+++json
{
  "schemaVersion": "5",
  "id": "q-ddf9fc695c8ac097",
  "revision": 1,
  "paperId": "p-f99ca20e1a729e32",
  "paperOrder": 19,
  "number": {
    "display": "第一题 19",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "19",
      "value": "19"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "virtual_memory_and_malloc",
    "moduleIds": [
      "virtual_memory_and_malloc"
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
      "legacyId": "q-ddf9fc695c8ac097",
      "document": "原文/期末/2020期末-无答案.md",
      "lines": {
        "start": 189,
        "end": 193
      },
      "curated": "_curated/期末/2020期末-无答案/189.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "垃圾收集器根节点的来源节"
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
19.  垃圾收集器的根节点不包括以下哪个节里的数据：
%%% reference
答案：A（来源：2019、2020期末-答案解析）
解析：根节点来自 data、bss、stack 等可能存放指针的区域；代码段中的内容不是根。
%%% option: A
text
%%% option: B
data
%%% option: C
bss
%%% option: D
stack
