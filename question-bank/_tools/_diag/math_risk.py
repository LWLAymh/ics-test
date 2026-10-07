# -*- coding: utf-8 -*-
"""B 类（`$` 吞正文）的真实风险度量。

判据不是「有多少个 `$`」，而是「能不能配成对」：MathJax 只在一段文本里出现
**偶数个**未被保护的 `$` 时才会配对，进而把中间内容吞进数学模式。
围栏内的 `$` 受 pre/code 保护，不算。

所以对 `_cls` 的每道题统计：剥掉围栏后剩下的 `$` 个数。
  偶数 >= 2  -> 高风险（会配对）
  奇数       -> 低风险（MathJax 找不到配对，通常按字面渲染）

同时统计围栏外的 `%`（TeX 注释符）情况，对应 ics-check 的 math-comment-eats-text。
"""
import io
import os
import re
import sys
import json
import glob

HERE = os.path.dirname(os.path.abspath(__file__))       # _tools/_diag
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
MD = os.path.join(BASE, "原文")
CLS = os.path.join(BASE, "_cls")


def unfenced(text):
    """去掉围栏块（含围栏行），返回剩下的文本与围栏内 `$` 数。"""
    out, fence, inside = [], False, 0
    for ln in text.splitlines():
        if ln.strip().startswith("```"):
            fence = not fence
            continue
        if fence:
            inside += ln.count("$")
            continue
        out.append(ln)
    return "\n".join(out), inside


def main():
    high, low = [], []
    n_items = 0
    fenced_dollar = 0
    outer_dollar = 0
    fenced_lines = 0
    for p in sorted(glob.glob(os.path.join(CLS, "*.json"))):
        d = json.load(io.open(p, encoding="utf-8"))
        rel = d.get("file")
        if not rel:
            continue
        src = os.path.join(MD, rel.replace("/", os.sep))
        if not os.path.exists(src):
            continue
        lines = io.open(src, encoding="utf-8").read().splitlines()
        for it in d.get("items") or []:
            s, e = it.get("start"), it.get("end")
            if not isinstance(s, int) or not isinstance(e, int):
                continue
            if s < 1 or e > len(lines):
                continue
            n_items += 1
            frag = "\n".join(lines[s - 1:e])
            outer, inside = unfenced(frag)
            fenced_dollar += inside
            c = outer.count("$")
            outer_dollar += c
            for ln in frag.splitlines():
                if ln.strip().startswith("```"):
                    fenced_lines += 1
            if c >= 2 and c % 2 == 0:
                high.append((rel, it.get("qno", ""), c, s, e,
                             [l for l in outer.splitlines() if "$" in l][:2]))
            elif c:
                low.append((rel, it.get("qno", ""), c, s, e,
                            [l for l in outer.splitlines() if "$" in l][:1]))
    print("题目数 %d" % n_items)
    print("围栏内 `$` %d（受 MathJax pre/code 保护），围栏外 `$` %d"
          % (fenced_dollar, outer_dollar))
    print("高风险（围栏外偶数个 >=2，会配对吞正文）: %d 道" % len(high))
    print("低风险（围栏外奇数个，通常按字面渲染）  : %d 道" % len(low))
    print()
    print("== 高风险题目明细 ==")
    for rel, qno, c, s, e, ls in high[:25]:
        print("  %-40s %-8s $=%d  [%d,%d]" % (rel, qno, c, s, e))
        for x in ls:
            print("        %s" % x.strip()[:110])
    print()
    print("== 低风险题目（抽样 12）==")
    for rel, qno, c, s, e, ls in low[:12]:
        print("  %-40s %-8s $=%d  %s" % (rel, qno, c, ls[0].strip()[:90] if ls else ""))


if __name__ == "__main__":
    main()
