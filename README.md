# ICS Test

PKU Introduction to Computer Systems 历年题测试站点。

- 在线地址：<https://lwlaymh.github.io/ics-test/>
- 题库源码：`question-bank/`
- 页面源码：`site/`
- Supabase 数据库脚本：`supabase/ics_stats.sql`
- 自动部署：`.github/workflows/pages.yml`

## 当前状态与下一步

站点目前使用 v3 发布数据。v3 已经能显式区分题型和试卷，但题面、图片、选项与填空位仍有一部分依赖 Markdown 字符串和兼容逻辑，复杂题目仍可能显示错误。

### 当前线上范围

线上练习池暂时只包含 `interaction.kind` 已明确标为 `single-choice` 或 `multiple-choice` 的题目。填空题、简答题以及仍为 `choice` / `legacy` 的未完全结构化题目继续保留在源题库和源试卷清单中，但 GitHub Pages 构建会从公开 JSON 中移除它们，它们不会进入组卷、判分或统计。各模块和试卷显示的可用题数均按这一发布范围单独计算。

这是迁移期间的临时发布策略，不是删除题目。完成 v4 迁移和逐卷视觉回归后，再恢复填空与简答题。

下面定义的 **v4 是下一轮题库迁移与前端重构的唯一目标接口**。在 v4 完成前：

- 不再新增依靠正则从题面猜测题型、选项或填空的逻辑；
- v3 文件仍可维护和构建，但不得把 v4 文档误认为已经部署；
- v4 生成器、校验器与前端全部完成后，再把 `schemaVersion` 切换为 `4`。

机器可读草案见 `question-bank/schema/question-v4.schema.json` 与 `question-bank/schema/paper-v4.schema.json`。现行 v3 说明保留在 `docs/QUESTION_FORMAT.md`，只用于迁移和追溯。

## v4 的核心原则

1. **题型只读字段，不猜正文。** 前端只根据 `type` 渲染 `single-choice`、`multiple-choice`、`fill` 或 `short-answer`。
2. **题面由有顺序的内容块组成。** 文字、公式、代码、图片和填空位在题面中的位置都是接口的一部分。
3. **选项是独立结构。** 每个选项有稳定 ID，并且自身也能包含 Markdown、代码、公式或图片。
4. **试卷身份与题号结构化。** “哪场考试、第几大题、第几小题、卷内第几道、属于哪个模块”不能从文件名或题面猜。
5. **答案与题面分离。** 题面绝不夹带答案；答案缺失或待复核时必须如实标记，不能静默删题。
6. **ID 稳定。** 修正文案、排版或标题不能改变 question ID、paper ID、选项 ID 或填空 ID，否则统计数据会断裂。

## 数据入口

构建后的静态数据包含四类文件：

```text
web-data/
├─ catalog.json                 # 模块、年份和试卷索引
├─ papers.json                  # 所有试卷元数据与题目顺序
├─ questions/<module>.json      # 按知识模块拆分的题目
└─ assets/...                   # 题面和答案使用的图片
```

浏览器先读取 `catalog.json` 与 `papers.json`，再按需加载题目文件。整卷练习必须按 `paperId` 和 `questionIds` 取题；随机模块练习按 `classification.moduleIds` 取题。

## 试卷接口

同一年、同一种考试可能有多套卷，因此年份和“期中/期末”不能充当主键。每份试卷必须有独立、稳定的 `id`：

```json
{
  "schemaVersion": 4,
  "id": "p-1a2b3c4d5e6f7890",
  "year": 2022,
  "academicYear": "2022-2023",
  "term": "fall",
  "examKind": "midterm",
  "sequence": null,
  "title": "2022 年秋季期中考试",
  "sourceLabel": "2022期中-带答案",
  "sourceDocument": "原文/期中/2022期中-带答案.md",
  "questionIds": ["q-1111111111111111", "q-2222222222222222"],
  "questionCount": 2,
  "verifiedAnswerCount": 2,
  "complete": true
}
```

| 字段 | 含义 |
| --- | --- |
| `id` | 稳定试卷 ID；不能因标题变化而改变 |
| `year` | 考试发生的自然年；未知时为 `null` |
| `academicYear` | 教学年度；未知时为 `null` |
| `term` | `spring`、`fall`、`summer`、`winter` 或 `unknown` |
| `examKind` | `midterm`、`final`、`stage-test`、`quiz`、`practice` 或 `other` |
| `sequence` | 第几次阶段测验/小测；不适用时为 `null` |
| `title` | 面向用户的正式名称 |
| `sourceLabel` | 原材料名称，仅用于追溯，不参与选卷 |
| `questionIds` | 严格按原卷顺序排列的题目 ID |
| `complete` | 是否完整收录该卷；不是“是否都有答案” |

页面上的年份、考试类型、试卷名称都从这里生成，不允许再拆文件名得到。

## 单题接口

### 总体结构

```json
{
  "schemaVersion": 4,
  "id": "q-1111111111111111",
  "paperId": "p-1a2b3c4d5e6f7890",
  "paperOrder": 9,
  "questionNumber": {
    "display": "第一题 9",
    "major": {"display": "第一题", "value": "1"},
    "minor": {"display": "9", "value": "9"},
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": ["machine_prog"],
    "tags": ["结构体对齐"]
  },
  "type": "single-choice",
  "title": "结构体对齐与总大小计算",
  "stem": {
    "blocks": [{"type": "markdown", "content": "下列说法中正确的是："}]
  },
  "options": [
    {"id": "A", "content": [{"type": "markdown", "content": "选项 A"}]},
    {"id": "B", "content": [{"type": "markdown", "content": "选项 B"}]}
  ],
  "solution": {
    "status": "verified",
    "correctOptionIds": ["B"],
    "blankAnswers": [],
    "referenceAnswer": {"blocks": []}
  },
  "source": {
    "document": "原文/期中/2022期中-带答案.md",
    "lines": {"start": 171, "end": 183},
    "curated": "_curated/期中/2022期中-带答案/171.md"
  }
}
```

### 考试、题号与分类

- `paperId` 必须能在 `papers.json` 中找到。
- `paperOrder` 是网站导航顺序，从 1 开始，必须与该试卷的 `questionIds` 一致。
- `questionNumber.display` 只用于还原原卷样式，例如 `第一题 9`、`Problem B 2(a)`；排序与导航不能解析这个字符串。
- `major` 和 `minor` 分别表示大题号与小题号，每项同时保留原样 `display` 和规范值 `value`。没有小题号时 `minor` 为 `null`。
- 更深的层级按顺序放进 `parts`，例如 `2(a)(iii)` 的 `parts` 为 `["a", "iii"]`。只有一个题号时将它作为 `major`、令 `minor` 为 `null`；无法可靠识别更深层级时保留在 `display` 中，`parts` 留空，不得猜测。
- `primaryModuleId` 决定默认模块；跨模块题可在 `moduleIds` 中列多个模块。
- `tags` 是检索标签，不能代替正式模块或题型。

## 内容块接口

题面、选项和参考答案都使用同一组内容块，按数组顺序渲染。

### Markdown 块

```json
{"type": "markdown", "content": "设 $x=2^k$，执行下列代码：\n\n```c\nint y = x + 1;\n```"}
```

- 普通文字、列表和表格使用 CommonMark。
- 行内公式使用 `$...$`，独立公式使用 `$$...$$`。
- 代码必须使用带语言名的围栏，如 `c`、`asm`、`hcl`。
- 不要用连续空格模拟表格，不要把整段普通文字放进代码块。

### 图片块

```json
{
  "type": "image",
  "src": "assets/期中/2022/struct-layout.png",
  "alt": "结构体成员排列示意图",
  "caption": "图 1：原始成员排列"
}
```

- 图片必须出现在 `stem.blocks`、某个选项的 `content` 或 `referenceAnswer.blocks` 的正确位置，不能只挂在题目末尾的资源列表中。
- `src` 必须以 `assets/` 开头，且不得包含 `..`。
- `alt` 必填并描述图片内容；`caption` 可选。
- 题图与答案图必须分别放置。答案图片只能出现在 `referenceAnswer` 中，避免提前泄题。

### 填空块

```json
{
  "type": "blank",
  "id": "offset",
  "label": "偏移量",
  "placeholder": "请输入十进制数",
  "width": "short"
}
```

- 填空块只允许出现在 `type: fill` 的 `stem.blocks` 中。
- `id` 在同一道题内唯一，并在题目生命周期内保持稳定。
- `width` 为 `short`、`medium` 或 `long`，仅控制展示宽度，不改变答案语义。
- 每个填空块生成一个独立输入框；禁止把多空题退化成一个大文本框。

## 四种题型

### 单选题 `single-choice`

```json
{
  "type": "single-choice",
  "stem": {
    "blocks": [
      {"type": "markdown", "content": "下列说法中正确的是："},
      {"type": "image", "src": "assets/example/cache.png", "alt": "Cache 结构图"}
    ]
  },
  "options": [
    {"id": "A", "content": [{"type": "markdown", "content": "选项 A"}]},
    {"id": "B", "content": [{"type": "markdown", "content": "选项 B"}]}
  ],
  "solution": {
    "status": "verified",
    "correctOptionIds": ["B"],
    "blankAnswers": [],
    "referenceAnswer": {
      "blocks": [{"type": "markdown", "content": "B 正确，因为……"}]
    }
  }
}
```

要求：至少两个选项；选项 ID 唯一；`verified` 时 `correctOptionIds` 恰好一个。交互使用单选控件，选择后提交。

### 多选题 `multiple-choice`

结构与单选相同，但 `type` 必须显式为 `multiple-choice`：

```json
{
  "type": "multiple-choice",
  "options": [
    {"id": "A", "content": [{"type": "markdown", "content": "选项 A"}]},
    {"id": "B", "content": [{"type": "markdown", "content": "选项 B"}]},
    {"id": "C", "content": [{"type": "markdown", "content": "选项 C"}]}
  ],
  "solution": {
    "status": "verified",
    "correctOptionIds": ["A", "C"],
    "blankAnswers": [],
    "referenceAnswer": {"blocks": []}
  }
}
```

交互使用复选控件。判分比较选项 ID 的集合是否完全相等；不能用字符串包含、顺序或“选中任一正确项”判分。统计时记录每个选项的选择人数，并单独计算整题全对率。

### 填空题 `fill`

题面被拆成 Markdown 块与填空块，输入框真正位于原题留空处：

```json
{
  "type": "fill",
  "stem": {
    "blocks": [
      {"type": "markdown", "content": "结构体优化前后大小分别为 56 和 40，因此 $A-B=$ "},
      {"type": "blank", "id": "difference", "label": "A-B", "width": "short"},
      {"type": "markdown", "content": " 字节。"}
    ]
  },
  "solution": {
    "status": "verified",
    "correctOptionIds": [],
    "blankAnswers": [
      {
        "blankId": "difference",
        "acceptedAnswers": ["16"],
        "caseSensitive": false,
        "trimWhitespace": true
      }
    ],
    "referenceAnswer": {
      "blocks": [{"type": "markdown", "content": "$56-40=16$。"}]
    }
  }
}
```

要求：题面至少一个填空块；`blankAnswers` 与题面中的 blank ID 一一对应；不得有 `options`。自动判分只做配置中明确允许的规范化，不能擅自把不同表达式视为等价。无法安全自动判分时展示参考答案并让用户自评。

### 简答题 `short-answer`

```json
{
  "type": "short-answer",
  "stem": {
    "blocks": [{"type": "markdown", "content": "说明 fork 后父子进程的返回值区别。"}]
  },
  "solution": {
    "status": "verified",
    "correctOptionIds": [],
    "blankAnswers": [],
    "referenceAnswer": {
      "blocks": [{"type": "markdown", "content": "父进程得到子进程 PID，子进程得到 0，失败返回 -1。"}]
    }
  }
}
```

简答题不显示输入框。页面只提供“显示参考答案”，显示后提供“需要复习 / 部分正确 / 回答正确”三个自评按钮，并始终保留“下一题”。

## 答案状态

`solution.status` 只有三种：

- `verified`：题面和答案已核对，可判分或自评；
- `missing`：原材料没有可靠答案；
- `needs-review`：提取到内容但存在错位、跨题或其他疑点。

`missing` 和 `needs-review` 的题仍必须保留在原卷顺序中。页面显示真实状态并跳过计分，绝不能因为没有答案而过滤掉题目。

## 题库 Markdown 的建议写法

v4 JSON 是发布接口；人工维护仍使用 `_curated/` 下的一题一文件 Markdown。生成器迁移后采用以下显式控制标记。

### 选择题

~~~markdown
%%% schema: 4
%%% id: q-1111111111111111
%%% paper: p-1a2b3c4d5e6f7890
%%% order: 9
%%% number-major: 第一题|1
%%% number-minor: 9|9
%%% module: machine_prog
%%% type: single-choice
%%% provenance: rewritten
%%% stem
下列结构体的总大小为 $A$，重排后的最小大小为 $B$，则 $A-B$ 为：

```c
struct record {
    char *a;
    short b;
    double c;
};
```

%%% option: A
12
%%% option: B
15
%%% option: C
16
%%% option: D
19
%%% correct: C
%%% solution
原大小为 56 字节，优化后为 40 字节，因此答案为 16。
~~~

`number-major` 和 `number-minor` 都使用 `原卷显示|规范值`。多选题只把 `type` 改为 `multiple-choice`，并写 `%%% correct: A,C`；类型不能根据正确答案个数自动推断。

### 带多个空的填空题

```markdown
%%% schema: 4
%%% id: q-2222222222222222
%%% paper: p-1a2b3c4d5e6f7890
%%% order: 10
%%% number-major: 第二题|2
%%% number-minor: 1|1
%%% module: data_representation
%%% type: fill
%%% provenance: rewritten
%%% stem
十六进制 `0x10` 的十进制值为 {{blank:decimal}}，二进制值为 {{blank:binary}}。
%%% blank-answer: decimal
16
%%% blank-answer: binary
10000
%%% solution
`0x10 = 16 = 0b10000`。
```

`{{blank:<id>}}` 是显式占位符，不允许用 `____`、`（ ）` 或 `(1)` 猜测填空。构建器会把文本按占位符拆成 Markdown 块与 blank 块。

### 带图片的题

```markdown
%%% type: short-answer
%%% stem
观察下图，说明流水线产生冲突的原因。

![五级流水线时序图](assets/阶段测验/2025/第2次/pipe-timing.png "图 1：五级流水线时序")

%%% solution
这里写参考答案；答案图片也必须写在本段中。
```

Markdown 图片在构建时转换为显式 image 块并保留原位置。选项中包含图片或代码时，将相同 Markdown 写在对应的 `%%% option: X` 段内。

## 前端渲染约定

前端不得读取题面文字来决定交互：

| `type` | 题面 | 作答区域 | 提交后 |
| --- | --- | --- | --- |
| `single-choice` | 顺序渲染 blocks | 单选选项 | 自动判分、统计、下一题 |
| `multiple-choice` | 顺序渲染 blocks | 复选选项 | 按集合判分、统计、下一题 |
| `fill` | blank 块原位变输入框 | 一个空一个输入框 | 自动判分或揭示答案自评、下一题 |
| `short-answer` | 顺序渲染 blocks | 不显示输入框 | 显示答案、自评、下一题 |

任一题在“提交答案”或“显示参考答案”后都必须出现清晰的下一题入口；自评未完成时允许“跳过自评，下一题”。

## 作答与统计事件

Supabase 中的作答记录也使用稳定 ID，不存题面副本：

```json
{
  "questionId": "q-1111111111111111",
  "paperId": "p-1a2b3c4d5e6f7890",
  "questionType": "multiple-choice",
  "selectedOptionIds": ["A", "C"],
  "blankValues": {},
  "selfRating": null,
  "isCorrect": true,
  "schemaVersion": 4
}
```

- 单选/多选写 `selectedOptionIds`；多选每个选项的人数和整题正确率分开统计。
- 填空写 `blankValues`，键必须是 blank ID；公开统计只展示聚合结果，不展示原始自由文本。
- 简答只写是否揭示答案及 `selfRating`，不伪造客观正确率。
- 题型改变或选项含义改变时应创建新 question ID；仅修正排版和错别字时保留原 ID。

## 构建期必须阻止的问题

v4 校验器必须让下列情况直接构建失败：

1. `paperId` 不存在，或 `paperOrder` 与试卷题目清单不一致；
2. 大题号/小题号与 `display` 矛盾，或 question ID、选项 ID、blank ID 重复；
3. 单选题没有且仅有一个正确选项，或正确答案引用不存在的选项；
4. 多选题未显式声明、选项不足，或正确答案引用不存在的选项；
5. 填空题没有 blank 块、答案遗漏某个 blank ID，或多出不存在的 blank ID；
6. 简答题含 `options`、blank 块或大文本输入配置；
7. 图片不存在、越出 `assets/`、缺少 alt 文本，或答案图被放进题面；
8. Markdown 代码围栏不配对；
9. `verified` 却没有可用答案；
10. 原卷清单中的题在模块文件中缺失，或被构建器静默过滤。

## 迁移顺序

1. 实现并测试 v4 Markdown 解析器与 JSON Schema 校验。
2. 先生成 `papers.json`，锁定稳定 paper ID、原卷顺序，以及大题号/小题号。
3. 按试卷逐题迁移 `_curated/`：先题型与题面，再选项/blank，最后答案。
4. 对图片、代码围栏、公式、选项数量、blank 覆盖率做全库校验。
5. 前端只消费 v4 结构，删除 `parseChoiceQuestion`、`parseFillQuestion` 等猜测逻辑。
6. 逐卷视觉回归，尤其检查含图片、选项含代码、多选和多空题。
7. 全库通过后切换 `schemaVersion: 4`，再删除 v3 兼容路径。

## 当前 v3 题库的维护与构建

在 v4 迁移完成前，仍按现行流程修改 `question-bank/_curated/`：

```powershell
cd question-bank
python _tools/validate_cls.py
python _tools/verify_verbatim.py
python _tools/verify_curated.py
python _tools/build_web_data.py
python _tools/validate_web_data.py
cd ..
npm run check
npm run build
```

构建后本地预览：

```powershell
python -m http.server 4173 --directory _site
```

访问 <http://127.0.0.1:4173/>。推送到 `main` 后，GitHub Actions 会重复校验并发布 GitHub Pages。

Supabase 前端只能使用 publishable key；secret key 不得写入源码、README、构建产物或 GitHub Actions 日志。首次创建或重置统计表时，在 Supabase SQL Editor 中执行 `supabase/ics_stats.sql`，日常改题不需要重复执行。

## 题目来源与致谢

本项目中的历年题资料整理自 [zhuozhiyongde/Introduction-to-Computer-System-2023Fall-PKU](https://github.com/zhuozhiyongde/Introduction-to-Computer-System-2023Fall-PKU)。感谢原仓库作者及所有贡献者对 PKU ICS 学习资料的整理与公开。

本项目在原始资料的基础上进行了按知识点分类、结构化提取、排版修正和网页化处理；题目与答案如有疏漏，请以课程官方资料为准。原仓库采用 GPL-3.0 许可证，复用相关内容时请同时遵守原仓库的许可与署名要求。
