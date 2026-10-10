+++json
{
  "schemaVersion": "5",
  "id": "q-49e2ba2fc68bee01",
  "revision": 2,
  "paperId": "p-089627b27e9b5e79",
  "paperOrder": 2,
  "number": {
    "display": "第一题 2",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "2",
      "value": "2"
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
      "legacyId": "q-49e2ba2fc68bee01",
      "document": "原文/期末/2014期末-带答案.md",
      "lines": {
        "start": 52,
        "end": 62
      },
      "curated": "_curated/期末/2014期末-带答案/52.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "算术右移与除法舍入的等价性"
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
2.  假设有下面`x`和`y`的程序定义
```
int x = a >> 2;
int y = (x + a) / 4;
```
那么有多少个位于闭区间[-8,8]的整数`a`能使得`x`和`y`相等？
%%% reference
答案：B
%%% option: A
12
%%% option: B
13
%%% option: C
14
%%% option: D
15
