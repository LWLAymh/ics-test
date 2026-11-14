+++json
{
  "schemaVersion": "5",
  "id": "q-f0b0ad5391aaad24",
  "revision": 5,
  "paperId": "p-e3f869956fc29bd8",
  "paperOrder": 17,
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
    "primaryModuleId": "compilation_linking",
    "moduleIds": [
      "compilation_linking"
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
      "legacyId": "q-fcdcf49e11759e0e",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 292,
        "end": 320
      },
      "curated": "_curated/期末/2018期末-带答案/292.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "各符号的 .symtab 条目、类型与所在节"
    },
    {
      "legacyId": "q-906e831c908a1bd5",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 321,
        "end": 404
      },
      "curated": "_curated/期末/2018期末-带答案/321.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "反汇编中的重定位条目与引用值计算"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-fcdcf49e11759e0e",
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
        "compilation_linking"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "bufp0-present",
            "marker": "{{blank:bufp0-present}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "yes",
                  "label": "是"
                },
                {
                  "value": "no",
                  "label": "否"
                }
              ]
            }
          },
          {
            "id": "bufp0-type",
            "marker": "{{blank:bufp0-type}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "local",
                  "label": "局部"
                },
                {
                  "value": "global",
                  "label": "全局"
                },
                {
                  "value": "external",
                  "label": "外部"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                }
              ]
            }
          },
          {
            "id": "bufp0-module",
            "marker": "{{blank:bufp0-module}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "m.o",
                  "label": "m.o"
                },
                {
                  "value": "foo.o",
                  "label": "foo.o"
                },
                {
                  "value": "/",
                  "label": "/"
                }
              ]
            }
          },
          {
            "id": "bufp0-section",
            "marker": "{{blank:bufp0-section}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": ".text",
                  "label": ".text"
                },
                {
                  "value": ".data",
                  "label": ".data"
                },
                {
                  "value": ".bss",
                  "label": ".bss"
                },
                {
                  "value": ".rodata",
                  "label": ".rodata"
                },
                {
                  "value": "COMMON",
                  "label": "COMMON / COM"
                },
                {
                  "value": "UNDEF",
                  "label": "UNDEF / UND"
                },
                {
                  "value": "ABS",
                  "label": "ABS"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                },
                {
                  "value": "X",
                  "label": "X · 无法确定"
                }
              ]
            }
          },
          {
            "id": "buf-present",
            "marker": "{{blank:buf-present}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "yes",
                  "label": "是"
                },
                {
                  "value": "no",
                  "label": "否"
                }
              ]
            }
          },
          {
            "id": "buf-type",
            "marker": "{{blank:buf-type}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "local",
                  "label": "局部"
                },
                {
                  "value": "global",
                  "label": "全局"
                },
                {
                  "value": "external",
                  "label": "外部"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                }
              ]
            }
          },
          {
            "id": "buf-module",
            "marker": "{{blank:buf-module}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "m.o",
                  "label": "m.o"
                },
                {
                  "value": "foo.o",
                  "label": "foo.o"
                },
                {
                  "value": "/",
                  "label": "/"
                }
              ]
            }
          },
          {
            "id": "buf-section",
            "marker": "{{blank:buf-section}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": ".text",
                  "label": ".text"
                },
                {
                  "value": ".data",
                  "label": ".data"
                },
                {
                  "value": ".bss",
                  "label": ".bss"
                },
                {
                  "value": ".rodata",
                  "label": ".rodata"
                },
                {
                  "value": "COMMON",
                  "label": "COMMON / COM"
                },
                {
                  "value": "UNDEF",
                  "label": "UNDEF / UND"
                },
                {
                  "value": "ABS",
                  "label": "ABS"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                },
                {
                  "value": "X",
                  "label": "X · 无法确定"
                }
              ]
            }
          },
          {
            "id": "bufp1-present",
            "marker": "{{blank:bufp1-present}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "yes",
                  "label": "是"
                },
                {
                  "value": "no",
                  "label": "否"
                }
              ]
            }
          },
          {
            "id": "bufp1-type",
            "marker": "{{blank:bufp1-type}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "local",
                  "label": "局部"
                },
                {
                  "value": "global",
                  "label": "全局"
                },
                {
                  "value": "external",
                  "label": "外部"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                }
              ]
            }
          },
          {
            "id": "bufp1-module",
            "marker": "{{blank:bufp1-module}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "m.o",
                  "label": "m.o"
                },
                {
                  "value": "foo.o",
                  "label": "foo.o"
                },
                {
                  "value": "/",
                  "label": "/"
                }
              ]
            }
          },
          {
            "id": "bufp1-section",
            "marker": "{{blank:bufp1-section}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": ".text",
                  "label": ".text"
                },
                {
                  "value": ".data",
                  "label": ".data"
                },
                {
                  "value": ".bss",
                  "label": ".bss"
                },
                {
                  "value": ".rodata",
                  "label": ".rodata"
                },
                {
                  "value": "COMMON",
                  "label": "COMMON / COM"
                },
                {
                  "value": "UNDEF",
                  "label": "UNDEF / UND"
                },
                {
                  "value": "ABS",
                  "label": "ABS"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                },
                {
                  "value": "X",
                  "label": "X · 无法确定"
                }
              ]
            }
          },
          {
            "id": "foo-present",
            "marker": "{{blank:foo-present}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "yes",
                  "label": "是"
                },
                {
                  "value": "no",
                  "label": "否"
                }
              ]
            }
          },
          {
            "id": "foo-type",
            "marker": "{{blank:foo-type}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "local",
                  "label": "局部"
                },
                {
                  "value": "global",
                  "label": "全局"
                },
                {
                  "value": "external",
                  "label": "外部"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                }
              ]
            }
          },
          {
            "id": "foo-module",
            "marker": "{{blank:foo-module}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "m.o",
                  "label": "m.o"
                },
                {
                  "value": "foo.o",
                  "label": "foo.o"
                },
                {
                  "value": "/",
                  "label": "/"
                }
              ]
            }
          },
          {
            "id": "foo-section",
            "marker": "{{blank:foo-section}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": ".text",
                  "label": ".text"
                },
                {
                  "value": ".data",
                  "label": ".data"
                },
                {
                  "value": ".bss",
                  "label": ".bss"
                },
                {
                  "value": ".rodata",
                  "label": ".rodata"
                },
                {
                  "value": "COMMON",
                  "label": "COMMON / COM"
                },
                {
                  "value": "UNDEF",
                  "label": "UNDEF / UND"
                },
                {
                  "value": "ABS",
                  "label": "ABS"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                },
                {
                  "value": "X",
                  "label": "X · 无法确定"
                }
              ]
            }
          },
          {
            "id": "temp-present",
            "marker": "{{blank:temp-present}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "yes",
                  "label": "是"
                },
                {
                  "value": "no",
                  "label": "否"
                }
              ]
            }
          },
          {
            "id": "temp-type",
            "marker": "{{blank:temp-type}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "local",
                  "label": "局部"
                },
                {
                  "value": "global",
                  "label": "全局"
                },
                {
                  "value": "external",
                  "label": "外部"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                }
              ]
            }
          },
          {
            "id": "temp-module",
            "marker": "{{blank:temp-module}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "m.o",
                  "label": "m.o"
                },
                {
                  "value": "foo.o",
                  "label": "foo.o"
                },
                {
                  "value": "/",
                  "label": "/"
                }
              ]
            }
          },
          {
            "id": "temp-section",
            "marker": "{{blank:temp-section}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": ".text",
                  "label": ".text"
                },
                {
                  "value": ".data",
                  "label": ".data"
                },
                {
                  "value": ".bss",
                  "label": ".bss"
                },
                {
                  "value": ".rodata",
                  "label": ".rodata"
                },
                {
                  "value": "COMMON",
                  "label": "COMMON / COM"
                },
                {
                  "value": "UNDEF",
                  "label": "UNDEF / UND"
                },
                {
                  "value": "ABS",
                  "label": "ABS"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                },
                {
                  "value": "X",
                  "label": "X · 无法确定"
                }
              ]
            }
          },
          {
            "id": "count-present",
            "marker": "{{blank:count-present}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "yes",
                  "label": "是"
                },
                {
                  "value": "no",
                  "label": "否"
                }
              ]
            }
          },
          {
            "id": "count-type",
            "marker": "{{blank:count-type}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "local",
                  "label": "局部"
                },
                {
                  "value": "global",
                  "label": "全局"
                },
                {
                  "value": "external",
                  "label": "外部"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                }
              ]
            }
          },
          {
            "id": "count-module",
            "marker": "{{blank:count-module}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "m.o",
                  "label": "m.o"
                },
                {
                  "value": "foo.o",
                  "label": "foo.o"
                },
                {
                  "value": "/",
                  "label": "/"
                }
              ]
            }
          },
          {
            "id": "count-section",
            "marker": "{{blank:count-section}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": ".text",
                  "label": ".text"
                },
                {
                  "value": ".data",
                  "label": ".data"
                },
                {
                  "value": ".bss",
                  "label": ".bss"
                },
                {
                  "value": ".rodata",
                  "label": ".rodata"
                },
                {
                  "value": "COMMON",
                  "label": "COMMON / COM"
                },
                {
                  "value": "UNDEF",
                  "label": "UNDEF / UND"
                },
                {
                  "value": "ABS",
                  "label": "ABS"
                },
                {
                  "value": "/",
                  "label": "/ · 不存在条目"
                },
                {
                  "value": "X",
                  "label": "X · 无法确定"
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
            "blankId": "bufp0-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "bufp0-type",
            "method": "selection",
            "correctValues": [
              "global"
            ]
          },
          {
            "blankId": "bufp0-module",
            "method": "selection",
            "correctValues": [
              "foo.o"
            ]
          },
          {
            "blankId": "bufp0-section",
            "method": "selection",
            "correctValues": [
              ".data"
            ]
          },
          {
            "blankId": "buf-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "buf-type",
            "method": "selection",
            "correctValues": [
              "external"
            ]
          },
          {
            "blankId": "buf-module",
            "method": "selection",
            "correctValues": [
              "m.o"
            ]
          },
          {
            "blankId": "buf-section",
            "method": "selection",
            "correctValues": [
              ".data"
            ]
          },
          {
            "blankId": "bufp1-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "bufp1-type",
            "method": "selection",
            "correctValues": [
              "global"
            ]
          },
          {
            "blankId": "bufp1-module",
            "method": "selection",
            "correctValues": [
              "foo.o"
            ]
          },
          {
            "blankId": "bufp1-section",
            "method": "selection",
            "correctValues": [
              "COMMON"
            ]
          },
          {
            "blankId": "foo-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "foo-type",
            "method": "selection",
            "correctValues": [
              "global"
            ]
          },
          {
            "blankId": "foo-module",
            "method": "selection",
            "correctValues": [
              "foo.o"
            ]
          },
          {
            "blankId": "foo-section",
            "method": "selection",
            "correctValues": [
              ".text"
            ]
          },
          {
            "blankId": "temp-present",
            "method": "selection",
            "correctValues": [
              "no"
            ]
          },
          {
            "blankId": "temp-type",
            "method": "selection",
            "correctValues": [
              "/"
            ]
          },
          {
            "blankId": "temp-module",
            "method": "selection",
            "correctValues": [
              "/"
            ]
          },
          {
            "blankId": "temp-section",
            "method": "selection",
            "correctValues": [
              "/"
            ]
          },
          {
            "blankId": "count-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "count-type",
            "method": "selection",
            "correctValues": [
              "local"
            ]
          },
          {
            "blankId": "count-module",
            "method": "selection",
            "correctValues": [
              "foo.o"
            ]
          },
          {
            "blankId": "count-section",
            "method": "selection",
            "correctValues": [
              ".bss"
            ]
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-fcdcf49e11759e0e",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 292,
            "end": 320
          },
          "curated": "_curated/期末/2018期末-带答案/292.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "各符号的 .symtab 条目、类型与所在节"
        }
      ],
      "issues": []
    },
    {
      "id": "q-906e831c908a1bd5",
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
        "compilation_linking"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {"id":"reloc-1","marker":"{{blank:reloc-1}}","occurrence":0,"width":"medium"},
          {"id":"reloc-2","marker":"{{blank:reloc-2}}","occurrence":0,"width":"medium"},
          {"id":"reloc-3","marker":"{{blank:reloc-3}}","occurrence":0,"width":"medium"},
          {"id":"reloc-5","marker":"{{blank:reloc-5}}","occurrence":0,"width":"medium"},
          {"id":"reloc-9","marker":"{{blank:reloc-9}}","occurrence":0,"width":"medium"}
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
          {"blankId":"reloc-1","method":"exact","acceptedAnswers":["0a 00 00 00","0A 00 00 00"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"reloc-2","method":"exact","acceptedAnswers":["0x2334"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"reloc-3","method":"exact","acceptedAnswers":["0x2019"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"reloc-5","method":"exact","acceptedAnswers":["0x1316"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"reloc-9","method":"exact","acceptedAnswers":["0x1fdc"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}
        ]
      },
      "sources": [
        {
          "legacyId": "q-906e831c908a1bd5",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 321,
            "end": 404
          },
          "curated": "_curated/期末/2018期末-带答案/321.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "反汇编中的重定位条目与引用值计算"
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
第三题（10分）
本题基于下列`m.c`及`foo.c`文件所编译生成的`m.o`和`foo.o`，编译过程未加优化选
项。按课程 ELF 逻辑节分类，启用传统 `-fcommon`，不使用 PIC/PIE 或 LTO；暂定定义归 COMMON，已初始化指针归 `.data`，不按现代工具链的细分重定位数据节另行分类。
`m.c`：
```c
void foo();
int buf[2] = {1, 2};
int main() {
    foo();
    return 0;
}
```

`foo.c`：
```c
extern int buf[];
int *bufp0 = &buf[0];
int *bufp1;
void foo() {
    static int count = 0;
    int temp;
    bufp1 = &buf[1];
    temp = *bufp0;
    *bufp0 = *bufp1;
    *bufp1 = temp;
    count++;
}
```
%%% part-stem: q-fcdcf49e11759e0e
对于每个`foo.o`中定义和引用的符号，请用“是”或“否”指出它是否在模块`foo.o`
的.symtab节中有符号表条目。如果存在条目，则请指出定义该符号的模块（`foo.o`
或`m.o`）、符号类型（局部、全局或外部）以及它在模块中所处的节；如果不存在条
目，则请将该行后继空白处标记为“/”。
第一问每行1分，该行全部答对才给分数，节名如果漏了“.”可以算对。
用英文回答的，如果正确也可以给分。
| 符号 | .symtab 条目？ | 符号类型 | 定义符号的模块 | 节 |
| --- | --- | --- | --- | --- |
| `bufp0` | {{blank:bufp0-present}} | {{blank:bufp0-type}} | {{blank:bufp0-module}} | {{blank:bufp0-section}} |
| `buf` | {{blank:buf-present}} | {{blank:buf-type}} | {{blank:buf-module}} | {{blank:buf-section}} |
| `bufp1` | {{blank:bufp1-present}} | {{blank:bufp1-type}} | {{blank:bufp1-module}} | {{blank:bufp1-section}} |
| `foo` | {{blank:foo-present}} | {{blank:foo-type}} | {{blank:foo-module}} | {{blank:foo-section}} |
| `temp` | {{blank:temp-present}} | {{blank:temp-type}} | {{blank:temp-module}} | {{blank:temp-section}} |
| `count` | {{blank:count-present}} | {{blank:count-type}} | {{blank:count-module}} | {{blank:count-section}} |
%%% part-reference: q-fcdcf49e11759e0e
| 符号 | .symtab 条目？ | 符号类型 | 定义符号的模块 | 节 |
| --- | --- | --- | --- | --- |
| `bufp0` | 是 | 全局 | `foo.o` | .data |
| `buf` | 是 | 外部 | `m.o` | .data |
| `bufp1` | 是 | 全局 | `foo.o` | COMMON |
| `foo` | 是 | 全局 | `foo.o` | .text |
| `temp` | 否 | / | / | / |
| `count` | 是 | 局部 | `foo.o` | .bss |
%%% part-stem: q-906e831c908a1bd5
原卷左右两栏分别为可重定位文件和链接后的文件。为避免跨栏转写混杂，下面按两份独立清单排列；符号最终地址及重定位字段位置完整保留。偏移 `r.offset` 相对于其所在目标模块的函数起点，`main` 与 `foo` 分开计算。

**可重定位文件（每个函数起点记为0，未重定位字段暂为0）：**

```asm
<main>:
    push %rbp
    mov  %rsp, %rbp
    mov  $0, %eax
    call foo                    # ① PC32字段偏移0xa
    mov  $0, %eax
    pop  %rbp
    ret

<foo>:
    push %rbp
    mov  %rsp, %rbp
    movq $0, 0(%rip)             # ③ disp偏移0x7；② imm偏移0xb
    mov  0(%rip), %rax           # ④
    mov  (%rax), %eax
    mov  %eax, -4(%rbp)
    mov  0(%rip), %rax           # ⑤ disp偏移0x1e
    mov  0(%rip), %rdx           # ⑥
    mov  (%rdx), %edx
    mov  %edx, (%rax)
    mov  0(%rip), %rax           # ⑦
    mov  -4(%rbp), %edx
    mov  %edx, (%rax)
    mov  0(%rip), %eax           # ⑧
    add  $1, %eax
    mov  %eax, 0(%rip)           # ⑨ disp偏移0x44
    nop
    pop  %rbp
    ret
```

**链接后的地址及反汇编（①填机器字节，其余填立即数/位移数值）：**

```asm
0fe8 <main>:
  0fe8: 55                         push %rbp
  0fe9: 48 89 e5                   mov  %rsp, %rbp
  0fec: b8 00 00 00 00             mov  $0, %eax
  0ff1: e8 [① 四字节]              call 1000 <foo>
  0ff6: b8 00 00 00 00             mov  $0, %eax
  0ffb: 5d                         pop  %rbp
  0ffc: c3                         ret

1000 <foo>:
  1000: push %rbp
  1001: mov  %rsp, %rbp
  1004: movq $②, ③(%rip)          # 总长11字节，下一条地址100f
  100f: mov  0x????(%rip), %rax
  1016: mov  (%rax), %eax
  1018: mov  %eax, -4(%rbp)
  101b: mov  ⑤(%rip), %rax         # 总长7字节
  1022: mov  0x????(%rip), %rdx
  1029: mov  (%rdx), %edx
  102b: mov  %edx, (%rax)
  102d: mov  0x????(%rip), %rax
  1034: mov  -4(%rbp), %edx
  1037: mov  %edx, (%rax)
  1039: mov  0x????(%rip), %eax
  103f: add  $1, %eax
  1042: mov  %eax, ⑨(%rip)         # 总长6字节
  1048: nop
  1049: pop  %rbp
  104a: ret

2330 <buf>:
2338 <bufp0>:
3024 <count.1837>:
3028 <bufp1>:
```

在上图中对所涉及到的重定位条目进行用数字①至⑨进行了标记，请根据下表中所提供的重定位条目信息，计算相应的重定位引用值并填写下表。

| 编号 | 重定位条目信息 | 应填入的重定位引用值 |
| --- | --- | --- |
| ① | `r.offset = 0xa`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` | {{blank:reloc-1}} |
| ② | `r.offset = 0xb`　　`r.symbol = buf` `r.type = R_X86_64_32`　　`r.addend = +4` | `{{blank:reloc-2}}` |
| ③ | `r.offset = 0x7`　　`r.symbol = bufp1` `r.type = R_X86_64_PC32`　　`r.addend = -8` | `{{blank:reloc-3}}` |
| ⑤ | `r.offset = 0x1e`　　`r.symbol = bufp0` `r.type = R_X86_64_PC32`　　`r.addend = -4` | `{{blank:reloc-5}}` |
| ⑨ | `r.offset = 0x44`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` | `{{blank:reloc-9}}` |
%%% part-reference: q-906e831c908a1bd5
| 编号 | 重定位条目信息 | 应填入的重定位引用值 |
| --- | --- | --- |
| ① | `r.offset = 0xa`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` | 0a 00 00 00 |
| ② | `r.offset = 0xb`　　`r.symbol = buf` `r.type = R_X86_64_32`　　`r.addend = +4` | `0x2334` |
| ③ | `r.offset = 0x7`　　`r.symbol = bufp1` `r.type = R_X86_64_PC32`　　`r.addend = -8` | `0x2019` |
| ⑤ | `r.offset = 0x1e`　　`r.symbol = bufp0` `r.type = R_X86_64_PC32`　　`r.addend = -4` | `0x1316` |
| ⑨ | `r.offset = 0x44`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` | `0x1fdc` |
%%% reference

