+++json
{
  "schemaVersion": "5",
  "id": "q-b127d0d7bfcddecd",
  "revision": 2,
  "paperId": "p-4486554924f4e320",
  "paperOrder": 16,
  "number": {
    "display": "第一题 16",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "16",
      "value": "16"
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
      "legacyId": "q-b127d0d7bfcddecd",
      "document": "原文/期中/2014期中-带答案.md",
      "lines": {
        "start": 273,
        "end": 288
      },
      "curated": "_curated/期中/2014期中-带答案/273.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "cache miss rate 与 S/E/B、替换策略关系"
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
      "B",
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
16、关于 cache 的 miss rate，下面那种说法是错误的。
%%% reference
答案：BC


注：实际答案 B 的说法也是有错误的。例如：保持总容量和 B 不变，提高 E，就意味着以前的两组可能并成一组。假设 A 和 B 组并成了新的一组。现在假设有一个访问序列 b1, b2, a1, a2, a3, ..., an, b1, b2。其中 bi 是会被放到 B 组的块，ai 是会被放到 A 组的块。n 足够大使得可以把合并后的组中的所有块都换出去。那么按合并后的情况全部都不命中，而按合并前的情况最后两次访问 b1, b2 仍然能命中。

因此，B、C 均应选择。
%%% option: A
保持 E 和 B 不变，增大 S，miss rate 一定不会增加
%%% option: B
保持总容量和 B 不变，提高 E，miss rate 一定不会增加
%%% option: C
保持总容量和 E 不变，提高 B，miss rate 一定不会增加
%%% option: D
如果不采用"LRU"，使用"随机替换策略"，miss rate 可能会降低
