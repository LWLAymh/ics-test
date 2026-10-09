+++json
{
  "schemaVersion": "5",
  "id": "q-dfcbb96f576da211",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 4,
  "number": {
    "display": "一 4",
    "major": {
      "display": "一",
      "value": null
    },
    "minor": {
      "display": "4",
      "value": "4"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "data_representation",
    "moduleIds": [
      "data_representation"
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
      "legacyId": "q-dfcbb96f576da211",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 84,
        "end": 99
      },
      "curated": "_curated/期末/2025期末-无答案/84.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "结构体对齐、offsetof 与 sizeof"
    }
  ],
  "type": "multiple-choice",
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
      "A",
      "B",
      "D",
      "E"
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
    },
    {
      "id": "E",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
4. 在 x86-64 常见对齐规则下，给定：
```c
struct S {
    char c;
    int i;
    short s;
    double d;
};
```
下列说法哪些正确？
%%% reference
答案：A, B, D, E
解析：（`d` 需要 8 对齐，导致 `s` 后面填充到 16；重排可显著减少填充）
%%% option: A
`offsetof(struct S, i) == 4`
%%% option: B
`offsetof(struct S, s) == 8`
%%% option: C
`offsetof(struct S, d) == 10`
%%% option: D
`sizeof(struct S) == 24`
%%% option: E
若改为字段顺序 `double d; int i; short s; char c;`，则该结构体大小应该会
变为16
