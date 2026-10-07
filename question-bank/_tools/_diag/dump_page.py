# -*- coding: utf-8 -*-
"""Dump 一页的行结构，用于判定交错是「聚簇过度合并」还是「同基线多段重叠」。

用法: python _tools/_diag/dump_page.py "期中/2014期中-带答案.pdf" 12
"""
import os
import re
import sys
from collections import Counter

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")

CJK = re.compile(r"[　-鿿＀-￯]")


def cluster_lines(cs, tol=1.0):
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


def overlap_violations(chars_sorted):
    """按 x0 排序后，x1 非单调的次数 —— 越大越说明同基线多段重叠。"""
    n = 0
    mx = -1e9
    for c in chars_sorted:
        if c["x0"] < mx - 0.5:
            n += 1
        mx = max(mx, c["x1"])
    return n


def main():
    rel, pno = sys.argv[1], int(sys.argv[2])
    path = os.path.join(SRC, rel.replace("/", os.sep))
    with pdfplumber.open(path) as pdf:
        pg = pdf.pages[pno - 1]
        chars = list(pg.chars)
        lines = cluster_lines(chars, tol=1.0)
        print("== %s p%d  chars=%d  tol=1.0 rows=%d" % (rel, pno, len(chars), len(lines)))
        for ln in sorted(lines, key=rep):
            s = sorted(ln, key=lambda c: c["x0"])
            v = overlap_violations(s)
            # 原始流顺序下 x0 回退次数：若为 0，说明原顺序已经是正确阅读顺序
            back = sum(1 for a, b in zip(ln, ln[1:]) if b["x0"] < a["x0"] - 0.5)
            txt = "".join(c["text"] for c in s)
            print("\n--- rep=%.2f n=%3d viol=%2d stream_back=%2d  size=%.2f"
                  % (rep(ln), len(ln), v, back, s[0]["size"]))
            print("    sortedX: %s" % txt[:120])
            print("    stream : %s" % "".join(c["text"] for c in ln)[:120])
            if v or back:
                segs = []
                cur = []
                for c in ln:
                    if cur and c["x0"] < cur[-1]["x0"] - 0.5:
                        segs.append(cur)
                        cur = []
                    cur.append(c)
                if cur:
                    segs.append(cur)
                for k, sg in enumerate(segs):
                    print("    stream-seg%d x0=%.1f-%.1f : %s"
                          % (k, sg[0]["x0"], max(c["x1"] for c in sg),
                             "".join(c["text"] for c in sg)[:90]))


if __name__ == "__main__":
    main()
