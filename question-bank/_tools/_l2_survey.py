# -*- coding: utf-8 -*-
"""L2 侦察：①过滤后的上下标可恢复量（并产出 L3 工单）②等宽字体清单 ③(cid:N) 异常。

上下标误报来源（实测量化）：
  - 不可见空白层：size 只有主体 1/4、dy 高达 -16pt；
  - `(cid:NNNN)` 未映射字形：pdfplumber 在 ToUnicode 缺失时输出的占位符；
  - 扫描件的 OCR 垃圾层。
所以判据收紧为：脚本字号在主体 0.5–0.85 倍之间、|dy| <= 1.2×主体字号、
紧贴左侧某个主体字符、且不含 `(cid:)`。

产出：
  _tools/_l2_survey.txt        侦察报告
  _tools/_scripts_worklist.txt L3 逐条上下标工单
"""
import io
import os
import re
import sys
import glob
from collections import Counter

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")
sys.path.insert(0, HERE)
from convert import cluster_lines, rep, LINE_MERGE      # noqa: E402
import convert as C                                     # noqa: E402

CID = re.compile(r"\(cid:\d+\)")
MONO_HINT = re.compile(r"courier|consolas|mono|menlo|dejavu\s*sans\s*mono|"
                       r"lucidaconsole|source\s*code|cascadia", re.I)


def buckets_of(chars):
    rows = sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))
    reps = []
    for r in rows:
        if reps and r - reps[-1] < LINE_MERGE:
            continue
        reps.append(r)
    out = [[] for _ in reps]
    for c in chars:
        out[min(range(len(reps)),
                key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    return reps, out


def script_segments(bucket):
    """-> (主体 size, [脚本段])；脚本段附带紧贴的基准字符。"""
    cnt = Counter(round(c["size"], 2) for c in bucket)
    if not cnt:
        return 0.0, []
    main_size = cnt.most_common(1)[0][0]
    main = [c for c in bucket if abs(c["size"] - main_size) < 0.01]
    if not main:
        return main_size, []
    main_top = sorted(c["top"] for c in main)[len(main) // 2]
    small = [c for c in bucket
             if 0.50 * main_size <= c["size"] < 0.85 * main_size]
    if not small:
        return main_size, []
    segs = []
    for c in sorted(small, key=lambda c: (round(c["top"], 1), c["x0"])):
        if segs and abs(c["top"] - segs[-1][-1]["top"]) <= 1.0:
            segs[-1].append(c)
        else:
            segs.append([c])
    out = []
    for sg in segs:
        top = sorted(c["top"] for c in sg)[len(sg) // 2]
        dy = main_top - top
        if not (1.0 < abs(dy) <= 1.2 * main_size):
            continue
        sg = sorted(sg, key=lambda c: c["x0"])
        txt = "".join(c["text"] for c in sg)
        if not txt.strip() or CID.search(txt):
            continue
        base = None
        for m in sorted(main, key=lambda c: -c["x1"]):
            if 0 <= sg[0]["x0"] - m["x1"] <= 0.4 * main_size:
                base = m["text"]
                break
        # 基准必须是字母数字：下角标挂在 `)`、`、`、`.` 后面几乎都是层级噪声
        if base is None or not re.match(r"[0-9A-Za-z]$", base):
            continue
        out.append({"dy": dy, "text": txt, "n": len(sg), "base": base,
                    "kind": "sup" if dy > 0 else "sub"})
    return main_size, out


def main():
    n_seg = 0
    worklist = []
    cid_lines = Counter()
    cid_total = 0
    fonts_tot = Counter()
    samples = []
    for p in sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True)):
        rel = os.path.relpath(p, SRC).replace(os.sep, "/")
        if os.path.basename(rel) == "期末往年题勘误、详解 by Arthals.pdf":
            continue
        # 人工誊写的文件：`原文` 内容是人写的，PDF 的脚本层信息对它无意义
        # （2014期中/2022期末 的文字层是 OCR 垃圾，会产出 `)^{s E}` 这类噪声）
        if os.path.splitext(rel)[0].replace(os.sep, "/") + ".md" in C.PRESERVE:
            continue
        try:
            pdf = pdfplumber.open(p)
        except Exception:
            continue
        with pdf:
            for i, pg in enumerate(pdf.pages, 1):
                chars = list(pg.chars)
                if not chars:
                    continue
                for c in chars:
                    fonts_tot[c["fontname"]] += 1
                if CID.search("".join(c["text"] for c in chars)):
                    cid_total += 1
                    cid_lines[rel] += 1
                _, buckets = buckets_of(chars)
                for b in buckets:
                    if len(b) < 2:
                        continue
                    _, segs = script_segments(b)
                    for s in segs:
                        n_seg += 1
                        whole = "".join(x["text"] for x in
                                        sorted(b, key=lambda x: x["x0"]))
                        worklist.append((rel, i, s, whole))
                        if len(samples) < 12:
                            samples.append((rel, i, s, whole))

    out = ["== ① 过滤后的上下标可恢复量 ==",
           "可用脚本段（字号 0.5-0.85×主体、|dy| <= 1.2×主体字号、紧贴左邻主体字符、"
           "无 (cid:) 占位）: %d 段" % n_seg, "",
           "== ② 等宽/疑似等宽字体（前 40）=="]
    for f, n in fonts_tot.most_common(40):
        out.append("  %-42s %7d%s" % (f, n, "  <== MONO" if MONO_HINT.search(f) else ""))
    out += ["", "== ③ 含 (cid:N) 未映射字形的文件 ==",
            "涉及 %d 页 / %d 个文件" % (cid_total, len(cid_lines))]
    for rel, n in cid_lines.most_common():
        out.append("  %-46s %d 页" % (rel, n))
    out += ["", "== 样例 =="]
    for rel, i, s, whole in samples:
        out.append("  %s p%d  %s%s{%s}" % (rel, i, s["base"],
                                          "^" if s["kind"] == "sup" else "_",
                                          s["text"]))
        out.append("      整行: %s" % whole[:110])
    io.open(os.path.join(HERE, "_l2_survey.txt"), "w", encoding="utf-8").write(
        "\n".join(out))

    W = ["上下标工单（L3 在 _curated 里据此写成 ^{} / _{}）",
         "共 %d 段；这些位置**没有**在 L2 自动改写。" % n_seg, "",
         "%-44s %5s %-6s %-5s %s" % ("文件", "页", "基准", "类型", "建议写法"),
         "-" * 96]
    for rel, i, s, whole in sorted(worklist, key=lambda x: (x[0], x[1])):
        W.append("%-44s %5d %-6s %-5s %s%s{%s}"
                 % (rel, i, s["base"], s["kind"], s["base"],
                    "^" if s["kind"] == "sup" else "_", s["text"]))
    W += ["",
          "为什么不在 L2 自动改写：",
          "  1) 判据有误报——放宽 filter 时检出的「下标」大量是不可见空白层",
          "     （size 仅主体 1/4、dy 达 -16pt）与 (cid:N) 未映射字形；",
          "  2) 更关键的是**无法验证**：`^{}`/`_{}` 按设计是投影中性的，",
          "     所以 project() 不变量对错误的上下标标注完全不敏感；",
          "     自动改写一旦判错就是静默污染，没有任何自动防线。",
          "  因此交给 L3 的 curated 流程逐条人工确认。"]
    io.open(os.path.join(HERE, "_scripts_worklist.txt"), "w", encoding="utf-8").write(
        "\n".join(W))
    print("\n".join(out[:4]))
    print("worklist -> _tools/_scripts_worklist.txt (%d 段)" % n_seg)


if __name__ == "__main__":
    main()
