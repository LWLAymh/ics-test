+++json
{
  "schemaVersion": "5",
  "id": "q-bcf53a1d45ecdc51",
  "revision": 3,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 50,
  "number": {
    "display": "第 4 题",
    "major": {
      "display": "第",
      "value": null
    },
    "minor": {
      "display": "4",
      "value": "4"
    },
    "parts": [
      "题"
    ]
  },
  "classification": {
    "primaryModuleId": "compilation_linking",
    "moduleIds": [
      "compilation_linking",
      "ecf_and_system_io"
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
      "legacyId": "q-a26ced764598c929",
      "document": "原文/期末/2021期末-带答案/chap 7 解析.md",
      "lines": {
        "start": 136,
        "end": 202
      },
      "curated": "_curated/期末/chap 7 解析/136.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "符号表中的符号及其定义所在节（.bss/.rodata/UNDEF 等）"
    },
    {
      "legacyId": "q-c7c4cf76549e1f00",
      "document": "原文/期末/2021期末-带答案/chap 7 解析.md",
      "lines": {
        "start": 204,
        "end": 248
      },
      "curated": "_curated/期末/chap 7 解析/204.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "重定位条目 R_X86_64_PLT32/PC32 与符号地址推算"
    },
    {
      "legacyId": "q-58e76213788bb4aa",
      "document": "原文/期末/2021期末-带答案/chap 7 解析.md",
      "lines": {
        "start": 250,
        "end": 252
      },
      "curated": "_curated/期末/chap 7 解析/250.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "execve 加载后的入口点 _start 与运行在用户态"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-a26ced764598c929",
      "number": {
        "display": "第 4 题 题干+Part A",
        "major": {
          "display": "第",
          "value": null
        },
        "minor": {
          "display": "4",
          "value": "4"
        },
        "parts": [
          "题 题干+Part A"
        ]
      },
      "type": "fill",
      "moduleIds": [
        "compilation_linking"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "iter-present",
            "marker": "{{blank:iter-present}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "iter-section",
            "marker": "{{blank:iter-section}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "pnt-present",
            "marker": "{{blank:pnt-present}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "pnt-section",
            "marker": "{{blank:pnt-section}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "Point-present",
            "marker": "{{blank:Point-present}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "Point-section",
            "marker": "{{blank:Point-section}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "total-present",
            "marker": "{{blank:total-present}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "total-section",
            "marker": "{{blank:total-section}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "seed-present",
            "marker": "{{blank:seed-present}}",
            "occurrence": 0,
            "width": "medium",
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
            "id": "seed-section",
            "marker": "{{blank:seed-section}}",
            "occurrence": 0,
            "width": "medium",
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
            "blankId": "iter-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "iter-section",
            "method": "self"
          },
          {
            "blankId": "pnt-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "pnt-section",
            "method": "self"
          },
          {
            "blankId": "Point-present",
            "method": "selection",
            "correctValues": [
              "no"
            ]
          },
          {
            "blankId": "Point-section",
            "method": "self"
          },
          {
            "blankId": "total-present",
            "method": "selection",
            "correctValues": [
              "yes"
            ]
          },
          {
            "blankId": "total-section",
            "method": "self"
          },
          {
            "blankId": "seed-present",
            "method": "selection",
            "correctValues": [
              "no"
            ]
          },
          {
            "blankId": "seed-section",
            "method": "self"
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-a26ced764598c929",
          "document": "原文/期末/2021期末-带答案/chap 7 解析.md",
          "lines": {
            "start": 136,
            "end": 202
          },
          "curated": "_curated/期末/chap 7 解析/136.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "符号表中的符号及其定义所在节（.bss/.rodata/UNDEF 等）"
        }
      ],
      "issues": []
    },
    {
      "id": "q-c7c4cf76549e1f00",
      "number": {
        "display": "第 4 题 Part B",
        "major": {
          "display": "第",
          "value": null
        },
        "minor": {
          "display": "4",
          "value": "4"
        },
        "parts": [
          "题 Part B"
        ]
      },
      "type": "short-answer",
      "moduleIds": [
        "compilation_linking"
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
          "legacyId": "q-c7c4cf76549e1f00",
          "document": "原文/期末/2021期末-带答案/chap 7 解析.md",
          "lines": {
            "start": 204,
            "end": 248
          },
          "curated": "_curated/期末/chap 7 解析/204.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "重定位条目 R_X86_64_PLT32/PC32 与符号地址推算"
        }
      ],
      "issues": []
    },
    {
      "id": "q-58e76213788bb4aa",
      "number": {
        "display": "第 4 题 Part C",
        "major": {
          "display": "第",
          "value": null
        },
        "minor": {
          "display": "4",
          "value": "4"
        },
        "parts": [
          "题 Part C"
        ]
      },
      "type": "fill",
      "moduleIds": [
        "ecf_and_system_io"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "entry",
            "marker": "{{blank:entry}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "A",
                  "label": "A · _init"
                },
                {
                  "value": "B",
                  "label": "B · main"
                },
                {
                  "value": "C",
                  "label": "C · __libc_start_main"
                },
                {
                  "value": "D",
                  "label": "D · _start"
                }
              ]
            }
          },
          {
            "id": "mode",
            "marker": "{{blank:mode}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "user",
                  "label": "用户"
                },
                {
                  "value": "kernel",
                  "label": "内核"
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
            "blankId": "entry",
            "method": "selection",
            "correctValues": [
              "D"
            ]
          },
          {
            "blankId": "mode",
            "method": "selection",
            "correctValues": [
              "user"
            ]
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-58e76213788bb4aa",
          "document": "原文/期末/2021期末-带答案/chap 7 解析.md",
          "lines": {
            "start": 250,
            "end": 252
          },
          "curated": "_curated/期末/chap 7 解析/250.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "execve 加载后的入口点 _start 与运行在用户态"
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

%%% part-stem: q-a26ced764598c929
4.  **(本大题共三问，共10分)** 有以下三个 c 文件 `hd.h f1.c f2.c`。使用

`gcc -c f1.c f2.c; gcc f1.o f2.o`

编译后得到可执行文件a.out。回答以下问题。Part A 中涉及的符号所对应的变量已在代码中加粗。****本大题无需理解代码的含义。****

| 文件 | 代码 |
| --- | --- |
| `f1.c` | `#include "hd.h"` `#include <stdio.h>` `const int `**`total`**` = 1 << 30;` `static int count = 0;` `static Point `**`pnt`**`;` `int `**`iter`**`;` `int main() {` `for (iter = 0; iter < total; ++iter) {` `rand_point(&pnt);` `count += if_inside(&pnt);` `}` `printf("Integral on [0,1] is %lf.\n",` `1.0 * count / total);` `}` |
| `hd.h` | `typedef struct {` `double x;` `double y;` `} `**`Point`**`;` `void rand_point(Point *);` `int if_inside(Point *);` |
| `f2.c` | `#include "hd.h"` `#include <stdlib.h>` `#include <time.h>` `void rand_point(Point *ptr) {` `static int `**`seed`**` = 0;` `if (!seed) {` `srand((unsigned)time(NULL));` `seed = 1;` `}` `ptr->x = 1.0 * rand() / RAND_MAX;` `ptr->y = 1.0 * rand() / RAND_MAX;` `}` `int if_inside(Point *p) {` `return 1 / (1 + p->x) >= p->y;` `}` |

Part A. **(每个符号1分，共5分)** 请说明以下符号是否在a.out的符号表中。如果是，请进一步指出符号定义所在的节，可能的选择有.text、.data、.bss、.rodata、COM、UNDEF、ABS。

| 符号名                             | `iter` | `pnt` | `Point` | `total` | `seed` |
|------------------------------------|------|-----|-------|-------|------|
| 在符号表中？（填是／否） | {{blank:iter-present}} | {{blank:pnt-present}} | {{blank:Point-present}} | {{blank:total-present}} | {{blank:seed-present}} |
| 定义所在节（无条目选 /） | {{blank:iter-section}} | {{blank:pnt-section}} | {{blank:Point-section}} | {{blank:total-section}} | {{blank:seed-section}} |
%%% part-reference: q-a26ced764598c929
答案：本大题的 Part A、Part B、Part C 答案如下。

**Part A**（原文答案表）

| 符号名         | `iter`     | `pnt`      | `Point`  | `total`       | `seed`   |
|----------------|----------|----------|--------|-------------|--------|
| 是否在符号表中 | **是**   | **是**   | **否** | **是**      | **否** |
| 定义所在节     | **.bss** | **.bss** |        | **.rodata** |        |

`Point`和`total`的部分容易出错。`Point`作为类型定义，在C中其结构信息已经作为偏移量被汇编代码包含，不需要再显式地输出到.o文件中。`total`已经被初始化成一个非零值，由于`const`修饰 [read-only]，将放入.rodata中。[改卷时 .data 和 .rodata 均给分]

**评分标准：在符号表中的符号，必须正确写出其定义所在节才能得分。**

**Part B**：pnt;  10;  d1 00 00 00

**Part C**：D; 用户

Part A 和 Part C 是基础题，Part B 难度适中。答案均唯一。

具体的启动过程如下图所示[图源：[**http://dbp-consulting.com/tutorials/debugging/linuxProgramStartup.html**](http://dbp-consulting.com/tutorials/debugging/linuxProgramStartup.html)]
%%% part-stem: q-c7c4cf76549e1f00
Part B.** (每空1分，共3分)** 使用`objdump -dx f1.o f2.o` 看到如下几条代码。****这里你可以将重定位类型`R_X86_64_PLT32`和`R_X86_64_PC32`同等看待。****

```
# objdump 重定位条目格式：
#           OFFSET: TYPE              VALUE
# e.g.          18: R_X86_64_PLT32    rand_point-0x4
# 所有数值均以十六进制表示
# f1.o
0000000000000000 <main>:
... # 省略无关代码
17:  e8 00 00 00 00.       callq  1c <main+0x1c>
18:                        R_X86_64_PLT32      rand_point-0x4
1c:  48 8d 3d 00 00 00 00  lea 0x0(%rip),%rdi
1f:                        R_X86_64_PC32       .bss+0xc
23:  e8 00 00 00 00        callq  28 <main+0x28>
24:                        R_X86_64_PLT32      if_inside-0x4
28:  89 c2                 mov %eax,%edx
... # 省略无关代码
# f2.o
0000000000000000 <rand_point>:
... # 省略无关代码
0000000000000074 <if_inside>:
... # 省略无关代码
```

据此你可以确定 `<main+0x1f>` 处的重定位条目是针对符号\_\_\_\_\_\_\_\_(****填写符号名，不要填写.bss这个节名****)的重定位，同时该符号定义的位置在 `f1.o` 中相对于 .bss 节的偏移量是 0x\_\_\_\_\_\_\_\_\_。

现已知 a.out 文件中 `<main+0x17>` 行变成

| `11a1: e8 69 00 00 00          callq  <rand_point>` |
|-----------------------------------------------------|

那么 a.out 中 `<main+0x23>` 行将变成

| 11ad: e8 \_\_\_\_\_\_\_\_\_\_\_          callq  \<if_inside\> |
|---------------------------------------------------------------|
%%% part-reference: q-c7c4cf76549e1f00
答案：pnt；0x10；d1 00 00 00

由汇编可知 `<main+0x1c>` 处是准备`if_inside`函数的参数。于是符号是pnt。假设其相对.bss偏移为x，`refaddr`表示条目的地址，则根据重定位类型都是相对偏移，有

`.bss + 0xc - refaddr = .bss + x - %rip`

于是

`x = 0xc + %rip` – `refaddr = 0xc + 0x4 = 0x10`

因为`if_inside` – `rand_point = 0x74`不变，故第四问的结果是

`0x69` – `(0x11ad` – `0x11a1) + 0x74 = 0xd1`

**评分标准：第二空允许有若干前导0，其余每空必须完全一致才得分**
%%% part-stem: q-58e76213788bb4aa
Part C. **(每空1分，共2分)** 使用`execve`加载a.out并执行时，其中第一个被执行的语句默认是{{blank:entry}}(单选) 函数的开头。已知 gcc -e 可以修改该默认行为到一个程序指定的函数，据此你推断该函数执行在{{blank:mode}}态下(填用户/内核)。

1.  `_init     B.main     C.__libc_start_main    D._start`
%%% part-reference: q-58e76213788bb4aa
答案：D；用户

原文选项按 1./A./B./C./D. 混排，标准答案是 D.\_start，第二空为“用户”。

`_start`是OS执行这段程序的第一条语句，即入口点，它来自于`crt0.o(`或者`crt1.o`，代表 c run-time)模块[因为这段程序没有自定义入口点函数]。第二问的信息已经强烈暗示了该函数只能运行在用户态下[否则直接破坏操作系统对机器的保护和用户间隔离的作用]。实际上，`_start`函数只需准备好 argc、argv和envp，然后准备好 \_\_libc_start_main 的参数。

具体的启动过程如下图所示[图源：[**http://dbp-consulting.com/tutorials/debugging/linuxProgramStartup.html**](http://dbp-consulting.com/tutorials/debugging/linuxProgramStartup.html)]

**评分标准：必须完全一致才得分**
