+++json
{
  "schemaVersion": "5",
  "id": "q-cca8c4a35fd60fb0",
  "revision": 1,
  "paperId": "p-0fe6817c7f881573",
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
      "legacyId": "q-cca8c4a35fd60fb0",
      "document": "原文/期中/2024期中-带答案.md",
      "lines": {
        "start": 69,
        "end": 82
      },
      "curated": "_curated/期中/2024期中-带答案/69.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "float阶码/小数位位数与可表示实数数量"
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
3. 我们熟悉的标准浮点格式 `float` 共有 32 位，其阶码字段和小数字段分别为 $k=8$ 位和 $n=23$ 位。如果保持 `float` 的总位数不变，但将阶码字段改为 $k'=10$ 位，则下列说法中正确的是：
%%% reference
答案：A。
修改后，阶码字段增加，小数字段减少，可以表示的NaN的数量减少，所以能表示
的实数值增多。
%%% option: A
修改后能表示的实数值的数量更多了
%%% option: B
修改后能表示的实数值的数量不变
%%% option: C
修改后能表示的实数值的数量更少了
%%% option: D
无法确定
