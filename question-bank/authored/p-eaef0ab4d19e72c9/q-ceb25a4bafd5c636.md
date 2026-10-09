+++json
{
  "schemaVersion": "5",
  "id": "q-ceb25a4bafd5c636",
  "revision": 1,
  "paperId": "p-eaef0ab4d19e72c9",
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
      "legacyId": "q-ceb25a4bafd5c636",
      "document": "原文/期中/2018期中-带答案.md",
      "lines": {
        "start": 148,
        "end": 158
      },
      "curated": "_curated/期中/2018期中-带答案/148.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "编译技术/取指速度对 ISA 选择的影响"
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
9.  请比较RISC和CISC的特点，回答下述问题：
假设编译技术处于发展初期，程序员更愿意使用汇编语言编程来解决实际问题，那
么程序员会更倾向于选用          ISA。
假设你设计的处理器速度非常快，但存储系统设计使得取指令的速度非常慢（也许
只是处理单元的十分之一）。这时你会更倾向于选用          ISA。
%%% reference
答案：B
//知识点1：CISC有更多的指令，有些更接近高级语言
//知识点2：CISC的指令功能更复杂，指令执行需要更多的周期，一定程度上可以
平衡处理速度与指令访存的速度差异。不过，通常处理器设计中，主要通过多层次
的存储体系结构来弥补两者之的速度差异。
%%% option: A
RISC、RISC
%%% option: B
CISC、CISC
%%% option: C
RISC、CISC
%%% option: D
CISC、RISC
