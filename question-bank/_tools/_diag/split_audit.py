# -*- coding: utf-8 -*-
"""直接度量「同一视觉行的中文层/拉丁层被劈成两行」的次数。

Word 导出的 PDF 里同一视觉行有中文层与拉丁/数学层两个基线（实测差 1.6pt 与 5.7pt）。
若合并阈值偏小，两层会各自成行，句子被劈开——这是真实缺陷，而
extract_text_lines 自己也会劈（y_tolerance=3），所以「行数最接近参考」会奖励错误的劈分。
本脚本因此不看行数，只看结构：

  split : 相邻 rep 间距 < 8pt，且两桶一个是中文主导(>=0.6)另一个是拉丁主导(<=0.2)
  loss  : 相邻 rep 间距 < 8pt 且两桶都非空（潜在被强行合并，需人工确认）

两种都越小越好。
"""
import io
import os
import re
import sys
import glob
from collections import Counter

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")

CJK = re.compile(r"[　-鿿＀-￯]")
ASCII = re.compile(r"[ -~]")

sys.path.insert(0, os.path.join(HERE))
from pick_merge import CANDS, reps_for          # noqa: E402


def cjk_ratio(s):
    core = "".join(s.split())
    if not core:
        return 0.0
    return len(CJK.findall(core)) / len(core)


def struct(chars, reps):
    if not reps:
        return 0, 0
    buckets = [[] for _ in reps]
    for c in chars:
        buckets[min(range(len(reps)),
                    key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    texts = []
    for b in buckets:
        b.sort(key=lambda c: c["x0"])
        s, prev = "", None
        for c in b:
            if prev is not None and (c["x0"] - prev["x1"]) > 0.35 * c["size"]:
                s += " "
            s += c["text"]
            prev = c
        texts.append(s.strip())
    split = loss = 0
    for k in range(len(reps) - 1):
        if reps[k + 1] - reps[k] >= 8.0:
            continue
        a, b = texts[k], texts[k + 1]
        if not a or not b:
            continue
        ra, rb = cjk_ratio(a), cjk_ratio(b)
        if (ra >= 0.6 and rb <= 0.2) or (rb >= 0.6 and ra <= 0.2):
            split += 1
        else:
            loss += 1
    return split, loss


def main():
    agg = {n: Counter() for n in CANDS}
    examples = {n: [] for n in CANDS}
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
                chars = list(pg.chars)
                if not chars:
                    continue
                for n in CANDS:
                    sp, lo = struct(chars, reps_for(n, chars))
                    agg[n]["split"] += sp
                    agg[n]["loss"] += lo
                    if sp and len(examples[n]) < 8:
                        examples[n].append((sp, rel, i))
    out = []
    out.append("%-10s %8s %8s" % ("cand", "split", "loss"))
    for n in CANDS:
        out.append("%-10s %8d %8d" % (n, agg[n]["split"], agg[n]["loss"]))
    out.append("")
    for n in CANDS:
        out.append("== %s 中文/拉丁层被劈开的页（前 8）==" % n)
        for sp, rel, i in examples[n]:
            out.append("  split=%-3d %s p%d" % (sp, rel, i))
        out.append("")
    io.open(os.path.join(HERE, "_split_audit.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out[:10]))


if __name__ == "__main__":
    main()
