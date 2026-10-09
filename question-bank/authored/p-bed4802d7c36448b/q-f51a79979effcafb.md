+++json
{
  "schemaVersion": "5",
  "id": "q-f51a79979effcafb",
  "revision": 1,
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
```
  struct {
  union {
      short s1;
      char c[3];
  } u;
  double d;
  short s2;
  } s;
```
考虑使用GCC默认选项进行编译，下列逻辑表达式为真的是：
%%% reference
答案：C
`sizeof s.u`应为4。
%%% option: A
`sizeof s.u == 3`
%%% option: B
`sizeof s.u == 8`
%%% option: C
`(&s.s2 - &s.u.s1) == 8`
%%% option: D
`(&s.s2 - &s.u.s1) == 16`
