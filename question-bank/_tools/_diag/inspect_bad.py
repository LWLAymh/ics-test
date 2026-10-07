# -*- coding: utf-8 -*-
"""只打印命中 is_bad 的桶的字符结构，用于定位交错的真实成因。

用法: python _tools/_diag/inspect_bad.py "期中/2014期中-带答案.pdf" 12 [全文|首80]
"""
import os
import sys

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")
sys.path.insert(0, TOOLS)
from find_interleave import is_bad            # noqa: E402


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


def main():
    rel, pno = sys.argv[1], int(sys.argv[2])
    lim = int(sys.argv[3]) if len(sys.argv) > 3 else 40
    path = os.path.join(SRC, rel.replace("/", os.sep))
    with pdfplumber.open(path) as pdf:
        pg = pdf.pages[pno - 1]
        for ln in sorted(cluster_lines(list(pg.chars), 1.0), key=rep):
            s = sorted(ln, key=lambda c: c["x0"])
            txt = "".join(c["text"] for c in s)
            if not is_bad(txt):
                continue
            print("\n=== rep=%.2f n=%d size=%.2f ===" % (rep(ln), len(ln), s[0]["size"]))
            print("SORTEDX: %r" % txt[:200])
            print("STREAM : %r" % "".join(c["text"] for c in ln)[:200])
            fonts = {}
            for c in s:
                fonts.setdefault(c["fontname"], 0)
                fonts[c["fontname"]] += 1
            print("fonts  : %s" % fonts)
            print("size   : %s" % sorted({round(c["size"], 2) for c in s}))
            print("chars (sorted by x0): x0/x1/size/font/text")
            for c in s[:lim]:
                print("   %8.2f %8.2f %5.2f %-14s %r"
                      % (c["x0"], c["x1"], c["size"], c["fontname"], c["text"]))
            print("--- stream order ---")
            for c in ln[:lim]:
                print("   %8.2f %8.2f %5.2f %-14s %r"
                      % (c["x0"], c["x1"], c["size"], c["fontname"], c["text"]))


if __name__ == "__main__":
    main()
