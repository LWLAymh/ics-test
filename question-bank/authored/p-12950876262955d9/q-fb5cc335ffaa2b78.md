+++json
{
  "schemaVersion": "5",
  "id": "q-fb5cc335ffaa2b78",
  "revision": 2,
  "paperId": "p-12950876262955d9",
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
      "legacyId": "q-fb5cc335ffaa2b78",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 188,
        "end": 205
      },
      "curated": "_curated/期中/2022期中-带答案/188.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "RISC/CISC的ISA特征描述"
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
11.下列 4 组对于 ISA 的描述, 它们分别符合(a)\_\_\_\_\_, (b)\_\_\_\_\_\_,
(c)______, (d)______, 的特点.

(a) 某ISA中, 所有指令均不采用条件码

(b) 某ISA中, 只有基址和偏移量寻址

(c) 某ISA中, 执行一些指令需要经过复杂的译码电路

(d) 某ISA中, 指令长度最短1字节, 最长15字节以上
%%% reference
答案：B
不采用条件码, 符合RISC指令的特征. 只有基址和偏移量寻址, 寻址模式单一, 也
符合RISC的描述. 具有复杂指令且需要经过复杂译码电路, 符合CISC的特征. 指
令长度可变并且变化范围达到最少1字节最长15字节, 只能是CISC
%%% option: A
RISC, CISC, CISC, RISC
%%% option: B
RISC, RISC, CISC, CISC
%%% option: C
CISC, RISC, RISC, CISC
%%% option: D
CISC, CISC, RISC, RISC
