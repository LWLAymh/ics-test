# -*- coding: utf-8 -*-
"""挑选 L1 的 rep 合并阈值：以「行数与 extract_text_lines 的偏离」为主指标。

关键失败模式是灾难性并行：2013期中 p8 旧算法 11 行 vs 参考 53 行，
2022期中-无答案 p9 旧算法 4 行 vs 参考 36 行。所以主指标是
「行数 < 0.7 * 参考行数」的页数，其次是 over-split（行数 > 1.3 * 参考行数）。

候选规则：
  A_old        现状（锚行中位间距的一半）
  B_plan       计划：全字符行 + 0.5*中位间隙
  G_bin        P = 出现次数足够多的最大间隙，merge = clamp(0.5P, 3, 8)
  G_bin60      merge = clamp(0.6P, 3, 8)
  H_abs6       merge = 6.0 固定
  H_abs8       merge = 8.0 固定
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


def rows_of(chars):
    return sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))


def rep_old(chars):
    af = anchor_font(chars)
    anchors = cluster_lines([c for c in chars if c["fontname"] == af]) or \
        cluster_lines(chars)
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


def dedup(rows, merge):
    out = []
    for r in rows:
        if out and r - out[-1] < merge:
            continue
        out.append(r)
    return out


def merge_plan(rows):
    gaps = [b - a for a, b in zip(rows, rows[1:]) if b - a > 0.5]
    local = sorted(gaps)[len(gaps) // 2] if gaps else 12.0
    return 0.5 * local


def pitch_bin(rows):
    """出现次数足够多的最大间隙 = 行距 P。"""
    gaps = [round(b - a, 1) for a, b in zip(rows, rows[1:]) if b - a > 0.5]
    if not gaps:
        return 12.0
    cnt = Counter(gaps)
    maxc = max(cnt.values())
    cand = [g for g, n in cnt.items() if n >= max(3, 0.3 * maxc)]
    return max(cand) if cand else sorted(gaps)[len(gaps) // 2]


def rep_bin(chars, k=0.5):
    rows = rows_of(chars)
    if not rows:
        return []
    p = pitch_bin(rows)
    merge = min(8.0, max(3.0, k * p))
    return dedup(rows, merge)


def rep_abs(chars, m):
    rows = rows_of(chars)
    return dedup(rows, m) if rows else []


def build(chars, reps, gap_k=0.35):
    if not reps:
        return []
    buckets = [[] for _ in reps]
    for c in chars:
        buckets[min(range(len(reps)),
                    key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    frag = []
    for ln in buckets:
        ln.sort(key=lambda c: c["x0"])
        s, prev = "", None
        for c in ln:
            if prev is not None and (c["x0"] - prev["x1"]) > gap_k * c["size"]:
                s += " "
            s += c["text"]
            prev = c
        if s.strip():
            frag.append(s.rstrip())
    return frag


CANDS = ["A_old", "B_plan", "G_bin50", "G_bin60", "H_abs6", "H_abs8"]


def reps_for(name, chars):
    if name == "A_old":
        return rep_old(chars)
    if name == "B_plan":
        rows = rows_of(chars)
        return dedup(rows, merge_plan(rows)) if rows else []
    if name == "G_bin50":
        return rep_bin(chars, 0.5)
    if name == "G_bin60":
        return rep_bin(chars, 0.6)
    if name == "H_abs6":
        return rep_abs(chars, 6.0)
    if name == "H_abs8":
        return rep_abs(chars, 8.0)
    raise KeyError(name)


def main():
    agg = {n: Counter() for n in CANDS}
    # 参考行数可信的页面（extract_text 干净）单独统计
    trust = {n: Counter() for n in CANDS}
    npages = 0
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
                npages += 1
                ref = [l for l in (pg.extract_text() or "").splitlines()
                       if l.strip()]
                ref_bad = sum(1 for l in ref if is_bad(l))
                ref_n = len(ref)
                for n in CANDS:
                    frag = build(chars, reps_for(n, chars))
                    a = agg[n]
                    a["lines"] += len(frag)
                    a["bad"] += sum(1 for l in frag if is_bad(l))
                    if ref_n:
                        r = len(frag) / ref_n
                        if r < 0.7:
                            a["under70"] += 1
                        elif r > 1.3:
                            a["over130"] += 1
                    if ref_n and ref_bad == 0:
                        t = trust[n]
                        t["pages"] += 1
                        t["lines"] += len(frag)
                        t["ref_lines"] += ref_n
                        t["bad"] += sum(1 for l in frag if is_bad(l))
                        if ref_n and len(frag) / ref_n < 0.8:
                            t["under80"] += 1
    out = []
    out.append("pages: %d" % npages)
    out.append("")
    out.append("%-10s %8s %8s %9s %10s" % ("cand", "lines", "bad", "under70", "over130"))
    for n in CANDS:
        a = agg[n]
        out.append("%-10s %8d %8d %9d %10d" % (
            n, a["lines"], a["bad"], a["under70"], a["over130"]))
    out.append("")
    out.append("只在「extract_text 干净」的页面上比较（参考行数可信）")
    out.append("%-10s %7s %10s %10s %8s %9s" % (
        "cand", "pages", "lines", "ref_lines", "bad", "under80"))
    for n in CANDS:
        t = trust[n]
        out.append("%-10s %7d %10d %10d %8d %9d" % (
            n, t["pages"], t["lines"], t["ref_lines"], t["bad"], t["under80"]))
    io.open(os.path.join(HERE, "_pick_merge.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out))


if __name__ == "__main__":
    main()
