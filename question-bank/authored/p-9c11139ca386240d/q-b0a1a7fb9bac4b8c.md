+++json
{
  "schemaVersion": "5",
  "id": "q-b0a1a7fb9bac4b8c",
  "revision": 2,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 14,
  "number": {
    "display": "Lab 任务 14",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "14",
      "value": "14"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "data_representation",
    "moduleIds": [
      "data_representation"
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
      "legacyId": "q-b0a1a7fb9bac4b8c",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 219,
        "end": 243
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/219.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "byteSwap 字节交换的移位与掩码"
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
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
14. （2 分）下面给出了 `byteSwap` 函数的代码，该函数交换后两个参数所指定的两个字节的数据。下面哪一个选项正确给出了 (1) 和 (2) 处应当填写的内容？

```c
/*
 * byteSwap - swaps the nth byte and the mth byte
 *  Examples: byteSwap(0x12345678, 1, 3) = 0x56341278
 *              byteSwap(0xDEADBEEF, 0, 2) = 0xDEEFBEAD
 *  You may assume that 0 <= n <= 3, 0 <= m <= 3
*/
int byteSwap(int x, int n, int m) {
    int n8 = n << ___(1)___;
    int m8 = m << ___(1)___;
    int swap_byte = ((x >> m8) __(2)__ (x >> n8)) & 0xff;
    return x ^ (swap_byte << n8) __(2)__ (swap_byte << m8);
}
```
%%% reference
答案：A

解析：字节下标要变成比特下标必须乘 8，即 `n << 3`，故 `(1) = 3`；两个字节的差异用异或取出（`swap_byte = byte_m ^ byte_n`），再在 `n`、`m` 两个位置各异或一次就完成了交换，故 `(2) = ^`。若用 `|`，则不能完成上述异或交换。故选 A。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
`(1) 3 (2) ^`
%%% option: B
`(1) 8 (2) ^`
%%% option: C
`(1) 3 (2) |`
%%% option: D
`(1) 8 (2) |`
