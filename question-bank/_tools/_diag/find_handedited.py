# -*- coding: utf-8 -*-
"""找出「人工誊写/改写过」的 原文 文件 —— 这些文件绝不能被 convert.py 覆盖。

判据（都指向同一件事：内容不是这次重提取产生的）：
  fences  : 基线里有 ``` 围栏。convert.py 的 PDF 路径从不写围栏（docx 走 pandoc 会写），
            所以 PDF 来源文件里出现围栏 = 人工添加。
  chardelta: 逐页比较基线与新文件的**非空白字符多重集**。重聚类只改分行、不改字符，
            所以机器生成的文件应当逐页完全一致；不一致即说明有人工增删。

用法: python _tools/_diag/find_handedited.py
"""
import io
import os
import re
import sys
import glob
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
MD = os.path.join(BASE, "原文")
OLD = r"D:\blog\_ics_backup\baseline\原文"
PAGE = re.compile(r"^\s*<!--\s*=+\s*page\s+(\d+)\s*=+\s*-->\s*$")
WS = re.compile(r"\s+")


def pages(path):
    """-> (head_lines, {pageno: [lines]})"""
    lines = io.open(path, encoding="utf-8").read().splitlines()
    marks = [i for i, l in enumerate(lines) if PAGE.match(l)]
    if not marks:
        return lines, {}
    head = lines[:marks[0]]
    out = {}
    for k, m in enumerate(marks):
        end = marks[k + 1] if k + 1 < len(marks) else len(lines)
        out[k + 1] = lines[m + 1:end]
    return head, out


def multi(lines):
    return Counter(WS.sub("", "".join(lines)))


def main():
    # docx/pandoc 来源不参与（它们天然可能有围栏）
    docx_rel = set()
    for p in glob.glob(os.path.join(BASE, "..", "往年题", "**", "*.docx"),
                       recursive=True):
        r = os.path.relpath(p, os.path.join(BASE, "..", "往年题"))
        docx_rel.add(os.path.splitext(r)[0].replace(os.sep, "/") + ".md")

    rows = []
    for f in sorted(glob.glob(os.path.join(MD, "**", "*.md"), recursive=True)):
        rel = os.path.relpath(f, MD).replace(os.sep, "/")
        if rel == "_manifest.json" or rel in docx_rel:
            continue
        oldp = os.path.join(OLD, rel.replace("/", os.sep))
        if not os.path.exists(oldp):
            continue
        oh, op = pages(oldp)
        nh, np_ = pages(f)
        fences = sum(1 for l in io.open(oldp, encoding="utf-8").read().splitlines()
                     if l.strip().startswith("```"))
        deltas = []
        for k in sorted(set(op) | set(np_)):
            a = multi(op.get(k, []))
            b = multi(np_.get(k, []))
            d = sum((a - b).values()) + sum((b - a).values())
            if d:
                deltas.append((k, d, sum(a.values()), sum(b.values())))
        head_d = 0
        if multi(oh) != multi(nh):
            head_d = (sum((multi(oh) - multi(nh)).values())
                      + sum((multi(nh) - multi(oh)).values()))
        if fences or deltas or head_d:
            rows.append((rel, fences, len(deltas), head_d,
                         sum(d for _, d, _, _ in deltas), deltas[:3]))

    out = ["人工誊写/改写嫌疑文件（不应被 convert.py 覆盖）", ""]
    out.append("%-46s %6s %7s %7s %9s" % ("文件", "围栏", "差异页", "前导差", "字符差合计"))
    out.append("-" * 90)
    for rel, fe, nd, hd, tot, _ in sorted(rows, key=lambda r: -(r[1] * 1000 + r[4])):
        out.append("%-46s %6d %7d %7d %9d" % (rel, fe, nd, hd, tot))
    out.append("")
    out.append("== 差异页明细（前 3 页/文件）==")
    for rel, fe, nd, hd, tot, det in sorted(rows, key=lambda r: -r[4]):
        if not det:
            continue
        out.append("%s (fences=%d)" % (rel, fe))
        for k, d, ca, cb in det:
            out.append("   page %-3d 差 %-5d 基线 %-6d 新 %-6d" % (k, d, ca, cb))
    io.open(os.path.join(HERE, "_handedited.txt"), "w", encoding="utf-8").write(
        "\n".join(out))
    print("\n".join(out[:34]))


if __name__ == "__main__":
    main()
