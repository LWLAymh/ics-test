# -*- coding: utf-8 -*-
"""校验 `_curated/*.md` 与其 `原文` 切片等价（计划的 L3 §verify_curated）。

分档（由 curated 文件里的 `%%% provenance` 决定）：

  verbatim（默认）  投影后**逐字节**相等；
  reflow           投影后把空白归一（`\\s+` -> 单空格）后相等 —— 用于 OCR 把选项压成
                   一行、或行内答案被切出来的情形；
  rewritten         不比对内容，但必须登记在 `_tools/_rewritten_allowlist.txt`，
                   且不得含渲染危险构造。

失败必须给出**首个差异位置及前后 40 字**，否则 1000 道题的失败列表不可用。
"""
import io
import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
MD = os.path.join(BASE, "原文")
CUR = os.path.join(BASE, "_curated")
sys.path.insert(0, HERE)
import build_modules as bm                              # noqa: E402
import legacy_v3 as bw                                  # noqa: E402
import project as P                                     # noqa: E402
import curated as CU                                    # noqa: E402

ALLOW = os.path.join(HERE, "_rewritten_allowlist.txt")
DANGER = [
    (re.compile(r"<script", re.I), "含 <script>"),
    (re.compile(r"^\s*%%%", re.M), "正文里残留 %%% 控制行"),
]


def first_diff(a, b, ctx=40):
    n = min(len(a), len(b))
    i = 0
    while i < n and a[i] == b[i]:
        i += 1
    lo = max(0, i - ctx)
    return ("位置 %d\n        旧: ...%s[%s]%s...\n        新: ...%s[%s]%s..."
            % (i, a[lo:i], a[i:i + 1] or "<END>", a[i + 1:i + 1 + ctx],
               b[lo:i], b[i:i + 1] or "<END>", b[i + 1:i + 1 + ctx]))


def load_allow():
    if not os.path.exists(ALLOW):
        return set()
    s = set()
    for ln in io.open(ALLOW, encoding="utf-8"):
        ln = ln.strip()
        if ln and not ln.startswith("#"):
            s.add(ln.replace("\\", "/"))
    return s


def main():
    allow = load_allow()
    materials = bm.load()
    out = []
    n_checked = 0
    n_fail = 0
    by_prov = {}
    fail_files = set()
    seen_files = set()

    for m in materials:
        lines = m["lines"]
        rel = m["rel"]
        dup = bool(m.get("dup_of"))
        for it in m["items"]:
            rel_cur = it.get("curated")
            if not rel_cur:
                continue
            seen_files.add(rel_cur.replace("/", os.sep))
            s, e = it.get("start"), it.get("end")
            tag = "%s %s [%s,%s]" % (bm.display_name(m), it.get("qno"), s, e)
            if dup or m["kind"] != "questions":
                n_fail += 1
                fail_files.add(rel_cur)
                out.append("FAIL %s: 别名/非题目材料不得挂 curated" % tag)
                continue
            if not isinstance(s, int) or not isinstance(e, int) or s < 1 or e > len(lines):
                n_fail += 1
                fail_files.add(rel_cur)
                out.append("FAIL %s: 行号越界" % tag)
                continue
            path = os.path.join(CUR, rel_cur.replace("/", os.sep))
            if not os.path.isfile(path):
                n_fail += 1
                fail_files.add(rel_cur)
                out.append("FAIL %s: curated 文件不存在 %s" % (tag, rel_cur))
                continue
            n_checked += 1
            p = CU.load(path)
            prov = p["provenance"]
            by_prov[prov] = by_prov.get(prov, 0) + 1
            errs = CU.check_assertions(p)
            if errs:
                n_fail += 1
                fail_files.add(rel_cur)
                out.append("FAIL %s: %s" % (tag, errs))
                continue
            slice_txt = bw.normalize_markdown_assets("\n".join(lines[s - 1:e]), rel)
            content = CU.build_content(p)
            if prov == "rewritten":
                if rel_cur not in allow:
                    n_fail += 1
                    fail_files.add(rel_cur)
                    out.append("FAIL %s: rewritten 未登记在 _rewritten_allowlist.txt" % tag)
                    continue
                bad = [msg for rx, msg in DANGER if rx.search(content)]
                if bad:
                    n_fail += 1
                    fail_files.add(rel_cur)
                    out.append("FAIL %s: rewritten 含渲染危险: %s" % (tag, bad))
                continue
            if prov == "reflow":
                a, b = P.project_reflow(slice_txt), P.project_reflow(content)
            else:
                a, b = P.project(slice_txt), P.project(content)
            if a != b:
                n_fail += 1
                fail_files.add(rel_cur)
                out.append("FAIL %s prov=%s 投影不等\n      %s"
                           % (tag, prov, first_diff(a, b)))

    # 反向扫描：没有 _cls 指针的孤儿文件
    orphans = []
    for f in sorted(glob.glob(os.path.join(CUR, "**", "*.md"), recursive=True)):
        r = os.path.relpath(f, CUR)
        if r not in seen_files:
            orphans.append(r)
    for r in orphans:
        n_fail += 1
        out.append("FAIL 孤儿 curated 文件（无 _cls 指针）: %s" % r.replace(os.sep, "/"))

    head = ["curated 校验",
            "检查 %d 条；失败 %d 条；涉及 %d 个 curated 文件；孤儿 %d 个"
            % (n_checked, n_fail, len(fail_files), len(orphans)),
            "provenance 分布: %s" % ", ".join("%s=%d" % kv for kv in sorted(by_prov.items())),
            ""]
    io.open(os.path.join(HERE, "_curated_report.txt"), "w", encoding="utf-8").write(
        "\n".join(head + out))
    print("\n".join(head[:3]))
    for x in out[:12]:
        print("  " + x.split("\n")[0])
    print("详见 _tools/_curated_report.txt")
    return 1 if n_fail else 0


if __name__ == "__main__":
    sys.exit(main())
