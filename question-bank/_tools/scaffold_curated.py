# -*- coding: utf-8 -*-
"""为 `_cls` 里的题目生成 `_curated/*.md` 骨架（计划的 L3 §scaffold）。

设计原则：**保守且可证明无损**。骨架只把 `原文` 切片按「题干 / 选项 / 答案」三段
重新分行，不增删字符；因此 `verify_curated.py` 能用 project() 证明它与切片等价。

分档：
  verbatim  切片本来就是「题干 -> 一行一个选项 -> 答案：…」的规范形态，逐行搬运；
  reflow    选项被压在同一行（`A. x   B. y   C. z`）时拆成多行，用 project_reflow() 校验；
  回退      无法规范化判定的切片整片放进 stem、mode: short，仍然无损，
            但记入 `_scaffold_report.txt` 的待人工 cure 清单。

用法：
  python _tools/scaffold_curated.py                      # 只报告，不写文件
  python _tools/scaffold_curated.py --apply              # 写 _curated/ 并更新 _cls
  python _tools/scaffold_curated.py --apply --limit 5    # 只做前 5 道（批次 0 打样）
  python _tools/scaffold_curated.py --apply --only 2016期中
"""
import io
import os
import re
import sys
import json
import glob
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
MD = os.path.join(BASE, "原文")
CLS = os.path.join(BASE, "_cls")
CUR = os.path.join(BASE, "_curated")

sys.path.insert(0, HERE)
import build_modules as bm                              # noqa: E402
import legacy_v3 as bw                                  # noqa: E402
import project as P                                     # noqa: E402
import curated as CU                                    # noqa: E402

MARK = "%%%"
ANSWER = re.compile(r"^\s*(?:\*\*)?\s*(?:参考)?答案\s*[:：]")
# 行内答案标记：人工誊写的 2012期中 把 `**答案：C**` 写在题干行末尾（实测 19 条）。
# 这类必须切出来放进 %%% answer 段，否则 layout.answer 为空、前端的 directAnswer 也是空，
# 题会被静默移出题库。
ANSWER_ANY = re.compile(r"(?:\*\*)?\s*(?:参考)?答案\s*[:：]")
OPT_LINE = re.compile(r"^\s*([A-Ha-h])\s*[.、)．:：]\s*\S")
OPT_SPLIT = re.compile(r"(?:(?<=\s)|^)([A-H])\s*[.、)．]\s*")
FILL = re.compile(r"_{2,}|（\s*\d+\s*）|\(\s*\d+\s*\)")


def split_options(line):
    """一行的多个选项 -> ['A. x', 'B. y', …]；少于两个返回 None。

    必须要求 key **严格递增且不重复**，否则中文正文里「输入 A、B 经一个与门…输入 A、C 经…」
    这种叙述会被当成 `A、…` 选项列表切开（实测把图注拆成了假选项）。
    """
    ms = list(OPT_SPLIT.finditer(line))
    if len(ms) < 2:
        return None
    keys = [m.group(1) for m in ms]
    if any(keys[i] >= keys[i + 1] for i in range(len(keys) - 1)):
        return None
    out = []
    for i, m in enumerate(ms):
        end = ms[i + 1].start() if i + 1 < len(ms) else len(line)
        seg = line[m.start():end].strip()
        if i == 0:
            # 第一个选项前面可能还有引用/缩进前缀（`> A.随时 B.…`），必须留在首项里，
            # 否则拆分会把 `> ` 丢掉，投影就不等了。
            seg = (line[:m.start()] + seg).rstrip()
        out.append(seg)
    return out


def extract_inline_answer(c):
    """把题干末行里的 `**答案：C**` 切进 answer 段。切在行中间，故降级为 reflow。"""
    if c["answer"] or not c["stem"]:
        return c, False
    last = c["stem"][-1]
    m = None
    for m in ANSWER_ANY.finditer(last):
        pass
    if m is None:
        return c, False
    # 切点前面必须有空白（或就在行首）：否则像 `2、答案：4f` 这样紧贴着切，
    # reflow 归一后会在中间多出一个空格，投影就不等了。这类保留在题干里，
    # 由 `answer.inline` 的兜底判定继续承认它（池子语义不变）。
    if m.start() > 0 and not last[m.start() - 1].isspace():
        return c, False
    tail = last[m.start():].strip()
    head = last[:m.start()].rstrip()
    if not tail:
        return c, False
    n = dict(c)
    n["stem"] = list(c["stem"][:-1]) + ([head] if head else [])
    n["answer"] = [tail]
    n["provenance"] = "reflow"
    # 答案原本在题干末行（在选项**之前**），必须记住位置，否则拼接顺序会把它挪到选项后
    n["answer_pos"] = len(c["stem"]) - 1
    return n, True


def balance_fences(c, lines_before):
    """把切片里**跨围栏**造成的不配对 ``` 补齐。

    题目的 `_cls` 区间是按题目切的，而代码围栏是按页/按代码块加的，两者边界不一致：
    切片可能从某个代码块中间开始（缺开栏）或在代码块中间结束（缺闭栏）。
    结果 `content` 里 ``` 个数是奇数，后面的内容就全被当成代码 —— 实测这让
    「中文正文被圈进围栏」的假报告多出好几条。

    project() 会把围栏行整行丢掉，所以**增删 ``` 是投影中性的**，可以放心补齐。
    """
    n = sum(1 for x in lines_before if x.strip().startswith("```"))
    c = {k: (list(v) if isinstance(v, list) else v) for k, v in c.items()}
    order = [k for k in section_order(c) if c.get(k)]
    if not order:
        return c
    if n % 2 == 1:
        c[order[0]] = ["```"] + c[order[0]]       # 切片从代码块中间开始 -> 补开栏
    total = sum(1 for k in order for x in c[k] if x.strip().startswith("```"))
    if total % 2 == 1:
        c[order[-1]] = c[order[-1]] + ["```"]     # 补闭栏到最后一段
    return c


DOLLAR_IMM = re.compile(r"(?<![`\w$])\$([0-9A-Za-z_]+)")


def inline_code_dollars(seq, fence=False):
    """把**围栏外**的 `$` 包成行内代码；返回 (新序列, 结束时的围栏状态)。

    正文引述汇编时（`E. 这里的 leave 等价于 addq $48,%rsp; popq %rbp`）裸 `$`
    会被 MathJax 当成公式起点，把后面正文整段吞掉 —— 实测 ics-check 报 7 条
    `math-unclosed`。围栏是行级的、包不住半行，但行内代码可以：MathJax 跳过
    `<code>`，而 project() 又剥掉反引号，所以这一步是**投影中性**的。

    两个必须覆盖的形态（都是实测踩到的）：
      - `irmovl$128`：`$` 紧跟在字母后面，没有空格；
      - `linux$ pmap -X ...`：`$` 是 shell 提示符，后面是空格。
    所以按字符扫描、跳过已有的 `...` 片段，`$` 后能带上多少字母数字就包多少。

    **围栏状态必须跨段传递**：一段代码块可能横跨 stem/answer 两个 `%%%` 段，
    每段各自从 fence=False 起算就会把围栏内的 `$0x20` 也包上反引号（实测踩到）。
    """
    out = []
    for ln in seq:
        if ln.strip().startswith("```"):
            fence = not fence
            out.append(ln)
            continue
        if fence or "$" not in ln:
            out.append(ln)
            continue
        res, i, in_code = [], 0, False
        while i < len(ln):
            ch = ln[i]
            if ch == "`":
                in_code = not in_code
                res.append(ch)
                i += 1
                continue
            if ch == "$" and not in_code:
                j = i + 1
                while j < len(ln) and (ln[j].isalnum() or ln[j] == "_"):
                    j += 1
                res.append("`" + ln[i:j] + "`")
                i = j
                continue
            res.append(ch)
            i += 1
        out.append("".join(res))
    return out, fence


def fence_flags(lines):
    """每行是否位于围栏**内部**（围栏行本身记为 False）。"""
    flags, cur = [], False
    for ln in lines:
        if ln.strip().startswith("```"):
            flags.append(False)
            cur = not cur
        else:
            flags.append(cur)
    return flags


def classify(lines):
    """-> dict(mode, provenance, stem, choices, answer, reason, *_pos)

    **绝不在围栏内部切段**：前端的选项是逐个独立渲染的（`md.renderInline`），
    一旦切点落在代码围栏中间，选项单独渲染时围栏状态就丢了，里面的 `$` 立即
    变成裸美元符并把后续内容吞进数学模式（实测 ics-check 报 11 条 math-unclosed）。
    """
    ins = fence_flags(lines)
    ai = None
    for i, ln in enumerate(lines):
        if ANSWER.match(ln) and not ins[i]:
            ai = i
            break
    body = lines[:ai] if ai is not None else list(lines)
    body_ins = ins[:ai] if ai is not None else ins
    answer = lines[ai:] if ai is not None else []

    k = None
    reason = ""
    for i, ln in enumerate(body):
        if body_ins[i]:
            continue                      # 围栏内的选项行不作为切点
        if OPT_LINE.match(ln) or split_options(ln):
            n = sum(1 for j, x in enumerate(body[i:], i)
                    if not body_ins[j] and (OPT_LINE.match(x) or split_options(x)))
            if n >= 2:
                k = i
            break
    if k is None:
        reason = "未找到围栏外的选项段"

    reflow = False
    choices = []
    stem = body[:k] if k is not None else body
    if k is not None:
        for ln in body[k:]:
            parts = split_options(ln)
            if parts:
                reflow = True
                choices.extend(parts)
            else:
                choices.append(ln)

    n_opt = sum(1 for x in choices if OPT_LINE.match(x))
    if n_opt >= 2:
        mode = "choice"
    elif FILL.search("\n".join(lines)):
        mode = "fill"
    else:
        mode = "short"
    return {"mode": mode, "provenance": "reflow" if reflow else "verbatim",
            "stem": stem, "choices": choices, "answer": answer,
            "reason": reason,
            "stem_pos": 0,
            "choices_pos": k if k is not None else 1 << 30,
            "answer_pos": ai if ai is not None else (1 << 30)}


def section_order(c):
    """按各段在原文里的起始行号排序 —— 不能写死 stem->choices->answer。"""
    pos = {"stem": c.get("stem_pos", 0),
           "choices": c.get("choices_pos", 1 << 30),
           "answer": c.get("answer_pos", 1 << 30)}
    present = [k for k in ("stem", "choices", "answer")
               if (c.get(k) or c.get(k + "_text"))]
    return sorted(present, key=lambda k: pos[k])


def render(c, order=None):
    order = order or section_order(c)
    blobs = {}
    fence = False
    for k in order:
        blobs[k], fence = inline_code_dollars(c[k], fence)
    L = ["%s mode: %s" % (MARK, c["mode"]),
         "%s provenance: %s" % (MARK, c["provenance"])]
    for k in order:
        if not blobs.get(k):
            continue
        L.append("%s %s" % (MARK, k))
        L.extend(blobs[k])
    return "\n".join(L).rstrip("\n") + "\n"


def main():
    apply = "--apply" in sys.argv
    limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else None
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None

    # 自己的 raw 副本，写回时用（build_modules 不保存原始 dict）
    raw_by_json = {}
    for p in sorted(glob.glob(os.path.join(CLS, "*.json"))):
        raw_by_json[os.path.basename(p)] = json.load(io.open(p, encoding="utf-8"))

    materials = bm.load()
    stats = Counter()
    rows = []
    plan = []          # (json_name, item_index, curated_name)
    made = 0
    for m in materials:
        if m.get("dup_of") or m["kind"] != "questions":
            continue
        if only and only not in m["rel"]:
            continue
        rel, label, cat, lines = m["rel"], m["label"], m["cat"], m["lines"]
        for idx, it in enumerate(m["items"]):
            s, e = it.get("start"), it.get("end")
            if not isinstance(s, int) or not isinstance(e, int):
                continue
            if s < 1 or e > len(lines):
                continue
            if limit is not None and made >= limit:
                break
            slice_txt = bw.normalize_markdown_assets(
                "\n".join(lines[s - 1:e]), rel)
            c = classify(slice_txt.splitlines())
            c, pulled = extract_inline_answer(c)
            c = balance_fences(c, lines[:s - 1])
            name = "%s/%s/%d.md" % (cat, label, s)
            text = render(c)
            p = CU.parse(text)
            errs = CU.check_assertions(p)
            fellback = False
            if errs:
                # 典型情形：一条 item 里聚了多道小题，选项 key 是 A,B,C,D,A,B,C,D…
                # 这时**不能**硬塞 choice 结构（构建期断言就是为拦住它）。
                # 回退成「选项行留在 stem、答案段保留」的无损形态，交 L3 人工拆分；
                # 池子语义不变（答案段仍在，inline 仍为真）。
                c2 = dict(c)
                c2["stem"] = list(c["stem"]) + list(c["choices"])
                c2["choices"] = []
                c2["mode"] = "fill" if FILL.search("\n".join(c2["stem"])) else "short"
                c2["reason"] = "多小题聚簇，需人工拆分"
                text = render(c2)
                p = CU.parse(text)
                errs = CU.check_assertions(p)
                fellback = True
                c = c2
            content = CU.build_content(p)
            if c["provenance"] == "reflow":
                same = P.project_reflow(slice_txt) == P.project_reflow(content)
            else:
                same = P.project(slice_txt) == P.project(content)
            if errs or not same:
                stats["FAIL"] += 1
                rows.append("FAIL %s %s [%d,%d] %s"
                            % (rel, it.get("qno"), s, e, errs or "投影不等"))
                continue

            stats[c["provenance"]] += 1
            stats["mode:" + c["mode"]] += 1
            if fellback:
                stats["回退:多小题聚簇"] += 1
            elif c["reason"]:
                stats["回退:" + c["reason"]] += 1
            if pulled:
                stats["行内答案已切出"] += 1
            made += 1
            plan.append((m["json"], idx, name))
            if apply:
                path = os.path.join(CUR, name.replace("/", os.sep))
                os.makedirs(os.path.dirname(path), exist_ok=True)
                io.open(path, "w", encoding="utf-8", newline="\n").write(text)
            if len(rows) < 10:
                rows.append("ok   %-30s %-8s [%d,%d] %-6s %-8s 选项%d"
                            % (label, it.get("qno"), s, e, c["mode"],
                               c["provenance"],
                               sum(1 for x in p["choices"])))
        if limit is not None and made >= limit:
            break

    if apply:
        touched = set()
        for jn, idx, name in plan:
            raw_by_json[jn]["items"][idx]["curated"] = name
            touched.add(jn)
        for jn in sorted(touched):
            with io.open(os.path.join(CLS, jn), "w", encoding="utf-8",
                         newline="\n") as fh:
                json.dump(raw_by_json[jn], fh, ensure_ascii=False, indent=2)
                fh.write("\n")

    head = ["生成 %d 条，涉及 %d 个 cls 文件（%s）"
            % (made, len({x[0] for x in plan}), "已写回" if apply else "仅检查")]
    body = ["  %-22s %d" % (k, v) for k, v in sorted(stats.items())] + rows
    print("\n".join(head + body[:14]))
    print("\n细节 -> _tools/_scaffold_report.txt")
    io.open(os.path.join(HERE, "_scaffold_report.txt"), "w", encoding="utf-8").write(
        "\n".join(head + body))


if __name__ == "__main__":
    main()
