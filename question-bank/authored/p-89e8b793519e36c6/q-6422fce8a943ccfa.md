+++json
{
  "schemaVersion": "5",
  "id": "q-6422fce8a943ccfa",
  "revision": 4,
  "paperId": "p-89e8b793519e36c6",
  "paperOrder": 26,
  "number": {
    "display": "第五题",
    "major": {
      "display": "第五题",
      "value": "5"
    },
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "memory_hierarchy",
    "moduleIds": [
      "memory_hierarchy"
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
      "legacyId": "q-6acdab44e2b32dd2",
      "document": "原文/期中/2015期中-带答案.md",
      "lines": {
        "start": 595,
        "end": 627
      },
      "curated": "_curated/期中/2015期中-带答案/595.md",
      "aliases": [
        "原文/期末/2015期末-20151109-带答案.md"
      ],
      "provenance": "rewritten",
      "editorNote": "组相连 Cache 失效次数与最终状态"
    },
    {
      "legacyId": "q-80c11cfc4df40242",
      "document": "原文/期中/2015期中-带答案.md",
      "lines": {
        "start": 633,
        "end": 655
      },
      "curated": "_curated/期中/2015期中-带答案/633.md",
      "aliases": [
        "原文/期末/2015期末-20151109-带答案.md"
      ],
      "provenance": "rewritten",
      "editorNote": "全相联 Cache 的 tag/失效次数与状态"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-6acdab44e2b32dd2",
      "number": {
        "display": "第五题 1",
        "major": {
          "display": "第五题",
          "value": "5"
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "memory_hierarchy"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "miss-1a",
            "marker": "{{blank:miss-1a}}",
            "occurrence": 0,
            "width": "short"
          },
          {
            "id": "miss-1b",
            "marker": "{{blank:miss-1b}}",
            "occurrence": 0,
            "width": "short"
          },
          {
            "id": "desc-1",
            "marker": "{{blank:desc-1}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "A",
                  "label": "A · 16×16失效更多"
                },
                {
                  "value": "B",
                  "label": "B · 失效相同"
                },
                {
                  "value": "C",
                  "label": "C · 16×16失效更少"
                }
              ]
            }
          },
          {
            "id": "miss-1c",
            "marker": "{{blank:miss-1c}}",
            "occurrence": 0,
            "width": "short"
          },
          {
            "id": "s1-v0",
            "marker": "{{blank:s1-v0}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s1-tag0",
            "marker": "{{blank:s1-tag0}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s1-block0",
            "marker": "{{blank:s1-block0}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s1-v1",
            "marker": "{{blank:s1-v1}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s1-tag1",
            "marker": "{{blank:s1-tag1}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s1-block1",
            "marker": "{{blank:s1-block1}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s1-v2",
            "marker": "{{blank:s1-v2}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s1-tag2",
            "marker": "{{blank:s1-tag2}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s1-block2",
            "marker": "{{blank:s1-block2}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s1-v3",
            "marker": "{{blank:s1-v3}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s1-tag3",
            "marker": "{{blank:s1-tag3}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s1-block3",
            "marker": "{{blank:s1-block3}}",
            "occurrence": 0,
            "width": "medium"
          }
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
          {
            "blankId": "miss-1a",
            "method": "exact",
            "acceptedAnswers": [
              "4",
              "4次",
              "4 次"
            ],
            "normalize": {
              "trimWhitespace": true,
              "caseSensitive": false
            }
          },
          {
            "blankId": "miss-1b",
            "method": "exact",
            "acceptedAnswers": [
              "16",
              "16次",
              "16 次"
            ],
            "normalize": {
              "trimWhitespace": true,
              "caseSensitive": false
            }
          },
          {
            "blankId": "desc-1",
            "method": "selection",
            "correctValues": [
              "A"
            ]
          },
          {
            "blankId": "miss-1c",
            "method": "exact",
            "acceptedAnswers": [
              "14",
              "14次",
              "14 次"
            ],
            "normalize": {
              "trimWhitespace": true,
              "caseSensitive": false
            }
          },
          {
            "blankId": "s1-v0",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s1-tag0",
            "method": "exact",
            "acceptedAnswers": [
              "100"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s1-block0",
            "method": "exact",
            "acceptedAnswers": [
              "M[64-67]",
              "Mem[64-67]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          },
          {
            "blankId": "s1-v1",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s1-tag1",
            "method": "exact",
            "acceptedAnswers": [
              "101"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s1-block1",
            "method": "exact",
            "acceptedAnswers": [
              "M[80-83]",
              "Mem[80-83]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          },
          {
            "blankId": "s1-v2",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s1-tag2",
            "method": "exact",
            "acceptedAnswers": [
              "110"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s1-block2",
            "method": "exact",
            "acceptedAnswers": [
              "M[100-103]",
              "Mem[100-103]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          },
          {
            "blankId": "s1-v3",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s1-tag3",
            "method": "exact",
            "acceptedAnswers": [
              "111"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s1-block3",
            "method": "exact",
            "acceptedAnswers": [
              "M[116-119]",
              "Mem[116-119]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          }
        ],
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "unknown",
          "crossChecked": null,
          "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
        }
      },
      "sources": [
        {
          "legacyId": "q-6acdab44e2b32dd2",
          "document": "原文/期中/2015期中-带答案.md",
          "lines": {
            "start": 595,
            "end": 627
          },
          "curated": "_curated/期中/2015期中-带答案/595.md",
          "aliases": [
            "原文/期末/2015期末-20151109-带答案.md"
          ],
          "provenance": "rewritten",
          "editorNote": "组相连 Cache 失效次数与最终状态"
        }
      ],
      "issues": []
    },
    {
      "id": "q-80c11cfc4df40242",
      "number": {
        "display": "第五题 2",
        "major": {
          "display": "第五题",
          "value": "5"
        },
        "minor": {
          "display": "2",
          "value": "2"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "memory_hierarchy"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "tag-bits",
            "marker": "{{blank:tag-bits}}",
            "occurrence": 0,
            "width": "short"
          },
          {
            "id": "miss-2a",
            "marker": "{{blank:miss-2a}}",
            "occurrence": 0,
            "width": "short"
          },
          {
            "id": "miss-2b",
            "marker": "{{blank:miss-2b}}",
            "occurrence": 0,
            "width": "short"
          },
          {
            "id": "desc-2",
            "marker": "{{blank:desc-2}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "A",
                  "label": "A · 16×16失效更多"
                },
                {
                  "value": "B",
                  "label": "B · 失效相同"
                },
                {
                  "value": "C",
                  "label": "C · 16×16失效更少"
                }
              ]
            }
          },
          {
            "id": "s2-v0",
            "marker": "{{blank:s2-v0}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s2-tag0",
            "marker": "{{blank:s2-tag0}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s2-block0",
            "marker": "{{blank:s2-block0}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s2-v1",
            "marker": "{{blank:s2-v1}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s2-tag1",
            "marker": "{{blank:s2-tag1}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s2-block1",
            "marker": "{{blank:s2-block1}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s2-v2",
            "marker": "{{blank:s2-v2}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s2-tag2",
            "marker": "{{blank:s2-tag2}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s2-block2",
            "marker": "{{blank:s2-block2}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s2-v3",
            "marker": "{{blank:s2-v3}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "0",
                  "label": "0"
                },
                {
                  "value": "1",
                  "label": "1"
                }
              ]
            }
          },
          {
            "id": "s2-tag3",
            "marker": "{{blank:s2-tag3}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "s2-block3",
            "marker": "{{blank:s2-block3}}",
            "occurrence": 0,
            "width": "medium"
          }
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
          {
            "blankId": "tag-bits",
            "method": "exact",
            "acceptedAnswers": [
              "6",
              "6位",
              "6 位"
            ],
            "normalize": {
              "trimWhitespace": true,
              "caseSensitive": false
            }
          },
          {
            "blankId": "miss-2a",
            "method": "exact",
            "acceptedAnswers": [
              "4",
              "4次",
              "4 次"
            ],
            "normalize": {
              "trimWhitespace": true,
              "caseSensitive": false
            }
          },
          {
            "blankId": "miss-2b",
            "method": "exact",
            "acceptedAnswers": [
              "4",
              "4次",
              "4 次"
            ],
            "normalize": {
              "trimWhitespace": true,
              "caseSensitive": false
            }
          },
          {
            "blankId": "desc-2",
            "method": "selection",
            "correctValues": [
              "C"
            ]
          },
          {
            "blankId": "s2-v0",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s2-tag0",
            "method": "exact",
            "acceptedAnswers": [
              "100000"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s2-block0",
            "method": "exact",
            "acceptedAnswers": [
              "M[128-131]",
              "Mem[128-131]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          },
          {
            "blankId": "s2-v1",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s2-tag1",
            "method": "exact",
            "acceptedAnswers": [
              "100101"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s2-block1",
            "method": "exact",
            "acceptedAnswers": [
              "M[148-151]",
              "Mem[148-151]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          },
          {
            "blankId": "s2-v2",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s2-tag2",
            "method": "exact",
            "acceptedAnswers": [
              "101001"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s2-block2",
            "method": "exact",
            "acceptedAnswers": [
              "M[164-167]",
              "Mem[164-167]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          },
          {
            "blankId": "s2-v3",
            "method": "selection",
            "correctValues": [
              "1"
            ]
          },
          {
            "blankId": "s2-tag3",
            "method": "exact",
            "acceptedAnswers": [
              "101101"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "s2-block3",
            "method": "exact",
            "acceptedAnswers": [
              "M[180-183]",
              "Mem[180-183]"
            ],
            "normalize": {
              "caseSensitive": true,
              "trimWhitespace": true,
              "syntax": "c-tokens"
            }
          }
        ],
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "unknown",
          "crossChecked": null,
          "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
        }
      },
      "sources": [
        {
          "legacyId": "q-80c11cfc4df40242",
          "document": "原文/期中/2015期中-带答案.md",
          "lines": {
            "start": 633,
            "end": 655
          },
          "curated": "_curated/期中/2015期中-带答案/633.md",
          "aliases": [
            "原文/期末/2015期末-20151109-带答案.md"
          ],
          "provenance": "rewritten",
          "editorNote": "全相联 Cache 的 tag/失效次数与状态"
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
第五题（20分）

以下程序仅生成前4行、前4列的16次逐字节写地址，按列优先顺序访问。每一问独立从空Cache开始，采用写分配、LRU，只统计数组访存，循环变量留在寄存器。

```c
#define LENGTH 8  /* 各小问会独立更改此值 */
void clear4x4(char array[LENGTH][LENGTH]) {
    for (int col = 0; col < 4; col++) {
        for (int row = 0; row < 4; row++) {
            array[row][col] = 0;
        }
    }
}
```

题库修订：原PDF在7/8位地址模型中分别给出 `0x1000000`、`0x10000000`，均超出所述位宽。这里明确重新设定首地址为二进制 `0b1000000=64` 和 `0b10000000=128`，不暗中截断十六进制高位。只分析程序实际触及的16个地址，不要求未访问的完整数组都放入此假想有限地址空间。最终数据块按绝对字节地址写为 `M[a-b]` 或 `Mem[a-b]`，每组内按块起址升序填表，Tag填足给定位数。

%%% reference

%%% part-stem: q-6acdab44e2b32dd2
1.采用7位有效访问地址，数组首地址为64。块大小4字节，4组、每组2路，数据容量32字节，Tag为3位。（10分）
1)  以上程序执行会引起多少次失效？{{blank:miss-1a}}

2)  如果`LENGTH`改为16，会引起多少次失效？{{blank:miss-1b}}

3)  如果`LENGTH`变为17，与2)相比，下面描述正确的是：{{blank:desc-1}}，会引起 {{blank:miss-1c}} 次失效。

A） 16×16 比17×17产生更多的失效次数

B） 16×16 和17×17产生的失效次数相同

C） 16×16 比17×17产生更少的失效次数

4) 填写第3问结束后的set0与set1状态（各组块起址升序）：

| 组／答题行 | V | Tag（3位二进制） | 数据块 |
| --- | --- | --- | --- |
| `set0 / 0` | {{blank:s1-v0}} | {{blank:s1-tag0}} | {{blank:s1-block0}} |
| `set0 / 1` | {{blank:s1-v1}} | {{blank:s1-tag1}} | {{blank:s1-block1}} |
| `set1 / 0` | {{blank:s1-v2}} | {{blank:s1-tag2}} | {{blank:s1-block2}} |
| `set1 / 1` | {{blank:s1-v3}} | {{blank:s1-tag3}} | {{blank:s1-block3}} |
%%% part-reference: q-6acdab44e2b32dd2
答案：1) 4 次失效
2) 16 次失效
3) A；会引起 14 次失效
4) 3) 运行后 cache 的最终状态：

| 组 | V | Tag | 数据块 |
| --- | --- | --- | --- |
| `set0` | 1 | `100` | `M[64-67]` |
| `set0` | 1 | `101` | `M[80-83]` |
| `set1` | 1 | `110` | `M[100-103]` |
| `set1` | 1 | `111` | `M[116-119]` |

当LENGTH=17，行首不再全部按4字节块对齐；原答案把每行的 `Array[row][0..3]` 一概写成一个块是错误的。例如row1从81开始，`M[80-83]` 只覆盖该行第0–2列以及前一行的最后一个字节；第3列84属于另一块。
%%% part-stem: q-80c11cfc4df40242
2.采用8位有效访问地址，数组首地址128。数据容量16字节，块大小4字节，全相联共4路，LRU替换。（10分）
1)  Tag的位数为 {{blank:tag-bits}}

2)  如果执行上述程序，当`LENGTH=8`时，会引起多少次失效？{{blank:miss-2a}}

3)  如果`LENGTH`改为16，会引起多少次失效？{{blank:miss-2b}}

4)  如果`LENGTH`变为17，与3)相比，下面描述正确的是：{{blank:desc-2}}

A） 16×16 比17×17产生更多的失效次数

B） 16×16 和17×17产生的失效次数相同

C） 16×16 比17×17产生更少的失效次数

5) 填写第4问结束后的最终状态，按块起址升序排列；Tag填6位二进制。

| 答题行 | V | Tag | 数据块 |
| --- | --- | --- | --- |
| 0 | {{blank:s2-v0}} | {{blank:s2-tag0}} | {{blank:s2-block0}} |
| 1 | {{blank:s2-v1}} | {{blank:s2-tag1}} | {{blank:s2-block1}} |
| 2 | {{blank:s2-v2}} | {{blank:s2-tag2}} | {{blank:s2-block2}} |
| 3 | {{blank:s2-v3}} | {{blank:s2-tag3}} | {{blank:s2-block3}} |
%%% part-reference: q-80c11cfc4df40242
答案：1) Tag 的位数为 6
2) `LENGTH=8` 时，会引起 4 次失效
3) `LENGTH` 改为 16 时，会引起 4 次失效
4) C（16×16 比 17×17 产生更少的失效次数）
5) 4) 执行后 cache 的最终状态：

| V | Tag | 数据块 |
| --- | --- | --- |
| 1 | `100000` | `M[128-131]` |
| 1 | `100101` | `M[148-151]` |
| 1 | `101001` | `M[164-167]` |
| 1 | `101101` | `M[180-183]` |

LENGTH=17时失效7次，故16×16的4次失效更少。最终row1的驻留块是该行第3–6列，row2为第2–5列，row3为第1–4列；不能把所有块误标为各行第0–3列。
