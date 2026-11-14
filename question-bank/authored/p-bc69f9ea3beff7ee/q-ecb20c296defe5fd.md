+++json
{
  "schemaVersion": "5",
  "id": "q-ecb20c296defe5fd",
  "revision": 2,
  "paperId": "p-bc69f9ea3beff7ee",
  "paperOrder": 13,
  "number": {
    "display": "第一题 13",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "13",
      "value": "13"
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
      "legacyId": "q-ecb20c296defe5fd",
      "document": "原文/期末/2016期末-带答案.md",
      "lines": {
        "start": 208,
        "end": 213
      },
      "curated": "_curated/期末/2016期末-带答案/208.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "虚拟地址与物理地址的位段划分关系"
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
13. 采用教材Core i7地址划分模型：4KB页、64B缓存行、L1有64组，48位虚拟地址的VPN由四个各9位页表索引组成。下列关系中各符号均表示**字段位数**，`+`表示拼接后的位宽之和，并非各字段当前存放的数值之和。哪项不正确？
%%% reference
答案：B (VPN = TLBT + TLBI)
%%% option: A
`VPO = CI + CO`
%%% option: B
`PPN = TLBT + TLBI`
%%% option: C
`VPN1 = VPN2 = VPN3 = VPN4`
%%% option: D
`TLBT + TLBI = VPN`
