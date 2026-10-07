#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""往年题 PDF/DOCX -> Markdown 批量转换。

为什么不用 pdftotext：这批 PDF 内嵌 CID 子集字体、ToUnicode 不规范，
pdftotext 抽不出中文；pdfplumber/pdfminer 可以，但要自己重建阅读顺序。

阅读顺序重建（全字符行聚类 + 两层合并）：
  这批 Word 导出的 PDF 里，中文和拉丁/数学文字是两个独立的文字层，同一视觉行的
  baseline 相差 1.6pt 或 5.7pt（全库 758 页实测，最大 < 8pt）；而真实行距的模式在
  11.04 / 11.8 / 12.0 / 13.9 / 15.6pt。所以「合并阈值 8pt」是安全的分界：它严格大于
  任何两层基线差，又严格小于任何真实行距。

  早期版本改成「取承载中文最多的字体的行作为锚行，再用锚行间距中位数的一半当同行
  容差」。锚行稀疏时（2013期中第 6 页只有 4 条中文锚行）中位数会被拉到 38.88pt，
  thr 达到 19.44pt，超过真实行距，于是相邻代码行被并进同一个桶，再按 x0 排序 →
  逐字符交错。正确做法是让 rep 直接来自**全部字符**的行聚类，不做字体筛选。
"""
import os
import re
import json
import glob
import shutil
import tempfile
import warnings
import subprocess
from collections import Counter

warnings.filterwarnings("ignore")

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)                 # 往年题(按知识点分类)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")
MD = os.path.join(BASE, "原文")
ASSETS = os.path.join(BASE, "assets")

DPI = 130
SCAN_CPP = 80            # 每页字符数低于此值 -> 视为扫描件，整本渲染
# 同一视觉行中文层/拉丁层的基线差 < 8pt，真实行距 >= 11.04pt，所以 8pt 是安全分界
LINE_MERGE = 8.0
# 人工誊写/改写的 原文 文件，绝不覆盖（见 _preserve.txt 与 _diag/find_handedited.py）
PRESERVE_FILE = os.path.join(HERE, "_preserve.txt")


def load_preserve():
    keep = set()
    if os.path.exists(PRESERVE_FILE):
        for line in open(PRESERVE_FILE, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#"):
                keep.add(line.replace("\\", "/"))
    return keep


PRESERVE = load_preserve()

manifest = {}


def cluster_lines(cs, tol=1.0):
    """按 baseline 聚成行（leader 聚类，足够应付等宽中文）。"""
    cs = sorted(cs, key=lambda c: c["bottom"])
    lines, cur, last = [], [], None
    for c in cs:
        b = c["bottom"]
        if last is None or abs(b - last) <= tol:
            cur.append(c)
            if last is None:
                last = b
        else:
            lines.append(cur)
            cur = [c]
            last = b
    if cur:
        lines.append(cur)
    return lines


def rep(ln):
    return sorted(c["bottom"] for c in ln)[len(ln) // 2]


CJK = re.compile(r"[　-鿿＀-￯]")
# 等宽字体名：这批卷子里代码/汇编一律用 Courier 家族（Courier New / CourierNewPSMT）
MONO = re.compile(r"courier|consolas|monospace|menlo|lucidaconsole|cascadia", re.I)
# 2013期中这类没有字体名的 CID 子集，只能靠内容特征判
CIDFONT = re.compile(r"^CIDFont\+F\d+$", re.I)
ASM_CODE = re.compile(
    r"^\s*(?:[0-9a-fA-F]{4,}:|(?:[0-9a-fA-F]{2}[ \t]+){1,6})"
    r".*\b(mov|movq|movl|push|pushq|pop|popq|cmp|jmp|je|jne|jle|jg|jl|lea|call|callq"
    r"|ret|retq|add|sub|test|xor|imul|idiv|sar|shl|shr|and|or|not|endbr64|nop)\b")
ADDR_CODE = re.compile(r"^\s*[0-9a-fA-F]{4,}:\s")
# 与字体无关的「汇编特征」判据。仅靠等宽字体不够：2019期中这类卷子的 ASCII 用的是
# 非等宽字体，2013期中用无名 CID 子集，两条都不是 MONO。要求助记符后紧跟 `%`/`$`
# 操作数，避免把英文正文误判成代码。
ASM_STRONG = re.compile(
    r"\b(mov|movl|movq|movb|movw|movabsq|add|addl|addq|sub|subl|subq|cmp|cmpl|cmpq"
    r"|test|testl|testq|push|pushq|pop|popq|lea|leal|leaq|xor|xorl|and|andl|or|orl"
    r"|imul|idiv|sar|shl|shr|jmp|je|jne|jle|jg|jl|call|callq|ret|retq"
    r"|irmovl|irmov|rrmovl|nop|endbr64|inc|dec)\b[\s,]*[%$]")
# 选项行：`A. ` / `B、` / `C) ` 等。选项列表也是等宽字体、也全是 ASCII，
# 但它属于正文（人工誊写的 3 个文件里选项都在围栏外），不要圈进代码块。
OPTION_LINE = re.compile(r"^\s*[A-Da-d][.、)．]\s*\S")


def _lines_of(pg, gap_k=0.35):
    """把一页拆成 [{text, font, cjk}]；`page_text()` 与围栏逻辑共用同一个行切分。"""
    chars = list(pg.chars)
    if not chars:
        return []
    rows = sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))
    reps = []
    for r in rows:
        if reps and r - reps[-1] < LINE_MERGE:
            continue
        reps.append(r)

    buckets = [[] for _ in reps]
    for c in chars:
        buckets[min(range(len(reps)),
                    key=lambda k: abs(c["bottom"] - reps[k]))].append(c)

    out = []
    for ln in buckets:
        ln.sort(key=lambda c: c["x0"])
        s, prev = "", None
        for c in ln:
            if prev is not None and (c["x0"] - prev["x1"]) > gap_k * c["size"]:
                s += " "
            s += c["text"]
            prev = c
        s = s.rstrip()
        if not s.strip():
            continue
        fonts = Counter(c["fontname"] for c in ln if c["text"].strip())
        cjk = len(CJK.findall(s))
        out.append({"text": s,
                    "font": fonts.most_common(1)[0][0] if fonts else "",
                    "cjk": cjk / max(1, len("".join(s.split())))})
    return out


def page_text(pg, gap_k=0.35):
    """纯文本（不含围栏）。行为必须与加围栏之前**逐字节**一致。"""
    return "\n".join(l["text"] for l in _lines_of(pg, gap_k))


def is_code_line(line):
    """代码行判据。

    关键约束：**含中文的行一律不算代码**。仅靠「等宽字体」是不够的——中文正文里
    常常内嵌命令/文件名（`执行 chmod 755 file.py 后…`），这类行按字符数算拉丁部分
    反而更多，会被误判成 Courier 主导，进而把正文圈进围栏。
    实测放宽到「cjk <= 0.5」时，1872 个围栏块里有 719 块（38%）是中文正文；
    收紧到「必须一个中文都没有」后人工复核的样例全部是真代码/汇编。

    字体之外还有一条与字体无关的通道（ASM_STRONG）：2019期中用非等宽字体排 ASCII，
    2013期中用无名 CID 子集，靠字体都不认。实测仅靠字体时仍有 72 行含 `$` 的汇编
    漏在围栏外。
    """
    if line["cjk"] > 0:
        return False
    if MONO.search(line["font"]):
        return True
    if CIDFONT.match(line["font"]):
        return bool(ADDR_CODE.match(line["text"])
                    or ASM_CODE.match(line["text"])
                    or ASM_STRONG.search(line["text"]))
    return bool(ASM_STRONG.search(line["text"]))


def is_strong_code_line(line):
    """地址/指令特征明确的行：允许单行成块。"""
    return bool(ADDR_CODE.match(line["text"]) or ASM_CODE.match(line["text"])
                or ASM_STRONG.search(line["text"]))


def is_option_list(run):
    """连续多行都是 `A. …` 形态 -> 选项列表，不是代码块。

    例外：如果这些「选项」本身就是汇编（`A. movl $34, (%eax)`），
    那它就是代码，必须圈起来，否则裸 `$` 会吞掉正文。
    """
    if len(run) < 2:
        return False
    if any(is_strong_code_line(l) for l in run):
        return False
    return all(OPTION_LINE.match(l["text"]) for l in run)


def page_markdown(pg, gap_k=0.35):
    """纯文本 + 代码围栏。

    围栏只**增加**两行 ``````，代码行内容一字不改，所以
    `project(page_markdown) == project(page_text)` 恒成立（见 project.py）。
    汇编进围栏后，MathJax 的 skipHtmlTags 会跳过 pre/code，
    `$0x1` 这类字面 `$` 不会再被当成公式分隔符吞掉中间整行（B 类缺陷）。

    两道防误圈：
      - 单行成块要谨慎：`A. sizeof(sa) == 24` 这种选项行也是等宽字体、也全 ASCII，
        孤立的候选行只有带明确地址/指令特征时才成块；
      - 连续选项列表整体排除（人工誊写文件里选项都在围栏外）。
    """
    lines = _lines_of(pg, gap_k)
    out = []
    i = 0
    while i < len(lines):
        if is_code_line(lines[i]):
            j = i
            while j < len(lines) and is_code_line(lines[j]):
                j += 1
            run = lines[i:j]
            if is_option_list(run) or not (len(run) >= 2
                                           or is_strong_code_line(run[0])):
                out.extend(l["text"] for l in run)
            else:
                out.append("```")
                out.extend(l["text"] for l in run)
                out.append("```")
            i = j
        else:
            out.append(lines[i]["text"])
            i += 1
    return "\n".join(out)


def save_jpeg(stream, path):
    f = stream.get("Filter")
    if isinstance(f, list):
        f = f[-1]
    name = getattr(f, "name", str(f) if f else "").lstrip("/")
    if name != "DCTDecode":
        return None
    try:
        with open(path, "wb") as fh:
            fh.write(stream.get_rawdata())
        return path
    except Exception:
        return None


def render_page(pdf, page_no, out_png):
    tmp = tempfile.mkdtemp()
    try:
        subprocess.run(
            ["pdftoppm", "-f", str(page_no), "-l", str(page_no),
             "-r", str(DPI), "-png", pdf, os.path.join(tmp, "pg")],
            check=True, capture_output=True)
        got = glob.glob(os.path.join(tmp, "pg*.png"))
        if not got:
            return None
        shutil.move(got[0], out_png)
        return out_png
    except Exception:
        return None
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def convert_pdf(rel):
    src = os.path.join(SRC, rel)
    dst = os.path.join(MD, os.path.splitext(rel)[0] + ".md")
    relmd = os.path.splitext(rel)[0].replace(os.sep, "/") + ".md"
    if relmd in PRESERVE:
        print("KEEP %s（人工誊写，见 _preserve.txt）" % rel, flush=True)
        return None
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    stem = os.path.splitext(os.path.basename(rel))[0]
    adir = os.path.join(ASSETS, os.path.dirname(rel), stem)

    pages, fig_pages = [], []

    with pdfplumber.open(src) as pdf:
        npages = len(pdf.pages)
        for i, pg in enumerate(pdf.pages, 1):
            # 用带围栏的版本落盘；project() 可证明它与 page_text() 内容等价
            txt = page_markdown(pg)
            if pg.images:
                fig_pages.append(i)
                os.makedirs(adir, exist_ok=True)
                imgs = sorted(pg.images,
                              key=lambda im: (round(im["top"], 1), round(im["x0"], 1)))
                links = []
                for n, im in enumerate(imgs, 1):
                    p = os.path.join(adir, "p%d-img%d.jpg" % (i, n))
                    if save_jpeg(im["stream"], p):
                        links.append(os.path.relpath(p, os.path.dirname(dst))
                                     .replace(os.sep, "/"))
                if links:
                    txt += "\n\n" + "\n".join("![图](%s)" % l for l in links)
            pages.append((i, txt))

    scanned = npages and (sum(len(p[1]) for p in pages) / npages) < SCAN_CPP
    render_pages = list(range(1, npages + 1)) if scanned else fig_pages
    if render_pages:
        os.makedirs(adir, exist_ok=True)
        for pno in render_pages:
            render_page(src, pno, os.path.join(adir, "page-%02d.png" % pno))

    buf = ["# %s" % stem, "",
           "> 来源：`往年题/%s`　共 %d 页%s"
           % (rel, npages, "　**扫描件**，正文需人工誊写" if scanned else ""), ""]
    for pno, txt in pages:
        buf += ["<!-- ===== page %d ===== -->" % pno, "", txt, ""]
    with open(dst, "w", encoding="utf-8") as fh:
        fh.write("\n".join(buf))

    manifest[rel] = {"md": os.path.relpath(dst, BASE).replace(os.sep, "/"),
                     "pages": npages,
                     "chars": sum(len(p[1]) for p in pages),
                     "scanned": bool(scanned),
                     "figure_pages": fig_pages}
    return manifest[rel]


def convert_docx(rel):
    src = os.path.join(SRC, rel)
    dst = os.path.join(MD, os.path.splitext(rel)[0] + ".md")
    os.makedirs(os.path.dirname(dst), exist_ok=True)

    # 用源目录当 cwd，让 --extract-media 产生相对路径，再整体搬到 assets
    tmp_media = os.path.join(os.path.dirname(src), "_media_tmp")
    cmd = ["pandoc", "-f", "docx", "-t", "gfm", "--wrap=none",
           "--extract-media=" + os.path.basename(tmp_media),
           os.path.basename(src), "-o", dst]
    r = subprocess.run(cmd, cwd=os.path.dirname(src), capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode("utf-8", "replace")[:300])

    body = open(dst, encoding="utf-8").read()
    if os.path.isdir(tmp_media):
        tgt = os.path.join(ASSETS, os.path.dirname(rel),
                           os.path.splitext(os.path.basename(rel))[0])
        if os.path.exists(tgt):
            shutil.rmtree(tgt, ignore_errors=True)
        os.makedirs(os.path.dirname(tgt), exist_ok=True)
        shutil.move(tmp_media, tgt)
        rel_media = os.path.relpath(tgt, os.path.dirname(dst)).replace(os.sep, "/")
        body = body.replace(os.path.basename(tmp_media) + "/", rel_media + "/")
        open(dst, "w", encoding="utf-8").write(body)
        # pandoc 会在源目录留下空目录或 media 目录，清掉
        leftover = os.path.join(os.path.dirname(src), "media")
        if os.path.isdir(leftover):
            shutil.rmtree(leftover, ignore_errors=True)

    manifest[rel] = {"md": os.path.relpath(dst, BASE).replace(os.sep, "/"),
                     "chars": len(body), "kind": "docx"}
    return manifest[rel]


def main():
    os.makedirs(MD, exist_ok=True)
    os.makedirs(ASSETS, exist_ok=True)

    for p in sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True)):
        rel = os.path.relpath(p, SRC).replace(os.sep, "/")
        if os.path.basename(rel) == "期末往年题勘误、详解 by Arthals.pdf":
            continue                       # 已有 .md 源
        try:
            info = convert_pdf(rel)
            if info is None:
                continue
            print("PDF  %3dp %6dch%s %s"
                  % (info["pages"], info["chars"],
                     "  [SCAN]" if info["scanned"] else "", rel), flush=True)
        except Exception as e:
            print("FAIL", rel, type(e).__name__, str(e)[:150], flush=True)

    for d in sorted(glob.glob(os.path.join(SRC, "**", "*.docx"), recursive=True)):
        rel = os.path.relpath(d, SRC).replace(os.sep, "/")
        try:
            convert_docx(rel)
            print("DOCX %s" % rel, flush=True)
        except Exception as e:
            print("FAIL", rel, type(e).__name__, str(e)[:150], flush=True)

    for pat in ("**/*.c", "**/*.h", "**/*.sh", "**/*.md"):
        for f in glob.glob(os.path.join(SRC, pat), recursive=True):
            dst = os.path.join(MD, os.path.relpath(f, SRC))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(f, dst)

    with open(os.path.join(MD, "_manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)
    print("\nDONE", len(manifest), "files")


if __name__ == "__main__":
    main()
