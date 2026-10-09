+++json
{
  "schemaVersion": "5",
  "id": "q-3beb3b3d5597aa7a",
  "revision": 1,
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
3.  下面关于缓存替换策略的说法哪个是正确的(N为cache的大小)
%%% reference
答案：C
 (至少有N+2个不同的输入，第一次一定miss，后N次一定与第一次换入的不同，
至少也有一次miss)
%%% option: A
FIFO的性能总是优于随机替换
%%% option: B
LRU适用于数组的顺序访问
%%% option: C
假定cache初始状态为空，若某一输入片段使用LRU造成了N + 1次miss，则
对任意策略至少产生两次miss
%%% option: D
对于同一确定性替换策略，增大N的大小一定减少miss次数
