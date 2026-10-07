# -*- coding: utf-8 -*-
"""校验 _cls/*.json 是否符合 CLS_CONTRACT.md。

只报告问题，不改文件。有问题就让对应的分类 agent 重做那一个文件。
"""
import io
import os
import re
import json
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
MD = os.path.join(BASE, "原文")
CLS = os.path.join(BASE, "_cls")

MODULES = [
    "Data Representation",
    "Machine Prog",
    "Processor Arch",
    "Memory Hierarchy",
    "Compilation (Program optimization and linking)",
    "ECF and System IO",
    "Virtual Memory and Dynamic Memory Allocation",
    "Network",
    "Concurrent Programming and Synchronization",
]
MSET = set(MODULES)


def key_of(rel):
    return os.path.splitext(rel)[0].replace("/", "__")


def check(path):
    """-> (errs, warn, summary dict)"""
    errs, warn = [], []
    try:
        d = json.load(io.open(path, encoding="utf-8"))
    except Exception as e:
        return ["JSON 解析失败: %s" % e], warn, {}
    rel = d.get("file")
    if not rel:
        return ["缺 file 字段"], warn, {}
    src = os.path.join(MD, rel.replace("/", os.sep))
    if not os.path.exists(src):
        return ["file 指向的原文不存在: %s" % rel], warn, {}
    nlines = len(io.open(src, encoding="utf-8").read().splitlines())

    if d.get("total_lines") != nlines:
        warn.append("total_lines=%s 实际=%d（不致命）" % (d.get("total_lines"), nlines))

    # kind 缺省为 questions；勘误/评分说明一类材料本身不含题目，
    # 声明 kind 之后允许 items 为空（但反过来，声明了却给 items 是错的）。
    kind = d.get("kind") or "questions"
    items = d.get("items") or []
    if not items and kind == "questions":
        errs.append("items 为空（若本就无题目，请在 json 里声明 kind）")
    if kind != "questions" and items:
        errs.append("kind=%s 却给出了 %d 条 items" % (kind, len(items)))
    prev_end = 0
    for i, it in enumerate(items):
        tag = "items[%d]" % i
        for f in ("start", "end", "module", "qno", "note"):
            if f not in it:
                errs.append("%s 缺字段 %s" % (tag, f))
        s, e = it.get("start"), it.get("end")
        if not isinstance(s, int) or not isinstance(e, int):
            errs.append("%s start/end 非整数" % tag)
            continue
        if s > e:
            errs.append("%s start(%d) > end(%d)" % (tag, s, e))
        if s < 1 or e > nlines:
            errs.append("%s 越界 [%d,%d] 共 %d 行" % (tag, s, e, nlines))
        if s <= prev_end:
            errs.append("%s 与上一区间重叠/乱序 (start=%d <= prev_end=%d)" % (tag, s, prev_end))
        prev_end = e
        if it.get("module") not in MSET:
            errs.append("%s module 非法: %r" % (tag, it.get("module")))
        # curated 指针（L3）：文件必须存在，且必须是库内相对路径
        cu = it.get("curated")
        if cu:
            if os.path.isabs(cu) or ".." in cu.replace("\\", "/").split("/"):
                errs.append("%s curated 非法路径: %r" % (tag, cu))
            elif not os.path.isfile(os.path.join(BASE, "_curated",
                                                 *cu.split("/"))):
                errs.append("%s curated 指向的文件不存在: %s" % (tag, cu))

    for j, a in enumerate(d.get("answer_sections") or []):
        s, e = a.get("start"), a.get("end")
        if not isinstance(s, int) or not isinstance(e, int) or s > e:
            errs.append("answer_sections[%d] 行号非法" % j)
        elif s < 1 or e > nlines:
            errs.append("answer_sections[%d] 越界" % j)

    if d.get("_note"):
        warn.append(d["_note"])

    cnt = {}
    for it in items:
        cnt[it.get("module")] = cnt.get(it.get("module"), 0) + 1
    return errs, warn, {"file": rel, "n_items": len(items), "by_mod": cnt, "kind": kind}


def main():
    paths = sorted(glob.glob(os.path.join(CLS, "*.json")))
    L = []
    nbad = 0

    # 别名/非题目材料不得挂 curated（否则产出孤儿文件）。
    # dup_of 由 build_modules 的正文指纹算出，这里复用它以免两处口径不一致。
    dup_of = {}
    try:
        import build_modules as _bm
        for d in _bm.load():
            if d.get("dup_of"):
                dup_of[d["rel"]] = d["dup_of"]
    except Exception as e:                      # 指纹算不出来就不做这项检查
        L.append("~ 跳过 dup_of 检查: %s" % e)

    seen_curated = set()
    for p in paths:
        errs, warn, s = check(p)
        name = os.path.basename(p)
        # 收集本文件用到的 curated 路径，供反向孤儿扫描
        try:
            dj = json.load(io.open(p, encoding="utf-8"))
        except Exception:
            dj = {}
        rel = dj.get("file") or ""
        kind = dj.get("kind") or "questions"
        n_cur = 0
        for it in dj.get("items") or []:
            cu = it.get("curated")
            if not cu:
                continue
            n_cur += 1
            seen_curated.add(cu)
            if kind != "questions":
                errs.append("kind=%s 的材料不得有 curated" % kind)
            if rel in dup_of:
                errs.append("别名卷（同 %s）不得有 curated" % dup_of[rel])
        if n_cur and not errs:
            L.append("      （curated %d 条）" % n_cur)
        if errs:
            nbad += 1
            L.append("FAIL %s" % name)
            for e in errs[:12]:
                L.append("      - " + e)
        else:
            by = ", ".join("%s=%d" % (m.split(" (")[0].split(" and ")[-1][:14], c)
                           for m, c in sorted(s["by_mod"].items(), key=lambda kv: -kv[1]))
            mark = "skip" if s.get("kind", "questions") != "questions" else "ok  "
            L.append("%s %-52s items=%-4d %s" % (mark, name, s["n_items"], by))
        for w in warn:
            L.append("      ~ " + w)

    # 反向扫描：_curated/ 里没有 _cls 指针的文件（仿 build_web_data 的孤儿守卫）
    orphans = []
    for f in sorted(glob.glob(os.path.join(BASE, "_curated", "**", "*.md"),
                              recursive=True)):
        r = os.path.relpath(f, os.path.join(BASE, "_curated")).replace(os.sep, "/")
        if r not in seen_curated:
            orphans.append(r)
    for r in orphans:
        nbad += 1
        L.append("FAIL 孤儿 curated（无 _cls 指针）: %s" % r)

    L.append("")
    L.append("共 %d 个文件，%d 个不合格；curated 指针 %d 个，孤儿 %d 个"
             % (len(paths), nbad, len(seen_curated), len(orphans)))
    io.open(os.path.join(HERE, "_cls_report.txt"), "w", encoding="utf-8").write("\n".join(L))
    print("checked", len(paths), "bad", nbad)


if __name__ == "__main__":
    main()
