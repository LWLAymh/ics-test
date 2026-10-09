+++json
{
  "schemaVersion": "5",
  "id": "q-20afad0be6eb7a61",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 32,
  "number": {
    "display": "Lab 任务 32",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "32",
      "value": "32"
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
      "legacyId": "q-20afad0be6eb7a61",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 704,
        "end": 709
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/704.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "trace 中 I（指令加载）操作应被忽略"
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
32. （2分）在`CacheLab Part A (csim.c)` 中，模拟器需要解析轨迹文件中的内存
访问操作。根据writeup，下列哪个操作类型应该被忽略？
%%% reference
答案：D

解析：writeup 明确说本实验只关心数据缓存，要求模拟器忽略所有以 I 开头的指令取指（instruction load）记录，故 D 对；L（数据加载）、S（数据存储）、M（数据修改）都必须处理。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
M (数据修改)
%%% option: B
L (数据加载)
%%% option: C
S (数据存储)
%%% option: D
I (指令加载)
