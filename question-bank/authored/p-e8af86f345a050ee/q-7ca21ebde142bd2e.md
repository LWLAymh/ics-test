+++json
{
  "schemaVersion": "5", "id": "q-7ca21ebde142bd2e", "revision": 1, "paperId": "p-e8af86f345a050ee", "paperOrder": 1,
  "number": {"display": "7.1", "major": {"display": "第 7 章", "value": "7"}, "minor": {"display": "7.1", "value": "1"}, "parts": []},
  "classification": {"primaryModuleId": "compilation_linking", "moduleIds": ["compilation_linking"], "tags": ["csapp", "practice", "chapter-7"]},
  "type": "single-choice", "stem": {"format": "markdown"},
  "options": [{"id": "A", "content": {"format": "markdown"}}, {"id": "B", "content": {"format": "markdown"}}, {"id": "C", "content": {"format": "markdown"}}, {"id": "D", "content": {"format": "markdown"}}],
  "solution": {"state": "available", "grading": "choice", "correctOptionIds": ["B"], "reference": {"format": "markdown"}, "provenance": {"origin": "unknown", "crossChecked": null, "note": "答案取自来源仓库的《练习题答案.md》，未另行交叉复核。"}},
  "publication": {"state": "published", "basis": "source-import", "reviewer": null, "reviewedAt": null, "issues": []},
  "sources": [
    {"document": "https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第07章-链接/chapter.md#L259-L294", "provenance": "rewritten", "editorNote": "从原练习 7.1 表格取 bufp0 一行；附上图 7-5 的两个源模块以补全上下文。"},
    {"document": "https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第07章-链接/练习题答案.md#L3-L11", "provenance": "reflow"}
  ]
}
+++
%%% stem
练习题 7.1 的 `swap.c` 模块包含：

```c
extern int buf[];
int *bufp0 = &buf[0];
int *bufp1;
```

关于 `swap.o` 的符号表，`bufp0` 的描述哪项正确？
%%% reference
`bufp0` 是在 `swap.c` 中定义并初始化的全局变量，因此是 `swap.o` 的 `.data` 节中的全局符号，并有 `.symtab` 条目。
%%% option: A
它是 `m.o` 的 `.data` 节中定义的外部符号。
%%% option: B
它是 `swap.o` 的 `.data` 节中定义的全局符号。
%%% option: C
它是 `swap.o` 的 COMMON 节中的全局符号。
%%% option: D
它是局部变量，因此没有 `.symtab` 条目。
