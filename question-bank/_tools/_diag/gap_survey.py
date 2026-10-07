# -*- coding: utf-8 -*-
"""L1 全库勘测：统计每页行间隙分布，并对比旧/新聚类的坏行数与行数。

目的：计划里的 `merge = 0.5 * 中位间隙` 在「两层基线差 5.7pt、行距 11.04pt」的页面上
会算出 merge=5.52 < 5.7，从而不再合并同一视觉行的两层，把一个视觉行劈成两行。
本脚本量化这个风险，并给出可选的更稳健判据。

产出 _tools/_diag/_gap_survey.txt
"""
import io
import os
import re
import sys
import glob
import collections
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


def old_reps(chars):
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


def build(chars, reps, gap_k=0.35):
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


def new_rows(chars):
    return sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))


def merge_median(rows):
    gaps = [b - a for a, b in zip(rows, rows[1:]) if b - a > 0.5]
    local = sorted(gaps)[len(gaps) // 2] if gaps else 12.0
    return 0.5 * local, gaps


def dedup(rows, merge):
    out = []
    for r in rows:
        if out and r - out[-1] < merge:
            continue
        out.append(r)
    return out


def main():
    out = []
    hist = collections.Counter()          # 间隙分布（0.1pt 粒度）
    two_layer = collections.Counter()     # 「疑似同一视觉行两层」的间隙
    files = []
    for p in sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True)):
        rel = os.path.relpath(p, SRC).replace(os.sep, "/")
        if os.path.basename(rel) == "期末往年题勘误、详解 by Arthals.pdf":
            continue
        files.append((rel, p))

    rows_report = []
    for rel, path in files:
        try:
            pdf = pdfplumber.open(path)
        except Exception as e:
            out.append("OPEN FAIL %s %s" % (rel, e))
            continue
        with pdf:
            for i, pg in enumerate(pdf.pages, 1):
                chars = list(pg.chars)
                if not chars:
                    continue
                orp = old_reps(chars)
                rows = new_rows(chars)
                merge, gaps = merge_median(rows)
                nrp = dedup(rows, merge)
                old_frag = build(chars, orp)
                new_frag = build(chars, nrp)
                bad_old = sum(1 for l in old_frag if is_bad(l))
                bad_new = sum(1 for l in new_frag if is_bad(l))
                for g in gaps:
                    hist[round(g, 1)] += 1
                delta = len(new_frag) - len(old_frag)
                rows_report.append((bad_old, bad_new, rel, i, len(old_frag),
                                    len(new_frag), len(rows), len(nrp),
                                    round(merge, 2), delta))
                # 记录「紧邻但未合并」的间隙（两层嫌疑）
                for a, b in zip(rows, rows[1:]):
                    if 0.5 < b - a < 8.0:
                        two_layer[round(b - a, 1)] += 1

    tot_bo = sum(r[0] for r in rows_report)
    tot_bn = sum(r[1] for r in rows_report)
    dirty_old = sum(1 for r in rows_report if r[0])
    dirty_new = sum(1 for r in rows_report if r[1])
    out.append("pages scanned: %d" % len(rows_report))
    out.append("bad lines: old=%d (on %d pages)  new=%d (on %d pages)"
               % (tot_bo, dirty_old, tot_bn, dirty_new))
    out.append("")
    out.append("== 页面级差异（新行数 - 旧行数 > 0 的页，前 40）==")
    out.append("%-42s %4s %6s %6s %6s %5s %6s %7s %6s"
               % ("file", "pg", "badO", "badN", "linesO", "linesN",
                  "rows", "nreps", "delta"))
    for r in sorted(rows_report, key=lambda x: -x[9])[:40]:
        out.append("%-42s %4d %6d %6d %6d %5d %6d %7d %6d"
                   % (r[2], r[3], r[0], r[1], r[4], r[5], r[6], r[7], r[9]))
    out.append("")
    out.append("== 仍有坏行的页（新算法）==")
    for r in rows_report:
        if r[1]:
            out.append("%-42s p%-4d badO=%d badN=%d linesO=%d linesN=%d merge=%.2f"
                       % (r[2], r[3], r[0], r[1], r[4], r[5], r[8]))
    out.append("")
    out.append("== 行间隙分布（全库页面，0.1pt 粒度，只列计数>=20 的）==")
    for g, n in sorted(hist.items()):
        if n >= 20:
            out.append("  gap=%6.1f  count=%d" % (g, n))
    out.append("")
    out.append("== 0.5<gap<8 的两层嫌疑分布（计数>=5）==")
    for g, n in sorted(two_layer.items()):
        if n >= 5:
            out.append("  gap=%6.1f  count=%d" % (g, n))

    io.open(os.path.join(HERE, "_gap_survey.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out[:40]))


if __name__ == "__main__":
    main()
