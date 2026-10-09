+++json
{
  "schemaVersion": "5",
  "id": "q-e6e9e076ae21c4ba",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 16,
  "number": {
    "display": "二 16",
    "major": {
      "display": "二",
      "value": null
    },
    "minor": {
      "display": "16",
      "value": "16"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "ecf_and_system_io",
    "moduleIds": [
      "ecf_and_system_io"
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
      "legacyId": "q-e6e9e076ae21c4ba",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 229,
        "end": 234
      },
      "curated": "_curated/期末/2025期末-无答案/229.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "进程上下文切换的时机与寄存器保存"
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
      "C",
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
16.关于“进程上下文切换（context switch）”，下列说法哪些正确？
%%% reference
答案：ACD
解析：B 错（不一定，有可能还在当前进程）；E 错（切换进程通常意味着切换到另一个地址空间/页表）。
%%% option: A
进程切换通常发生在内核态，由调度器决定下一个运行的进程
%%% option: B
显式调用 `fork()` 就会发生进程切换
%%% option: C
定时器中断（timer interrupt）可能触发调度，从而导致进程切换
%%% option: D
切换进程时需要保存当前进程的寄存器状态，并恢复另一个进程的寄存器状态
%%% option: E
上下文切换不会改变当前进程的虚拟地址空间映射（页表等）
