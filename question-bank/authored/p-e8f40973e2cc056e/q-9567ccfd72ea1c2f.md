+++json
{
  "schemaVersion": "5",
  "id": "q-9567ccfd72ea1c2f",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 15,
  "number": {
    "display": "二 15",
    "major": {
      "display": "二",
      "value": null
    },
    "minor": {
      "display": "15",
      "value": "15"
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
      "legacyId": "q-9567ccfd72ea1c2f",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 219,
        "end": 224
      },
      "curated": "_curated/期末/2025期末-无答案/219.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "异常四分类与返回行为"
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
      "B",
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
15.关于异常（exception）的细分类型，下列说法哪些正确？
%%% reference
答案：ABD
解析：trap 常见于系统调用，返回到下一条；fault 典型会重启当前指令（例如页故障修好后重新执行触发缺页的那条访存指令），因此 C 错；page fault 是 fault，不是 trap（E 错）。
%%% option: A
Interrupt 通常由外部设备异步触发，处理后回到“下一条指令”
%%% option: B
Trap 通常在CPU内部由执行指令触发，处理后回到“下一条指令”
%%% option: C
Fault 通常表示可以恢复的错误，处理后回到“下一条指令”
%%% option: D
Abort 通常表示不可恢复的错误，程序一般不会继续执行
%%% option: E
执行访存指令引发的缺页异常，属于Trap
