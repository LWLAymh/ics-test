+++json
{
  "schemaVersion": "5",
  "id": "q-df2d7d75bbdc534d",
  "revision": 2,
  "paperId": "p-662d741f28b2bed0",
  "paperOrder": 7,
  "number": {
    "display": "第一题 7",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "7",
      "value": "7"
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
      "legacyId": "q-df2d7d75bbdc534d",
      "document": "原文/期中/2016期中-带答案.md",
      "lines": {
        "start": 90,
        "end": 94
      },
      "curated": "_curated/期中/2016期中-带答案/90.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "lea 求数组元素地址"
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
7.  已知短整型数组S的起始地址和下标i分别存放在寄存器`%rdx`和`%rcx`，将
`&S[i]`存放在寄存器`%rax`中所对应的汇编代码是
%%% reference
答案：C
%%% option: A
`leaq (%rdx, %rcx, 1), %rax`
%%% option: B
`movw (%rdx, %rcx, 2), %rax`
%%% option: C
`leaq (%rdx, %rcx, 2), %rax`
%%% option: D
`movw (%rdx, %rcx, 1), %rax`
