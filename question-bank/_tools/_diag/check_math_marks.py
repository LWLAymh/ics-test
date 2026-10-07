# -*- coding: utf-8 -*-
"""补数学标记后的自检。

判据（必须按**围栏内/外**区分，否则全是假警报）：
  - 围栏**外**的行内 `$` 必须成对（MathJax 会配对；奇数个会吞掉后面正文）；
  - 围栏**内**的 `$` 无所谓（MathJax 跳过 pre/code）；
  - `$…$` 里不能出现 `|`（markdown 表格会把它当分隔符）。
"""
import io
import os
import re
import glob

HERE = os.path.dirname(os.path.abspath(__file__))       # _tools/_diag
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
CUR = os.path.join(BASE, "_curated")
DOLLAR = re.compile(r"\$([^$]*)\$")
CODE = re.compile(r"`[^`]*`")


def main():
    total_marks = 0
    bad_lines = []
    pipe_in_math = []
    freed = 0
    for f in sorted(glob.glob(os.path.join(CUR, "**", "*.md"), recursive=True)):
        rel = os.path.relpath(f, CUR)
        fence = False
        for i, ln in enumerate(io.open(f, encoding="utf-8").read().splitlines(), 1):
            if ln.strip().startswith("```"):
                fence = not fence
                continue
            if fence or ln.lstrip().startswith("%%%"):
                continue
            stripped = CODE.sub("", ln)          # 行内代码里的 $ 是安全的
            n = stripped.count("$")
            if n % 2:
                bad_lines.append("%s:%d %s" % (rel, i, ln.strip()[:90]))
            total_marks += len(DOLLAR.findall(stripped))
            for m in DOLLAR.finditer(stripped):
                if "|" in m.group(1):
                    pipe_in_math.append("%s  %r" % (rel, m.group(1)[:40]))
            if "|" in stripped:
                freed += 1
    print("围栏外公式对总数: %d" % total_marks)
    print("围栏外 $ 不成对的行: %d" % len(bad_lines))
    for x in bad_lines[:10]:
        print("   !! %s" % x)
    print("$…$ 里含 | 的处数: %d" % len(pipe_in_math))
    for x in pipe_in_math[:6]:
        print("   !! %s" % x)


if __name__ == "__main__":
    main()
