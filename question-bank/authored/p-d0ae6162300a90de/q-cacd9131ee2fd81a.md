+++json
{
  "schemaVersion": "5",
  "id": "q-cacd9131ee2fd81a",
  "revision": 2,
  "paperId": "p-d0ae6162300a90de",
  "paperOrder": 3,
  "number": {
    "display": "选择题 3",
    "major": {
      "display": "选择题",
      "value": null
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
      "legacyId": "q-cacd9131ee2fd81a",
      "document": "原文/期中/2013期中-带答案.md",
      "lines": {
        "start": 37,
        "end": 44
      },
      "curated": "_curated/期中/2013期中-带答案/37.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "浮点数就近偶数舍入到小数点后两位"
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
      "D"
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
3、 对 `x = 1⅛` 和 `y = 1⅜` 进行小数点后两位取整（rounding to nearest even），结果正确的是
%%% reference
答案：D
`x = 1.00100₂  half way and down --> 1.00`
`y = 1.01100₂  half way and up-->1.10`
%%% option: A
1¼, 1¼
%%% option: B
1, 1¼
%%% option: C
1¼, 1½
%%% option: D
1, 1½
