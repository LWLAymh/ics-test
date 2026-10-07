# -*- coding: utf-8 -*-
"""投影不变量：`project(text)` 剥掉全部「展示层」标记，只留内容本身。

L2 会给 `原文` 加三类标记（代码围栏、`$` 公式定界符、`^{}`/`_{}` 上下标），
L3 的 curated 文件还会多一类 `%%%` 控制行。这些标记都**不改变内容**，
所以只要两侧施加同一个 `project()`，结果必须逐字节相等——这就是 L2/L3 的硬约束。

project() 依次剥掉：
  1. `%%% ` 控制行（整行丢弃，其后的内容行保留）；
  2. ``` 围栏行（整行丢弃，围栏内的内容行保留）；
  3. `<!-- ===== page N ===== -->` 页码注释行 —— 纯 PDF 元数据，
     curated 文件里不该出现，所以两侧都丢掉才对得上；
  4. 行尾空白（L4 的硬换行是两个空格；代码行尾空白同样无意义）；
  5. markdown 反斜杠转义（`\\$`、`\\*`、`\\_`、`\\\\` …）—— **必须在删 `$` 之前做**，
     否则 `\\$` 里的 `$` 先被删掉，只剩一个孤儿反斜杠；
  6. `$` / `$$` 定界符的字面字符 —— **不分围栏内外一律删**：
     汇编里的字面 `$`（`movq $0x0`）两侧同样被删，对称故安全；
  7. 行内代码的反引号（``` ` ```）。行内代码和围栏一样是**展示层**：
     MathJax 的 skipHtmlTags 会跳过 `<code>`，所以把「正文里引述的汇编」
     （`addq $48,%rsp`）包成行内代码既能防 `$` 吞正文，又是投影中性的；
  8. `^{...}` / `_{...}` 的定界符（内容保留）。要求脚本内容不含 `{`/`}`/`\\`，
     否则 L2 不产出该标记，因此这是精确可逆的。

同一个函数施加在两侧，所以任何确定性规则都是安全的；顺序固定，保证可复现。

另有 `project_reflow()`：`verbatim` 之外的 provenance 允许换行/重排，
所以比较前先把空白归一（计划里的 `reflow` 档）。
"""
import re

CONTROL = re.compile(r"^\s*%%%")
FENCE = re.compile(r"^\s*```")
PAGE_COMMENT = re.compile(r"^\s*<!--\s*=+\s*page\s+\d+\s*=+\s*-->\s*$")
# `^{x}` / `_{x}`，内容不含花括号与反斜杠（L2 只在安全时才产出）
SCRIPT = re.compile(r"[\^_]\{([^{}\\]*)\}")
ESCAPE = re.compile(r"\\([!-/:-@\[-`{-~])")


def project_line(line):
    """单行的投影结果；返回 None 表示整行是展示层标记，应当丢弃。"""
    if CONTROL.match(line) or FENCE.match(line) or PAGE_COMMENT.match(line):
        return None
    s = line.rstrip()
    s = SCRIPT.sub(r"\1", s)
    s = ESCAPE.sub(r"\1", s)
    s = s.replace("$", "")
    s = s.replace("`", "")          # 行内代码定界符（内容保留）
    return s


def project(text):
    """把一段 Markdown 投影成纯内容，用于逐字节比对。"""
    out = []
    for line in text.splitlines():
        p = project_line(line)
        if p is None or not p:
            continue
        out.append(p)
    return "\n".join(out)


def project_reflow(text):
    """reflow 档：投影后把空白归一成单空格，容许换行与重排。"""
    return re.sub(r"\s+", " ", project(text)).strip()


def nonspace(text):
    return re.sub(r"\s+", "", text)


if __name__ == "__main__":
    # 自检：标记必须全部消失，内容必须逐字节还原
    cases = [
        ("```\nmovq $0x0, %rax\n```", "movq 0x0, %rax"),
        ("2^{-23} 与 2-23", "2-23 与 2-23"),
        ("%%% stem\n题干 $x^2$ 结束", "题干 x^2 结束"),
        ("答案：A&D  ", "答案：A&D"),
        ("转义\\$与\\*与\\\\", "转义与*与\\"),
        ("x_{i} + y^{2}", "xi + y2"),
        ("<!-- ===== page 3 ===== -->\n正文", "正文"),
    ]
    bad = 0
    for src, want in cases:
        got = project(src)
        if got != want:
            print("FAIL %r -> %r (want %r)" % (src, got, want))
            bad += 1
    if project_reflow("A. x    B. y") != project_reflow("A. x\nB. y"):
        print("FAIL reflow 归一不生效")
        bad += 1
    print("project self-test: %s" % ("OK" if not bad else "%d problems" % bad))
