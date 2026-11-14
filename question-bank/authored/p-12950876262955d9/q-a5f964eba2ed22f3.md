+++json
{
  "schemaVersion": "5",
  "id": "q-a5f964eba2ed22f3",
  "revision": 2,
  "paperId": "p-12950876262955d9",
  "paperOrder": 13,
  "number": {
    "display": "第一题 13",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "13",
      "value": "13"
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
      "legacyId": "q-a5f964eba2ed22f3",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 213,
        "end": 219
      },
      "curated": "_curated/期中/2022期中-带答案/213.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "三级流水线吞吐量计算"
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
13. 将一个延迟为300ps的组合逻辑均匀划分为三级流水线，每级时钟寄存器延迟为20ps。假设没有暂停、每周期可接收一条新指令，则流水线稳定运行时的吞吐量为：
%%% reference
答案：B；1 / (100ps + 20ps) = 8.33GIPS
%%% option: A
10GIPS
%%% option: B
8.33GIPS
%%% option: C
3.33GIPS
%%% option: D
2.77GIPS
