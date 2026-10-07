# -*- coding: utf-8 -*-
"""对比 convert.py 的 page_text() 与 pdfplumber extract_text()。

目的：验证计划的关键前提「extract_text() 在这些页面上完全正确，坏行只出现在
page_text() 输出里」。对每个页面统计：
  badOld / badRef      各自的 is_bad 行数
  refFixes             旧有坏行而 ref 没有 -> 聚类问题（可修）
  bothBad              两边都有坏行 -> 文本层面重叠，聚类修不了
  diffRatio            两边的行文本差异比例
"""
import io
import os
import re
import sys
import glob
import difflib
from collections import Counter

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")

sys.path.insert(0, TOOLS)
from find_interleave import is_bad            # noqa: E402
from convert import page_text as old_page_text  # noqa: E402

CJK = re.compile(r"[　-鿿＀-￯]")


def ref_lines(pg):
    t = pg.extract_text() or ""
    return [l for l in t.splitlines() if l.strip()]


def main():
    rows = []
    files = sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True))
    for p in files:
        rel = os.path.relpath(p, SRC).replace(os.sep, "/")
        if os.path.basename(rel) == "期末往年题勘误、详解 by Arthals.pdf":
            continue
        try:
            pdf = pdfplumber.open(p)
        except Exception:
            continue
        with pdf:
            for i, pg in enumerate(pdf.pages, 1):
                if not pg.chars:
                    continue
                old = [l for l in old_page_text(pg).splitlines() if l.strip()]
                ref = ref_lines(pg)
                bo = sum(1 for l in old if is_bad(l))
                br = sum(1 for l in ref if is_bad(l))
                if not bo and not br and len(old) == len(ref):
                    continue
                sm = difflib.SequenceMatcher(None, old, ref)
                dr = 1.0 - sm.ratio()
                rows.append((rel, i, bo, br, len(old), len(ref), round(dr, 3), old, ref))

    n_ref_fix = sum(1 for r in rows if r[2] and not r[3])
    n_both = sum(1 for r in rows if r[2] and r[3])
    n_only_ref = sum(1 for r in rows if r[3] and not r[2])
    n_same_bad = sum(1 for r in rows if r[2] == r[3] and r[2] > 0)
    out = []
    out.append("pages with any bad line or line-count mismatch: %d" % len(rows))
    out.append("old bad & ref clean  (clustering-only defect): %d" % n_ref_fix)
    out.append("old bad & ref bad too(text-level overlap)    : %d  (其中坏行数相同 %d)"
               % (n_both, n_same_bad))
    out.append("ref bad but old clean                        : %d" % n_only_ref)
    out.append("")
    out.append("== old bad & ref clean ==")
    for r in rows:
        if r[2] and not r[3]:
            out.append("%-42s p%-4d badOld=%-3d badRef=0 linesOld=%-4d linesRef=%-4d diff=%.3f"
                       % (r[0], r[1], r[2], r[4], r[5], r[6]))
    out.append("")
    out.append("== old bad & ref bad (聚类修不掉) ==")
    for r in rows:
        if r[2] and r[3]:
            out.append("%-42s p%-4d badOld=%-3d badRef=%-3d linesOld=%-4d linesRef=%-4d diff=%.3f"
                       % (r[0], r[1], r[2], r[3], r[4], r[5], r[6]))
    out.append("")
    out.append("== 样例对照：old 与 ref 前若干行 ==")
    shown = 0
    for r in rows:
        if not (r[2] or r[3]) or r[6] < 0.2:
            continue
        shown += 1
        if shown > 8:
            break
        out.append("")
        out.append("### %s p%d  badOld=%d badRef=%d" % (r[0], r[1], r[2], r[3]))
        for k, (a, b) in enumerate(zip(r[7][:14], r[8][:14])):
            mark = "  " if a == b else "!!"
            out.append("%s OLD| %s" % (mark, a[:110]))
            out.append("%s REF| %s" % (mark, b[:110]))
    io.open(os.path.join(HERE, "_cmp_ref.txt"), "w", encoding="utf-8").write("\n".join(out))
    print("\n".join(out[:6]))


if __name__ == "__main__":
    main()
