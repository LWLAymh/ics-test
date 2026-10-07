# -*- coding: utf-8 -*-
"""L2 回归检查：围栏改造必须「只加围栏、不改文本」。

用 project() 剥掉展示层后，逐页比较：
  A) 落盘 原文 的该页内容  vs  convert.page_text(pg)   —— 证明重构没改文本
  B) convert.page_markdown(pg) vs convert.page_text(pg) —— 证明围栏是投影中性的
再统计围栏规模与「围栏内出现中文正文」的可疑块（ics-check 的 code-fence-prose 同类判据）。

用法: python _tools/_diag/l2_regress.py
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
MD = os.path.join(BASE, "原文")
sys.path.insert(0, TOOLS)
import convert                                          # noqa: E402
import project as P                                     # noqa: E402

PAGE = re.compile(r"^\s*<!--\s*=+\s*page\s+(\d+)\s*=+\s*-->\s*$")
# convert_pdf 会把该页图片链接追加到页文本末尾，比对时两边都要去掉
IMG = re.compile(r"!\[[^\]]*\]\([^)]*\)")


def main():
    n_pages = n_a_bad = n_b_bad = 0
    blocks = 0
    block_lines = 0
    prose_blocks = []
    protected_dollar = 0
    total_dollar = 0
    samples = []
    for p in sorted(glob.glob(os.path.join(SRC, "**", "*.pdf"), recursive=True)):
        rel = os.path.relpath(p, SRC).replace(os.sep, "/")
        if os.path.basename(rel) == "期末往年题勘误、详解 by Arthals.pdf":
            continue
        mdp = os.path.join(MD, os.path.splitext(rel)[0] + ".md")
        relmd = os.path.splitext(rel)[0].replace(os.sep, "/") + ".md"
        if relmd in convert.PRESERVE or not os.path.exists(mdp):
            continue
        raw = io.open(mdp, encoding="utf-8").read().splitlines()
        marks = [i for i, l in enumerate(raw) if PAGE.match(l)]
        with pdfplumber.open(p) as pdf:
            for k, pg in enumerate(pdf.pages):
                if not pg.chars:
                    continue
                n_pages += 1
                txt = convert.page_text(pg)
                mdt = convert.page_markdown(pg)
                # A) 落盘内容 vs 现算文本（两边都去掉图片链接）
                if k < len(marks):
                    end = marks[k + 1] if k + 1 < len(marks) else len(raw)
                    seg = IMG.sub("", "\n".join(raw[marks[k] + 1:end]))
                    if P.project(seg) != P.project(txt):
                        n_a_bad += 1
                        if n_a_bad <= 3:
                            print("A) 文本不一致: %s p%d" % (rel, k + 1))
                # B) 围栏中性
                if P.project(mdt) != P.project(txt):
                    n_b_bad += 1
                    if n_b_bad <= 3:
                        print("B) 围栏非中性: %s p%d" % (rel, k + 1))
                # 围栏统计
                lines = mdt.splitlines()
                fence = False
                cur = []
                for ln in lines:
                    if ln.strip().startswith("```"):
                        if fence:
                            blocks += 1
                            block_lines += len(cur)
                            cjk = sum(1 for x in cur if re.search(r"[　-鿿]", x))
                            if cur and cjk / len(cur) > 0.5:
                                prose_blocks.append((rel, k + 1, cur[:3]))
                            if len(samples) < 14 and len(cur) <= 8:
                                samples.append((rel, k + 1, list(cur)))
                            for x in cur:
                                protected_dollar += x.count("$")
                        fence = not fence
                        cur = []
                        continue
                    if fence:
                        cur.append(ln)
                total_dollar += mdt.count("$")
    print("pages checked            : %d" % n_pages)
    print("A) 落盘文本不一致的页     : %d" % n_a_bad)
    print("B) 围栏非投影中性的页     : %d" % n_b_bad)
    print("围栏块数 / 圈入行数       : %d / %d" % (blocks, block_lines))
    print("`$` 总数 %d，其中围栏内 %d（受保护）" % (total_dollar, protected_dollar))
    print("围栏内中文占比 >50%% 的块 : %d" % len(prose_blocks))
    for rel, pg, cur in prose_blocks[:12]:
        print("   !! %s p%d  %r" % (rel, pg, cur))
    print()
    print("== 短围栏块样例（人工复核）==")
    for rel, pg, cur in samples:
        print("  %s p%d (%d 行)" % (rel, pg, len(cur)))
        for x in cur:
            print("      | %s" % x[:100])


if __name__ == "__main__":
    main()
