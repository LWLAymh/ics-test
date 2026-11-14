+++json
{
  "schemaVersion": "5",
  "id": "q-5f869c9dbc978cec",
  "revision": 2,
  "paperId": "p-5e37064fe519258d",
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
      "legacyId": "q-5f869c9dbc978cec",
      "document": "原文/期中/2017期中-带答案.md",
      "lines": {
        "start": 55,
        "end": 60
      },
      "curated": "_curated/期中/2017期中-带答案/55.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "补码加法溢出与位运算表示逻辑"
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
2. 按教材固定字长补码、溢出截断的位运算模型（不按严格C有符号溢出UB），以下说法正确的是哪项？逻辑与或非指布尔位上的与、或、非。
%%% reference
答案：C
%%% option: A
负数加上负数结果都为负数
%%% option: B
正数加上正数结果都为正数
%%% option: C
用 `&` 和 `~` 可以表示所有的逻辑与或非操作。
%%% option: D
用 `&` 和 `|` 可以表示所有的逻辑与或非操作。
