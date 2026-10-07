# -*- coding: utf-8 -*-
"""L2 硬约束校验：project(新原文切片) == project(旧原文切片) 逐字节相等。

思路：`原文` 里的展示层（代码围栏、`$` 定界符、`^{}`/`_{}`、markdown 转义）在
project() 下全部消失，而**内容一个字都不该变**。所以对 `_cls` 里的每一条区间，
把旧原文切片与新原文切片各自投影后应完全一致。

必须在 `remap_cls.py --apply` **之前**运行（此时 `_cls` 里还是旧行号），
用它内部的配准逻辑把旧区间映射到新区间。

失败报告给出**首个差异位置及前后 40 字**，否则 1000 道题的失败列表不可用。
"""
import io
import os
import re
import sys
import json
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
MD = os.path.join(BASE, "原文")
CLS = os.path.join(BASE, "_cls")
P_CONTROL_PAGE = re.compile(r"^\s*<!--\s*=+\s*page\s+\d+\s*=+\s*-->\s*$")
sys.path.insert(0, HERE)
import project as P                                     # noqa: E402
import remap_cls as R                                   # noqa: E402


def first_diff(a, b, ctx=40):
    n = min(len(a), len(b))
    i = 0
    while i < n and a[i] == b[i]:
        i += 1
    lo = max(0, i - ctx)
    return ("位置 %d\n      旧: ...%s[%s]%s...\n      新: ...%s[%s]%s..."
            % (i,
               a[lo:i], a[i:i + 1] or "<END>", a[i + 1:i + 1 + ctx],
               b[lo:i], b[i:i + 1] or "<END>", b[i + 1:i + 1 + ctx]))


def pages_of(lines):
    """按 page 注释切段；注释行本身归入其所属页。"""
    marks = [i for i, l in enumerate(lines) if P_CONTROL_PAGE.match(l)]
    if not marks:
        return [lines]
    segs = [lines[:marks[0]]] if marks[0] > 0 else []
    for k, m in enumerate(marks):
        end = marks[k + 1] if k + 1 < len(marks) else len(lines)
        segs.append(lines[m:end])
    return segs


def check_pages(old_dir):
    """与 `_cls` 无关的、可随时重跑的页级不变量检查。"""
    fails = []
    checked = 0
    for f in sorted(glob.glob(os.path.join(MD, "**", "*.md"), recursive=True)):
        rel = os.path.relpath(f, MD).replace(os.sep, "/")
        oldp = os.path.join(old_dir, rel.replace("/", os.sep))
        if not os.path.exists(oldp):
            continue
        a = pages_of(R.read_lines(oldp))
        b = pages_of(R.read_lines(f))
        if len(a) != len(b):
            fails.append((rel, -1, "页数不同 %d vs %d" % (len(a), len(b))))
            continue
        for k, (x, y) in enumerate(zip(a, b)):
            checked += 1
            pa, pb = P.project("\n".join(x)), P.project("\n".join(y))
            if pa != pb:
                fails.append((rel, k, first_diff(pa, pb)))
    return checked, fails


def main():
    old_dir = None
    if "--old" in sys.argv:
        old_dir = sys.argv[sys.argv.index("--old") + 1]
    if not old_dir:
        print("用法: python _tools/verify_project.py --old <旧原文目录> [--pages]")
        return 1
    if "--pages" in sys.argv:
        checked, fails = check_pages(old_dir)
        print("页级投影不变量：检查 %d 页，不等 %d 页" % (checked, len(fails)))
        for rel, k, d in fails[:10]:
            print("  FAIL %s page#%d %s" % (rel, k, d))
        return 1 if fails else 0
    out = []
    n_items = n_fail = 0
    fail_files = 0
    for p in sorted(glob.glob(os.path.join(CLS, "*.json"))):
        d = json.load(io.open(p, encoding="utf-8"))
        rel = d.get("file")
        if not rel:
            continue
        oldp = os.path.join(old_dir, rel.replace("/", os.sep))
        newp = os.path.join(MD, rel.replace("/", os.sep))
        if not os.path.exists(oldp) or not os.path.exists(newp):
            continue
        old_lines = R.read_lines(oldp)
        new_lines = R.read_lines(newp)
        if old_lines == new_lines:
            out.append("SAME %s" % os.path.basename(p))
            continue
        m, warns = R.build_map(old_lines, new_lines)
        if m is None:
            fail_files += 1
            out.append("FAIL %s 配准失败: %s" % (os.path.basename(p), warns))
            continue
        errs = []
        for it in (d.get("items") or []) + (d.get("answer_sections") or []):
            s, e = it.get("start"), it.get("end")
            if not isinstance(s, int) or not isinstance(e, int):
                continue
            n_items += 1
            if s not in m or e not in m:
                errs.append("[%d,%d] 行号不在映射内" % (s, e))
                continue
            ns, ne = m[s][0], m[e][1]
            if ns > ne:
                errs.append("[%d,%d] -> 空区间 [%d,%d]" % (s, e, ns, ne))
                continue
            a = P.project("\n".join(old_lines[s - 1:e]))
            b = P.project("\n".join(new_lines[ns - 1:ne]))
            if a != b:
                errs.append("[%d,%d] -> [%d,%d] 投影不等\n      %s"
                            % (s, e, ns, ne, first_diff(a, b)))
        if errs:
            fail_files += 1
            n_fail += len(errs)
            out.append("FAIL %s  %d 条" % (os.path.basename(p), len(errs)))
            for x in errs[:6]:
                out.append("      - " + x)
        else:
            out.append("ok   %-52s 条目投影逐字节相等" % os.path.basename(p))
    head = ["投影不变量校验（project(新) == project(旧)）",
            "旧原文目录：%s" % old_dir,
            "条目 %d，投影不等 %d 条，涉及 %d 个文件" % (n_items, n_fail, fail_files),
            ""]
    io.open(os.path.join(HERE, "_project_report.txt"), "w", encoding="utf-8").write(
        "\n".join(head + out))
    print("\n".join(head[:3]))
    print("详见 _tools/_project_report.txt")
    return 1 if n_fail else 0


if __name__ == "__main__":
    sys.exit(main())
