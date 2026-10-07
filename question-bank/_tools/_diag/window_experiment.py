# -*- coding: utf-8 -*-
"""实验：在整行相邻重复率之外，加一条「最差滑窗」判据，看能否捞回被稀释的真交错。

被漏掉的真实交错形如 `pmuosvh %%rbrspp ,%rbp`（`push`/`mov` 逐字符交织）：
局部 `%%rbrspp` 的重复率约 0.5，但整行被其它内容稀释到 0.28 以下。
而合法的十六进制/字节列已经被 hex_mask 剔除，所以滑窗不会在那里爆。
"""
import io
import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
BASE = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
import find_interleave as F            # noqa: E402

KNOWN = ["pmuosvh", "%%rbrspp", "rbrspp", "rrsbpp"]


def max_window_ratio(s, win=18):
    mask = F.hex_mask(s)
    t = [(ch, mask[i]) for i, ch in enumerate(s) if F.ALNUM.match(ch)]
    if len(t) < 10:
        return 0.0
    best = 0.0
    for k in range(0, len(t) - 4):
        seg = t[k:k + win]
        if len(seg) < 6:
            break
        same = sum(1 for (c1, h1), (c2, h2) in zip(seg, seg[1:])
                   if c1 == c2 and not (h1 and h2))
        best = max(best, same / (len(seg) - 1))
    return best


def is_bad_v3(s, thr=0.45):
    if F.is_bad(s):
        return True
    core = s.strip()
    if len(core) < 8 or core.startswith("```") or core.startswith("<!--"):
        return False
    if set(core) <= set("-=_*# "):
        return False
    if len(F.ALPHA.findall(core)) < 6:
        return False
    return max_window_ratio(core) >= thr


def main():
    files = sorted(glob.glob(os.path.join(BASE, "原文", "**", "*.md"),
                              recursive=True))
    tot_v2 = tot_v3 = 0
    new_hits = []
    known_hit_v2 = known_hit_v3 = 0
    for f in files:
        rel = os.path.relpath(f, os.path.join(BASE, "原文")).replace(os.sep, "/")
        lines = io.open(f, encoding="utf-8").read().splitlines()
        fence = False
        for i, ln in enumerate(lines, 1):
            if ln.strip().startswith("```"):
                fence = not fence
                continue
            if fence:
                continue
            if any(k in ln for k in KNOWN):
                if F.is_bad(ln):
                    known_hit_v2 += 1
                if is_bad_v3(ln):
                    known_hit_v3 += 1
            if F.is_bad(ln):
                tot_v2 += 1
            if is_bad_v3(ln):
                tot_v3 += 1
                if not F.is_bad(ln):
                    new_hits.append((rel, i, round(max_window_ratio(ln), 3), ln.strip()[:110]))
    print("flagged: v2=%d  v3(window)=%d" % (tot_v2, tot_v3))
    print("known pmuosvh/rbrspp lines caught: v2=%d  v3=%d" % (known_hit_v2, known_hit_v3))
    print()
    print("== v3 新增命中（前 30）==")
    for rel, i, r, t in new_hits[:30]:
        print("  %-40s L%-5d r=%.2f  %s" % (rel, i, r, t))


if __name__ == "__main__":
    main()
