# -*- coding: utf-8 -*-
"""把 is_bad 命中的桶分成三类，判定 D 类的真实成因分布。

分类依据（用旧 convert.py 的聚簇算法重建桶）：
  over_merge : 桶内 bottom 跨度 > 1.0pt —— 实际含 >=2 个视觉行，是 rep 推导过粗导致
  multi_run  : 同一基线（跨度 <= 1.0pt）内出现 >=2 种字体或 >=2 种字号 —— 同基线多段重叠
  fp         : 同一基线、单一字体单一字号 —— 文本本来就是对的，是检测器误报
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

sys.path.insert(0, TOOLS)
from find_interleave import is_bad            # noqa: E402

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


def anchor_font(chars):
    cjk_cnt, tot_cnt = Counter(), Counter()
    for c in chars:
        tot_cnt[c["fontname"]] += 1
        if CJK.match(c["text"]):
            cjk_cnt[c["fontname"]] += 1
    return (max(cjk_cnt, key=lambda f: (cjk_cnt[f], tot_cnt[f]))
            if cjk_cnt else max(tot_cnt, key=tot_cnt.get))


def old_buckets(chars):
    af = anchor_font(chars)
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
    buckets = [[] for _ in reps]
    for c in chars:
        buckets[min(range(len(reps)),
                    key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    return buckets


def text_of(ln):
    ln = sorted(ln, key=lambda c: c["x0"])
    return "".join(c["text"] for c in ln)


def main():
    stats = Counter()
    examples = {"over_merge": [], "multi_run": [], "fp": []}
    per_file = Counter()
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
                for b in old_buckets(chars):
                    if len(b) < 2:
                        continue
                    t = text_of(b)
                    if not is_bad(t):
                        continue
                    spread = max(c["bottom"] for c in b) - min(c["bottom"] for c in b)
                    fonts = {c["fontname"] for c in b}
                    sizes = {round(c["size"], 2) for c in b}
                    if spread > 1.0:
                        k = "over_merge"
                    elif len(fonts) >= 2 or len(sizes) >= 2:
                        k = "multi_run"
                    else:
                        k = "fp"
                    stats[k] += 1
                    per_file[(k, rel)] += 1
                    if len(examples[k]) < 6:
                        examples[k].append(
                            (rel, i, round(spread, 2), len(fonts), len(sizes), t[:100]))

    out = ["is_bad 命中桶的三分类（全库 758 页）", ""]
    for k in ("fp", "multi_run", "over_merge"):
        out.append("%-12s %d" % (k, stats[k]))
    out.append("")
    for k in ("fp", "multi_run", "over_merge"):
        out.append("== 样例: %s ==" % k)
        for rel, i, sp, nf, ns, t in examples[k]:
            out.append("  %s p%d spread=%.2f fonts=%d sizes=%d" % (rel, i, sp, nf, ns))
            out.append("      %s" % t)
        out.append("")
    out.append("== 按文件（fp / multi_run / over_merge）==")
    rels = sorted({r for _, r in per_file})
    for r in rels:
        a = per_file[("fp", r)]
        b = per_file[("multi_run", r)]
        c = per_file[("over_merge", r)]
        if a + b + c:
            out.append("  %-46s fp=%-4d multi_run=%-4d over_merge=%-4d" % (r, a, b, c))
    io.open(os.path.join(HERE, "_classify_bad.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out[:12]))


if __name__ == "__main__":
    main()
