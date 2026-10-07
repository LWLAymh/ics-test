# -*- coding: utf-8 -*-
"""结构审计：用「桶是否跨基线」「rep 之间是否残留 <8pt 缝」直接度量聚簇好坏。

文本启发式（find_interleave.is_bad）既有误报（174/380 是合法十六进制行）
也有漏报（pmuosvh %%rbrspp 那种逐字符交错整行重复率不够）。所以 L1 的验收改用
两个结构性指标，它们直接对应两种失败模式，且不依赖任何文本启发式：

  M1 over_merge : 桶内 bottom 跨度 > 1.0pt  —— 把 >=2 个视觉行并进了一个桶
  M2 over_split : 相邻 rep 间距 < 8.0pt     —— 同一视觉行的两层没被合并

全库两层基线差的实测分布集中在 1.6-1.7pt 与 5.7pt（最大 < 8pt），
真实行距的模式在 11.04 / 11.8 / 12.0 / 13.9 / 15.6pt。
所以「合并 <=8pt 的相邻行、绝不合并 >8pt 的」应当让 M1 与 M2 同时为 0。
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


def rep_old(chars):
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
    return reps


def rep_plan(chars, merge_abs=None):
    rows = sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))
    gaps = [b - a for a, b in zip(rows, rows[1:]) if b - a > 0.5]
    local = sorted(gaps)[len(gaps) // 2] if gaps else 12.0
    merge = 0.5 * local if merge_abs is None else merge_abs
    out = []
    for r in rows:
        if out and r - out[-1] < merge:
            continue
        out.append(r)
    return out


def rep_half_high(chars, cap=8.0):
    """merge = min(cap, 0.5 * (较大一撮间隙的中位数))"""
    rows = sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))
    gaps = [b - a for a, b in zip(rows, rows[1:]) if b - a > 0.5]
    big = [g for g in gaps if g > 5.0] or gaps
    local = sorted(big)[len(big) // 2] if big else 12.0
    merge = min(cap, 0.5 * local)
    out = []
    for r in rows:
        if out and r - out[-1] < merge:
            continue
        out.append(r)
    return out


def rep_ref(chars):
    """直接借用 pdfplumber 自己的行分组（extract_text_lines 的 bottom）。"""
    raise NotImplementedError


def payloads(chars):
    return {
        "A_old": rep_old(chars),
        "B_plan": rep_plan(chars, None),
        "C_8.0": rep_plan(chars, 8.0),
        "D_6.0": rep_plan(chars, 6.0),
        "E_5.0": rep_plan(chars, 5.0),
        "F_half_cap8": rep_half_high(chars),
    }


def audit(chars, reps):
    buckets = [[] for _ in reps]
    for c in chars:
        buckets[min(range(len(reps)),
                    key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    m1 = 0
    for b in buckets:
        if len(b) >= 2 and (max(c["bottom"] for c in b)
                            - min(c["bottom"] for c in b)) > 1.0:
            m1 += 1
    m2 = sum(1 for a, b in zip(reps, reps[1:]) if b - a < 8.0)
    nlines = sum(1 for b in buckets if b and "".join(
        c["text"] for c in b).strip())
    return m1, m2, nlines


def main():
    names = ["A_old", "B_plan", "C_8.0", "D_6.0", "E_5.0", "F_half_cap8", "REF"]
    agg = {n: Counter() for n in names}
    worst = {n: [] for n in names}
    files = sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True))
    npages = 0
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
                npages += 1
                try:
                    ref_lines = pg.extract_text_lines(strip=True)
                    ref_reps = sorted({round(l["bottom"], 2) for l in ref_lines})
                except Exception:
                    ref_reps = []
                cand = payloads(chars)
                cand["REF"] = ref_reps
                for n in names:
                    reps = cand[n]
                    m1, m2, nl = audit(chars, reps)
                    a = agg[n]
                    a["M1"] += m1
                    a["M2"] += m2
                    a["lines"] += nl
                    if m1:
                        a["pages_M1"] += 1
                    if m2:
                        a["pages_M2"] += 1
                    if m1 >= 3:
                        worst[n].append((m1, rel, i, len(reps)))

    out = []
    out.append("pages: %d" % npages)
    out.append("")
    out.append("%-12s %8s %8s %9s %9s %9s" % (
        "candidate", "M1", "M2", "pages_M1", "pages_M2", "lines"))
    for n in names:
        a = agg[n]
        out.append("%-12s %8d %8d %9d %9d %9d" % (
            n, a["M1"], a["M2"], a["pages_M1"], a["pages_M2"], a["lines"]))
    out.append("")
    for n in names:
        if not worst[n]:
            continue
        out.append("== %s 最严重的 M1（over-merge）==" % n)
        for m1, rel, i, nr in sorted(worst[n], reverse=True)[:12]:
            out.append("  M1=%-3d %-42s p%-4d reps=%d" % (m1, rel, i, nr))
        out.append("")
    io.open(os.path.join(HERE, "_structural_audit.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out))


if __name__ == "__main__":
    main()
