+++json
{
  "schemaVersion": "5",
  "id": "q-1c3bcd5eda908dc3",
  "revision": 1,
  "paperId": "p-d72f88c4198cf267",
  "paperOrder": 3,
  "number": {
    "display": "第一题 3",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "3",
      "value": "3"
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
      "legacyId": "q-1c3bcd5eda908dc3",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 69,
        "end": 83
      },
      "curated": "_curated/期中/2020期中-带答案/69.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "静态数组与指针数组的地址计算"
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
      "A"
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
3. 假定静态 `int` 型二维数组 `a` 和指针数组 `pa` 的声明如下：

```c
static int a[4][4] = {
    {3, 8, -2, 6},
    {2, 1, -5, 3},
    {1, 18, 4, 10},
    {4, -2, 0, 8}
};
static int *pa[4] = {a[0], a[1], a[2], a[3]};
```

若 `a` 的首地址为 `0x601080`，则 `&pa[0]` 和 `pa[1]` 分别是：
%%% reference
A
%%% option: A
`0x6010c0`、`0x601090`
%%% option: B
`0x6010e0`、`0x601090`
%%% option: C
`0x6010c0`、`0x6010a0`
%%% option: D
`0x6010e0`、`0x6010a0`
