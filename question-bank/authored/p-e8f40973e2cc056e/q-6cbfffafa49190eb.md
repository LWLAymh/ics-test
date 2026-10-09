+++json
{
  "schemaVersion": "5",
  "id": "q-6cbfffafa49190eb",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 22,
  "number": {
    "display": "二 22",
    "major": {
      "display": "二",
      "value": null
    },
    "minor": {
      "display": "22",
      "value": "22"
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
      "legacyId": "q-6cbfffafa49190eb",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 322,
        "end": 331
      },
      "curated": "_curated/期末/2025期末-无答案/322.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "TLB 作用、上下文切换与 page fault 关系"
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
22.关于TLB，下列说法哪些正确？
%%% reference
答案：AB
解析：TLB 是“页表项缓存”；TLB miss 会引发页表遍历甚至缺页处理。上下文切换时是否“必须清空”取决于是否有地址空间标识等机制，因此 C 说法太绝对。TLB 命中时，如果有效位为 0，也会导致缺页（E 错误）。
%%% option: A
TLB 本质上是缓存，缓存最近使用的页表条目
%%% option: B
TLB 命中时，CPU 通常无需再访问内存中的页表即可完成地址翻译
%%% option: C
进程上下文切换时 TLB 必须清空，否则会被另一个进程误用
%%% option: D
TLB 的miss rate由页大小决定，与程序访问模式无关
%%% option: E
发生page fault之前必然有一次对应的TLB miss
