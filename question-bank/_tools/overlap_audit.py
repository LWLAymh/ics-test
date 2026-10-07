# -*- coding: utf-8 -*-
"""D 类交错的几何回归守卫 + 文本筛子工单。

结论（实测，两个结构性判据都被否掉，本脚本保留为回归守卫）：
  - 「同基线两个 run 的 x 区间重叠」不成立：正常中文/拉丁两层里，拉丁 run 本来
    就落在中文 run 的 x 跨度内部 —— 放宽到「任意两 run」会误报 798 处；
  - 收紧到「同一 (font,size) 的两个 run 重叠」则命中 0 处，说明 PDF 里的重复字形
    并不是「同源两遍绘制」，而是别的成因。
  - 因此**几何判据无法识别 D 类**，可靠的筛子仍是文本层面的相邻重复率
    （find_interleave.is_bad，已用 hex_mask 剔除十六进制噪声）。

本脚本现在的作用：断言「同源重叠 = 0」，若将来重提取把它做出来就会报警。
工单以文本筛子命中为准（当前 44 行）。
"""
import io
import os
import re
import sys
import glob
from collections import Counter

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))   # _tools
BASE = os.path.dirname(HERE)                        # 往年题(按知识点分类)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")
sys.path.insert(0, HERE)
from find_interleave import is_bad                     # noqa: E402
from convert import page_text                          # noqa: E402


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


def buckets_of(chars, line_merge=8.0):
    rows = sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))
    reps = []
    for r in rows:
        if reps and r - reps[-1] < line_merge:
            continue
        reps.append(r)
    out = [[] for _ in reps]
    for c in chars:
        out[min(range(len(reps)),
                key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    return reps, out


def runs_of(bucket):
    """把桶按 (font,size) + x 连续性切成 run。"""
    cs = sorted(bucket, key=lambda c: c["x0"])
    runs, cur = [], []
    for c in cs:
        if cur:
            prev = cur[-1]
            same = (c["fontname"] == prev["fontname"]
                    and abs(c["size"] - prev["size"]) < 0.01)
            gap = c["x0"] - prev["x1"]
            if not same or gap > 0.5 * c["size"]:
                runs.append(cur)
                cur = []
        cur.append(c)
    if cur:
        runs.append(cur)
    return runs


def overlap_pairs(bucket):
    """返回「同一 (font,size) 的两个 run 的 x 区间重叠超过较短者 30%」的对数。

    注意不能只看「x 区间重叠」：正常的中文/拉丁两层里，拉丁 run 本来就落在
    中文 run 的 x 跨度**内部**，那样会误报 798 处。真正的交错是**同一字体、同一字号**
    的文字被画了两遍（`uunnssiiggnneedd`），只有这种同源重叠才是缺陷。
    """
    runs = runs_of(bucket)
    n = 0
    for i in range(len(runs)):
        for j in range(i + 1, len(runs)):
            a, b = runs[i], runs[j]
            if (a[0]["fontname"] != b[0]["fontname"]
                    or abs(a[0]["size"] - b[0]["size"]) >= 0.01):
                continue
            ax0, ax1 = min(c["x0"] for c in a), max(c["x1"] for c in a)
            bx0, bx1 = min(c["x0"] for c in b), max(c["x1"] for c in b)
            ov = min(ax1, bx1) - max(ax0, bx0)
            if ov <= 0:
                continue
            shorter = min(ax1 - ax0, bx1 - bx0)
            if shorter > 0 and ov / shorter > 0.30:
                n += 1
    return n


def text_of(bucket, gap_k=0.35):
    b = sorted(bucket, key=lambda c: c["x0"])
    s, prev = "", None
    for c in b:
        if prev is not None and (c["x0"] - prev["x1"]) > gap_k * c["size"]:
            s += " "
        s += c["text"]
        prev = c
    return s.rstrip()


def main():
    struct_hits, text_hits = [], []
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
                _, buckets = buckets_of(chars)
                for b in buckets:
                    if len(b) < 4:
                        continue
                    t = text_of(b)
                    if not t.strip():
                        continue
                    n = overlap_pairs(b)
                    if n:
                        struct_hits.append((rel, i, n, t[:120]))
                # 文本筛子：逐行重新定位到 is_bad
                for ln in page_text(pg).splitlines():
                    if is_bad(ln):
                        text_hits.append((rel, i, ln.strip()[:120]))

    out = []
    out.append("D 类交错工单")
    out.append("")
    out.append("1) 结构性重叠（同基线两个 run 的 x 区间重叠 >30%%）：%d 处"
               % len(struct_hits))
    out.append("2) 文本筛子命中（find_interleave.is_bad）：%d 行" % len(text_hits))
    out.append("")
    out.append("== 1) 结构性重叠明细 ==")
    byfile = Counter(r for r, _, _, _ in struct_hits)
    for rel, n in byfile.most_common():
        out.append("  %-46s %d" % (rel, n))
    out.append("")
    for rel, i, n, t in struct_hits:
        out.append("  %-40s p%-3d ov=%d  %s" % (rel, i, n, t))
    out.append("")
    out.append("== 2) 文本筛子命中明细 ==")
    byfile2 = Counter(r for r, _, _ in text_hits)
    for rel, n in byfile2.most_common():
        out.append("  %-46s %d" % (rel, n))
    out.append("")
    for rel, i, t in text_hits:
        out.append("  %-40s p%-3d  %s" % (rel, i, t))
    io.open(os.path.join(HERE, "_overlap_report.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out[:8]))
    print()
    print("structural overlap files/pages: %d hits" % len(struct_hits))
    print("text-screen hits: %d" % len(text_hits))


if __name__ == "__main__":
    main()
