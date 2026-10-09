+++json
{
  "schemaVersion": "5",
  "id": "q-cc38d1d63ae5f11e",
  "revision": 1,
  "paperId": "p-98acf19964247e22",
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
      "legacyId": "q-cc38d1d63ae5f11e",
      "document": "原文/期末/2019期末-无答案.md",
      "lines": {
        "start": 125,
        "end": 130
      },
      "curated": "_curated/期末/2019期末-无答案/125.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "多级页表层数的计算"
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
11. 已知某系统页面长2KB，页表项8字节，采用多层分页策略映射48位虚
拟地址空间。若限定最高层页表占1页，则它可以采用多少层的分页策略？
%%% reference
答案：C（来源：2019、2020期末-答案解析）
解析：页面 2KB → VPO 11 位；页表项 8B 且页表占满一页 → 每级 `2KB/8B = 256` 个 PTE → 每级 8 位；`48-11 = 37` 位 VPN，至少 `ceil(37/8) = 5` 级。
%%% option: A
3层
%%% option: B
4层
%%% option: C
5层
%%% option: D
6层
