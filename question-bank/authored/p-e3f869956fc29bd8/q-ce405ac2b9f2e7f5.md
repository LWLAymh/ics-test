+++json
{
  "schemaVersion": "5",
  "id": "q-ce405ac2b9f2e7f5",
  "revision": 1,
  "paperId": "p-e3f869956fc29bd8",
  "paperOrder": 8,
  "number": {
    "display": "第一题 8",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "8",
      "value": "8"
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
      "legacyId": "q-ce405ac2b9f2e7f5",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 159,
        "end": 166
      },
      "curated": "_curated/期末/2018期末-带答案/159.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "同一页内两变量的物理地址关系"
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
8.  假定整型变量A的虚拟地址空间为`0x12345cf0`，另一整形变量B的虚拟地
址`0x12345d98`，假定一个page的长度为`0x1000 byte`，A的物理地址数值
和B的物理地址数值关系应该为：
%%% reference
答案：B 考察物理地址和虚拟地址的映射关系 同一个page
%%% option: A
A的物理地址数值始终大于B的物理地址数值
%%% option: B
A的物理地址数值始终小于B的物理地址数值
%%% option: C
A的物理地址数值和B的物理地址数值大小取决于动态内存分配策略，
%%% option: D
无法判定两个物理地址值的大小
