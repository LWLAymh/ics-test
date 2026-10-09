+++json
{
  "schemaVersion": "5",
  "id": "q-dfb1408ac4bafee7",
  "revision": 1,
  "paperId": "p-d72f88c4198cf267",
  "paperOrder": 13,
  "number": {
    "display": "第二题",
    "major": {
      "display": "第二题",
      "value": "2"
    },
    "minor": null,
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
      "legacyId": "q-c26dcb8894f2b45e",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 190,
        "end": 226
      },
      "curated": "_curated/期中/2020期中-带答案/190.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "union 中 double 的位模式与 IEEE 浮点解释"
    },
    {
      "legacyId": "q-77dc7db573e0ee5a",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 227,
        "end": 239
      },
      "curated": "_curated/期中/2020期中-带答案/227.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "float 精度、(int) 截断与不可精确表示的数"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-c26dcb8894f2b45e",
      "number": {
        "display": "第二题 第一段",
        "major": {
          "display": "第二题",
          "value": "2"
        },
        "minor": {
          "display": "第一段",
          "value": null
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "data_representation"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "output-1",
            "marker": "{{blank:output-1}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "output-2",
            "marker": "{{blank:output-2}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "union-size",
            "marker": "{{blank:union-size}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "bytes",
            "marker": "{{blank:bytes}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "struct-x",
            "marker": "{{blank:struct-x}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "struct-y",
            "marker": "{{blank:struct-y}}",
            "occurrence": 0,
            "width": "medium"
          }
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "unknown",
          "crossChecked": null,
          "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
        },
        "blankAnswers": [
          {
            "blankId": "output-1",
            "method": "exact",
            "acceptedAnswers": [
              "nan",
              "-nan"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "output-2",
            "method": "exact",
            "acceptedAnswers": [
              "1",
              "1.000000"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "union-size",
            "method": "exact",
            "acceptedAnswers": [
              "8"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "bytes",
            "method": "exact",
            "acceptedAnswers": [
              "01 00 00 00 00 00 00 80",
              "0100000000000080"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "struct-x",
            "method": "exact",
            "acceptedAnswers": [
              "1"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "struct-y",
            "method": "exact",
            "acceptedAnswers": [
              "-2147483648",
              "-2**31",
              "-2^31"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-c26dcb8894f2b45e",
          "document": "原文/期中/2020期中-带答案.md",
          "lines": {
            "start": 190,
            "end": 226
          },
          "curated": "_curated/期中/2020期中-带答案/190.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "union 中 double 的位模式与 IEEE 浮点解释"
        }
      ],
      "issues": []
    },
    {
      "id": "q-77dc7db573e0ee5a",
      "number": {
        "display": "第二题 第二段",
        "major": {
          "display": "第二题",
          "value": "2"
        },
        "minor": {
          "display": "第二段",
          "value": null
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "data_representation"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "outputs",
            "marker": "{{blank:outputs}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "first-inexact-int",
            "marker": "{{blank:first-inexact-int}}",
            "occurrence": 0,
            "width": "medium"
          }
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "unknown",
          "crossChecked": null,
          "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
        },
        "blankAnswers": [
          {
            "blankId": "outputs",
            "method": "exact",
            "acceptedAnswers": [
              "-2, 1, 0, -1, 2",
              "-2 1 0 -1 2",
              "-2，1，0，-1，2"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "first-inexact-int",
            "method": "exact",
            "acceptedAnswers": [
              "16777217",
              "2**24+1",
              "2^24+1"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-77dc7db573e0ee5a",
          "document": "原文/期中/2020期中-带答案.md",
          "lines": {
            "start": 227,
            "end": 239
          },
          "curated": "_curated/期中/2020期中-带答案/227.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "float 精度、(int) 截断与不可精确表示的数"
        }
      ],
      "issues": []
    }
  ],
  "solution": {
    "state": "available",
    "grading": "parts",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null
    }
  }
}
+++
%%% stem

%%% reference

%%% part-stem: q-c26dcb8894f2b45e
第二题（20 分）

分析两段在 x86-64 CPU 上运行的程序代码并回答问题。第一段代码如下：

```c
#include <stdio.h>

typedef struct {
    int x;
    int y;
} struct_e;

typedef union {
    struct_e s;
    double d;
} union_e;

int main(void) {
    union_e test;
    test.s.x = 0;
    test.s.y = -1;
    printf("%lf\n", test.d);

    test.s.y = 0x3ff00000;
    printf("%lf\n", test.d);
}
```

1. 两次输出依次为 {{blank:output-1}} 和 {{blank:output-2}}。
2. `sizeof(union_e)` 为 {{blank:union-size}}。
3. 如果某次输出的 `test.d` 是最大的负非规格化数，则从 `test` 起始地址开始的 8 个字节（十六进制）依次为 {{blank:bytes}}；此时 `test.s.x` 为 {{blank:struct-x}}，`test.s.y` 为 {{blank:struct-y}}。
%%% part-reference: q-c26dcb8894f2b45e
1. 两次输出依次为 `NaN` 和 `1`。
2. `sizeof(union_e) = 8`。
3. 八个字节依次为 `01 00 00 00 00 00 00 80`；`test.s.x = 1`，`test.s.y = -2147483648`（即 $-2^{31}$）。
%%% part-stem: q-77dc7db573e0ee5a
第二段代码如下：

```c
int a = 33554442;  // 2^25 + 10
int b = a + 5;

for (; a < b; a++) {
    float f = a;
    printf("%d ", (int)f - a);
}
```

1. 程序的输出依次为 {{blank:outputs}}。
2. `float` 类型不能精确表示的最小正整数为 {{blank:first-inexact-int}}。
%%% part-reference: q-77dc7db573e0ee5a
1. 输出依次为 `-2, 1, 0, -1, 2`。
2. 最小正整数为 $2^{24}+1=16777217$。
