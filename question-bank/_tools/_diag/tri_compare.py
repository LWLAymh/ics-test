# -*- coding: utf-8 -*-
"""并排打印 old / new(merge=8.0) / pdfplumber 参考 三份提取结果，人工判定。

用法: python _tools/_diag/tri_compare.py "期末/2025期末-无答案.pdf" 5 [行数]
"""
import os
import sys

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")
sys.path.insert(0, HERE)
from pick_merge import rep_old, rows_of, build, dedup   # noqa: E402


def main():
    rel, pno = sys.argv[1], int(sys.argv[2])
    lim = int(sys.argv[3]) if len(sys.argv) > 3 else 24
    path = os.path.join(SRC, rel.replace("/", os.sep))
    with pdfplumber.open(path) as pdf:
        pg = pdf.pages[pno - 1]
        chars = list(pg.chars)
        old = [l for l in build(chars, rep_old(chars)) if l.strip()]
        new = [l for l in build(chars, dedup(rows_of(chars), 8.0)) if l.strip()]
        ref = [l for l in (pg.extract_text() or "").splitlines() if l.strip()]
        print("== %s p%d  chars=%d" % (rel, pno, len(chars)))
        print("old lines=%d  new lines=%d  ref lines=%d\n" % (len(old), len(new), len(ref)))
        for i in range(min(lim, max(len(old), len(new), len(ref)))):
            a = old[i] if i < len(old) else ""
            b = new[i] if i < len(new) else ""
            c = ref[i] if i < len(ref) else ""
            print("OLD %2d| %s" % (i, a[:100]))
            print("NEW %2d| %s" % (i, b[:100]))
            if a != b:
                print("      ^ 变化")
            if i < len(ref):
                print("REF %2d| %s" % (i, c[:100]))
            print()


if __name__ == "__main__":
    main()
