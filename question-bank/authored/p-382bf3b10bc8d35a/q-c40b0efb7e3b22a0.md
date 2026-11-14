+++json
{
  "schemaVersion": "5",
  "id": "q-c40b0efb7e3b22a0",
  "revision": 2,
  "paperId": "p-382bf3b10bc8d35a",
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
      "legacyId": "q-c40b0efb7e3b22a0",
      "document": "原文/期末/2017期末-无答案.md",
      "lines": {
        "start": 140,
        "end": 144
      },
      "curated": "_curated/期末/2017期末-无答案/140.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "显式/隐式分配器的能力与效率"
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
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
11. 关于动态内存分配，下列说法中正确的是：
%%% reference
答案：C
解析：这里比较的是程序显式管理malloc/free与隐式垃圾收集，不是“显式/隐式空闲链表”两种数据结构。普通C显式分配器须按请求顺序提供块，不能任意搬移调用者持有的块，也不因不可达就自动释放；隐式收集可能有追踪可达性等成本，C是教材的通常性能概括，不是任何实现下的速度定理。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
显式分配器可以重新排列请求顺序，从而最大化内存利用率
%%% option: B
显式分配器可以修改已分配的块，把内容复制到别的位置，从而消除外部碎片
%%% option: C
通常显式分配器会比隐式分配器更快
%%% option: D
C语言中如果某个已分配块不再可达，那它就会被释放并返回给空闲链表
