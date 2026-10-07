# -*- coding: utf-8 -*-
"""探测上下标的可恢复率（计划 L2 §2.1）。

PDF 里上下标是独立的一层：同一视觉行内存在 size < 0.85 × 主体 size、且 top 相对主体
上移/下移 > 1pt 的连续字符段。它们与主体层按 x 交错，需要按 x 就近挂到前一个主体字符上。

但恢复率不是 100%：部分行整个数学 run 是同一 size/基线，没有可区分的层。
本脚本统计「可恢复 / 不可恢复」，**不为不可恢复的做无根据猜测**。

产出 _tools/_scripts_report.txt
"""
import io
import os
import re
import sys
import glob
from collections import Counter

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")
sys.path.insert(0, HERE)
from convert import cluster_lines, rep, LINE_MERGE      # noqa: E402

CJK = re.compile(r"[　-鿿＀-￯]")


def buckets_of(chars):
    rows = sorted(rep(ln) for ln in cluster_lines(chars, tol=1.0))
    reps = []
    for r in rows:
        if reps and r - reps[-1] < LINE_MERGE:
            continue
        reps.append(r)
    out = [[] for _ in reps]
    for c in chars:
        out[min(range(len(reps)),
                key=lambda k: abs(c["bottom"] - reps[k]))].append(c)
    return reps, out


def size_profile(bucket):
    """-> (主体 size, 主体 baseline, [可恢复脚本段])"""
    cnt = Counter(round(c["size"], 2) for c in bucket)
    main_size = cnt.most_common(1)[0][0]
    main = [c for c in bucket if abs(c["size"] - main_size) < 0.01]
    if not main:
        return main_size, 0.0, []
    main_top = sorted(c["top"] for c in main)[len(main) // 2]
    small = [c for c in bucket if c["size"] < 0.85 * main_size]
    if not small:
        return main_size, main_top, []
    # 按 top 分成段
    segs = []
    for c in sorted(small, key=lambda c: (round(c["top"], 1), c["x0"])):
        if segs and abs(c["top"] - segs[-1][-1]["top"]) <= 1.0:
            segs[-1].append(c)
        else:
            segs.append([c])
    out = []
    for sg in segs:
        top = sorted(c["top"] for c in sg)[len(sg) // 2]
        dy = main_top - top                    # >0 上标，<0 下标
        if abs(dy) <= 1.0:
            continue
        sg = sorted(sg, key=lambda c: c["x0"])
        out.append({
            "dy": dy,
            "size": round(sg[0]["size"], 2),
            "x0": sg[0]["x0"], "x1": max(c["x1"] for c in sg),
            "text": "".join(c["text"] for c in sg),
            "n": len(sg),
        })
    return main_size, main_top, out


def main():
    tot_buckets = tot_buckets_with_script = 0
    n_sup = n_sub = 0
    char_sup = char_sub = 0
    samples = []
    per_file = Counter()
    for p in sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True)):
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
                    if len(b) < 2:
                        continue
                    tot_buckets += 1
                    ms, mt, segs = size_profile(b)
                    if not segs:
                        continue
                    tot_buckets_with_script += 1
                    per_file[rel] += len(segs)
                    for s in segs:
                        if s["dy"] > 0:
                            n_sup += 1
                            char_sup += s["n"]
                        else:
                            n_sub += 1
                            char_sub += s["n"]
                        if len(samples) < 40:
                            whole = "".join(c["text"] for c in
                                            sorted(b, key=lambda c: c["x0"]))
                            samples.append((rel, i, s, whole[:110]))
    out = []
    out.append("上下标探测（全库 PDF）")
    out.append("")
    out.append("桶总数                    %d" % tot_buckets)
    out.append("含可分辨脚本层的桶        %d  (%.1f%%)"
               % (tot_buckets_with_script,
                  100.0 * tot_buckets_with_script / max(1, tot_buckets)))
    out.append("上标段 %-6d 字符 %d" % (n_sup, char_sup))
    out.append("下标段 %-6d 字符 %d" % (n_sub, char_sub))
    out.append("")
    out.append("按文件（脚本段数）")
    for rel, n in per_file.most_common():
        out.append("  %-46s %d" % (rel, n))
    out.append("")
    out.append("== 样例（脚本段 -> 整行）==")
    for rel, i, s, whole in samples:
        out.append("  %s p%d dy=%+.2f size=%.2f 段=%r" % (rel, i, s["dy"], s["size"], s["text"]))
        out.append("      整行: %s" % whole)
    io.open(os.path.join(HERE, "_scripts_report.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out[:8]))


if __name__ == "__main__":
    main()
