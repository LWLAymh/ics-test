# 题目数据接口（v3）

## 为什么要有 v3

旧接口把题干、选项、图片和答案拼成一段 Markdown，再由浏览器用正则猜题型与答案边界。
PDF 一旦跨页、答案写在图里、或一道题含多个小问，就可能出现“题干吃掉下一小问”“答案错位”
或“整卷只剩少数题”的问题。v3 的原则是：**源定位、交互类型、内容、资源和答案状态都显式声明**，
前端只负责渲染，不再猜测。

## 三层数据

1. `原文/` 与 `_cls/`：保留 PDF 转写结果和行号定位，只作为可追溯证据。
2. `_curated/`：人工校对层，明确 `mode`、单选/多选、题干、选项与答案。这里可以重排版，
   但 `rewritten` 文件必须登记在 `_tools/_rewritten_allowlist.txt`。
3. `web-data/`：由脚本生成的只读发布接口。浏览器读取 `catalog.json`、`papers.json` 和各模块题目文件。

禁止直接手改 `web-data/`；它会在下一次构建时被覆盖。

## 单题接口

每道题至少包含以下字段：

```json
{
  "id": "q-…",
  "paperId": "p-…",
  "paperOrder": 3,
  "moduleId": "processor_arch",
  "questionNo": "第9讲 3",
  "summary": "由 HCL 表达式补全组合逻辑电路图",
  "interaction": {
    "kind": "multiple-choice",
    "declared": true,
    "choices": [
      {"id": "A", "content": "选项 A 的 Markdown"},
      {"id": "B", "content": "选项 B 的 Markdown"}
    ],
    "correctChoiceIds": ["A", "B"]
  },
  "contentV3": {
    "format": "markdown",
    "prompt": "题干 Markdown",
    "answer": "答案 Markdown"
  },
  "assets": ["assets/阶段测验/…/diagram.png"],
  "answer": {
    "status": "verified",
    "inline": true,
    "relatedBlockIds": []
  },
  "source": {
    "document": "原文/阶段测验/….md",
    "lines": {"start": 69, "end": 77},
    "curated": "_curated/阶段测验/…/69.md"
  }
}
```

`summary` 仅供题库维护、审计和检索，可能包含对解法或考点的概括。前端禁止把它作为题目标题或在作答记录中展示；学生作答时只能看到原卷题号与原始题面。

### `interaction.kind`

- `single-choice`：单选题，必须显式写 `%%% selection: single`。
- `multiple-choice`：多选题，必须显式写 `%%% selection: multiple`；答案保存在
  `correctChoiceIds` 选项 ID 数组中，
  判分时比较集合是否完全一致，不按字符串包含关系判断。
- `fill`：填空题；每个空必须有独立输入框。后续迁移为复合题时，每个空还应有稳定 ID。
- `short-answer`：简答、作图等题型；不显示大文本框，只允许揭示参考答案后自评。
- `composite`：一道大题含多个小问；每个小问应有自己的 ID、交互类型和答案，不允许把
  `(1)`、`(2)` 粘成一个答案字符串。
- `choice` / `legacy`：旧数据兼容状态，表示尚未完成显式迁移，不应视为已经可靠校对。

### `answer.status`

- `verified`：题干与答案已经人工核对，可以展示和计分。
- `missing`：原始材料中没有提取出可靠答案。
- `needs-review`：检测到多个答案标记、跨题内容或其他可疑结构。

整卷模式必须展示清单中的全部题目。`missing` 和 `needs-review` 题目显示“待校对”并跳过计分，
绝不能从试卷中静默删除。

## 图片、公式和代码怎么连接

`contentV3.prompt` 与 `contentV3.answer` 使用 CommonMark Markdown：

- 图片：`![有意义的替代文字](assets/类别/试卷/文件.png)`。资源必须放在
  `question-bank/assets/` 下，构建器会检查文件存在并复制到站点。题图和答案图要分开，避免提前泄题。
- 行内公式：`$x+y$`；独立公式：使用 `$$ ... $$`。不要把普通文本靠猜测包进公式块。
- 代码：使用带语言名的围栏，如 `````c``、`````asm``、`````hcl``。围栏必须成对，
  题目区间不能从代码块中间切开。
- 表格：优先使用 Markdown 表格；复杂电路图、时序图和无法可靠重建的 PDF 表格使用清晰图片。
- 跨页内容：不要保留页码或分页注释；应在 curated 层把同一题重新组合，并在 `source.lines`
  或后续的 PDF page/region 元数据中保留来源定位。

## 试卷清单接口

`web-data/papers.json` 是整卷练习的唯一入口。每份试卷记录稳定 `paperId`、题目顺序、总题数、
已校对答案数和 `complete` 状态。前端必须按 `paperId` 精确选择试卷，不能只按“年份 + 考试类型”
把多份卷子混在一起。

## 构建期硬校验

`python question-bank/_tools/validate_web_data.py` 检查：

1. 题目 ID 与试卷内顺序唯一；
2. `papers.json` 的题目清单与模块文件逐题一致；
3. `verified` 题必须有非空答案；
4. 所有资源路径存在且不得越出 `assets/`；
5. 单选/多选声明与选项结构一致；
6. 整卷题数和已校对题数如实展示，任何题都不得静默丢失。

迁移时应先让题目进入清单并标记真实状态，再逐题补录答案。宁可显示“待校对”，也不要猜答案。
