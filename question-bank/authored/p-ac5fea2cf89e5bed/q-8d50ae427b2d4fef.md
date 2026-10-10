+++json
{
  "schemaVersion": "5",
  "id": "q-8d50ae427b2d4fef",
  "revision": 2,
  "paperId": "p-ac5fea2cf89e5bed",
  "paperOrder": 14,
  "number": {
    "display": "第一题 14",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "14",
      "value": "14"
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
      "legacyId": "q-8d50ae427b2d4fef",
      "document": "原文/期末/2013期末-带答案.md",
      "lines": {
        "start": 174,
        "end": 180
      },
      "curated": "_curated/期末/2013期末-带答案/174.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "隐式空闲链表分配器的适配、吞吐与对齐"
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
14、用带有header和footer的隐式空闲链表实现分配器时，如果一个应用请
求一个3字节的块，下列说法哪一项是错误的？
%%% reference
答案：D，malloc在64位机器上返回的地址应该按16字节对齐。
%%% option: A
搜索空闲链表时，存储利用率为：`best fit > next fit > first fit`
%%% option: B
搜索空闲链表时，吞吐率为：`next fit > first fit > best fit`
%%% option: C
在x86机器上，`malloc(3)`实际分配的空闲块大小可能为`8`字节
%%% option: D
在x64机器上，`malloc(3)`返回的地址可能为`2147549777`
