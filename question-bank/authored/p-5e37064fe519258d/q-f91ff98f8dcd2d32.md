+++json
{
  "schemaVersion": "5",
  "id": "q-f91ff98f8dcd2d32",
  "revision": 2,
  "paperId": "p-5e37064fe519258d",
  "paperOrder": 7,
  "number": {
    "display": "第一题 7",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "7",
      "value": "7"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog"
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
      "legacyId": "q-f91ff98f8dcd2d32",
      "document": "原文/期中/2017期中-带答案.md",
      "lines": {
        "start": 103,
        "end": 115
      },
      "curated": "_curated/期中/2017期中-带答案/103.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "二维数组指针运算与地址计算"
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
7.  有A的定义：

```c
int A[3][2] = {{1, 2}, {3, 3}, {2, 1}};
```

按教材将连续二维数组视作线性存储区的地址计算模型，`A[2]`退化后的首元素地址对应哪项？`int`占4字节；这里比较机器地址，不讨论跨内层数组边界指针运算的严格C限制。
%%% reference
答案：C
数组起址记为X，第三行首元素地址是X+16字节。`&A`的指针步长为 `sizeof A`，即24字节；`A`退化后步长为 `sizeof A[0]`，即8字节；`*A`退化后步长为 `sizeof(int)`，即4字节。因此C的 `*A+4` 对应同一机器地址。

原解析把整个数组大小误写成 `sizeof(A[3][2])`，后者的类型是单个int，并不等于24，已改正。`A+2`与该首元素地址数值相同但指针类型不同，不能将数值相等直接当作类型等价。
%%% option: A
`&A+16`
%%% option: B
`A+16`
%%% option: C
`*A+4`
%%% option: D
`*A+2`
