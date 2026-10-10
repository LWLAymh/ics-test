+++json
{
  "schemaVersion": "5",
  "id": "q-39f3f84bc46decbc",
  "revision": 2,
  "paperId": "p-febcfbeee0f364b2",
  "paperOrder": 12,
  "number": {
    "display": "第5讲 12",
    "major": {
      "display": "第5讲",
      "value": null
    },
    "minor": {
      "display": "12",
      "value": "12"
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
      "legacyId": "q-c62728deb08346bb",
      "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
      "lines": {
        "start": 135,
        "end": 159
      },
      "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/135.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "absdiff 的分支实现与条件传送实现补空"
    },
    {
      "legacyId": "q-60f6356d0e6b5538",
      "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
      "lines": {
        "start": 160,
        "end": 165
      },
      "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/160.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "不适合使用条件传送的情况"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-c62728deb08346bb",
      "number": {
        "display": "第5讲 12（1）（2）",
        "major": {
          "display": "第5讲",
          "value": null
        },
        "minor": {
          "display": "12（1）（2）",
          "value": null
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "machine_prog"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "q12-branch",
            "marker": "{{blank:q12-branch}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q12-ret-before-else",
            "marker": "{{blank:q12-ret-before-else}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q12-compare",
            "marker": "{{blank:q12-compare}}",
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
            "blankId": "q12-branch",
            "method": "exact",
            "acceptedAnswers": [
              "jg .L4"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q12-ret-before-else",
            "method": "exact",
            "acceptedAnswers": [
              "ret"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q12-compare",
            "method": "exact",
            "acceptedAnswers": [
              "cmpq %rsi, %rdi",
              "cmpq %rsi,%rdi"
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
          "legacyId": "q-c62728deb08346bb",
          "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
          "lines": {
            "start": 135,
            "end": 159
          },
          "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/135.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "absdiff 的分支实现与条件传送实现补空"
        }
      ],
      "issues": []
    },
    {
      "id": "q-60f6356d0e6b5538",
      "number": {
        "display": "第5讲 12（4）",
        "major": {
          "display": "第5讲",
          "value": null
        },
        "minor": {
          "display": "12（4）",
          "value": null
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "machine_prog"
      ],
      "stem": {
        "format": "markdown"
      },
      "solution": {
        "state": "available",
        "grading": "self",
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
          "legacyId": "q-60f6356d0e6b5538",
          "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
          "lines": {
            "start": 160,
            "end": 165
          },
          "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/160.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "不适合使用条件传送的情况"
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

%%% part-stem: q-c62728deb08346bb
12. 下面的 C 语言代码与汇编语言代码对应，补全汇编代码：

```c
long absdiff(long x, long y) {
    long result;
    if (x <= y)
        result = x-y;
    else
        result = y-x;
    return result;
}
```

```asm
absdiff:
    cmpq %rsi, %rdi
    {{blank:q12-branch}}
    movq %rdi, %rax
    subq %rsi, %rax
    {{blank:q12-ret-before-else}}
.L4:
    movq %rsi, %rax
    subq %rdi, %rax
    ret
```

（2）如果用条件传送指令实现上述功能，对应汇编语言代码如下，补全缺失的代码（注意要符合编译器生成代码的常规情况）：

```asm
absdiff:
    movq %rdi, %rax
    subq %rsi, %rax
    movq %rsi, %rdx
    subq %rdi, %rdx
    {{blank:q12-compare}}
    cmovg %rdx, %rax
    ret
```
%%% part-reference: q-c62728deb08346bb
答案：

```asm
    jg .L4
    ret
    cmpq %rsi, %rdi
```
%%% part-stem: q-60f6356d0e6b5538
（4）有些情况不适合使用条件传送指令。原因是什么？
%%% part-reference: q-60f6356d0e6b5538
答案：条件传送指令需要把条件成立和不成立的两种情况都提前计算出来，会增加计算量，还有可能产生副作用。
