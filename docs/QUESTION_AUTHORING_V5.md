# 人工题目 Markdown 与运行时接口 v5

本文是当前**已实现**的唯一撰写约定。历史 v3/v4/v4.1 不再参与网站构建。机器约束见 `question-bank/schema/question-v5.schema.json`、`paper-v5.schema.json`，语义约束见 `_tools/format_v5.py`。文档示例仅为说明；可直接复制并通过校验的完整文件在 `templates/question-v5.md`。

## 1. 不可变原则

- 题面、每个选项、解析均是维护者手写 Markdown；图片、公式、代码在其实际位置写入，不另用数组猜插入位置。
- 元数据明确题型、试卷、题号、空位和判分规则。渲染器不得根据下划线、中文关键词、答案字母、代码形状或文件名推断。
- 一份文件表示一次完整作答；原卷同一大题包含若干依赖小问时使用 composite，不因模块不同拆开。
- 不自拟会泄露解法的题目标题。页面只显示题型、试卷、原卷题号、模块和人工题面。
- ID 一经发布不因文字、文件位置、题号或模块变化而改变。题目修订增加 revision；不要复用别题 ID。
- 所有嵌套对象严格限制字段；不能把旧 `layout`、`interaction`、`summary` 混进 v5。

## 2. 唯一人工文件格式

位置：`question-bank/authored/<paperId>/<id>.md`，文件名、父目录与元数据必须一致。

文件以 `+++json` 开始，接标准 JSON，单独一行 `+++` 结束。无 JSON 注释，无尾逗号。内容对象在元数据中只写 `format` 与可选 `blanks`，**不能写 text**；text 来自下面的 Markdown 内容段。

````text
+++json
{ ...标准 JSON 元数据... }
+++
%%% stem
题面 Markdown
%%% reference
参考答案与解析 Markdown
%%% option: A
A 的 Markdown
%%% option: B
B 的 Markdown
````

上例围栏中的起止标记实际均为三个 `+`：`+++json` / `+++`。`%%%` 控制行必须独占一行且与声明的对象对应，不能缺段、重复段或附加未知段。root 的 stem/reference 必需；综合题可为空。内容段可以按任意顺序出现，选项和小问的显示顺序**只由 JSON 数组顺序决定**。

每段正文后有一个分隔换行，解析器只移除这一个换行；正文需要末尾空行时再多留一行。代码缩进、内部换行、首尾空行都不会被自动清洗。允许 CRLF，解析时统一为 LF。

综合题使用以下段名，`partId` 来自 parts[i].id：

```text
%%% part-stem: partId
%%% part-reference: partId
%%% part-option: partId A
```

合法 fenced code 内的 `%%%` 是普通代码，不作为分隔符。未闭合围栏会失败。普通正文中不要单独写未转义的控制行；需要讨论标记语法时放在围栏里。

## 3. 整题字段

| 字段 | 约定 |
| --- | --- |
| schemaVersion | 字符串 `"5"`，不是数字 5 |
| id | `q-` 加 16 位小写十六进制；随机生成、全局唯一、永久稳定 |
| revision | 正整数；修题时递增 |
| paperId | 所属试卷稳定 ID，必须在 papers.json 中登记 |
| paperOrder | 正整数排序键；同一试卷/章节内唯一，按 paper.questionIds 严格递增，允许精选题目留下间隔；不等于界面进度编号 |
| number | 原题号结构，见下节，不承担排序功能 |
| classification | primaryModuleId、moduleIds、tags；主模块必须在模块数组内 |
| type | single-choice、multiple-choice、fill、short-answer、composite、unclassified-choice |
| stem | `{format:"markdown"}`，可在 fill 题面上声明 blanks |
| options | 选择题必需，2 个以上，顺序就是显示顺序 |
| parts | 仅 composite 使用，至少 2 个非综合小问，按原卷顺序 |
| solution | 结构化评分配置与独立 reference Markdown |
| publication | 发布状态、审核依据、审核者、日期、已知问题 |
| sources | 非空来源列表，追溯原文，不作为渲染内容或答题标题 |

选择题不能带 parts；非选择题不能带 options；非综合题不能带 parts；综合题不能带根级选项或空位。题型与 solution.grading 的合法组合同时受 Schema 和语义校验约束。

## 4. 题型与原卷题号

```json
{
  "display": "第一题 9",
  "major": {"display": "第一题", "value": "1"},
  "minor": {"display": "9", "value": "9"},
  "parts": []
}
```

大题号、小题号分开保存，display 是原卷显示用完整题号。更深层如 `(2)(a)` 依次放入 parts 字符串数组，不解析题目正文。无法可靠确定时 major/minor 或其 value 可为 null，不虚构题号；number.display 仍保留原标注。题号可能重复，不能代替稳定 ID。

判断题用 single-choice，明确两个选项（例如 A“正确”、B“错误”）和正确键，不用简答题模拟。是否多选必须人工指定，不能根据正确键数量反推；multiple-choice 也允许正确集合只有一项。未确认选择形式用 unclassified-choice，禁止发布。

## 5. Markdown、图片、公式、代码、换行

### 正文与换行

使用标准 Markdown：普通单换行是源码折行；空行分段；真正的强制换行用行尾两个空格或反斜杠。前端 `breaks:false`，不会把 PDF 的每个物理行都变成显示断行，也不删除中文折行。要调整排版，应逐题改人工 Markdown。

原卷的多行程序必须手写代码围栏。不要在一段普通文本里靠空格或 `<br>` 排列代码；也不要将两份并排源文件粘成一个交错代码块。

````markdown
已知以下程序：

```c
int main(void) {
    int x = 3;
    return x * 2;
}
```

问返回值是多少？
````

汇编用 `asm` 围栏，单条指令或寄存器用反引号，如 `subq $48, %rsp`、`ZF ^ OF`。位运算符 `^` 不是数学上标。普通算式 `3*2*4` 要么整体用反引号保护，要么明确写 `$3\times 2\times 4$`；不要依赖渲染器把所有星号认成乘号。

### 公式

行内公式 `$2^{24}=16777216$`，独立公式用单独的 `$$` 块，前后空行。只有显式数学分隔符会交给 MathJax，代码块及行内代码跳过。公式不应吞掉汇编里的 `$10`；汇编必须写在 code 内。

### 表格

使用标准 Markdown 表格，标题行、分隔行、内容行分开写。单元格中的竖线需转义。复杂多行代码尽量分成“优化前”“优化后”两段 fenced code，避免将 `<br>` 字面量混在单元格里。HTML 默认禁用，不承诺 HTML 表格/标签可用。

### 图片

把真实文件提交到 `question-bank/assets/`，在题面、选项或 reference 的正确位置写：

```markdown
![电路图](assets/example/circuit.png)
```

路径相对题库资源根，不是 authored 子目录；区分大小写，推荐 ASCII 文件名。旧 `../../assets/...` 引用仅做精确资源根映射，Markdown 原文不变。外链图片、越界路径、缺文件、查询参数或片段都被拒绝。不要只登记图片列表却忘记在题面引用，也不要把原卷答案图插到题面。

图片可放在任意内容段中，选项也可包含图片。构建会用 Markdown token 校验实际图片链接，不把代码围栏中展示的 `![...]` 当图片。发布时统一映射到 `./web-data/assets/...`。

## 6. 单选与多选

元数据 options 示例：

```json
[
  {"id":"A","content":{"format":"markdown"}},
  {"id":"B","content":{"format":"markdown"}}
]
```

分别写 `%%% option: A` / `%%% option: B` 的 Markdown，不必重复字母标签。选项 ID 当前限 A–H，唯一且稳定，和现有 Supabase RPC 一致。不能因重新排序而交换 ID 的含义；如果实质换题，要评估历史统计是否仍可比较。

答案元数据：

```json
{
  "state":"available",
  "grading":"choice",
  "correctOptionIds":["A"],
  "reference":{"format":"markdown"},
  "provenance":{"origin":"unknown","crossChecked":null}
}
```

单选恰好一个正确键；多选正确键为非空集合，必须引用实际选项。多选需集合完全一致才得 1 分，不给少选/多选部分分。没有可靠键但有参考解释时可 grading:self，需登记 `answer-key-unresolved`，前端不从解释提取字母。

## 7. 填空：位置与答案一一绑定

在人工题面内写 `{{blank:x}}`，元数据显式声明：

```json
{
  "format":"markdown",
  "blanks":[
    {"id":"x","marker":"{{blank:x}}","occurrence":0,"width":"short","label":"x 的值"}
  ]
}
```

marker 是精确字面文本，不是正则；occurrence 是该 marker 在本内容段出现的第几次，从 0 开始，按可重叠的字面搜索计数。锚点不得重叠。输入框会在原位置替换这段文本，允许出现在代码、表格和普通段落内。

新题用明确标记。旧题的 `____` 等保留原文，但必须显式写 marker / occurrence，前端不会扫描下划线猜空位。显式 `{{blank:...}}` 未登记会报错。标记语法只用于空位，别把它用于变量名或题面示例。

同一逻辑空在同一小问多次展示，可给同 id 绑定多个不同 occurrence；输入值自动同步，只判一次分。不同小问可复用局部 blank ID，作用域互不干扰。每个逻辑 ID 恰好一条判分规则：

```json
{
  "state":"available",
  "grading":"blanks",
  "blankAnswers":[
    {"blankId":"x","method":"exact","acceptedAnswers":["255","0xff"],
     "normalize":{"trimWhitespace":true,"caseSensitive":false}}
  ],
  "reference":{"format":"markdown"},
  "provenance":{"origin":"human-derived","crossChecked":false}
}
```

exact 只做指定的首尾空白、大小写处理，再对白名单精确比较。`0x00ff`、`3*85` 不自动等于 `255`；需要接受则人工加入。不会 eval，也暂不支持数值容差、符号化简或模糊匹配。

某空需人工判断时使用 `{blankId:"x",method:"self"}`。若本填空小问任一规则是 self，则此小问整体显示参考答案后自评；若全部 exact 或 selection，所有逻辑空都对才算小问正确。根题与综合题小问规则相同。

### 候选项有限：单选下拉 / 多选下拉

这是 v5 的可选扩展；没有 `input` 的空仍是普通文本框，不需要批量迁移或自动猜测。作者须逐空明确填写完整候选集，**不能只把正确答案列为候选项**。选择标签是普通文本，不做 Markdown/LaTeX 猜测；候选值是稳定 ID，不是展示文字。

单选下拉空位示例：

```json
{
  "id":"relation", "marker":"{{blank:relation}}", "occurrence":0,
  "width":"short", "label":"关系符",
  "input":{
    "kind":"select", "multiple":false,
    "options":[
      {"value":"lt","label":"<"},
      {"value":"eq","label":"=="},
      {"value":"gt","label":">"}
    ]
  }
}
```

判分规则为 `{"blankId":"relation","method":"selection","correctValues":["lt"]}`。必须引用该空实际候选 ID；单选恰好一个正确值。不要给 selection 填 acceptedAnswers/normalize，也不要对下拉空使用 exact。

需要在同一个空中选择多项时使用 `multiple:true`。页面会展开带勾选框的菜单，而不是原生列表的 Ctrl 多选。比如“不定项关系符”：

```json
{
  "id":"r", "marker":"{{blank:r}}", "occurrence":0,
  "width":"medium", "label":"关系符（可多选）",
  "input":{
    "kind":"select", "multiple":true,
    "options":[
      {"value":"A","label":"A · <"},
      {"value":"B","label":"B · >"},
      {"value":"C","label":"C · =="},
      {"value":"D","label":"D · !="},
      {"value":"E","label":"E · none"}
    ],
    "exclusiveValues":["E"]
  }
}
```

对应规则例：`{"blankId":"r","method":"selection","correctValues":["B","D"]}`。集合必须完全一致（顺序无关），少选/多选不得分。exclusiveValues 可省略；其中每个值都与其他所有值互斥，适用于 none / 以上都不是。正确集合不能同时包含互斥项和其他项。

候选值必须唯一，至少两个候选。重复展示同一逻辑空时，各处 input 配置必须完全相同；选中值自动同步。普通输入、单选下拉、多选下拉可混在同一填空题或综合小问中，分别配置 exact / selection / self 规则。选择也保留草稿，提交后锁定，上一题/下一题返回时不丢失。

维护实例：2015 期中第二题第 1 小问（`q-1737c983c32fea14`），8 个原位多选空，E 与关系符互斥。原卷小问计分与网站整题归一化计分不同，题面与参考中明确说明，不暗示支持少选部分分。

仅历史迁移允许暂未标注空位的 fill，需登记 `blank-positions-unresolved` 且 grading:self/none，页面明确提示待补空位，不降格成简答、不瞎造输入框。新题应补标注后发布。

## 8. 简答与综合题

short-answer 使用 grading:self，不设大回答框，只显示参考答案与“需要复习 / 部分正确 / 回答正确”自评。

composite 的 root.stem 放共用条件、代码和图片，parts 保存完整的小问。root.solution 为 available / parts，reference 可放整题说明，也可为空。至少一个小问答案可用才可以声明整题 available。小问可以是单选、多选、填空、简答，但不允许递归嵌套 composite。

每个 part 有 id、number、type、moduleIds、stem、solution、sources、issues；选择小问另有 options。小问 ID 全库唯一，迁移前的片段 ID 继续用；模块须包含在整题 classification.moduleIds 中。part 不另写 publication，以整题发布状态为准。

按 JSON 顺序显示小问。用户提交整题时自动核对选择与已配置的填空，再统一自评其余小问。可评分小问等权：客观正确数加上自评分乘主观小问数，除以可评分小问数，整题分保留两位小数。缺失/待复核答案的小问不计入分母。全部客观也按比例分，不将任意一个错判为整题 0 分。

综合题一次提交一条整题统计，完全 1 分才计入 correct_answers；当前不上传小问详细作答。浏览器草稿为本次页面会话状态，不是题库接口或长期学习记录。

## 9. 答案状态、出处与发布

solution.state：available / missing / needs-review。后两种必须 grading:none 且给出 reason；不能偷偷从 relatedBlockIds 或邻题补答案。available 的叶子题必须有可见参考内容，choice/blanks 再要求相应规则。

provenance.origin：official / human-derived / ai-derived / unknown，crossChecked 为 true / false / null，可选 attribution/note。只有查到依据才写 official、审核事实不明就用 unknown/null。AI 推导会显示警示。答案“可用”不等于其出处可靠或内容已逐题证实。

publication 必需字段：

```json
{
  "state":"draft",
  "basis":"human-review",
  "reviewer":null,
  "reviewedAt":null,
  "issues":[]
}
```

state 为 draft/review/published，仅 published 进入部署。新人工发布时 basis:human-review，必须填写真实 reviewer 与 ISO 日期 reviewedAt。legacy-migration 仅用于承接已有发布范围，不伪造审核记录；修订并完成审核后应切换 human-review、递增 revision 并更新审核信息。

`source-import` 表示按可追溯题源逐题录入后发布，不声称经过人工审核；没有真实审核者时 reviewer/reviewedAt 均为 null。它不是答案可靠性的证明，答案出处仍由 solution.provenance 独立记录。CSAPP 家庭作业的自行推导参考答案使用 ai-derived / crossChecked:false，不能写为 official。

### 题目来源集合与章节组卷

`authored/papers.json` 中的 `sourceCollection` 显式区分 `pku-exam`（PKU 真题）与 `csapp-textbook`（CSAPP 习题）。兼容旧 v5 时省略字段视为 pku-exam；当前登记均显式填写。前端只读取此字段，不根据题目标题、正文或标签猜来源。

CSAPP 第 N 章的练习题和精选家庭作业共用一个 paper，displayName 为 `CSAPP SecN · 章节名`，examKind 为 practice，year 为 null，coverage.state 为 partial。原题号 N.M 放入 number；paperOrder 使用原小题号 M，保留被排除题目的间隔，questionIds 按此键排序。没有合适题目的章节不创建空 paper。

组卷来源是两个独立、默认选中的复选项；模块数量、试卷/章节列表、考试类型、随机抽题、模块全练及高错题排序均遵守来源筛选。至少选择一个来源；已选试卷若不属于新来源范围应清空，避免残留隐性筛选。

以上是 v5 的兼容扩展：新增可选来源枚举、source-import 发布依据，并允许有间隔但严格递增的 paperOrder。旧 v5 文件仍可校验；不改变任何 Markdown 渲染或评分规则。

sources 记录真实来源 document、provenance（verbatim/reflow/rewritten/unknown），可选行号、legacyId、curated 路径、aliases 和 editorNote。editorNote 只供维护，不渲染为答题标题。来源行号倒序会失败。

全部答案保存在静态 JSON，用户能自行查看；此站是自学练习工具，不提供防泄题/防作弊考试隔离。

## 10. 试卷接口

`authored/papers.json` 为 `{schemaVersion:"5",papers:[...]}`。每份卷子包含：

- schemaVersion、稳定 `p-16位十六进制` id、正整数 revision；
- displayName（选择器显示）、title（可为 null）；
- year、academicYear（未知可为 null）、term（unknown/fall/spring/summer 等，以 Schema 枚举为准）；
- examKind：midterm/final/stage-test/quiz/lab-quiz/practice/other；sequence 表示第几次测验，可为 null；
- questionIds 按原卷顺序排列，含未发布题；每题只能归一份卷子，paperOrder 与此列表从 1 连续对应；
- coverage.state 为 unknown/partial/complete，note 说明依据。complete 只表示原卷收录完整，不表示答案全有；
- sourceDocuments 非空的原始资料路径列表。

发布会过滤未发布题，但保留原始 paperOrder，允许线上顺序号存在间隙，不另重编号。不同章节分类不应登记成多份同名试卷。

## 11. 生成接口与维护步骤

生成的 `web-data/` 只有 catalog.json、questions.json、papers.json 与说明文件；发布目录另外带 assets。每份顶层 payload 的 schemaVersion 都为字符串 5。questions.json 持有完整题目对象（content.text 从人工正文段注入），无 v3 冗余 content/layout 或兼容字段。papers.json 的 stats 为生成统计，不写回人工试卷 Schema。

catalog 的模块只是 questionIds 索引；一道跨模块综合题可在多个模块索引里出现，但全局记录只有一条，前端抽题不会重复。发布子集只含 published，待复核内容留在仓库供维护/PDF 审阅。

操作流程：

1. 定位稳定 ID，修改对应 authored 文件，不动旧 `_curated` 或生成 JSON。
2. 手工补 Markdown 结构；需要改题型时同时修改 options/blanks/solution 和对应内容段。
3. 修订 revision；完成审核后如实登记审核者、日期并清理已解决的 issues。
4. 新增/删除题需要同步 papers.json 的顺序与所有受影响 paperOrder；别改变已发布题目的 id。
5. `npm run compile-bank`，再 `npm run check`、`npm run build`。失败时修源文件，不改生成物绕过校验。
6. 检查网页（尤其表格、代码缩进、图片、窄屏、填空可输入性），必要时导出试卷 PDF 对照原卷。
7. 提交人工文件、图片、试卷索引与生成 JSON。修复线上报错后单独用管理员维护命令清理对应报告。

校验包括：Schema 联合约束、全局 ID 唯一、原卷归属/顺序、模块引用、选项键、空位定位/重叠/判分覆盖、内容段完整性、图片存在及路径安全、生成文件是否过期、部署子集是否一致。它不能自动证明原卷转写、答案推理或人为换行正确，仍需人工审阅。
