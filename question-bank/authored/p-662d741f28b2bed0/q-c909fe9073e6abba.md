+++json
{
  "schemaVersion": "5",
  "id": "q-c909fe9073e6abba",
  "revision": 2,
  "paperId": "p-662d741f28b2bed0",
  "paperOrder": 9,
  "number": {
    "display": "第一题 9",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "9",
      "value": "9"
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
      "legacyId": "q-c909fe9073e6abba",
      "document": "原文/期中/2016期中-带答案.md",
      "lines": {
        "start": 105,
        "end": 116
      },
      "curated": "_curated/期中/2016期中-带答案/105.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "流水线技术描述辨析"
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
9.  下面对流水线技术的描述，正确的是：
%%% reference
答案：C
%%% option: A
流水线技术不仅能够提高执行指令的吞吐率，还能减少单条指令的执行时
间。
%%% option: B
不断加深流水线级数，总能获得性能上的提升。
%%% option: C
流水级划分应尽量均衡，吞吐率会受到最慢的流水级影响。
%%% option: D
指令间的数据相关可能会引发流水线停顿，但总是可以通过调度指令来解
决。
