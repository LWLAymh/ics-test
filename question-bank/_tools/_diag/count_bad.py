# -*- coding: utf-8 -*-
"""统计当前 原文 的交错坏行总数（沿用 find_interleave 的原判据）。"""
import io
import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
from find_interleave import scan            # noqa: E402


def main():
    tot = 0
    per = []
    for f in sorted(glob.glob(os.path.join(BASE, "原文", "**", "*.md"),
                              recursive=True)):
        rel = os.path.relpath(f, os.path.join(BASE, "原文")).replace(os.sep, "/")
        nl, bad = scan(f)
        if bad:
            per.append((len(bad), rel))
        tot += len(bad)
    per.sort(reverse=True)
    print("TOTAL bad lines: %d   (baseline 380)" % tot)
    for n, rel in per:
        print("  %-46s %d" % (rel, n))


if __name__ == "__main__":
    main()
