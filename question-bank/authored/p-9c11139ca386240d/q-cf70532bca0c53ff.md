+++json
{
  "schemaVersion": "5",
  "id": "q-cf70532bca0c53ff",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 33,
  "number": {
    "display": "Lab 任务 33",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "33",
      "value": "33"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "memory_hierarchy",
    "moduleIds": [
      "memory_hierarchy"
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
      "legacyId": "q-cf70532bca0c53ff",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 710,
        "end": 717
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/710.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "csim 解析 M 操作时按 L+S 处理"
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
33. （2分）根据CacheLab Part A 的编程规则和提示，当缓存模拟器 `(csim.c)` 解
析到一行 M（数据修改）操作时，它应该如何处理？
%%% reference
答案：B

解析：trace 格式里 M 表示 data modify，即"一次数据加载 L 紧跟一次数据存储 S"，所以要按两次访问处理：两次都可能命中，也可能第一次未命中（伴随一次可能的淘汰）而第二次命中，故 B 对。A 把它当单次访问、C 直接忽略、D 只看成 S，都不符合 writeup。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
将其视为单次内存访问，最多导致一次缓存未命中 (miss) 和一次可能的淘汰
(eviction)
%%% option: B
将其视为一次数据加载 (L) 和紧随其后的一次数据存储 (S) 。这可能导致两次
命中，或者一次未命中和一次命中（可能伴随淘汰）
%%% option: C
忽略此操作，因为实验只关心数据加载 (L) 和数据存储 (S) 操作
%%% option: D
只将其视为一次数据存储 (S) 操作，因为数据最终被修改了
