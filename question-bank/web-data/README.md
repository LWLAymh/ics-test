# v5 生成数据（不要手工编辑）

唯一输入是 `../authored/` 的完整题目 Markdown 与试卷/模块索引。运行仓库根目录的 `npm run compile-bank` 生成：

- `catalog.json`：版本、模块索引、筛选项与统计。
- `questions.json`：完整题目数组，题面/选项/参考内容直接来自人工 Markdown。
- `papers.json`：原卷顺序及生成统计。

各 payload 的 `schemaVersion` 都是字符串 `"5"`。此处保留待复核题供维护和 PDF 审阅，实际 `_site/web-data/` 仅发布 `publication.state=published` 的题，并复制 `../assets/`。

不再生成旧的 `questions/<module>.json`、`groups.json` 或 `answer-blocks.json`。完整约定见 [v5 编写指导](../../docs/QUESTION_AUTHORING_V5.md)。
