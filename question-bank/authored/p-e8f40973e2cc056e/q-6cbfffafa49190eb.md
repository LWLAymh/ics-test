+++json
{
  "schemaVersion": "5",
  "id": "q-6cbfffafa49190eb",
  "revision": 2,
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
22. 关于 x86 风格系统的 TLB，下列说法哪些正确？这里的page fault（#PF）包括页面不存在和权限检查引起的保护异常，不只指需要从磁盘调入页面的情形。
%%% reference
答案：AB
解析：TLB缓存地址翻译及权限等信息，命中时通常不必遍历内存页表，AB正确。带地址空间标识的TLB不一定在每次进程切换时整体清空，C过于绝对；D忽视访问模式。命中一条已有翻译后，访问权限不允许仍可引发保护性的#PF，因此E也过于绝对。不能用“TLB缓存了valid=0的不存在页面”解释E；正常TLB通常不会把不存在页的无效PTE作为可用翻译缓存。
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
