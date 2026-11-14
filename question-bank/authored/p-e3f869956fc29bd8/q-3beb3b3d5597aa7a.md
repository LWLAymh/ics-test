+++json
{
  "schemaVersion": "5",
  "id": "q-3beb3b3d5597aa7a",
  "revision": 2,
  "paperId": "p-e3f869956fc29bd8",
  "paperOrder": 3,
  "number": {
    "display": "第一题 3",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "3",
      "value": "3"
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
      "legacyId": "q-3beb3b3d5597aa7a",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 93,
        "end": 101
      },
      "curated": "_curated/期末/2018期末-带答案/93.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "cache 替换策略与 miss 次数下界"
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
3. 缓存为全相联，容量 N 表示可容纳 N 个块（N 为正整数），无预取且仅按访问装入块。下面哪种说法正确？
%%% reference
答案：C
初始为空时，若总共只访问不超过 N 个不同块，LRU 只可能产生不超过 N 次冷缺失。因此 LRU 有 N+1 次缺失说明至少访问了 N+1 个不同块，任何不预取的策略都至少有 N+1 次冷缺失，当然至少两次。原解析“N+2个不同输入”不成立，已更正。
%%% option: A
FIFO的性能总是优于随机替换
%%% option: B
只要按同一顺序反复扫描数组，无论数组有多大，LRU 都能保证较高命中率
%%% option: C
假定cache初始状态为空，若某一输入片段使用LRU造成了N + 1次miss，则
对任意策略至少产生两次miss
%%% option: D
对于同一确定性替换策略，增大N的大小一定减少miss次数
