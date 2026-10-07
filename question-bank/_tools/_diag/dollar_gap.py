# -*- coding: utf-8 -*-
"""列出「不在围栏内、却含 $」的行 —— 这些是 B 类（$ 吞正文）的残余风险。

判据：用 page_markdown 生成带围栏的页文本，找出围栏外的含 $ 行。
如果残余都在正文/数学里（不含汇编立即数），说明围栏已足够；
如果仍有汇编行漏在围栏外，说明围栏判据需要放宽。
"""
import io
import os
import re
import sys
import glob

import pdfplumber

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
REPO = os.path.dirname(BASE)
SRC = os.path.join(REPO, "往年题")
sys.path.insert(0, TOOLS)
import convert                                          # noqa: E402

ASM_HINT = re.compile(r"^\s*(?:[0-9a-fA-F]{2,}[ \t]+){1,8}\S|\bmov|push|pop|call|"
                      r"lea|cmp|jmp|ret|add|sub|test|xor|imul|\b[0-9a-fA-F]{4,}:")


def main():
    outer = []
    n_total = n_fenced = 0
    for p in sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True)):
        rel = os.path.relpath(p, SRC).replace(os.sep, "/")
        if os.path.basename(rel) == "期末往年题勘误、详解 by Arthals.pdf":
            continue
        if os.path.splitext(rel)[0].replace(os.sep, "/") + ".md" in convert.PRESERVE:
            continue
        with pdfplumber.open(p) as pdf:
            for k, pg in enumerate(pdf.pages, 1):
                if not pg.chars:
                    continue
                md = convert.page_markdown(pg)
                fence = False
                for ln in md.splitlines():
                    if ln.strip().startswith("```"):
                        fence = not fence
                        continue
                    if "$" not in ln:
                        continue
                    n_total += ln.count("$")
                    if fence:
                        n_fenced += ln.count("$")
                    else:
                        outer.append((rel, k, ln.strip()[:120],
                                      bool(ASM_HINT.search(ln))))
    asmish = [x for x in outer if x[3]]
    print("`$` 总数 %d，围栏内 %d，围栏外 %d" % (n_total, n_fenced, n_total - n_fenced))
    print("围栏外的含 $ 行数 %d，其中带汇编/地址特征的 %d"
          % (len(outer), len(asmish)))
    print()
    print("== 围栏外**带汇编特征**的含 $ 行（这些是真正需要修 B 类的）==")
    for rel, k, ln, _ in asmish[:40]:
        print("  %-40s p%-3d %s" % (rel, k, ln))
    print()
    print("== 围栏外其它含 $ 行（抽样 25）==")
    for rel, k, ln, _ in [x for x in outer if not x[3]][:25]:
        print("  %-40s p%-3d %s" % (rel, k, ln))


if __name__ == "__main__":
    main()
