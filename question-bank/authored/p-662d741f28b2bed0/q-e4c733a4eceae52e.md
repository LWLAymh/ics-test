+++json
{
  "schemaVersion": "5",
  "id": "q-e4c733a4eceae52e",
  "revision": 4,
  "paperId": "p-662d741f28b2bed0",
  "paperOrder": 21,
  "number": {
    "display": "第二题 1",
    "major": {
      "display": "第二题",
      "value": "2"
    },
    "minor": {
      "display": "1",
      "value": "1"
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
      "legacyId": "q-e4c733a4eceae52e",
      "document": "原文/期中/2016期中-带答案.md",
      "lines": {
        "start": 206,
        "end": 241
      },
      "curated": "_curated/期中/2016期中-带答案/206.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "补码/无符号/浮点表达式恒成立判断"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "q1",
        "marker": "{{blank:q1}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
      },
      {
        "id": "q2",
        "marker": "{{blank:q2}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
      },
      {
        "id": "q3",
        "marker": "{{blank:q3}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
      },
      {
        "id": "q4",
        "marker": "{{blank:q4}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
      },
      {
        "id": "q5",
        "marker": "{{blank:q5}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
      },
      {
        "id": "q6",
        "marker": "{{blank:q6}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
      },
      {
        "id": "q7",
        "marker": "{{blank:q7}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
      },
      {
        "id": "q8",
        "marker": "{{blank:q8}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "Y",
              "label": "Y · 是"
            },
            {
              "value": "N",
              "label": "N · 否"
            }
          ]
        }
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
        "blankId": "q1",
        "method": "selection",
        "correctValues": [
          "N"
        ]
      },
      {
        "blankId": "q2",
        "method": "selection",
        "correctValues": [
          "N"
        ]
      },
      {
        "blankId": "q3",
        "method": "selection",
        "correctValues": [
          "Y"
        ]
      },
      {
        "blankId": "q4",
        "method": "selection",
        "correctValues": [
          "N"
        ]
      },
      {
        "blankId": "q5",
        "method": "selection",
        "correctValues": [
          "N"
        ]
      },
      {
        "blankId": "q6",
        "method": "selection",
        "correctValues": [
          "N"
        ]
      },
      {
        "blankId": "q7",
        "method": "selection",
        "correctValues": [
          "Y"
        ]
      },
      {
        "blankId": "q8",
        "method": "selection",
        "correctValues": [
          "Y"
        ]
      }
    ]
  }
}
+++
%%% stem
第二题（20分）
（边凯归，周明辉）

1. 在教材的x86-64位运算模型上，判断下列等式是否恒成立。`int`和`unsigned`为32位，`long`为64位，`double`为IEEE binary64；有符号右移为算术右移，整数加减乘和左移按对应字长截断，超范围类型转换保留位模式。本题按该模型分析，不按严格ISO C有符号溢出/负数左移的未定义行为作答。
```c
/* random_int()函数返回一个随机的int类型值 */
int x = random_int();
int y = random_int();
int z = random_int();
unsigned ux = (unsigned)x;
long lx = (long)x;  /* long为64位 */
long ly = (long)y;
double dx = (double)x;
double dy = (double)y;
double dz = (double)z;
```

| 表达式 | 是否恒成立 |
| --- | --- |
| `(x >= 0) \|\| (3*x < 0)` | {{blank:q1}} |
| `(x >= 0) \|\| (x < ux)` | {{blank:q2}} |
| `((x >> 1) << 1) <= x` | {{blank:q3}} |
| `((x-y)<<3) + (x>>1) - y == 8*x - 9*y + x/2` | {{blank:q4}} |
| `(x - y > 0) == ((y+~x+1)>>31 == 1)` | {{blank:q5}} |
| `dx + dy == (double) (y+x)` | {{blank:q6}} |
| `dx + dy + dz == dz + dy + dx` | {{blank:q7}} |
| `(int)((lx+ly)>>1) == ((x&y) + ((x^y)>>1))` | {{blank:q8}} |
（前6题每题1分; 7、8两题每题2分; 共10分）
%%% reference
答案：1. N（取32位整数 `x = -1073741824`，则 `3*x`截断后为正，两个或项都为假。）
2. N（考虑 `x = -1`）
3. Y
4. N（考虑 `x = -1`，`y = 0`）
5. N（例如 `x = 1, y = 0`，左侧为真，右侧是 `(-1 >> 31) == 1`，即 `-1 == 1`，为假。）
6. N（考虑 x + y 溢出）
7. Y（任意三个32位整数的和及中间两项和都可由binary64精确表示，所以这里没有加法舍入造成的结合顺序差异。）
8. Y（恒成立）
