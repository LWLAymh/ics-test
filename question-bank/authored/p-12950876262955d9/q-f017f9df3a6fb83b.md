+++json
{
  "schemaVersion": "5",
  "id": "q-f017f9df3a6fb83b",
  "revision": 1,
  "paperId": "p-12950876262955d9",
  "paperOrder": 12,
  "number": {
    "display": "第一题 12",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "12",
      "value": "12"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "processor_arch",
    "moduleIds": [
      "processor_arch"
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
      "legacyId": "q-f017f9df3a6fb83b",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 206,
        "end": 212
      },
      "curated": "_curated/期中/2022期中-带答案/206.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "组合逻辑电路对应的HCL表达式"
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
12.对应下述组合电路的正确HCL表达式为：

![组合电路图](assets/期中/2022期中-带答案/p6-img1.jpg)
%%% reference
答案：D；本体主要考察组合逻辑电路和HCL表达式。逻辑电路由2个或门、1个
与门、1个反向器构成，难度较易。
%%% option: A
`Bool out = ( a && b) || (!a && c)`
%%% option: B
`Bool out = (!a && b) || ( a && c)`
%%% option: C
`Bool out = ( a || b) && ( a || c)`
%%% option: D
`Bool out = ( a || b) && (!a || c)`
