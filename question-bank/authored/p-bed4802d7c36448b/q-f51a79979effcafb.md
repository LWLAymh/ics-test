+++json
{
  "schemaVersion": "5",
  "id": "q-f51a79979effcafb",
  "revision": 2,
  "paperId": "p-bed4802d7c36448b",
  "paperOrder": 8,
  "number": {
    "display": "第一题 8",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "8",
      "value": "8"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog"
    ],
    "tags": []
  },
  "publication": {
    "state": "published",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": []
  },
  "sources": [
    {
      "legacyId": "q-f51a79979effcafb",
      "document": "原文/期中/2023期中-带答案.md",
      "lines": {
        "start": 165,
        "end": 180
      },
      "curated": "_curated/期中/2023期中-带答案/165.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "struct/union对齐与成员偏移"
    }
  ],
  "type": "single-choice",
  "stem": {
    "format": "markdown"
  },
  "solution": {
    "state": "available",
    "grading": "choice",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    },
    "correctOptionIds": [
      "C"
    ]
  },
  "options": [
    {
      "id": "A",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "B",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "C",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "D",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
8.在x86-64架构、Linux操作系统下，有如下C定义。
```c
struct {
    union {
        short s1;
        char c[3];
    } u;
    double d;
    short s2;
} s;
```
考虑使用 GCC 默认的 x86-64 System V 布局，下列逻辑表达式为真的是？

> 题面约定：原卷 C、D 项用跨结构成员的 `short *` 相减考查偏移。这里把它理解为“两个成员的字节地址之差除以 `sizeof(short)`”，不把它当作合法 ISO C 指针相减程序来执行。
%%% reference
答案：C
`sizeof s.u` 为4；`s.d` 在偏移8，`s.s2` 在偏移16。按题面明确的地址差模型，`16 / sizeof(short) = 8`，故选 C。严格 ISO C 中，这两个成员不是同一数组元素，不能直接用跨成员指针相减得到可移植结论。
%%% option: A
`sizeof s.u == 3`
%%% option: B
`sizeof s.u == 8`
%%% option: C
`(&s.s2 - &s.u.s1) == 8`
%%% option: D
`(&s.s2 - &s.u.s1) == 16`
