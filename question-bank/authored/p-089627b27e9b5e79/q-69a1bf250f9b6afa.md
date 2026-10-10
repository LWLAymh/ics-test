+++json
{
  "schemaVersion": "5",
  "id": "q-69a1bf250f9b6afa",
  "revision": 3,
  "paperId": "p-089627b27e9b5e79",
  "paperOrder": 20,
  "number": {
    "display": "第一题 20",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "20",
      "value": "20"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "concurrent_programming",
    "moduleIds": [
      "concurrent_programming"
    ],
    "tags": []
  },
  "publication": {
    "state": "review",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": [
      "selection-multiplicity-unresolved"
    ]
  },
  "sources": [
    {
      "legacyId": "q-69a1bf250f9b6afa",
      "document": "原文/期末/2014期末-带答案.md",
      "lines": {
        "start": 313,
        "end": 339
      },
      "curated": "_curated/期末/2014期末-带答案/313.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "并发轨迹线安全/不安全判定"
    }
  ],
  "type": "unclassified-choice",
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
20. 两个线程中共享如下一段C代码：
```
         for (j = 0;  j < N;  j++)
                count += 2;
```
假设其对应的汇编代码如下：
```
    movq  (%rdi), %rcx
    testq %rcx,%rcx
    jle   .L2                       Hi
    movl  $0, %eax
.L3:
    movq  count(%rip),%rdx       Li
    addq  $2, %rdx                 Ui
    movq  %rdx, count(%rip)      Si
    addq  $1, %rax
    cmpq  %rcx, %rax              Ti
    jne   .L3
.L2:
```
请问在下列指令顺序对应的轨迹线中，哪一个是安全轨迹线？
%%% reference
答案：C
考查两个并发线程指令执行序列是否会导致不安全轨迹线。
%%% option: A
H1，H2，`L2`，L1，U2，U1，S1，S2，T1，T2
%%% option: B
H1，L1，U1，H2，`L2`，S1，T1，U2，S2，T2
%%% option: C
H2，`L2`，U2，H1，S2，L1，T2，U1，S1，T1
%%% option: D
H2，`L2`，H1，L1，U1，U2，S2，T2，S1，T1
