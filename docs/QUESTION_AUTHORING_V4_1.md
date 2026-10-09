# 人工题目接口 v4.1（设计稿）

> ## 状态：**设计稿，尚未实现，不要照此迁移**
>
> - 当前线上构建要求 `schemaVersion: 3`；[build-site.js](../scripts/build-site.js) 与
>   [validate_web_data.py](../question-bank/_tools/validate_web_data.py) 都会直接拒绝其他版本。
> - v4.1 的 JSON Schema、模板与本文件已经写好并经过校验，但**没有任何构建步骤读取它们**，
>   题库**一道题都没有迁移**。迁移是后续工作。
> - 本文取代 v4 的撰写说明作为**下一轮迁移的唯一目标接口**；[QUESTION_AUTHORING_V4.md](QUESTION_AUTHORING_V4.md)
>   保留作为 v4 的历史记录。
> - 与 v4 不同，v4.1 **只有一种方言**（见 §2）。v4 曾同时存在 README 的 `%%% schema: 4` 写法与
>   本文档 TOML `+++` 写法，两者互不兼容——照 README 写出来的文件解析器直接报错。这个坑不再重复。

机械可读的接口：[question-v4.1.schema.json](../question-bank/schema/question-v4.1.schema.json)、
[paper-v4.1.schema.json](../question-bank/schema/paper-v4.1.schema.json)。
空白模板：[question-v4.1.md](../question-bank/templates/question-v4.1.md)。
文档内所有以 `json v4.1-question` / `json v4.1-paper` 标记的代码块都是**规范示例**，由
[`_tools/v4_1_conformance.py`](../question-bank/_tools/v4_1_conformance.py) 抽取并逐个校验通过；
标记为 `json v4.1-invalid` 的块**必须**校验失败。

---

## 1. 为什么要有 v4.1

v4 的方向是对的（题型只读字段、内容块有顺序、答案与题面分离），但有 10 处让它在真实题库上
不成立或不好用。每一条都对应本轮维护中实测到的问题：

| # | v4 的问题 | 实测证据 | v4.1 的做法 |
| --- | --- | --- | --- |
| 1 | **答案仍是「TOML 散字段 + 中文解析正文」**：`correct_options = ["A","D"]`，而人写的解析里还要写「答案：A、D」 | 题库里到处是 `答案：B`；甚至有题把整份答案连同评分标准写进**题干**（`！！！！答案`），既泄题又导致 `status = missing` | `solution` 成为**判别式联合**（`state` × `kind`），答案键是类型化数据；**题面/选项里的 Markdown 出现「答案：」直接拒绝**（schema 层 `not pattern`） |
| 2 | **代码靠人工加反引号/围栏**，且明确声明「不替维护者补反引号」 | 全库 281 行选项代码没被包成代码；853 行 C 代码缩进全丢；17 个反汇编块列错位 | 新增 **`code` 内容块**，代码进 `blocks` 就是代码；缩进是块内文本，不靠空白碰运气 |
| 3 | **part 没有模块归属** | 同一个大题的小问常分属不同模块，v3 只能靠 `%%% group` 分组层缝合，于是出现「跨模块组合题被截断」的 bug | **每个 part 自带 `modules`**，组合题原生跨模块，**分组层整层不需要存在** |
| 4 | **答案来源只能写进答案正文** | 94 道已发布题目的参考答案里塞着一句「本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对」 | `solution.provenance = {origin, crossChecked, attribution}`，由界面渲染徽章 |
| 5 | **`provenance`（verbatim/reflow/rewritten）不在 schema 里** | 它写在 curated front matter，校验时再对照一份外部 `_rewritten_allowlist.txt` | 进 `source.provenance`，题目自描述，不再依赖外部清单 |
| 6 | **两套方言** | README 教 `%%% schema: 4`，文档与 [authoring_v4.py](../question-bank/_tools/authoring_v4.py) 用 TOML `+++` | §2 只声明一种，并在 v4 文档里标注废弃 |
| 7 | **`schemaVersion` 是数字 4** | `4.10` 会被读成 `4.1`；比较逻辑迟早出错 | 改为字符串 `"4.1"` |
| 8 | **没有 `revision`** | 无法区分「只是排版修正」与「内容变了」；统计只能靠 ID 是否变化来猜 | 新增 `revision` 整数 |
| 9 | **复合题顶层 `solution` 与各 part 的答案关系含糊** | v3 曾把整份试卷的答案块挂到该卷每道题上，造成泄题风险 | 顶层只允许 `aggregateSolution`（state + 可选总解析 + 来源）；**答案只能待在 part 里** |
| 10 | **`status` 语义重载**：`publication.status` 与 `solution.status` 同名不同义 | 审阅时容易混淆「还没审」与「还没答案」 | 统一叫 `state` 并分成两张表：`publication.state`（draft/review/published）与 `solution.state`（missing/needs-review/verified） |

v4.1 同时顺手修掉两个数据接口上的坑：

- **试卷标题**：v4 的 `title` 要求 `minLength: 1`，但生成器给 27/28 份试卷写的是空串。v4.1 拆成
  **必填的 `displayName`** 与**可空的 `title`**，界面一律回退到 `displayName`。
- **派生计数**：`questionCount` / `verifiedAnswerCount` 是算出来的，写进人工数据只会漂移
  （v3 的 `withheldQuestions` 就少报了 25 道）。v4.1 的试卷 schema 不再要求它们，改由构建器计算。

## 2. 唯一方言

一个题目文件 = 一道题，路径 `question-bank/authored/<paper-id>/<question-id>.md`。

文件结构固定为三段，没有第二种写法：

1. **TOML 元数据**：由独占一行的 `+++` 包住。机器判分需要的一切（题型、答案键、填空答案、
   选项 ID、模块、来源、发布状态）都在这里。
2. **正文段**：以 `%%%` 开头的控制行分段。
3. 其余一律是段内 Markdown 内容。

正文控制行**只有**下列 9 种，出现其他 `%%%` 控制行即报错：

```text
%%% stem                       顶层题面（可重复，用于在文字之间插入内容块）
%%% code: <language>           一段代码块（v4.1 新增）
%%% option: <option-id>        一个独立选项
%%% blank: <blank-id>          填空位置（无正文）
%%% explanation                解析正文（不是答案键；答案键在 TOML）
%%% part-stem: <part-id>       复合题某个小问的题面
%%% part-code: <part-id> <language>
%%% part-option: <part-id> <option-id>
%%% part-blank: <part-id> <blank-id>
%%% part-explanation: <part-id>
```

`%%% answer` 这个名字在 v4.1 **被取消**：它同时被当作「答案键」和「解析」使用，正是问题 1 的来源。
现在答案键只存在于 `[solution]`，人写的解释叫 `%%% explanation`。

## 3. 规范示例

### 3.1 多选题

```json v4.1-question
{
  "schemaVersion": "4.1",
  "id": "q-4f3a2b1c0d9e8f76",
  "revision": 1,
  "paperId": "p-0f1e2d3c4b5a6978",
  "paperOrder": 9,
  "number": {
    "display": "第一题 9",
    "major": {"display": "第一题", "value": "1"},
    "minor": {"display": "9", "value": "9"},
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": ["machine_prog"],
    "tags": ["条件码", "条件跳转"]
  },
  "type": "multiple-choice",
  "stem": {
    "blocks": [
      {"type": "markdown", "text": "`x86-64` 提供条件码寄存器。执行 `cmpq` 后，以下哪些表达式成立？"},
      {"type": "code", "language": "asm", "text": "cmpq %rsi, %rdi\njg   target\n"}
    ]
  },
  "options": [
    {"id": "A", "content": {"blocks": [{"type": "markdown", "text": "`~(SF ^ OF) & ~ZF`"}]}},
    {"id": "B", "content": {"blocks": [{"type": "markdown", "text": "`~(SF ^ OF)`"}]}},
    {"id": "C", "content": {"blocks": [{"type": "markdown", "text": "`SF ^ OF`"}]}},
    {"id": "D", "content": {"blocks": [{"type": "markdown", "text": "`ZF == 0 && SF == OF`"}]}}
  ],
  "solution": {
    "state": "verified",
    "kind": "choice",
    "correctOptionIds": ["B", "D"],
    "provenance": {"origin": "official", "crossChecked": true},
    "explanation": {
      "blocks": [{"type": "markdown", "text": "`jg` 的转移条件是 `ZF == 0` 且 `SF == OF`，即 `~(SF ^ OF) & ~ZF`。"}]
    }
  },
  "publication": {"state": "published", "reviewer": "LWLAymh", "reviewedAt": "2026-10-10"},
  "source": {
    "document": "原文/期中/2019期中-带答案.md",
    "lines": {"start": 141, "end": 153},
    "pages": [4],
    "provenance": "rewritten"
  }
}
```

注意这里**没有**任何地方写「答案：B、D」——答案键是 `solution.correctOptionIds`，解析是
`solution.explanation`，两者分开。

### 3.2 填空题

```json v4.1-question
{
  "schemaVersion": "4.1",
  "id": "q-2b3c4d5e6f708192",
  "revision": 1,
  "paperId": "p-0f1e2d3c4b5a6978",
  "paperOrder": 10,
  "number": {
    "display": "第二题 1",
    "major": {"display": "第二题", "value": "2"},
    "minor": {"display": "1", "value": "1"},
    "parts": []
  },
  "classification": {
    "primaryModuleId": "data_representation",
    "moduleIds": ["data_representation"],
    "tags": ["结构体对齐"]
  },
  "type": "fill",
  "stem": {
    "blocks": [
      {"type": "markdown", "text": "原结构体大小为 56 字节，重排后为 40 字节，因此 $A-B=$ "},
      {"type": "blank", "id": "difference", "label": "A-B", "placeholder": "十进制字节数", "width": "short"},
      {"type": "markdown", "text": " 字节。"}
    ]
  },
  "solution": {
    "state": "verified",
    "kind": "blanks",
    "blanks": [
      {
        "blankId": "difference",
        "numeric": {"equals": 16, "integer": true},
        "normalize": {"trimWhitespace": true, "caseSensitive": false}
      }
    ],
    "provenance": {"origin": "official", "crossChecked": true},
    "explanation": {"blocks": [{"type": "markdown", "text": "$56-40=16$。"}]}
  },
  "publication": {"state": "published", "reviewer": "LWLAymh", "reviewedAt": "2026-10-10"},
  "source": {
    "document": "原文/期中/2022期中-带答案.md",
    "lines": {"start": 171, "end": 183},
    "provenance": "rewritten"
  }
}
```

空与答案必须一一对应：题面里有几个 `blank` 块，`solution.blanks` 就必须有几项，
`blankId` 集合完全相等。`numeric` 与 `accept` 二选一——用 `numeric` 就不必再手写
`["16","0x10","0x0010"]` 这类等价字面量。

### 3.3 简答题

```json v4.1-question
{
  "schemaVersion": "4.1",
  "id": "q-3c4d5e6f708192a3",
  "revision": 1,
  "paperId": "p-0f1e2d3c4b5a6978",
  "paperOrder": 11,
  "number": {
    "display": "第三题",
    "major": {"display": "第三题", "value": "3"},
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "ecf_and_system_io",
    "moduleIds": ["ecf_and_system_io"],
    "tags": ["fork", "进程控制"]
  },
  "type": "short-answer",
  "stem": {
    "blocks": [{"type": "markdown", "text": "说明 `fork` 之后父子进程返回值的区别。"}]
  },
  "solution": {
    "state": "verified",
    "kind": "reference",
    "reference": {
      "blocks": [{"type": "markdown", "text": "父进程得到子进程 PID，子进程得到 0，失败返回 -1。"}]
    },
    "provenance": {"origin": "human-derived", "crossChecked": true}
  },
  "publication": {"state": "published", "reviewer": "LWLAymh", "reviewedAt": "2026-10-10"},
  "source": {"document": "原文/期末/2019期末-无答案.md", "provenance": "rewritten"}
}
```

简答题不出现输入框，也没有 `options` 与 `blank`；学生查看 `reference` 后自评。

### 3.4 复合题（原生跨模块）

这是 v4.1 相对 v4 最关键的结构变化：**每个 part 自己声明模块**，所以一道大题天然可以横跨多个模块，
不需要 v3 的 `%%% group` 分组层，也就不可能出现「只选了其中一个模块时题面被截断」。

```json v4.1-question
{
  "schemaVersion": "4.1",
  "id": "q-5e6f708192a3b4c5",
  "revision": 3,
  "paperId": "p-1a2b3c4d5e6f7081",
  "paperOrder": 2,
  "number": {
    "display": "第六题",
    "major": {"display": "第六题", "value": "6"},
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": ["machine_prog", "data_representation", "processor_arch"],
    "tags": ["循环展开", "流水线冒险"]
  },
  "type": "composite",
  "stem": {
    "blocks": [
      {"type": "markdown", "text": "阅读下列函数，回答（1）至（3）。"},
      {"type": "code", "language": "c", "caption": "待分析的函数", "text": "float func(float *p, int n)\n{\n    float ans = 0;\n    for (int i = 0; i < n; i++)\n        ans += p[i];\n    return ans;\n}\n"}
    ]
  },
  "parts": [
    {
      "id": "semantics",
      "label": "（1）",
      "type": "multiple-choice",
      "modules": ["data_representation"],
      "stem": {"blocks": [{"type": "markdown", "text": "关于 `float` 累加的误差，下列说法成立的是："}]},
      "options": [
        {"id": "A", "content": {"blocks": [{"type": "markdown", "text": "累加顺序会影响结果"}]}},
        {"id": "B", "content": {"blocks": [{"type": "markdown", "text": "结果与累加顺序无关"}]}},
        {"id": "C", "content": {"blocks": [{"type": "markdown", "text": "误差随 `n` 增大而累积"}]}}
      ],
      "solution": {
        "state": "verified",
        "kind": "choice",
        "correctOptionIds": ["A", "C"],
        "provenance": {"origin": "official", "crossChecked": true}
      }
    },
    {
      "id": "unroll",
      "label": "（2）",
      "type": "fill",
      "modules": ["machine_prog"],
      "stem": {
        "blocks": [
          {"type": "markdown", "text": "若按 $2 \\times 2$ 循环展开，累积变量应增加到 "},
          {"type": "blank", "id": "accumulators", "label": "累积变量个数", "width": "short"},
          {"type": "markdown", "text": " 个。"}
        ]
      },
      "solution": {
        "state": "verified",
        "kind": "blanks",
        "blanks": [{"blankId": "accumulators", "numeric": {"equals": 2, "integer": true}}],
        "provenance": {"origin": "official", "crossChecked": true}
      }
    },
    {
      "id": "pipeline",
      "label": "（3）",
      "type": "short-answer",
      "modules": ["processor_arch"],
      "stem": {"blocks": [{"type": "markdown", "text": "展开后为什么可能反而变慢？"}]},
      "solution": {
        "state": "verified",
        "kind": "reference",
        "reference": {"blocks": [{"type": "markdown", "text": "展开倍数过大时寄存器压力上升，溢出到栈上的访存会抵消并行带来的收益。"}]},
        "provenance": {"origin": "ai-derived", "crossChecked": false, "attribution": "deepseek v4.1 flash · 大肥鱼小姐"}
      }
    }
  ],
  "solution": {
    "state": "verified",
    "provenance": {"origin": "human-derived", "crossChecked": true},
    "explanation": {"blocks": [{"type": "markdown", "text": "三个小问分别考数据表示、机器级程序与处理器体系结构。"}]}
  },
  "publication": {"state": "published", "reviewer": "LWLAymh", "reviewedAt": "2026-10-10"},
  "source": {"document": "原文/期中/2021期中-带答案.md", "lines": {"start": 782, "end": 830}, "provenance": "rewritten"}
}
```

要点：

- 顶层 `stem` 只放**所有小问共享的材料**，不含填空。
- 每个 part 都有自己的 `solution`，其中第（3）问老实标了 `ai-derived` + `crossChecked: false` +
  署名——所以界面能显示「AI 推导，未与官方核对」徽章，而不是靠在解析里写一句中文。
- 顶层 `solution` 只有总解析与来源，**不允许**出现 `correctOptionIds` / `blanks` / `reference`。

### 3.5 试卷

```json v4.1-paper
{
  "schemaVersion": "4.1",
  "id": "p-0f1e2d3c4b5a6978",
  "revision": 1,
  "displayName": "2019期中",
  "title": null,
  "year": 2019,
  "academicYear": "2018-2019",
  "term": "spring",
  "examKind": "midterm",
  "sequence": null,
  "sourceLabel": "2019期中-带答案",
  "sourceDocument": "原文/期中/2019期中-带答案.md",
  "questionIds": ["q-4f3a2b1c0d9e8f76", "q-2b3c4d5e6f708192", "q-3c4d5e6f708192a3"],
  "complete": true
}
```

`title` 为 `null` 是合法的：原卷没给正式标题时，界面显示 `displayName`。

`stage-test` 必须给出 `sequence`：

```json v4.1-paper
{
  "schemaVersion": "4.1",
  "id": "p-2b3c4d5e6f70819a",
  "revision": 1,
  "displayName": "2025阶段测验（第2次）",
  "title": null,
  "year": 2025,
  "academicYear": "2024-2025",
  "term": "fall",
  "examKind": "stage-test",
  "sequence": 2,
  "sourceLabel": "2025第2次阶段测验-带答案",
  "sourceDocument": "原文/阶段测验/2025第2次阶段测验-带答案.md",
  "questionIds": ["q-5e6f708192a3b4c5"],
  "complete": true
}
```

### 3.6 反面示例（必须被拒绝）

把答案写进题面——这正是本次维护中在 `2016期末 第四题` 上发现的真实缺陷，v4.1 在 schema 层就拒绝它：

```json v4.1-invalid
{
  "schemaVersion": "4.1",
  "id": "q-6f708192a3b4c5d6",
  "revision": 1,
  "paperId": "p-0f1e2d3c4b5a6978",
  "paperOrder": 12,
  "number": {"display": "第四题", "major": {"display": "第四题", "value": "4"}, "minor": null, "parts": []},
  "classification": {"primaryModuleId": "compilation_linking", "moduleIds": ["compilation_linking"], "tags": ["符号"]},
  "type": "short-answer",
  "stem": {
    "blocks": [
      {"type": "markdown", "text": "请给出各符号的强弱属性。"},
      {"type": "markdown", "text": "答案：main.c 的 f 是全局弱符号。"}
    ]
  },
  "solution": {"state": "missing", "reason": "原卷未提供可靠答案"},
  "publication": {"state": "draft", "reviewer": null, "reviewedAt": null},
  "source": {"document": "原文/期末/2016期末-带答案.md", "provenance": "rewritten"}
}
```

另一个必须被拒绝的例子：复合题把答案放在顶层。

```json v4.1-invalid
{
  "schemaVersion": "4.1",
  "id": "q-708192a3b4c5d6e7",
  "revision": 1,
  "paperId": "p-0f1e2d3c4b5a6978",
  "paperOrder": 13,
  "number": {"display": "第五题", "major": {"display": "第五题", "value": "5"}, "minor": null, "parts": []},
  "classification": {"primaryModuleId": "ecf_and_system_io", "moduleIds": ["ecf_and_system_io"], "tags": []},
  "type": "composite",
  "stem": {"blocks": [{"type": "markdown", "text": "回答下面两问。"}]},
  "parts": [
    {"id": "a", "label": "（1）", "type": "short-answer", "modules": ["ecf_and_system_io"],
     "stem": {"blocks": [{"type": "markdown", "text": "第一问。"}]},
     "solution": {"state": "missing", "reason": "待校对"}},
    {"id": "b", "label": "（2）", "type": "short-answer", "modules": ["ecf_and_system_io"],
     "stem": {"blocks": [{"type": "markdown", "text": "第二问。"}]},
     "solution": {"state": "missing", "reason": "待校对"}}
  ],
  "solution": {"state": "verified", "kind": "reference", "reference": {"blocks": []}, "provenance": {"origin": "official", "crossChecked": true}},
  "publication": {"state": "draft", "reviewer": null, "reviewedAt": null},
  "source": {"document": "原文/期末/2019期末-无答案.md", "provenance": "rewritten"}
}
```

## 4. 人工撰写格式

### 4.1 文件骨架

```markdown
+++
schema_version = "4.1"
id = "q-4f3a2b1c0d9e8f76"
revision = 1
type = "multiple-choice"

paper_id = "p-0f1e2d3c4b5a6978"
paper_order = 9

number_display = "第一题 9"
number_major_display = "第一题"
number_major_value = "1"
number_minor_display = "9"
number_minor_value = "9"

module_primary = "machine_prog"
modules = ["machine_prog"]
tags = ["条件码", "条件跳转"]

[solution]
state = "verified"
kind = "choice"
correct_option_ids = ["B", "D"]

[solution.provenance]
origin = "official"
cross_checked = true

[publish]
state = "published"
reviewer = "LWLAymh"
reviewed_at = "2026-10-10"

[source]
document = "原文/期中/2019期中-带答案.md"
start = 141
end = 153
provenance = "rewritten"
+++

%%% stem
`x86-64` 提供条件码寄存器。执行 `cmpq` 后，以下哪些表达式成立？

%%% code: asm
cmpq %rsi, %rdi
jg   target

%%% option: A
`~(SF ^ OF) & ~ZF`

%%% option: B
`~(SF ^ OF)`

%%% option: C
`SF ^ OF`

%%% option: D
`ZF == 0 && SF == OF`

%%% explanation
`jg` 的转移条件是 `ZF == 0` 且 `SF == OF`。
```

### 4.2 TOML 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `schema_version` | 是 | 固定字符串 `"4.1"` |
| `id` | 是 | `q-` + 16 位小写十六进制，永久稳定 |
| `revision` | 是 | 整数，从 1 开始；内容改动时加一 |
| `type` | 是 | `single-choice` / `multiple-choice` / `fill` / `short-answer` / `composite` |
| `paper_id` | 是 | 稳定试卷 ID |
| `paper_order` | 是 | 原卷顺序，从 1 开始 |
| `number_display` | 是 | 原卷题号原样文本 |
| `number_major_display` / `number_major_value` | 是 | 大题号的原样文本与规范值 |
| `number_minor_display` / `number_minor_value` | 成对 | 没有小题号时同时省略 |
| `number_parts` | 否 | 更深层级，例如 `["a", "iii"]` |
| `module_primary` | 是 | 主模块 |
| `modules` | 是 | 所属模块，必须包含 `module_primary` |
| `tags` | 否 | 检索标签 |
| `[solution]` | 是 | 见 §5 |
| `[publish]` | 是 | `state` / `reviewer` / `reviewed_at` |
| `[source]` | 是 | `document` / `provenance`，可选 `start` / `end` / `pages` / `curated` |

### 4.3 各题型的额外字段

**选择题**

```toml
[solution]
state = "verified"
kind = "choice"
correct_option_ids = ["B", "D"]     # 单选恰好一个；多选至少一个
```

**填空题**

```toml
[[blanks]]
id = "difference"
label = "A-B"
placeholder = "十进制字节数"
width = "short"

[[solution.blanks]]
blank = "difference"
numeric = { equals = 16, integer = true }
# 或者显式白名单：
# accept = ["16", "0x10"]
```

**简答题**：只有 `[solution]` 的 `state` / `kind = "reference"` / `[solution.provenance]`，
参考答案正文写在 `%%% explanation` 段里（这也是学生看到的那份）。

**复合题**

```toml
type = "composite"

[[parts]]
id = "semantics"
label = "（1）"
type = "multiple-choice"
modules = ["data_representation"]
correct_option_ids = ["A", "C"]

[[parts]]
id = "pipeline"
label = "（2）"
type = "short-answer"
modules = ["processor_arch"]
```

每个 part 必须有自己的 `id`、`label`、`type`、`modules`、题面与答案。part 的 `type` 只能是四种基础
题型，**不允许嵌套 composite**。

## 5. 答案接口

`[solution]` 按 `state` 分三态，`verified` 再按 `kind` 分三种载荷：

| state | 必填 | 含义 |
| --- | --- | --- |
| `missing` | `reason` | 原材料确实没有答案。题目仍留在原卷顺序里，页面显示真实状态并跳过计分 |
| `needs-review` | `reason`，可选 `candidate` | 提取到内容但有疑点（跨页错位等） |
| `verified` | `kind` + 对应载荷 + `provenance` | 已人工核对，可判分或自评 |

| kind | 载荷 | 适用题型 |
| --- | --- | --- |
| `choice` | `correctOptionIds`（单选 1 个，多选 ≥1） | 单选、多选 |
| `blanks` | `blanks[]`，每项 `accept` 或 `numeric` | 填空 |
| `reference` | `reference`（参考答案内容块） | 简答 |

`provenance` 三个字段：

- `origin`：`official`（原卷自带）/ `human-derived`（人写）/ `ai-derived`（模型推导）
- `crossChecked`：是否已与官方答案核对
- `attribution`：`origin = "ai-derived"` 时**必填**，例如 `deepseek v4.1 flash · 大肥鱼小姐`

界面据此渲染徽章：`ai-derived` 且 `crossChecked = false` 的题，在参考答案上方显示
「⚠️ 本题答案由 AI 推导，未与官方答案核对」。

**两条硬约束**：

1. 题面与选项里的 Markdown **不得**出现 `答案：`、`参考答案：` 或 `！！！！答案`——schema 直接拒绝。
2. 复合题的答案**只能**放在 part 里；顶层 `solution` 只有总解析与来源。

## 6. 内容块

`stem`、`options[].content`、`solution.reference`、`solution.explanation` 都由有顺序的 `blocks` 组成。

| 块 | 允许出现的位置 | 字段 |
| --- | --- | --- |
| `markdown` | 全部 | `text` |
| `code` | 全部 | `language`（`c`/`cpp`/`asm`/`y86`/`hcl`/`bash`/`text`）、`text`、可选 `caption` |
| `image` | 全部 | `src`（`assets/` 开头）、`alt`（必填）、可选 `caption` |
| `blank` | 只在 `fill` 的题面（含 fill part 的题面） | `id`、可选 `label`/`placeholder`、`width` |

- `image` 必须写在它实际出现的位置，答案图只能出现在 `solution` 里。
- `blank` 一个块对应一个输入框；禁止把多空题退化成一个大文本框。
- 行内代码沿用 Markdown 的 `` `...` ``（`%rax`、`SF ^ OF` 这类程序表达式）。
- 数学公式用 `$...$`；`^ & | ~` 等程序运算符不得为了排版塞进公式。

## 7. 构建期必须失败的校验

**schema 能表达的**（已写在 `question-v4.1.schema.json` 里）：

1. 未知字段、未知 `type`、缺必填字段。
2. 题型的结构约束：选择题必须有 `options` 且题面无 `blank`；填空题必须有 `blank` 且无 `options`；
   简答题两者皆无；复合题必须有 `parts` 且顶层无 `options`。
3. 答案与题型匹配：`single-choice` 的 `correctOptionIds` 恰好 1 个；每种题型只接受对应 `kind`。
4. 复合题顶层不得出现 `kind`；part 不得嵌套 composite。
5. 题面/选项 Markdown 中出现答案标记。
6. `published` 必须有 `reviewer` 与非空 `reviewedAt`。
7. `ai-derived` 必须有 `attribution`。
8. `image.src` 必须以 `assets/` 开头。
9. 填空答案必须给出 `accept` 或 `numeric` 之一。
10. `stage-test` 试卷必须给出 `sequence`。

**需要校验器（schema 表达不了）**：

11. `paperId` 能在 `papers.json` 里找到；`paperOrder` 与试卷 `questionIds` 下标一致。
12. `correctOptionIds` 引用的选项 ID 存在；选项 ID 在题内唯一且连续。
13. 填空：题面 `blank.id` 集合 == `solution.blanks[].blankId` 集合，且每个 id 恰好出现一次。
14. 复合题：part id 唯一；每个 part 的 `solution.kind` 与其 `type` 匹配；顶层 `state = "verified"`
    当且仅当所有 part 都是 `verified`。
15. `image.src` 指向的文件真实存在，且路径不含 `..`。
16. 题面/选项的 Markdown 里，**代码 token 必须处于行内代码或 `code` 块中**：出现裸露的
    `0x…`、`%reg`、`sizeof(`、`offsetof(`、`a->b`、`x[i]` 即报错。这条正是本次维护中
    「281 行选项代码没被包成代码」那类问题的机器化闸门。
17. 仓库内 `id` / `paperId` / part id / blank id / option id 全局唯一。
18. `paperId` 变化或 `id` 变化必须伴随 `papers.json` 的同步修改——否则视为破坏性变更。

> 第 16 条与「不要猜正文」的原则不冲突：它**不猜测**哪些文字是代码，只拒绝在明确是代码 token
> 时没有标注。作者要么加反引号，要么改用 `code` 块，没有第三种解释。

## 8. 从 v3/v4 迁移的映射（**留作后续工作，本次不执行**）

| v3 | v4 | v4.1 |
| --- | --- | --- |
| `interaction.kind`（`choice`/`legacy` 也算） | `type` | `type`（不变） |
| `layout.stem`（Markdown 字符串） | `stem.blocks` | `stem.blocks`，新增 `code` 块 |
| `layout.choices[].content` | `options[].content`（数组） | `options[].content.blocks`（对象） |
| `blankAnswers[]` | `solution.blankAnswers[]` | `solution.blanks[]`，新增 `numeric` |
| `answer.status` | `solution.status` | `solution.state` |
| `answer.inline`（正文里有没有答案） | — | 取消：答案一律在 `solution` 里 |
| `%%% group` / `group_title` / `group_order` | `parts[]` | `parts[]`，每个 part 自带 `modules` |
| `%%% provenance:` + `_rewritten_allowlist.txt` | — | `source.provenance` |
| 答案正文里的 AI 免责声明 | — | `solution.provenance` |
| `%%% mode: choice|fill|short` | `type` | `type` |
| `%%% correct: B,D` | `correct_options` | `correct_option_ids` |
| `%%% answer` 段 | `%%% solution` 段 | `%%% explanation` 段（答案键在 TOML） |
| `questionNo`（扁平字符串） | `questionNumber` | `number` |
| `paperId` / `paperOrder` | 同 | 同，另加 `revision` |

迁移顺序建议（沿用 v4 文档的骨架，但目标是 v4.1）：

1. 先实现 **TOML + `%%%` 解析器**与 JSON Schema 校验器（含 §7 的 18 条），并接入 CI 但只作用于
   `authored/` 目录，不影响现有 v3 构建。
2. 生成 v4.1 的 `papers.json`，锁定 `paperId`、原卷顺序、大题号/小题号。
3. 按试卷逐题迁移，先题型与题面，再选项/blank，最后答案与 `provenance`。
4. 全库校验图片、代码块、公式、选项数量、blank 覆盖率。
5. 前端只消费 v4.1 结构，删除全部按正文猜测的逻辑。
6. 逐卷视觉回归，重点看含图片、选项含代码、多选、多空、跨模块复合题。
7. 全库通过后再切换 `schemaVersion`，并删除 v3 兼容路径。

**顺序上有一条硬要求**：第 1 步的校验器必须包含 §7 第 16 条（裸代码 token），否则迁移过程中会
再次出现「选项里的代码没被包成代码」这一类问题。

## 9. 尚未实现的部分（诚实清单）

| 内容 | 状态 |
| --- | --- |
| 两份 JSON Schema | ✅ 已写，已用 `jsonschema` 校验过自身与全部示例 |
| 本文件与模板 | ✅ 已写 |
| 文档示例的一致性校验（含反面示例必须失败） | ✅ [`_tools/v4_1_conformance.py`](../question-bank/_tools/v4_1_conformance.py)，已接入 `npm run check`；机器上没装 `jsonschema` 时打印 SKIP 并以 0 退出，不会让 CI 失败 |
| TOML + `%%%` → JSON 的解析器 | ❌ 未实现（v4 的 [authoring_v4.py](../question-bank/_tools/authoring_v4.py) 可作起点，但它只认 v4） |
| §7 第 11–18 条的校验器 | ❌ 未实现 |
| 前端 v4.1 渲染 | ❌ 未实现（当前前端只认 v3） |
| 题库迁移 | ❌ 未开始，**按要求不做** |
| 构建路径接入 | ❌ 未接入；`build-site.js` 依旧要求 `schemaVersion === 3`，`authored/` 目录也还不存在 |

上面那条「一致性校验」只检查**文档与 schema 是否自洽**，不读题库、不参与发布，因此不算接入。
在解析器与校验器就位之前，`schema/question-v4.1.schema.json` 与
`schema/paper-v4.1.schema.json` **不可**作为发布依据。
