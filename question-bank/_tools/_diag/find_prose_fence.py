# -*- coding: utf-8 -*-
"""列出 web-data 里「围栏块含中文」的题，并回溯到 原文/curated 的位置。"""
import io
import os
import re
import sys
import json
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
import curated as CU                                    # noqa: E402

CJK = re.compile(r"[　-鿿]")


def blocks(content):
    fence, cur = False, []
    for ln in content.splitlines():
        if ln.strip().startswith("```"):
            if fence:
                yield list(cur)
            fence = not fence
            cur = []
            continue
        if fence:
            cur.append(ln)


def main():
    for f in sorted(glob.glob(os.path.join(BASE, "web-data", "questions", "*.json"))):
        d = json.load(io.open(f, encoding="utf-8"))
        for q in d["questions"]:
            for b in blocks(q["content"]):
                if not b:
                    continue
                cjk = sum(1 for x in b if CJK.search(x))
                if cjk / len(b) <= 0.5:
                    continue
                print("=== %s #%s  (%d 行, %d 行含中文)"
                      % (q["exam"], q["questionNo"], len(b), cjk))
                print("    mode=%s  curated=%s" % (q.get("layout", {}).get("mode"),
                                                   q["source"].get("curated")))
                for x in b[:6]:
                    print("      | %s" % x[:110])
                cur = q["source"].get("curated") or ""
                if cur.startswith("_curated/"):
                    cur = cur[len("_curated/"):]
                if cur:
                    cp = os.path.join(BASE, "_curated", cur.replace("/", os.sep))
                    if not os.path.isfile(cp):
                        print("    (curated 文件缺失: %s)" % cp)
                        continue
                    print("    --- curated 文件里的控制行与围栏 ---")
                    for i, ln in enumerate(
                            io.open(cp, encoding="utf-8").read().splitlines(), 1):
                        if ln.lstrip().startswith("%%%") or ln.strip().startswith("```"):
                            print("      %5d| %s" % (i, ln[:100]))
                print()


if __name__ == "__main__":
    main()
