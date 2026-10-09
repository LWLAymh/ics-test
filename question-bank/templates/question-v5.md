+++json
{
  "schemaVersion": "5",
  "id": "q-0000000000000000",
  "revision": 1,
  "paperId": "p-0000000000000000",
  "paperOrder": 1,
  "number": {
    "display": "第一题 1",
    "major": {"display": "第一题", "value": "1"},
    "minor": {"display": "1", "value": "1"},
    "parts": []
  },
  "classification": {
    "primaryModuleId": "data_representation",
    "moduleIds": ["data_representation"],
    "tags": []
  },
  "type": "single-choice",
  "stem": {"format": "markdown"},
  "options": [
    {"id": "A", "content": {"format": "markdown"}},
    {"id": "B", "content": {"format": "markdown"}}
  ],
  "solution": {
    "state": "available",
    "grading": "choice",
    "correctOptionIds": ["B"],
    "reference": {"format": "markdown"},
    "provenance": {"origin": "human-derived", "crossChecked": false}
  },
  "publication": {
    "state": "draft",
    "basis": "human-review",
    "reviewer": null,
    "reviewedAt": null,
    "issues": []
  },
  "sources": [{"document": "手工编写的接口示例，非原卷题目", "provenance": "rewritten"}]
}
+++
%%% stem
执行以下 C 代码后，`y` 的值是多少？

```c
int x = 3;
int y = x * 2;
```
%%% reference
`y` 为 `6`，因为整数表达式 `3 * 2` 的结果是 `6`。
%%% option: A
`3`
%%% option: B
`6`
