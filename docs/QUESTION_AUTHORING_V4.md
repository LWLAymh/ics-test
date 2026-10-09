# 人工题目 Markdown 接口（v4）

## 1. 目的与边界

v4 的唯一题目内容来源是维护者逐题编写、逐题审核的 Markdown 文件。转换 PDF、OCR、正则表达式或大模型输出只能作为录入参考，不能直接成为线上题目。

构建程序只允许做三件事：

1. 读取 TOML 元数据和显式内容段；
2. 校验字段、引用和题型约束；
3. 原样复制 Markdown 到发布 JSON。

构建程序禁止猜题型、拆选项、识别“像代码的文字”、自动添加代码围栏、自动添加公式标记、改写换行、生成标题或从解析中推断正确答案。未完成人工录入的题保持 `draft`，不发布。

## 2. 文件位置与生命周期

每道题一个文件：

```text
question-bank/authored/<paper-id>/<question-id>.md
```

状态只有三种：

- `draft`：正在录入，可以不完整，绝不上线；
- `review`：已录入，等待另一位维护者对照原卷检查，绝不上线；
- `published`：题面、选项、解析和元数据均已人工核对，可以上线。

把状态改成 `published` 是人工审核动作，不允许脚本批量添加或自动升级。

## 3. 完整示例

```markdown
+++
schema_version = 4
id = "q-0123456789abcdef"
status = "published"
reviewed_by = "reviewer-name"
reviewed_at = "2026-10-08"
type = "multiple-choice"

paper_id = "p-0123456789abcdef"
paper_order = 6
number_display = "第一题 6"
number_major_display = "第一题"
number_major_value = "1"
number_minor_display = "6"
number_minor_value = "6"
number_parts = []

module_primary = "machine_prog"
modules = ["machine_prog"]
tags = ["条件码", "条件跳转"]

correct_options = ["A", "D"]

source_document = "原文/期中/2019期中-带答案.md"
source_start = 141
source_end = 153
source_pages = [4]
+++

%%% stem
`x86-64` 提供条件码寄存器。执行 `cmpq` 后，以下哪些表达式满足题目条件？

下面是真正的代码块；语言名必须由录入者填写：

```asm
cmpq %rsi, %rdi
jg target
```

真正的数学公式才使用公式标记，例如 $x = 2^k$。

%%% option: A
`~(SF ^ OF) & ~ZF`

%%% option: B
`~(SF ^ OF)`

%%% option: C
`SF ^ OF`

%%% option: D
`ZF == 0 && SF == OF`

%%% solution
正确选项为 A、D。`SF ^ OF` 是程序表达式，因此使用行内代码，而不是数学公式。
```

示例中的内容只说明格式，不是一道要导入题库的真实题。

## 4. TOML 元数据

文件必须以一对独占一行的 `+++` 包住 TOML 元数据。正文从第二个 `+++` 的下一行开始。

### 4.1 通用必填字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `schema_version` | 整数 | 固定为 `4` |
| `id` | 字符串 | 稳定题目 ID，格式 `q-` 加 16 位小写十六进制；排版修改不能改变 |
| `status` | 字符串 | `draft`、`review` 或 `published` |
| `type` | 字符串 | `single-choice`、`multiple-choice`、`fill`、`short-answer` 或 `composite` |
| `paper_id` | 字符串 | 稳定试卷 ID |
| `paper_order` | 整数 | 在原卷中的顺序，从 1 开始 |
| `number_display` | 字符串 | 原卷显示题号，只展示，不参与排序 |
| `number_major_display` | 字符串 | 大题号原样文本，例如 `第一题` |
| `number_major_value` | 字符串 | 大题号规范值，例如 `1` |
| `module_primary` | 字符串 | 主知识模块 ID |
| `modules` | 字符串数组 | 所属模块，必须包含主模块 |
| `source_document` | 字符串 | 原材料路径 |

`number_minor_display` 与 `number_minor_value` 必须同时出现或同时省略。更深层级写入 `number_parts`，例如 `2(a)(iii)` 可写为 `["a", "iii"]`。`tags`、`source_start`、`source_end` 和 `source_pages` 可选，但不得靠文件名推断这些信息。

`published` 还必须填写 `reviewed_by` 与 ISO 日期格式的 `reviewed_at`。解析器只检查声明是否完整，不会替维护者判断内容是否正确。

### 4.2 选择题字段

- 单选和多选都必须显式填写 `correct_options`。
- 单选恰好一个正确选项；多选至少一个。
- `correct_options` 中的 ID 必须与 `%%% option: ID` 完全一致。
- 选项 ID 在本题内稳定。调整选项文字不改变 ID。

### 4.3 填空题字段

每个空在 TOML 中使用一项 `[[blanks]]`：

```toml
[[blanks]]
id = "offset"
label = "偏移量"
placeholder = "十进制字节数"
width = "short"
accepted_answers = ["8"]
case_sensitive = false
trim_whitespace = true
```

正文在准确位置写 `%%% blank: offset`。这是一种显式内容块，不是从下划线或括号猜出来的空。每个 `id` 必须正好在题面出现一次。

### 4.4 简答题字段

简答题没有 `correct_options`、`[[blanks]]` 或选项段。页面只显示题面；学生点击“显示参考答案”后查看 `solution` 并自评，不出现大文本框。

### 4.5 复合题字段

一道原卷大题包含不同交互方式的小问时使用 `type = "composite"`。顶层不写 `correct_options` 或 `[[blanks]]`；每个小问用 `[[parts]]` 显式声明，数组顺序就是原卷顺序：

```toml
type = "composite"

[[parts]]
id = "condition"
label = "（1）"
type = "multiple-choice"
correct_options = ["A", "C"]

[[parts]]
id = "result"
label = "（2）"
type = "fill"

[[parts.blanks]]
id = "value"
label = "结果"
placeholder = "十进制整数"
width = "short"
accepted_answers = ["42"]
case_sensitive = false
trim_whitespace = true

[[parts]]
id = "reason"
label = "（3）"
type = "short-answer"
```

part 的 `type` 只能是四种基础题型，不允许再次嵌套 `composite`。每个 part 都必须有自己的题面和解析；选择 part 需要选项与 `correct_options`，填空 part 需要 `[[parts.blanks]]`，简答 part 不得声明选项或填空。

## 5. 正文段

控制行必须独占一行，当前只允许：

```text
%%% stem
%%% option: A
%%% blank: offset
%%% solution
%%% part-stem: condition
%%% part-option: condition A
%%% part-blank: result value
%%% part-solution: reason
```

- `stem`：题面 Markdown。填空题可以有多个 `stem` 段，以便在段间插入空。
- `option`：一个独立选项的 Markdown。选项可包含多段文字、图片、表格和围栏代码；解析器不按行拆选项。
- `blank`：填空位置，无正文，ID 对应 `[[blanks]]`。
- `solution`：完整解析 Markdown。正确选项等机器判分数据放在 TOML，不从解析文字中提取。
- `part-stem: <part-id>`：复合题某个小问的题面，可像普通 `stem` 一样重复出现。
- `part-option: <part-id> <option-id>`：复合题选择小问的独立选项。
- `part-blank: <part-id> <blank-id>`：复合题填空小问的原位输入位置，无正文。
- `part-solution: <part-id>`：该小问自己的答案与解析。顶层 `solution` 只用于跨小问的总解析，可以省略正文内容。

段内 Markdown 除去段边界的空行后原样保留。以 `%%%` 开头的行保留给接口控制，不应作为正文使用。

## 6. Markdown 写法

### 6.1 普通文字与换行

人工决定段落和换行。不要依赖浏览器或构建器把 OCR 折行重新拼接。

### 6.2 代码和程序表达式

- 多行 C、汇编、HCL 等代码必须人工放入带语言名的围栏代码块，例如 `c`、`asm`、`hcl`。
- 寄存器、指令、变量、类型和程序表达式使用行内代码，例如 `` `%rax` ``、`` `cmpq` ``、`` `SF ^ OF` ``。
- `^`、`&`、`|`、`~` 等程序运算符不得为了排版放进 `$...$`。

解析器不会检查一段文字“像不像代码”，也不会替维护者补反引号。

### 6.3 数学公式

只有数学表达式使用 `$...$` 或 `$$...$$`。例如 `$2^k$` 是公式，而 `SF ^ OF` 是程序表达式。

### 6.4 图片

图片直接写在它实际出现的段内：

```markdown
![Cache 结构示意图](assets/期中/2022/cache-layout.png)
```

题图放在 `stem` 或对应 `option`，答案图放在 `solution`。路径必须以 `assets/` 开头，不能包含 `..`；替代文字必须能说明图片内容。

## 7. 机械解析保证

单文件解析器的契约是：

- 输入一个明确指定的 `.md` 文件；
- 不遍历题库，不写回文件，不迁移旧题；
- 不更改 Markdown 内文；
- 不从正文推断任何元数据；
- 未知字段、未知控制段和不一致引用直接报错；
- 只有 `status = "published"` 的题能进入发布集合。

因此，“校验通过”只表示接口结构正确，不表示题目内容已经校对。内容正确性仍由 `reviewed_by` 对应的人工审核负责。

