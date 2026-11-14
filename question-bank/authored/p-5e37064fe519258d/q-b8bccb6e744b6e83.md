+++json
{
  "schemaVersion": "5",
  "id": "q-b8bccb6e744b6e83",
  "revision": 2,
  "paperId": "p-5e37064fe519258d",
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
      "legacyId": "q-b8bccb6e744b6e83",
      "document": "原文/期中/2017期中-带答案.md",
      "lines": {
        "start": 116,
        "end": 120
      },
      "curated": "_curated/期中/2017期中-带答案/116.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "union 与整数的小端字节序"
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
      "B"
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
8.  在x86-64架构下，有如下变量：

```c
union {
    char c[8];
    int i;
} x;
```

采用x86-64的小端法、32位int，赋值 `x.i=0x41424344` 后，按字节查看对象表示，`x.c[2]`的值为多少（ASCII中 `'A'=0x41`）？源卷union声明的逗号已修为分号。
%%% reference
答案：B
%%% option: A
‘A’
%%% option: B
‘B’
%%% option: C
‘C’
%%% option: D
‘D’
