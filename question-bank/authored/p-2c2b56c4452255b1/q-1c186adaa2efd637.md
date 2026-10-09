+++json
{
  "schemaVersion": "5",
  "id": "q-1c186adaa2efd637",
  "revision": 1,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 4,
  "number": {
    "display": "第一题 4",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "4",
      "value": "4"
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
      "legacyId": "q-1c186adaa2efd637",
      "document": "原文/期末/2021期末-无答案.md",
      "lines": {
        "start": 79,
        "end": 101
      },
      "curated": "_curated/期末/2021期末-无答案/79.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "PIPE 中无前递时的数据冒险判定"
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
4. 在Y86-64 PIPE处理器中（不考虑数据前递），以下哪个指令序列会造成
数据冒险？
%%% reference
答案：D
%%% option: A
```asm
irmovq $10, %rdx
addq %rdx, %rax
```
%%% option: B
```asm
irmovq $10, %rdx
nop
addq %rdx, %rax
```
%%% option: C
```asm
irmovq $10, %rdx
nop
nop
addq %rdx, %rax
```
%%% option: D
以上三个选项都会引发数据冒险
