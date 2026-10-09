+++json
{
  "schemaVersion": "5",
  "id": "q-f91ff98f8dcd2d32",
  "revision": 1,
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

那么`A[2]`的值为：
%%% reference
答案：C
解析：参见书 P177 页表格，机器在计算指针与常数的运算时，会将常数乘以指针
指向的元素大小。`&A` 常数扩大的倍数为 `sizeof(A[3][2])` $= 3 \times 2 \times 4$；`A` 常数
扩大的倍数为 `sizeof(A[0])` $= 2 \times 4$；`*A` 常数扩大的倍数为 `sizeof(int)` $= 4$。
正确的答案应为 `A+2` 或 `*A+4`，故应选择 C。
%%% option: A
`&A+16`
%%% option: B
`A+16`
%%% option: C
`*A+4`
%%% option: D
`*A+2`
