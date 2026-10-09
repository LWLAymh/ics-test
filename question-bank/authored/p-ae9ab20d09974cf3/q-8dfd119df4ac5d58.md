+++json
{
  "schemaVersion": "5",
  "id": "q-8dfd119df4ac5d58",
  "revision": 1,
  "paperId": "p-ae9ab20d09974cf3",
  "paperOrder": 9,
  "number": {
    "display": "第一题 9",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "9",
      "value": "9"
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
      "legacyId": "q-8dfd119df4ac5d58",
      "document": "原文/期末/2024期末-带答案.md",
      "lines": {
        "start": 283,
        "end": 298
      },
      "curated": "_curated/期末/2024期末-带答案/283.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "页表/TLB/CR3 与大页下的多级页表"
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
      "A",
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
9. 关于虚拟地址和物理地址的转换，下列说法错误的是：（多选）
%%% reference
答案：AD
A. 错误，在现代计算机中，操作系统（如Linux）通过页表实现虚拟地址到物理
地址的映射，而非物理地址到虚拟地址的映射。
B. TLB 是一种专用的硬件缓存，存储最近访问的虚拟地址到物理地址的映射，
CPU可以快速找到对应的物理地址而无需访问内存，
C.  $2\mathrm{MB}/4\mathrm{KB}=2^9$，原来是四级页表；$9 \times 4 + 12 = 48$，使用大页后变为
$9 \times 3 + (9 + 12) = 48$，可以少用一级页表，提高性能
D. 错误，CR3寄存器用于保存一级页表的物理地址，而非虚拟地址。
%%% option: A
在x86-64 Linux虚拟内存中，物理地址到虚拟地址的映射是通过页表实现
的。
%%% option: B
TLB用于缓存虚拟地址到物理地址的映射，以加速地址转换。
%%% option: C
某x86-64 Linux中页大小为 4KB，每个页表条目为 8 字节，每个页表占
据一页（即 4KB），使用 48 位虚拟地址和 44 位物理地址。如果支持大页（2MB
页），可以减少1级页表。
%%% option: D
Intel Core i7体系结构中的CR3寄存器用于保存一级页表的虚拟地址。
