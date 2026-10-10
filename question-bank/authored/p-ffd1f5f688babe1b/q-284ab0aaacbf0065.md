+++json
{
  "schemaVersion": "5",
  "id": "q-284ab0aaacbf0065",
  "revision": 2,
  "paperId": "p-ffd1f5f688babe1b",
  "paperOrder": 3,
  "number": {
    "display": "第一题 3",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "3",
      "value": "3"
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
      "legacyId": "q-284ab0aaacbf0065",
      "document": "原文/期中/2021期中-带答案.md",
      "lines": {
        "start": 93,
        "end": 105
      },
      "curated": "_curated/期中/2021期中-带答案/93.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "按位异或循环的规律（位运算）"
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
      "A"
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
3.阅读如下一段代码
```c
int s = 0;
for (int i = 0; i < 32; i++)
    s = s ^ i;
printf("%d", s);
```
问运行这段代码后的输出是什么:
%%% reference
A
%%% option: A
0
%%% option: B
1
%%% option: C
4
%%% option: D
16
