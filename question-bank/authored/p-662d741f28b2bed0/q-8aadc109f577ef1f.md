+++json
{
  "schemaVersion": "5",
  "id": "q-8aadc109f577ef1f",
  "revision": 1,
  "paperId": "p-662d741f28b2bed0",
  "paperOrder": 1,
  "number": {
    "display": "第一题 1",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "1",
      "value": "1"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog"
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
      "legacyId": "q-8aadc109f577ef1f",
      "document": "原文/期中/2016期中-带答案.md",
      "lines": {
        "start": 48,
        "end": 52
      },
      "curated": "_curated/期中/2016期中-带答案/48.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "会改变条件码 CF 的指令辨析"
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
1. 在下列指令中，其执行会影响条件码中的 `CF` 位的是：
%%% reference
答案：D
%%% option: A
`jmp NEXT`
%%% option: B
`jc NEXT`
%%% option: C
`inc %bx`
%%% option: D
`shl $1, %ax`
