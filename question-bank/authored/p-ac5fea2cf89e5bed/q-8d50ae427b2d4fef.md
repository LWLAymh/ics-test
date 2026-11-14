+++json
{
  "schemaVersion": "5",
  "id": "q-8d50ae427b2d4fef",
  "revision": 3,
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
14、用带有header和footer的隐式空闲链表实现分配器。在32位教材模型中，头/脚各4字节，块按8字节对齐；64位环境采用通常的16字节malloc有效载荷对齐。对一个3字节申请，下列哪项错误？
%%% reference
答案：D，十进制地址2147549777是奇数，不符合给定对齐要求。

原卷A、B将经验上的利用率/吞吐率趋势写成严格固定排序，实际取决于负载与实现；C又把含两个4字节边界标记的最小块写成8字节。题库已将A、B改为可成立的一般描述，并按给定经典布局把C更正为16字节：`4 + 3 + 4 = 11`，向上对齐到16。不要将这些源卷问题隐藏在答案D里。
%%% option: A
best fit可能比first fit或next fit减少某些负载下的浪费，但三者没有对所有负载都成立的严格利用率排序
%%% option: B
在通常的隐式链表中，best fit为找最小合适块可能扫描整表，first fit和next fit则可能提前停止
%%% option: C
在题面32位布局中，`malloc(3)`至少需要16字节的总块空间（含header、footer及填充）
%%% option: D
在x64机器上，`malloc(3)`返回的地址可能为`2147549777`
