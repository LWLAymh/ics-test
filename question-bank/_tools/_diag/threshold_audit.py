# -*- coding: utf-8 -*-
"""定阈值：固定 8.0 vs 随字号缩放；并列出 8.0 下「行数明显少于参考」的页面供人工判定。

H_abs8 的 split=0 是构造上必然的（保证相邻 rep >=8pt），所以还要反向确认
它没有把「真实行距 < 8pt 的紧排表格」并掉。判据：合并后桶的 bottom 跨度
在 (0.6*merge, merge) 之间 -> 疑似把两个相邻视觉行并进一个桶。
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
sys.path.insert(0, HERE)
from pick_merge import cluster_lines, rep, build, rows_of     # noqa: E402


def dedup(rows, merge):
    out = []
    for r in rows:
        if out and r - out[-1] < merge:
            continue
        out.append(r)
    return out


def median_size(chars):
    ss = sorted(c["size"] for c in chars)
    return ss[len(ss) // 2]


def reps_fixed(chars, m):
    return dedup(rows_of(chars), m)


def reps_scaled(chars, k, cap):
    s = median_size(chars)
    return dedup(rows_of(chars), min(cap, k * s))


def cjk_ratio(s):
    core = "".join(s.split())
    return len(CJK.findall(core)) / len(core) if core else 0.0


def split_count(chars, reps):
    if not reps:
        return 0
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
    n = 0
    for k in range(len(reps) - 1):
        if reps[k + 1] - reps[k] >= 8.0:
            continue
        a, b = texts[k], texts[k + 1]
        if not a or not b:
            continue
        ra, rb = cjk_ratio(a), cjk_ratio(b)
        if (ra >= 0.6 and rb <= 0.2) or (rb >= 0.6 and ra <= 0.2):
            n += 1
    return n


def wide_buckets(chars, reps, merge):
    if not reps:
        return 0
    buckets = [[] for _ in reps]
    for c in chars:
        buckets[min(range(len(reps)),
                    key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    n = 0
    for b, r in zip(buckets, reps):
        if len(b) < 2:
            continue
        sp = max(c["bottom"] for c in b) - min(c["bottom"] for c in b)
        if 0.6 * merge < sp <= merge:
            n += 1
    return n


CANDS = {
    "F8.0": lambda ch: (reps_fixed(ch, 8.0), 8.0),
    "S0.9c8": lambda ch: (reps_scaled(ch, 0.9, 8.0), min(8.0, 0.9 * median_size(ch))),
    "S1.0c8": lambda ch: (reps_scaled(ch, 1.0, 8.0), min(8.0, 1.0 * median_size(ch))),
    "F7.0": lambda ch: (reps_fixed(ch, 7.0), 7.0),
    "F9.0": lambda ch: (reps_fixed(ch, 9.0), 9.0),
}


def main():
    agg = {n: Counter() for n in CANDS}
    under = []
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
                ref = [l for l in (pg.extract_text() or "").splitlines() if l.strip()]
                for n, fn in CANDS.items():
                    reps, merge = fn(chars)
                    a = agg[n]
                    a["lines"] += len(build(chars, reps))
                    a["split"] += split_count(chars, reps)
                    a["wide"] += wide_buckets(chars, reps, merge)
                if ref:
                    reps, merge = CANDS["F8.0"](chars)
                    nl = len(build(chars, reps))
                    if nl / len(ref) < 0.8 and len(ref) > 10:
                        under.append((round(nl / len(ref), 2), nl, len(ref),
                                      rel, i, round(median_size(chars), 2)))
    out = []
    out.append("%-8s %9s %8s %8s" % ("cand", "lines", "split", "wide"))
    for n in CANDS:
        a = agg[n]
        out.append("%-8s %9d %8d %8d" % (n, a["lines"], a["split"], a["wide"]))
    out.append("")
    out.append("== F8.0 下行数 < 0.8*参考 的页（按比例升序，前 30）==")
    for r, nl, nr, rel, i, ms in sorted(under)[:30]:
        out.append("  ratio=%.2f new=%-4d ref=%-4d medSize=%.2f  %s p%d"
                   % (r, nl, nr, ms, rel, i))
    io.open(os.path.join(HERE, "_threshold_audit.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out))


if __name__ == "__main__":
    main()
