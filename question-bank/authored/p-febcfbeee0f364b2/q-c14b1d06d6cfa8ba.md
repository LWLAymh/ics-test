+++json
{
  "schemaVersion": "5",
  "id": "q-c14b1d06d6cfa8ba",
  "revision": 2,
  "paperId": "p-febcfbeee0f364b2",
  "paperOrder": 17,
  "number": {
    "display": "第6讲 17",
    "major": {
      "display": "第6讲",
      "value": null
    },
    "minor": {
      "display": "17",
      "value": "17"
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
      "legacyId": "q-c14b1d06d6cfa8ba",
      "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
      "lines": {
        "start": 252,
        "end": 276
      },
      "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/252.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "取地址与解引用，变量存放于寄存器还是内存"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "q17-v0",
        "marker": "{{blank:q17-v0}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "register",
              "label": "寄存器"
            },
            {
              "value": "memory",
              "label": "内存"
            }
          ]
        }
      },
      {
        "id": "q17-v1",
        "marker": "{{blank:q17-v1}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "register",
              "label": "寄存器"
            },
            {
              "value": "memory",
              "label": "内存"
            }
          ]
        }
      },
      {
        "id": "q17-v2",
        "marker": "{{blank:q17-v2}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "register",
              "label": "寄存器"
            },
            {
              "value": "memory",
              "label": "内存"
            }
          ]
        }
      },
      {
        "id": "q17-v3",
        "marker": "{{blank:q17-v3}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "register",
              "label": "寄存器"
            },
            {
              "value": "memory",
              "label": "内存"
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
        "blankId": "q17-v0",
        "method": "selection",
        "correctValues": [
          "register"
        ]
      },
      {
        "blankId": "q17-v1",
        "method": "selection",
        "correctValues": [
          "memory"
        ]
      },
      {
        "blankId": "q17-v2",
        "method": "selection",
        "correctValues": [
          "register"
        ]
      },
      {
        "blankId": "q17-v3",
        "method": "selection",
        "correctValues": [
          "register"
        ]
      }
    ]
  }
}
+++
%%% stem
17. 考虑以下 C 语言代码：
```c
long bit_not1(long a) {
    long x = ~p;
    return x;
}
long bit_not2(long *p) {
    long x = *p;
    long y = ~x
    return y;
}
long call_bitnot() {
    long v0 = 1010;
    long v1 = 1010;
    long v2 = bit_not1(v0);
    long v3 = bit_not2(&v1);
    return v2+v3;
}
```
下列变量分别存放在寄存器还是内存中？
`v0`：{{blank:q17-v0}}　`v1`：{{blank:q17-v1}}　`v2`：{{blank:q17-v2}}　`v3`：{{blank:q17-v3}}
%%% reference
`v0`：寄存器；`v1`：内存；`v2`：寄存器；`v3`：寄存器。

注：原卷将 `long x = ~p;`（预期应为 `~a`）以及 `long y = ~x`（缺少分号）印成笔误；此处保留原题写法。
