# -*- coding: utf-8 -*-
"""把 _cls/*.json 里的行号从旧 原文 重映射到新 原文。

为什么不能用 SequenceMatcher 就完事：L1 修的是「相邻行被并进同一个桶」，
所以旧文件里**一行**在新文件里会变成**连续多行**。行级 diff 会把这种变化报成
replace 块，块内无法一一对应，区间端点就落不到确定位置上。

做法（按页锚定 + 字符数配准）：
  1. `<!-- ===== page N ===== -->` 注释在旧新文件里逐字相同，且页数不变，
     用它把文件切成「页前导 + 每页正文」；
  2. 页内旧新两边的**非空白字符多重集**应当完全相同（重聚类只改分行，不改字符）；
  3. 用「非空白字符累计数」把新行贪心配准到旧行：旧行 i 对应一段连续新行
     [lo, hi]；
  4. item 区间 [s,e] → [map(s).lo, map(e).hi]；
  5. 独立校验：旧切片与新切片的非空白字符多重集必须相等，否则只报告不猜。

用法：
  python _tools/remap_cls.py                 # 只检查并写报告
  python _tools/remap_cls.py --apply         # 写回 _cls/*.json
  python _tools/remap_cls.py --old DIR       # 指定旧 原文 目录

**不能重复运行**：本脚本把 `_cls` 从「旧行号」改写成「新行号」，跑第二次时
`_cls` 里已经是新行号，拿它们去切旧文件会得到错误的字符多重集，于是每一条都
校验失败 —— 脚本因此**只报告、不写回**（`--apply` 仅在无错时落盘），不会二次破坏。
"""
import io
import os
import re
import sys
import json
import glob
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import project as P                                     # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
MD = os.path.join(BASE, "原文")
CLS = os.path.join(BASE, "_cls")
DEFAULT_OLD = os.path.join(os.path.expanduser("~"), "..", "..", "blog",
                           "_ics_backup", "baseline", "原文")

PAGE = re.compile(r"^\s*<!--\s*=+\s*page\s+(\d+)\s*=+\s*-->\s*$")
WS = re.compile(r"\s+")


def nonspace(s):
    return WS.sub("", s)


def proj_len(line):
    """一行投影后的内容长度。围栏行/`%%%` 控制行投影为空 -> 长度 0（按空行处理）。

    L2 加围栏、L3 加控制行都会插入「展示层」整行，用投影长度配准才能跨这两种
    改动继续工作；直接用原始字符数会把 ``` 里的反引号算成内容。
    """
    p = P.project_line(line)
    return len(nonspace(p)) if p else 0


def proj_multiset(lines):
    return Counter(nonspace(P.project("\n".join(lines))))


def read_lines(path):
    return io.open(path, encoding="utf-8").read().splitlines()


def segments(lines):
    """-> [(kind, page, [(idx, line), ...])]  kind in {head, page}

    每页段落**包含它自己的 page 注释行**（新旧文件里这一行逐字相同），
    这样文件里每一行都落在某个段落里，不会出现「行号不在映射内」的空洞。
    """
    marks = [i for i, l in enumerate(lines) if PAGE.match(l)]
    out = []
    if not marks:
        return [("head", 0, list(enumerate(lines)))]
    if marks[0] > 0:
        out.append(("head", 0, list(enumerate(lines[:marks[0]]))))
    for k, m in enumerate(marks):
        end = marks[k + 1] if k + 1 < len(marks) else len(lines)
        out.append(("page", k + 1, list(enumerate(lines[m:end], m))))
    return out


def align_segment(old_seg, new_seg):
    """把旧行配准到新行 -> ([(lo_idx, hi_idx)] 每个旧行一项, warn)

    用「非空白字符累计偏移」做配准：旧行 o 的字符区间是 [O[o], O[o+1])，
    它在新区间里覆盖整行 [lo_idx, hi_idx]。
    这样**任何方向的合并/拆分都能映射**：
      - 旧 1 行被拆成新 3 行 -> 该旧行 -> (j, j+2)
      - 旧 3 行被并成新 1 行 -> 那 3 个旧行都 -> (j, j)
    """
    ol = [proj_len(l) for _, l in old_seg]
    nl = [proj_len(l) for _, l in new_seg]
    warn = None
    if sum(ol) != sum(nl):
        warn = "非空白字符数不等 old=%d new=%d" % (sum(ol), sum(nl))
    if not nl:
        return [(0, 0)] * len(ol) if ol else [], warn
    # 累计前缀
    N = [0]
    for x in nl:
        N.append(N[-1] + x)
    total = N[-1]

    def line_of(offset, forward=True):
        """offset 落在第几个新行里（forward=取该偏移所在行，否则取其前一字符所在行）"""
        if total == 0:
            return 0
        if forward:
            for j in range(len(nl)):
                if N[j + 1] > offset:
                    return j
            return len(nl) - 1
        # offset 是「区间结束」的排他位置：取 offset-1 落在的行
        if offset <= 0:
            return 0
        for j in range(len(nl)):
            if N[j + 1] >= offset:
                return j
        return len(nl) - 1

    spans = []
    acc = 0
    for k, length in enumerate(ol):
        if length == 0:
            spans.append(None)        # 空白行稍后按邻居补齐
            continue
        lo = line_of(acc, True)
        hi = line_of(acc + length, False)
        if hi < lo:
            hi = lo
        spans.append((lo, hi))
        acc += length

    # 空白行（含 page 注释后的空行）不能一律向前吸附：区间若以空行结尾，
    # 向前吸附会把下一题的首行圈进来（实测 2020期中 items[233,283] 就是这样）。
    # 所以：空白行的 lo 取「下一个有内容旧行」的 lo，hi 取「上一个有内容旧行」的 hi。
    n = len(ol)
    lo_list = [0] * n
    hi_list = [0] * n
    nxt = None
    for k in range(n - 1, -1, -1):
        if spans[k] is None:
            lo_list[k] = nxt
        else:
            lo_list[k] = spans[k][0]
            nxt = spans[k][0]
    prev = None
    for k in range(n):
        if spans[k] is None:
            hi_list[k] = prev
        else:
            hi_list[k] = spans[k][1]
            prev = spans[k][1]
    out = []
    for k in range(n):
        lo = lo_list[k] if lo_list[k] is not None else 0
        hi = hi_list[k] if hi_list[k] is not None else 0
        if spans[k] is None:
            # 空白行本身没有内容：lo 指向它**之后**的内容、hi 指向它**之前**的内容，
            # 于是 lo > hi 是正常的，且正是我们要的语义——
            # 区间以空行结尾时取 hi（停在前一内容），以空行开头时取 lo（从后一内容起）。
            out.append((lo, hi))
        else:
            if hi < lo:
                hi = lo
            out.append((lo, hi))
    return out, warn


def build_map(old_lines, new_lines):
    """-> ({old_lineno(1based): (lo, hi)}, [warnings])"""
    os_ = segments(old_lines)
    ns_ = segments(new_lines)
    warns = []
    if len(os_) != len(ns_):
        warns.append("段数不一致 old=%d new=%d（页注释被改动？）" % (len(os_), len(ns_)))
        return None, warns
    m = {}
    for (ko, po, oseg), (kn, pn, nseg) in zip(os_, ns_):
        if ko != kn or po != pn:
            warns.append("段结构错位 old=%s/%s new=%s/%s" % (ko, po, kn, pn))
            return None, warns
        if ko == "head":
            if len(oseg) != len(nseg):
                warns.append("前导行数不一致 old=%d new=%d" % (len(oseg), len(nseg)))
                return None, warns
            for (oi, _), (ni, _) in zip(oseg, nseg):
                m[oi + 1] = (ni + 1, ni + 1)
            continue
        assign, w = align_segment(oseg, nseg)
        if w:
            warns.append("page %s: %s" % (po, w))
        oglob = [oi + 1 for oi, _ in oseg]
        nglob = [ni + 1 for ni, _ in nseg]
        if len(assign) != len(oglob):
            warns.append("page %s: 配准长度不符 %d vs %d"
                         % (po, len(assign), len(oglob)))
            return None, warns
        for ai, (lo_i, hi_i) in enumerate(assign):
            m[oglob[ai]] = (nglob[lo_i], nglob[hi_i])
    return m, warns


def main():
    apply = "--apply" in sys.argv
    old_dir = MD
    if "--old" in sys.argv:
        old_dir = sys.argv[sys.argv.index("--old") + 1]
    out = []
    nbad = 0
    total_items = 0
    changed = 0
    pending = []
    for p in sorted(glob.glob(os.path.join(CLS, "*.json"))):
        d = json.load(io.open(p, encoding="utf-8"))
        rel = d.get("file")
        if not rel:
            continue
        oldp = os.path.join(old_dir, rel.replace("/", os.sep))
        newp = os.path.join(MD, rel.replace("/", os.sep))
        if not os.path.exists(oldp) or not os.path.exists(newp):
            out.append("SKIP %s（旧或新文件不存在）" % rel)
            continue
        old_lines = read_lines(oldp)
        new_lines = read_lines(newp)
        name = os.path.basename(p)
        if old_lines == new_lines:
            out.append("SAME %-52s 行数 %d（未变）" % (name, len(new_lines)))
            continue
        m, warns = build_map(old_lines, new_lines)
        if m is None:
            nbad += 1
            out.append("FAIL %s" % name)
            for w in warns:
                out.append("      - " + w)
            continue

        entries = []
        for it in d.get("items") or []:
            entries.append(("items", it))
        for a in d.get("answer_sections") or []:
            entries.append(("answer_sections", a))

        errs = []
        touched = 0
        for kind, it in entries:
            s, e = it.get("start"), it.get("end")
            if not isinstance(s, int) or not isinstance(e, int):
                continue
            total_items += 1
            if s not in m or e not in m:
                errs.append("%s [%d,%d] 行号不在映射内" % (kind, s, e))
                continue
            ns, ne = m[s][0], m[e][1]
            if ns > ne:
                # 只有「整条区间都是空行」才会出现，属于退化条目
                errs.append("%s [%d,%d] 映射出空区间 [%d,%d]" % (kind, s, e, ns, ne))
                continue
            # 独立校验：投影后的非空白字符多重集必须相等
            if proj_multiset(old_lines[s - 1:e]) != proj_multiset(new_lines[ns - 1:ne]):
                errs.append("%s [%d,%d] -> [%d,%d] 字符多重集不等" % (kind, s, e, ns, ne))
                continue
            if (ns, ne) != (s, e):
                touched += 1
            it["start"], it["end"] = ns, ne
        if errs:
            nbad += 1
            out.append("WARN %s 行数 %d -> %d，%d 条映射失败"
                       % (name, len(old_lines), len(new_lines), len(errs)))
            for x in errs[:12]:
                out.append("      - " + x)
        else:
            changed += touched
            out.append("ok   %-52s 行数 %d -> %d，条目 %d，改动 %d"
                       % (name, len(old_lines), len(new_lines), len(entries), touched))
        for w in warns[:4]:
            out.append("      ~ " + w)
        if not errs:
            if apply and "total_lines" in d:
                # total_lines 是行数的冗余副本（只被 validate_cls 用来做一致性提示），
                # 重提取后必须同步，否则 42 个文件都会报「不致命」的警告淹没真问题。
                # module / qno / note 等语义字段一律不动。
                d["total_lines"] = len(new_lines)
            pending.append((p, d))

    # 原子化：只有整体健康才落盘。重复运行时 _cls 里已是新行号，绝大多数条目会
    # 校验失败；此时若按文件逐个写回，那些「恰好通过」的文件会被改成错的行号。
    nfiles = len(glob.glob(os.path.join(CLS, "*.json")))
    limit = max(1, int(0.1 * nfiles))
    if apply and nbad > limit:
        out.append("")
        out.append("!! 中止写回：%d/%d 个文件校验失败（阈值 %d）。"
                   "本脚本对同一次重提取只能运行一次，"
                   "重复运行说明 --old 指向了错误的基线。" % (nbad, nfiles, limit))
        apply = False
        pending = []
    elif apply:
        for p, d in pending:
            with io.open(p, "w", encoding="utf-8", newline="\n") as fh:
                json.dump(d, fh, ensure_ascii=False, indent=2)
                fh.write("\n")

    head = ["行号重映射报告（%s）" % ("已写回" if apply else "仅检查"),
            "旧原文目录：%s" % old_dir,
            "条目总数 %d，行号有变化的条目 %d，失败文件 %d，待写回文件 %d"
            % (total_items, changed, nbad, len(pending)),
            ""]
    io.open(os.path.join(HERE, "_remap_report.txt"), "w", encoding="utf-8").write(
        "\n".join(head + out))
    print("\n".join(head[:3]))
    for line in out:
        if line.startswith(("FAIL", "WARN", "SKIP")):
            print(line)
    print("done. details -> _tools/_remap_report.txt")


if __name__ == "__main__":
    main()
