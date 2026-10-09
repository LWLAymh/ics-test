+++json
{
  "schemaVersion": "5",
  "id": "q-23de3bd6db6e2bd9",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 13,
  "number": {
    "display": "Lab 任务 13",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "13",
      "value": "13"
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
      "legacyId": "q-23de3bd6db6e2bd9",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 177,
        "end": 217
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/177.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "float_half 浮点位模式减半与舍入"
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
13. （2分）下面给出了`float_half`函数的代码，该函数给出单精度浮点数`f`的一半（即
0.5 * f）的位模式。下面哪一个选项正确给出了(1)和(2)处应当填写的值？
```
/*
 * float_half - Return bit-level equivalent of expression 0.5*f for
 *   floating point argument f.
 *   Both the argument and result are passed as unsigned int's, but
 *   they are to be interpreted as the bit-level representation of
 *   single-precision floating point values.
 *   When argument is NaN, return argument
*/
unsigned float_half(unsigned uf) {
  unsigned sign = uf >> 31;
  unsigned exp = (uf >> 23) & 0xFF;
  unsigned frac = uf & 0x7FFFFF;
  /* Only roundup case will be when rounding to even */
  unsigned roundup = (frac & 0x3) == 3;
  if (exp == 0) {
    /* Denormalized. Must halve fraction */
    frac = (frac >> 1) + roundup;
  } else if (exp < 0xFF) {
    /* Normalized. Decrease exponent */
    exp--;
    if (exp == 0) {
      /* Denormalize adding back leading one */
      frac = (frac >> 1) + roundup + _____(1)_____;
    }
  }
  /* NaN Infinity do not require any changes */
  return (sign << 31) | (exp << _____(2)_____) | frac;
}
```
%%% reference
答案：D

解析：(2) 处要把 `exp` 放回第 23~30 位，移位量是 23；(1) 处是 `exp` 减到 0 变成非规格化数时，必须把隐含的前导 1 补进小数域最高位（第 22 位，即 `0x400000`），而 `0x800000` 是符号位的位置。故选 D。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
`(1) 0x800000 (2) 8`
%%% option: B
`(1) 0x800000 (2) 23`
%%% option: C
`(1) 0x400000 (2) 8`
%%% option: D
`(1) 0x400000 (2) 23`
