+++json
{
  "schemaVersion": "5",
  "id": "q-31a026ec4bb13cfd",
  "revision": 1,
  "paperId": "p-d72f88c4198cf267",
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
      "legacyId": "q-31a026ec4bb13cfd",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 173,
        "end": 179
      },
      "curated": "_curated/期中/2020期中-带答案/173.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "cache 替换策略与相联度对命中率影响"
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
11、以下关于缓存的说法中，正确的是:
%%% reference
答案：D
答案为D，LRU有可能比MRU更差；先入先出可能比随机差；保持缓存容量、缓
存块大小（B）不变，增加路数（E），命中率可能下降
%%% option: A
LRU不会比MRU（most-recently used）替换策略差
%%% option: B
先入先出（FIFO）比随机替换命中率高
%%% option: C
保持缓存容量、缓存块大小（B）不变，增加路数（E），命中率不会下降
%%% option: D
以上说法都不正确
