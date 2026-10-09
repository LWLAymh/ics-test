+++json
{
  "schemaVersion": "5",
  "id": "q-c4bd0bdf31a6406e",
  "revision": 1,
  "paperId": "p-5e37064fe519258d",
  "paperOrder": 11,
  "number": {
    "display": "第一题 11",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "11",
      "value": "11"
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
      "legacyId": "q-c4bd0bdf31a6406e",
      "document": "原文/期中/2017期中-带答案.md",
      "lines": {
        "start": 146,
        "end": 152
      },
      "curated": "_curated/期中/2017期中-带答案/146.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "流水线与数据冒险描述辨析"
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
11. 关于流水线技术的描述，错误的是:
%%% reference
答案：C
%%% option: A
流水线技术能够提高执行指令的吞吐率，但也同时增加单条指令的执行时间
%%% option: B
增加流水线级数，不一定能获得总体性能的提升
%%% option: C
指令间数据相关引发的数据冒险，不一定可以通过暂停流水线来解决。
%%% option: D
流水级划分应尽量均衡，吞吐率会受到最慢的流水级影响，均衡的流水线能提
高吞吐量。
