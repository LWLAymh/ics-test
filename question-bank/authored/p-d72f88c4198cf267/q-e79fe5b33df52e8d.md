+++json
{
  "schemaVersion": "5",
  "id": "q-e79fe5b33df52e8d",
  "revision": 1,
  "paperId": "p-d72f88c4198cf267",
  "paperOrder": 14,
  "number": {
    "display": "第三题",
    "major": {
      "display": "第三题",
      "value": "3"
    },
    "minor": null,
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
      "legacyId": "q-0e7411e79eb6dc92",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 246,
        "end": 340
      },
      "curated": "_curated/期中/2020期中-带答案/246.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "C 与 x86-64 汇编填空：递归、参数传递"
    },
    {
      "legacyId": "q-3969dec85485a1a1",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 342,
        "end": 363
      },
      "curated": "_curated/期中/2020期中-带答案/342.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "断点处栈帧地址与存储值的推断"
    },
    {
      "legacyId": "q-83f219186da3fa88",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 364,
        "end": 364
      },
      "curated": "_curated/期中/2020期中-带答案/364.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "递归函数 foo 的功能"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-0e7411e79eb6dc92",
      "number": {
        "display": "第三题 1",
        "major": {
          "display": "第三题",
          "value": "3"
        },
        "minor": {
          "display": "1",
          "value": "1"
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
            "id": "q3-1",
            "marker": "{{blank:q3-1}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-2",
            "marker": "{{blank:q3-2}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-3",
            "marker": "{{blank:q3-3}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-4",
            "marker": "{{blank:q3-4}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-5",
            "marker": "{{blank:q3-5}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-6",
            "marker": "{{blank:q3-6}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-7",
            "marker": "{{blank:q3-7}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-8",
            "marker": "{{blank:q3-8}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-9",
            "marker": "{{blank:q3-9}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-10",
            "marker": "{{blank:q3-10}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-11",
            "marker": "{{blank:q3-11}}",
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
            "blankId": "q3-1",
            "method": "exact",
            "acceptedAnswers": [
              "return",
              "return;"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-2",
            "method": "exact",
            "acceptedAnswers": [
              "params->n"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-3",
            "method": "exact",
            "acceptedAnswers": [
              "%rdi"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-4",
            "method": "exact",
            "acceptedAnswers": [
              "-0xc"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-5",
            "method": "exact",
            "acceptedAnswers": [
              "%rbp"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-6",
            "method": "exact",
            "acceptedAnswers": [
              "sub",
              "subq"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-7",
            "method": "exact",
            "acceptedAnswers": [
              "jle"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-8",
            "method": "exact",
            "acceptedAnswers": [
              "%rax"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-9",
            "method": "exact",
            "acceptedAnswers": [
              "%edx"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-10",
            "method": "exact",
            "acceptedAnswers": [
              "-0x8(%rbp)"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "q3-11",
            "method": "exact",
            "acceptedAnswers": [
              "0x00005555555551af",
              "5555555551af",
              "foo",
              "<foo>"
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
          "legacyId": "q-0e7411e79eb6dc92",
          "document": "原文/期中/2020期中-带答案.md",
          "lines": {
            "start": 246,
            "end": 340
          },
          "curated": "_curated/期中/2020期中-带答案/246.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "C 与 x86-64 汇编填空：递归、参数传递"
        }
      ],
      "issues": []
    },
    {
      "id": "q-3969dec85485a1a1",
      "number": {
        "display": "第三题 2",
        "major": {
          "display": "第三题",
          "value": "3"
        },
        "minor": {
          "display": "2",
          "value": "2"
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
            "id": "stack-12",
            "marker": "{{blank:stack-12}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "stack-13",
            "marker": "{{blank:stack-13}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "stack-14",
            "marker": "{{blank:stack-14}}",
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
            "blankId": "stack-12",
            "method": "exact",
            "acceptedAnswers": [
              "0x555551f9",
              "555551f9"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "stack-13",
            "method": "exact",
            "acceptedAnswers": [
              "0x555551de",
              "555551de"
            ],
            "normalize": {
              "caseSensitive": false,
              "trimWhitespace": true
            }
          },
          {
            "blankId": "stack-14",
            "method": "exact",
            "acceptedAnswers": [
              "0xffffe2f0",
              "ffffe2f0"
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
          "legacyId": "q-3969dec85485a1a1",
          "document": "原文/期中/2020期中-带答案.md",
          "lines": {
            "start": 342,
            "end": 363
          },
          "curated": "_curated/期中/2020期中-带答案/342.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "断点处栈帧地址与存储值的推断"
        }
      ],
      "issues": []
    },
    {
      "id": "q-83f219186da3fa88",
      "number": {
        "display": "第三题 3",
        "major": {
          "display": "第三题",
          "value": "3"
        },
        "minor": {
          "display": "3",
          "value": "3"
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
          "legacyId": "q-83f219186da3fa88",
          "document": "原文/期中/2020期中-带答案.md",
          "lines": {
            "start": 364,
            "end": 364
          },
          "curated": "_curated/期中/2020期中-带答案/364.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "递归函数 foo 的功能"
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

%%% part-stem: q-0e7411e79eb6dc92
第三题（20 分）

请分析下面的 C 程序和对应的 x86-64 汇编代码，填写标号对应的缺失内容。汇编与机器码中的数字用十六进制填写。

```c
typedef struct _parameters {
    int n;
    int product;
} parameters;

int bar(parameters *params, int x) {
    params->product *= x;
}

void foo(parameters *params) {
    if (params->n <= 1) {
        {{blank:q3-1}}
    }
    bar(params, {{blank:q3-2}});
    params->n--;
    foo(params);
}
```

为简洁起见，函数内的指令地址只给出后四位：

```asm
0x0000555555555189 <bar>:
    5189: f3 0f 1e fa       endbr64
    518d: 55                push   %rbp
    518e: 48 89 e5          mov    %rsp,%rbp
    5191: 48 89 7d f8       mov    {{blank:q3-3}},-0x8(%rbp)
    5195: 89 75 f4          mov    %esi,-0xc(%rbp)
    5198: 48 8b 45 f8       mov    -0x8(%rbp),%rax
    519c: 8b 40 04          mov    0x4(%rax),%eax
    519f: 0f af 45 f4       imul   {{blank:q3-4}}(%rbp),%eax
    51a3: 89 c2             mov    %eax,%edx
    51a5: 48 8b 45 f8       mov    -0x8(%rbp),%rax
    51a9: 89 50 04          mov    %edx,0x4(%rax)
    51ac: 90                nop
    51ad: 5d                pop    {{blank:q3-5}}
    51ae: c3                retq

0x00005555555551af <foo>:
    51af: f3 0f 1e fa       endbr64
    51b3: 55                push   %rbp
    51b4: 48 89 e5          mov    %rsp,%rbp
    51b7: 48 83 ec 10       {{blank:q3-6}} $0x10,%rsp
    51bb: 48 89 7d f8       mov    %rdi,-0x8(%rbp)
    51bf: 48 8b 45 f8       mov    -0x8(%rbp),%rax
    51c3: 8b 00             mov    (%rax),%eax
    51c5: 83 f8 01          cmp    $0x1,%eax
    51c8: 7e 31             {{blank:q3-7}} 51fb <foo+0x4c>
    51ca: 48 8b 45 f8       mov    -0x8(%rbp),%rax
    51ce: 8b 10             mov    (%rax),%edx
    51d0: 48 8b 45 f8       mov    -0x8(%rbp),%rax
    51d4: 89 d6             mov    %edx,%esi
    51d6: 48 89 c7          mov    %rax,%rdi
    51d9: e8 ab ff ff ff    callq  0x0000555555555189 <bar>
    51de: 48 8b 45 f8       mov    -0x8(%rbp),%rax
    51e2: 8b 00             mov    (%rax),%eax
    51e4: 8d 50 ff          lea    -0x1({{blank:q3-8}}),%edx
    51e7: 48 8b 45 f8       mov    -0x8(%rbp),%rax
    51eb: 89 10             mov    {{blank:q3-9}},(%rax)
    51ed: 48 8b 45 f8       mov    {{blank:q3-10}},%rax
    51f1: 48 89 c7          mov    %rax,%rdi
    51f4: e8 b6 ff ff ff    callq  {{blank:q3-11}}
    51f9: eb 01             jmp    51fc <foo+0x4d>
    51fb: 90                nop
    51fc: c9                leaveq
    51fd: c3                retq
```
%%% part-reference: q-0e7411e79eb6dc92
1. `return;`
2. `params->n`
3. `%rdi`
4. `-0xc`
5. `%rbp`
6. `sub`（`subq` 也可）
7. `jle`
8. `%rax`
9. `%edx`
10. `-0x8(%rbp)`
11. `0x00005555555551af <foo>`（只写地址或 `foo` 也可）
%%% part-stem: q-3969dec85485a1a1
2. 程序执行到 `0x000055555555518e` 时（该指令尚未执行），栈帧如下。请填写三个空：

| 地址 | 值 |
| --- | --- |
| `0x7fffffffe308` | `0xffffe340` |
| `0x7fffffffe304` | `0x00000000` |
| `0x7fffffffe300` | `0x00000000` |
| `0x7fffffffe2fc` | `0x00005555` |
| `0x7fffffffe2f8` | {{blank:stack-12}} |
| `0x7fffffffe2f4` | `0x00007fff` |
| `0x7fffffffe2f0` | `0xffffe310` |
| `0x7fffffffe2ec` | `0x00007fff` |
| `0x7fffffffe2e8` | `0xffffe340` |
| `0x7fffffffe2e4` | `0x00000004` |
| `0x7fffffffe2e0` | `0xffffe350` |
| `0x7fffffffe2dc` | `0x00005555` |
| `0x7fffffffe2d8` | {{blank:stack-13}} |
| `0x7fffffffe2d4` | `0x00007fff` |
| `0x7fffffffe2d0` | {{blank:stack-14}} |
%%% part-reference: q-3969dec85485a1a1
12. `0x555551f9`
13. `0x555551de`
14. `0xffffe2f0`
%%% part-stem: q-83f219186da3fa88
3. 当 `params = {n, 1}` 时，`foo(&params)` 的功能是什么？
%%% part-reference: q-83f219186da3fa88
计算 `n` 的阶乘。函数从 `n` 开始递归，将 `product` 依次乘以当前的 `n`，直到 `n <= 1` 时返回；若初始 `product = 1`，最终 `product = n!`。
