+++json
{
  "schemaVersion": "5",
  "id": "q-1c186adaa2efd637",
  "revision": 3,
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
4. 在Y86-64 PIPE处理器中，不考虑数据前递，也不使用同周期W阶段写回到D阶段读取的旁路；D阶段必须等写回后的下一周期才能读取新值。以下哪个指令序列会造成数据冒险？
%%% reference
答案：D

生产者在W阶段写回时，只有两个 `nop` 的选项C已经到D阶段，仍读不到新值；三个序列都需要暂停。明确同周期寄存器读写约定，避免将另一种寄存器堆时序模型混入本题。
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
