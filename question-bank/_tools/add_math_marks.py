# -*- coding: utf-8 -*-
"""给 curated 文件里**确有数学含义**的表达式补 `$…$`（计划 §2.3 的人工确认版）。

计划禁止「看起来像公式」的启发式（那正是 A 类缺陷的来源），所以这里只认三类
**无歧义**的形态，且必须是纯 ASCII 数学字符：

  指数：      2^32 / 2^{-23} / (-1)^S / x^2
  移位与位运算：z<<3 / x >> 31 / n & 1 / (z<<3)==(z*8)
  上下标形式的幂：M × 2^E

project() 会剥掉 `$`，所以补标记是**投影中性**的，verify_curated 必然通过；
但也因此**它抓不到不配对的 `$`** —— 所以本脚本必须自己保证成对，
并在跑完后用 ics-check 复查 `math-unclosed`。

用法：
  python _tools/add_math_marks.py            # 只报告候选
  python _tools/add_math_marks.py --apply
"""
import io
import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
CUR = os.path.join(BASE, "_curated")
sys.path.insert(0, HERE)
import curated as CU                                    # noqa: E402
import project as P                                     # noqa: E402

CJK = re.compile(r"[\u3400-\u9fff]")
# 只认**自带边界**的两类形态，绝不靠贪婪匹配圈范围（第一版贪婪版产出了
# `-$31 >> 3.$`、`$((x << 31)$ >> 31)` 这种括号不配对的坏标记）：
#   指数：2^32 / 2^{-23} / x^2 / (-1)^S      —— 底数和指数都是完整 token
#   整体带括号的移位：(z<<3) / (x >> 31)     —— 括号自身就是边界
EXP = (r"\(?-?[0-9]+(?:\.[0-9]+)?\)?\s*\^\s*\{?-?[A-Za-z0-9_]+\}?"
       r"|[A-Za-z_][A-Za-z0-9_]*\s*\^\s*\{?-?[0-9A-Za-z_]+\}?")
PAREN_SHIFT = (r"\([A-Za-z0-9_+\-*/^ ]*(?:<<|>>)[A-Za-z0-9_+\-*/^ ]*\)")
SAFE = r"[A-Za-z0-9_^{}()\[\]+\-*/<>=!&|,. ]+"
CAND = re.compile(r"(?<![`$\w])(?P<span>" + EXP + "|" + PAREN_SHIFT + r")(?![`$\w])")


def balanced(s):
    depth = {"(": 0, "[": 0}
    for ch in s:
        if ch == "(":
            depth["("] += 1
        elif ch == ")":
            depth["("] -= 1
        elif ch == "[":
            depth["["] += 1
        elif ch == "]":
            depth["["] -= 1
        if depth["("] < 0 or depth["["] < 0:
            return False
    return depth["("] == 0 and depth["["] == 0


def ok(span):
    s = span.strip()
    if not s or len(s) > 40:
        return False
    if CJK.search(s) or "`" in s or "$" in s:
        return False
    if not re.fullmatch(SAFE, s):
        return False
    if not balanced(s):
        return False
    # 边界必须是「实心」字符，避免把句号、逗号卷进公式
    if not re.match(r"^[A-Za-z0-9(]", s) or not re.search(r"[A-Za-z0-9)]$", s):
        return False
    return True


def mark_line(line):
    """在一行里把候选表达式包成 $…$，跳过 `...` 行内代码与已有的 $...$。"""
    spans = []
    in_code = in_math = False
    idx, n = 0, len(line)
    while idx < n:
        ch = line[idx]
        if ch == "`":
            in_code = not in_code
            idx += 1
            continue
        if ch == "$":
            in_math = not in_math
            idx += 1
            continue
        if in_code or in_math:
            idx += 1
            continue
        m = CAND.match(line, idx)
        if m and ok(m.group("span")):
            spans.append((m.start("span"), m.end("span")))
            idx = m.end("span")
            continue
        idx += 1
    if in_code or in_math:
        return line, 0                 # 行内反引号/美元符本身不配对，整行放弃，避免造出不配对的 $
    if not spans:
        return line, 0
    out, last = [], 0
    for a, b in spans:
        out.append(line[last:a])
        out.append("$" + line[a:b].strip() + "$")
        last = b
    out.append(line[last:])
    return "".join(out), len(spans)


def main():
    apply = "--apply" in sys.argv
    files = sorted(glob.glob(os.path.join(CUR, "**", "*.md"), recursive=True))
    total = 0
    touched = 0
    samples = []
    for f in files:
        text = io.open(f, encoding="utf-8").read()
        lines = text.splitlines()
        out, fence, hits = [], False, 0
        for ln in lines:
            if ln.strip().startswith("```"):
                fence = not fence
                out.append(ln)
                continue
            if fence or ln.lstrip().startswith("%%%"):
                out.append(ln)
                continue
            new, k = mark_line(ln)
            hits += k
            out.append(new)
            if k and len(samples) < 20:
                samples.append((os.path.relpath(f, CUR), ln.strip()[:60], new.strip()[:80]))
        if hits:
            touched += 1
            total += hits
            if apply:
                io.open(f, "w", encoding="utf-8", newline="\n").write(
                    "\n".join(out) + "\n")
    print("候选表达式 %d 处，涉及 %d 个 curated 文件（%s）"
          % (total, touched, "已写回" if apply else "仅检查"))
    for rel, a, b in samples:
        print("  %-40s %s" % (rel, b))


if __name__ == "__main__":
    main()
