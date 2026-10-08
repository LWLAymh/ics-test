# -*- coding: utf-8 -*-
"""`_curated/*.md` 的解析与拼装（供 build_web_data / verify_curated / validate_cls 共用）。

文件格式（`%%%` 是唯一的控制标记 —— `原文` 里 `#`/`##` 大量出现会撞车，
已实测 `原文` 中没有一行以 `%%%` 开头）：

    %%% mode: choice
    %%% provenance: verbatim
    %%% stem
    2. For which values can X not be equal to Z **(f-f09 1-8)**
    %%% choices
    A. For large positive values of CONSTANT
    B. For large negative values of CONSTANT
    %%% answer
    答案：A&D

要点：
- `%%% mode: choice|fill|short` 是**显式题型**，取代运行时的猜测；
- `%%% provenance: verbatim|reflow|rewritten` 决定校验强度；
- `%%% group` / `group_title` / `group_order` 显式声明同一大题的多个片段；
- `%%% answer` 段**保留 `答案：` 字面前缀**（前端 `simpleExpected()` 的正则依赖它）；
  没有该段 = 本题无内联答案 -> `answer.inline = false`；
- `build_content()` 按 stem+choices+answer **原样**拼接（用解析出的原始段文本，
  不重新合成），这样它投影后必然等于 `原文` 切片。
"""
import io
import os
import re

SECTION = re.compile(r"^%%%\s*(stem|choices|answer)\s*$")
SETTING = re.compile(r"^%%%\s*([A-Za-z_]+)\s*:\s*(.*)$")
# 选项行：`A. ` / `B、` / `C) ` / `D．`（也接受全角）
CHOICE = re.compile(r"^\s*([A-Ha-h])\s*[.、)．:：]\s*(.*)$")
MODES = ("choice", "fill", "short", "composite")
PROVENANCE = ("verbatim", "reflow", "rewritten")
SELECTIONS = ("single", "multiple")


class CuratedError(Exception):
    pass


def parse(text):
    """-> dict(mode, provenance, stem, choices, answer, order, section_text, problems)

    `order` 记录各段在文件里出现的先后。**段落顺序必须可数据化**：有些卷子（人工誊写的
    2012期中）把 `**答案：C**` 写在题干行末尾、选项之前，若强制按 stem->choices->answer
    拼接就会把答案挪到选项后面，投影立刻不等。
    """
    mode = None
    selection = None
    provenance = "verbatim"
    group = None
    group_title = None
    group_order = None
    cur = None
    order = []
    sections = {"stem": [], "choices": [], "answer": []}
    problems = []
    for ln in text.splitlines():
        m = SECTION.match(ln)
        if m:
            cur = m.group(1)
            if cur not in order:
                order.append(cur)
            continue
        m = SETTING.match(ln)
        if m:
            key, val = m.group(1).lower(), m.group(2).strip()
            if key == "mode":
                mode = val
                if val not in MODES:
                    problems.append("mode 非法: %r" % val)
            elif key == "provenance":
                provenance = val
                if val not in PROVENANCE:
                    problems.append("provenance 非法: %r" % val)
            elif key == "selection":
                selection = val
                if val not in SELECTIONS:
                    problems.append("selection 非法: %r" % val)
            elif key == "group":
                group = val
                if not re.match(r"^[a-z0-9][a-z0-9-]{0,63}$", val):
                    problems.append("group 必须是小写字母、数字和连字符: %r" % val)
            elif key == "group_title":
                group_title = val
                if not val:
                    problems.append("group_title 不能为空")
            elif key == "group_order":
                try:
                    group_order = int(val)
                    if group_order < 1:
                        raise ValueError
                except ValueError:
                    problems.append("group_order 必须是正整数: %r" % val)
            else:
                problems.append("未知控制项: %s" % key)
            continue
        if ln.lstrip().startswith("%%%"):
            problems.append("正文里残留控制行: %r" % ln[:60])
            continue
        if cur is None:
            if ln.strip():
                problems.append("控制段之前出现正文: %r" % ln[:60])
            continue
        sections[cur].append(ln)

    if mode is None:
        problems.append("缺 %%% mode")
    group_fields = (group, group_title, group_order)
    if any(value is not None for value in group_fields) and not all(value is not None for value in group_fields):
        problems.append("组合题必须同时设置 group、group_title、group_order")

    stem = "\n".join(sections["stem"]).strip("\n")
    choices_text = "\n".join(sections["choices"]).strip("\n")
    answer = "\n".join(sections["answer"]).strip("\n")

    # 选项解析：一行一个 `A. …`，不属于任何选项的续行并入上一项
    choices = []
    for ln in sections["choices"]:
        m = CHOICE.match(ln)
        if m:
            choices.append({"key": m.group(1).upper(),
                            "content": m.group(2).strip(),
                            "lines": [ln]})
        elif choices and ln.strip():
            choices[-1]["content"] += "\n" + ln.strip()
            choices[-1]["lines"].append(ln)
        elif ln.strip():
            problems.append("choices 段里无法解析的行: %r" % ln[:60])
    for c in choices:
        c["content"] = c["content"].strip()
        c.pop("lines", None)

    return {"mode": mode, "selection": selection, "provenance": provenance,
            "group": group, "group_title": group_title, "group_order": group_order,
            "stem": stem, "choices": choices, "answer": answer,
            "choices_text": choices_text,
            "order": order or ["stem", "choices", "answer"],
            "has_choices_section": bool(sections["choices"]),
            "has_answer_section": bool(sections["answer"]),
            "problems": problems}


def build_content(p):
    """stem / choices / answer 按**文件里的实际顺序**拼接 -> 网页 content 字段。

    顺序来自 `p['order']`，不是写死的 stem->choices->answer：见 parse() 的说明。
    """
    blobs = {"stem": p["stem"], "choices": p["choices_text"], "answer": p["answer"]}
    parts = [blobs[k] for k in p["order"] if blobs.get(k, "").strip()]
    return "\n".join(parts)


def build_layout(p):
    """结构化 layout，供前端零猜测渲染。"""
    return {
        "mode": p["mode"],
        "selection": p.get("selection"),
        "stem": p["stem"],
        "choices": [{"key": c["key"], "content": c["content"]}
                    for c in p["choices"]],
        "answer": p["answer"],
    }


def check_assertions(p):
    """构建期断言：不合格就让构建失败，不静默降级。"""
    errs = list(p["problems"])
    if p["mode"] == "choice":
        keys = [c["key"] for c in p["choices"]]
        if len(keys) < 2:
            errs.append("mode=choice 但选项少于 2 个: %r" % (keys,))
        else:
            expect = [chr(ord("A") + i) for i in range(len(keys))]
            if keys != expect:
                errs.append("choice 的 key 必须是连续的 A,B,C…，实际 %r" % (keys,))
    elif p.get("selection"):
        errs.append("只有 mode=choice 可以设置 selection")
    for field in ("stem", "answer", "choices_text"):
        for ln in (p[field] or "").splitlines():
            if ln.lstrip().startswith("%%%"):
                errs.append("%s 里残留 %%%% 控制行: %r" % (field, ln[:50]))
    # 围栏必须成对：题目区间是按题切的、围栏是按代码块加的，两者边界不一致，
    # 切片可能从代码块中间开始或结束。个数为奇数时，后面的内容会全被当成代码。
    blobs = {"stem": p["stem"], "choices": p["choices_text"], "answer": p["answer"]}
    nfence = 0
    for k in p["order"]:
        for ln in (blobs.get(k) or "").splitlines():
            if ln.strip().startswith("```"):
                nfence += 1
    if nfence % 2:
        errs.append("代码围栏不配对（%d 个 ```），其后内容会被当成代码" % nfence)
    return errs


def load(path):
    return parse(io.open(path, encoding="utf-8").read())


def curated_path(base, item):
    """item['curated'] -> 绝对路径"""
    rel = item.get("curated")
    return os.path.join(base, "_curated", rel.replace("/", os.sep)) if rel else None


if __name__ == "__main__":
    sample = """%%% mode: choice
%%% provenance: verbatim
%%% stem
2. For which values can X not be equal to Z
%%% choices
A. For large positive values of CONSTANT
B. For large negative values of CONSTANT
%%% answer
答案：A&D
"""
    p = parse(sample)
    print("mode=%s prov=%s" % (p["mode"], p["provenance"]))
    print("choices=%r" % [(c["key"], c["content"]) for c in p["choices"]])
    print("problems=%r" % p["problems"])
    print("assertions=%r" % check_assertions(p))
    print("--- content ---")
    print(build_content(p))
