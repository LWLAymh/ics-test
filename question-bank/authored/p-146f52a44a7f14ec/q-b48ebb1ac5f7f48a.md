+++json
{
  "schemaVersion": "5", "id": "q-b48ebb1ac5f7f48a", "revision": 2, "paperId": "p-146f52a44a7f14ec", "paperOrder": 1,
  "number": {"display": "8.1", "major": {"display": "第 8 章", "value": "8"}, "minor": {"display": "8.1", "value": "1"}, "parts": []},
  "classification": {"primaryModuleId": "ecf_and_system_io", "moduleIds": ["ecf_and_system_io"], "tags": ["csapp", "practice", "chapter-8"]},
  "type": "fill", "stem": {"format": "markdown", "blanks": [{"id":"ab","marker":"{{blank:ab}}","occurrence":0,"width":"short","input":{"kind":"select","multiple":false,"options":[{"value":"yes","label":"是"},{"value":"no","label":"否"}]}},{"id":"ac","marker":"{{blank:ac}}","occurrence":0,"width":"short","input":{"kind":"select","multiple":false,"options":[{"value":"yes","label":"是"},{"value":"no","label":"否"}]}},{"id":"bc","marker":"{{blank:bc}}","occurrence":0,"width":"short","input":{"kind":"select","multiple":false,"options":[{"value":"yes","label":"是"},{"value":"no","label":"否"}]}}]},
  "solution": {"state": "available", "grading": "blanks", "blankAnswers": [{"blankId":"ab","method":"selection","correctValues":["yes"]},{"blankId":"ac","method":"selection","correctValues":["no"]},{"blankId":"bc","method":"selection","correctValues":["yes"]}], "reference": {"format": "markdown"}, "provenance": {"origin": "unknown", "crossChecked": false, "note": "答案据来源仓库《练习题答案.md》及题目时间区间核对。"}},
  "publication": {"state": "published", "basis": "source-import", "reviewer": null, "reviewedAt": null, "issues": []},
  "sources": [
    {"document": "https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/chapter.md#L306-L317", "provenance": "rewritten"},
    {"document": "https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/练习题答案.md#L3-L5", "provenance": "reflow"}
  ]
}
+++
%%% stem
练习题 8.1：三个进程的起始和结束时间如下。若一个进程在另一个进程结束前开始，则称它们并发运行。对每对进程选择是否并发。

| 进程 | 起始时间 | 结束时间 |
|---|---:|---:|
| A | 0 | 2 |
| B | 1 | 4 |
| C | 3 | 5 |

| 进程对 | 是否并发 |
|---|---|
| AB | {{blank:ab}} |
| AC | {{blank:ac}} |
| BC | {{blank:bc}} |
%%% reference
AB 与 BC 的时间区间重叠，AC 不重叠。
