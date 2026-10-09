# -*- coding: utf-8 -*-
"""调试 scaffold 的投影不等。
用法: python _tools/_diag/dbg_scaffold.py "期中/2014期中-带答案.md" 173 186
"""
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
import project as P                                     # noqa: E402
import curated as CU                                    # noqa: E402
import scaffold_curated as S                            # noqa: E402
import legacy_v3 as bw                                  # noqa: E402


def main():
    rel, s, e = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    path = os.path.join(BASE, "原文", rel.replace("/", os.sep))
    lines = io.open(path, encoding="utf-8").read().splitlines()
    sl = lines[s - 1:e]
    slice_txt = bw.normalize_markdown_assets("\n".join(sl), rel)
    c = S.classify(slice_txt.splitlines())
    c, pulled = S.extract_inline_answer(c)
    print("pulled_inline_answer=%s" % pulled)
    print("mode=%s prov=%s reason=%s" % (c["mode"], c["provenance"], c["reason"]))
    text = S.render(c)
    p = CU.parse(text)
    print("assertions=%r" % CU.check_assertions(p))
    content = CU.build_content(p)
    a = P.project(slice_txt)
    b = P.project(content)
    ar = P.project_reflow(slice_txt)
    br = P.project_reflow(content)
    print("byte-equal=%s  reflow-equal=%s" % (a == b, ar == br))
    if ar != br:
        n = min(len(ar), len(br))
        i = 0
        while i < n and ar[i] == br[i]:
            i += 1
        print("reflow first diff at %d" % i)
        print("  slice: ...%r[%r]%r..." % (ar[max(0, i - 60):i], ar[i:i + 1], ar[i + 1:i + 60]))
        print("  cur  : ...%r[%r]%r..." % (br[max(0, i - 60):i], br[i:i + 1], br[i + 1:i + 60]))
    print("--- rendered curated ---")
    print(text)
    print("--- slice (raw) ---")
    for i, l in enumerate(sl, s):
        print("%4d| %s" % (i, l))


if __name__ == "__main__":
    main()
