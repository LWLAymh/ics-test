+++json
{
  "schemaVersion": "5",
  "id": "q-5affb1fbdda946b0",
  "revision": 1,
  "paperId": "p-08e665c0f6e47348",
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
      "legacyId": "q-5affb1fbdda946b0",
      "document": "原文/期末/2015期末-20160104-带答案.md",
      "lines": {
        "start": 250,
        "end": 263
      },
      "curated": "_curated/期末/2015期末-20160104-带答案/250.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "多级分页策略的层数推导"
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
16. 已知某系统页面长8KB，页表项4字节，采用多层分页策略映射64位虚拟地
址空间。若限定最高层页表占1页，则它可以采用多少层的分页策略？
%%% reference
答案：C。由题意，64位虚拟地址的虚拟空间大小为 $2^{64}$。页面长为8KB，页表项4
字节，所以一个页面可存放2K个表项。由于最高层页表占1页，也就是说其页表
项个数最多为2K个，每一项对应一页，每页又可存放2K个页表项，依次类推可
知，采用的分页层数为：5层。
%%% option: A
3层
%%% option: B
4层
%%% option: C
5层
%%% option: D
6层
