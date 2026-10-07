# -*- coding: utf-8 -*-
"""L1 根因探针：对比旧/新 rep 推导，在指定页上打印诊断。

用法: python _tools/_diag/probe_l1.py "期中/2013期中-带答案.pdf" 6
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


def old_reps(chars):
    cjk_cnt, tot_cnt = Counter(), Counter()
    for c in chars:
        tot_cnt[c["fontname"]] += 1
        if CJK.match(c["text"]):
            cjk_cnt[c["fontname"]] += 1
    af = (max(cjk_cnt, key=lambda f: (cjk_cnt[f], tot_cnt[f]))
          if cjk_cnt else max(tot_cnt, key=tot_cnt.get))
    anchors = cluster_lines([c for c in chars if c["fontname"] == af])
    if not anchors:
        anchors = cluster_lines(chars)
    reps = sorted(rep(ln) for ln in anchors)
    gaps = [b - a for a, b in zip(reps, reps[1:]) if b - a > 2]
    pitch = sorted(gaps)[len(gaps) // 2] if gaps else 12.0
    thr = 0.5 * pitch
    for ln in cluster_lines([c for c in chars if c["fontname"] != af]):
        r = rep(ln)
        if min(abs(r - x) for x in reps) > thr:
            reps.append(r)
    reps.sort()
    return af, anchors, reps, pitch, thr


def new_reps(chars):
    rows = sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))
    gaps = [b - a for a, b in zip(rows, rows[1:]) if b - a > 0.5]
    local = sorted(gaps)[len(gaps) // 2] if gaps else 12.0
    merge = 0.5 * local
    reps = []
    for r in rows:
        if reps and r - reps[-1] < merge:
            continue
        reps.append(r)
    return rows, gaps, local, merge, reps


def main():
    rel, pno = sys.argv[1], int(sys.argv[2])
    path = os.path.join(SRC, rel.replace("/", os.sep))
    with pdfplumber.open(path) as pdf:
        pg = pdf.pages[pno - 1]
        chars = list(pg.chars)
        af, anchors, oreps, pitch, thr = old_reps(chars)
        rows, gaps, local, merge, nreps = new_reps(chars)
        print("== %s  p%d  chars=%d" % (rel, pno, len(chars)))
        print("anchor font = %s   anchor lines = %d" % (af, len(anchors)))
        print("old: reps=%d pitch=%.2f thr=%.2f" % (len(oreps), pitch, thr))
        print("  old anchor reps:", ["%.2f" % r for r in oreps[:12]])
        print("new: rows=%d  median gap=%.2f merge=%.2f reps=%d"
              % (len(rows), local, merge, len(nreps)))
        print("  new rows:", ["%.2f" % r for r in rows])
        print("  new reps:", ["%.2f" % r for r in nreps])
        small = ["%.2f" % g for g in sorted(gaps) if g < 12]
        print("gaps < 12pt (%d):" % len(small), small[:20])
        # 同时打印 pdfplumber 自带 extract_text 作为「正确答案」参照
        ref = pg.extract_text() or ""
        print("\n--- pdfplumber extract_text() 前 25 行 ---")
        for ln in ref.splitlines()[:25]:
            print("REF| " + ln)
    print("\ndone")


if __name__ == "__main__":
    main()
