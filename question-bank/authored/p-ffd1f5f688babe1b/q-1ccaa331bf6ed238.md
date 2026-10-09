+++json
{
  "schemaVersion": "5",
  "id": "q-1ccaa331bf6ed238",
  "revision": 1,
  "paperId": "p-ffd1f5f688babe1b",
  "paperOrder": 6,
  "number": {
    "display": "第一题 6",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "6",
      "value": "6"
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
      "legacyId": "q-1ccaa331bf6ed238",
      "document": "原文/期中/2021期中-带答案.md",
      "lines": {
        "start": 129,
        "end": 136
      },
      "curated": "_curated/期中/2021期中-带答案/129.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "movabsq/INC/popq/call 指令语义辨析"
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
6.以下关于x86-64指令的描述，说法正确的是：
%%% reference
答案：B
解析： 数`Imm`放到目的地址`(%rax)`中。A中`movabsq`的目的操作数只能是寄存器，C中`%rax`的值即为跳转目标，D中等效于`movq (%rsp), %rax; addq $8, %rsp`。
%%% option: A
数据传送指令 `movabsq $Imm, (%rax)` 将以64位二进制补码表示的立即数 Imm 放到目的地址 `(%rax)` 中。
%%% option: B
`INC`和`DEC`指令会设置溢出标志`OF`和零标志`ZF`，但不会改变进位标志`CF`。
%%% option: C
`call *%rax` 指令以 `%rax` 中的值作为读地址，从内存中读出调用目标。
%%% option: D
`popq %rax` 指令的行为等效于 `movq %rsp, %rax; addq $8, %rsp`。
