+++json
{
  "schemaVersion": "5",
  "id": "q-703874ba6aeb4fff",
  "revision": 2,
  "paperId": "p-d0ae6162300a90de",
  "paperOrder": 10,
  "number": {
    "display": "选择题 10",
    "major": {
      "display": "选择题",
      "value": null
    },
    "minor": {
      "display": "10",
      "value": "10"
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
      "legacyId": "q-703874ba6aeb4fff",
      "document": "原文/期中/2013期中-带答案.md",
      "lines": {
        "start": 101,
        "end": 106
      },
      "curated": "_curated/期中/2013期中-带答案/101.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "流水线吞吐率与数据冒险"
    }
  ],
  "type": "multiple-choice",
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
      "C",
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
10、下面对流水线技术的描述，正确的是：
%%% reference
答案：CD
%%% option: A
流水线技术不仅能够提高执行指令的吞吐率，还能减少单条指令的执行时间。
%%% option: B
不断加深流水线级数，总能获得性能上的提升。
%%% option: C
流水级划分应尽量均衡，吞吐率会受到最慢的流水级影响。
%%% option: D
指令间的数据相关可能会引发数据冒险，可以通过数据转发或暂停流水线来解决。
