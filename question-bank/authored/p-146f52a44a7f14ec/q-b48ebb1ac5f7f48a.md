+++json
{
  "schemaVersion": "5", "id": "q-b48ebb1ac5f7f48a", "revision": 1, "paperId": "p-146f52a44a7f14ec", "paperOrder": 1,
  "number": {"display": "8.1", "major": {"display": "第 8 章", "value": "8"}, "minor": {"display": "8.1", "value": "1"}, "parts": []},
  "classification": {"primaryModuleId": "ecf_and_system_io", "moduleIds": ["ecf_and_system_io"], "tags": ["csapp", "practice", "chapter-8"]},
  "type": "single-choice", "stem": {"format": "markdown"},
  "options": [{"id": "A", "content": {"format": "markdown"}}, {"id": "B", "content": {"format": "markdown"}}, {"id": "C", "content": {"format": "markdown"}}, {"id": "D", "content": {"format": "markdown"}}],
  "solution": {"state": "available", "grading": "choice", "correctOptionIds": ["B"], "reference": {"format": "markdown"}, "provenance": {"origin": "unknown", "crossChecked": null, "note": "答案取自来源仓库的《练习题答案.md》，未另行交叉复核。"}},
  "publication": {"state": "published", "basis": "source-import", "reviewer": null, "reviewedAt": null, "issues": []},
  "sources": [
    {"document": "https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/chapter.md#L306-L317", "provenance": "rewritten"},
    {"document": "https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/练习题答案.md#L3-L5", "provenance": "reflow"}
  ]
}
+++
%%% stem
三个进程的起始和结束时间如下：A：0–2，B：1–4，C：3–5。对于每对进程，若一个进程在另一个进程结束前开始，则称它们并发运行。哪些进程对并发？
%%% reference
A 与 B 的执行区间重叠，B 与 C 的执行区间重叠；A 在 C 开始前已结束。因此并发的进程对是 AB 和 BC。
%%% option: A
只有 AB。
%%% option: B
AB 和 BC。
%%% option: C
AC 和 BC。
%%% option: D
AB、AC 和 BC。
