+++json
{
  "schemaVersion": "5",
  "id": "q-4ac4bd7dfc349c3f",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 8,
  "number": {
    "display": "一 8",
    "major": {
      "display": "一",
      "value": null
    },
    "minor": {
      "display": "8",
      "value": "8"
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
      "legacyId": "q-4ac4bd7dfc349c3f",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 154,
        "end": 161
      },
      "curated": "_curated/期末/2025期末-无答案/154.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Y86-64 指令编码 regids 与 valC 字段"
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
      "A",
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
    },
    {
      "id": "E",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
8. 在 Y86-64 指令集中，下列哪些指令在指令字节序列中同时包含 regids 字节与
valC 常量字段？
%%% reference
答案：AB
解析：`irmovq/rmmovq/mrmovq` 需要寄存器说明（regids）且需要常量/位移（valC）。`call/jXX` 只有 valC；OPq 只有 regids；`ret` 两者都不需要。
%%% option: A
`irmovq V, rB`
%%% option: B
`rmmovq rA, D(rB)`
%%% option: C
`call Dest`
%%% option: D
`OPq rA, rB`
%%% option: E
`ret`
