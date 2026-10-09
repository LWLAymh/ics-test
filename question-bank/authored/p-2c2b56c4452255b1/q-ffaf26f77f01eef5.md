+++json
{
  "schemaVersion": "5",
  "id": "q-ffaf26f77f01eef5",
  "revision": 1,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 56,
  "number": {
    "display": "大题",
    "major": {
      "display": "大题",
      "value": null
    },
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "virtual_memory_and_malloc",
    "moduleIds": [
      "virtual_memory_and_malloc",
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
      "legacyId": "q-c269d968c30f6a73",
      "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
      "lines": {
        "start": 61,
        "end": 153
      },
      "curated": "_curated/期末/chap 9 题目/61.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "IA32 两级页表+TLB 命中：物理访存次数与实质权限"
    },
    {
      "legacyId": "q-b48bdc4603e2fe19",
      "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
      "lines": {
        "start": 157,
        "end": 157
      },
      "curated": "_curated/期末/chap 9 题目/157.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "TLB 未命中：页表遍历与二级页表起始地址"
    },
    {
      "legacyId": "q-7e98b751f0325385",
      "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
      "lines": {
        "start": 159,
        "end": 189
      },
      "curated": "_curated/期末/chap 9 题目/159.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "malloc 未初始化致结果不定，应改 calloc/memset"
    },
    {
      "legacyId": "q-f7fcda18b34e3a29",
      "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
      "lines": {
        "start": 191,
        "end": 197
      },
      "curated": "_curated/期末/chap 9 题目/191.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "参数非法使段错误发生在 y[0] 的充要条件"
    },
    {
      "legacyId": "q-4689e57e852af72d",
      "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
      "lines": {
        "start": 199,
        "end": 205
      },
      "curated": "_curated/期末/chap 9 题目/199.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "double fault：缺页处理程序再次触发故障（选项为原文的 ①/②/③）"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-c269d968c30f6a73",
      "number": {
        "display": "大题 1",
        "major": {
          "display": "大题",
          "value": null
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "virtual_memory_and_malloc"
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
          "legacyId": "q-c269d968c30f6a73",
          "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
          "lines": {
            "start": 61,
            "end": 153
          },
          "curated": "_curated/期末/chap 9 题目/61.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "IA32 两级页表+TLB 命中：物理访存次数与实质权限"
        }
      ],
      "issues": []
    },
    {
      "id": "q-b48bdc4603e2fe19",
      "number": {
        "display": "大题 2",
        "major": {
          "display": "大题",
          "value": null
        },
        "minor": {
          "display": "2",
          "value": "2"
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "virtual_memory_and_malloc"
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
          "legacyId": "q-b48bdc4603e2fe19",
          "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
          "lines": {
            "start": 157,
            "end": 157
          },
          "curated": "_curated/期末/chap 9 题目/157.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "TLB 未命中：页表遍历与二级页表起始地址"
        }
      ],
      "issues": []
    },
    {
      "id": "q-7e98b751f0325385",
      "number": {
        "display": "大题 3(1)",
        "major": {
          "display": "大题",
          "value": null
        },
        "minor": {
          "display": "3(1)",
          "value": null
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "virtual_memory_and_malloc"
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
          "legacyId": "q-7e98b751f0325385",
          "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
          "lines": {
            "start": 159,
            "end": 189
          },
          "curated": "_curated/期末/chap 9 题目/159.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "malloc 未初始化致结果不定，应改 calloc/memset"
        }
      ],
      "issues": []
    },
    {
      "id": "q-f7fcda18b34e3a29",
      "number": {
        "display": "大题 3(2)",
        "major": {
          "display": "大题",
          "value": null
        },
        "minor": {
          "display": "3(2)",
          "value": null
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "virtual_memory_and_malloc"
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
          "legacyId": "q-f7fcda18b34e3a29",
          "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
          "lines": {
            "start": 191,
            "end": 197
          },
          "curated": "_curated/期末/chap 9 题目/191.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "参数非法使段错误发生在 y[0] 的充要条件"
        }
      ],
      "issues": []
    },
    {
      "id": "q-4689e57e852af72d",
      "number": {
        "display": "大题 4",
        "major": {
          "display": "大题",
          "value": null
        },
        "minor": {
          "display": "4",
          "value": "4"
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "ecf_and_system_io"
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
          "legacyId": "q-4689e57e852af72d",
          "document": "原文/期末/2021期末-带答案/chap 9 题目.md",
          "lines": {
            "start": 199,
            "end": 205
          },
          "curated": "_curated/期末/chap 9 题目/199.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "double fault：缺页处理程序再次触发故障（选项为原文的 ①/②/③）"
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

%%% part-stem: q-c269d968c30f6a73
大题（15分）

IA32体系采用**小端法**、32位虚拟地址和两级页表。两级页表大小相同，页大小都是`4 KB = 2$`^{12}$ Byte，结构也相同。TLB 采用**直接映射**，4位组索引。TLB 和页表每一项格式如图所示：

| 31 12 | 11 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Address of 4KB page frame | Ignored | G | PAT | D | A | PCD | PWT | U/S | R/W | P |

部分位的含义如下：

0 (P): 1表示存在，0表示不存在

1 (R/W)：1表示可写，0表示只读

2 (U/S)：1表示内核模式，0表示用户模式

当系统运行到某一时刻时，TLB**有效位为1**的条目如下（未列出部分都是无效的）：

| 索引（十进制） | TLB 标记 |    内容    |
|:--------------:|:--------:|:----------:|
|       0        |  `0x0400`  | `0x0ec91313` |
|       3        |  `0x02ff`  | `0x5d2bac01` |
|       5        |  `0xd551`  | `0x019fa42d` |
|       11       |  `0x55a6`  | `0xfdd3c66b` |
|       13       |  `0x5515`  | `0xb591926b` |

一级页表的基地址为`0x00e66000`，物理内存中的部分内容如下（均为十六进制）：

|   地址   | 内容 |   地址   | 内容 |   地址   | 内容 |
|:--------:|:----:|:--------:|:----:|:--------:|:----:|
| 00615000 |  21  | 00615001 |  2d  | 00615002 |  ee  |
| 00615003 |  c0  | 006154d0 |  ff  | 006154d1 |  a0  |
| 00e66001 |  a1  | 00e66002 |  a4  | 00e66003 |  67  |
| 00e66004 |  21  | 00e66005 |  57  | 00e66006 |  61  |
| 00e66007 |  00  | 2167e000 |  42  | 2167e001 |  67  |
| 2167e002 |  9a  | 2167e003 |  7c  | c0ee2000 |  6f  |
| c0ee2001 |  d5  | c0ee2002 |  7e  | c0ee24d0 |  48  |
| c0ee24d1 |  83  | c0ee24d2 |  ec  | c0ee2d21 |  11  |
| c0ee2d22 |  6b  | c0ee2d23 |  82  | c0ee2d24 |  8a  |

1.  将 cache 清空。访问一个在主存中的虚拟地址，TLB命中，**没有**触发缺页异常，这一过程中，需要访问物理内存（主存）\_\_\_\_\_次（3分）。具体来说，如果该虚拟地址为 `y = 0xd5515213`，y 地址所具有的**实质权限**是\_\_\_\_\_\_\_\_\_（多选题，选对才得分2分）。
%%% part-reference: q-c269d968c30f6a73
答案：1 次（TLB 命中且无缺页，故只需访问一次物理内存取数据）；②④（选项为原文的 ①可写 ②只读 ③用户模式权限 ④内核模式权限）

依据：y 的 `TLBT=0xd551`、`TLBI=5`，查表得 TLB 条目内容 `0x019fa42d`，其中 `R/W=0`、`U/S=1`，故该页实质权限为只读、内核模式。
%%% part-stem: q-b48bdc4603e2fe19
2.  不考虑第一小问，将 cache 清空。访问一个在主存中的虚拟地址，TLB不命中，**没有**触发缺页异常，这一过程中，需要访问物理内存（主存）\_\_\_\_\_次（3分）。具体来说，如果该虚拟地址为`x = 0x004004d0`，那么x 对应的二级页表起始地址是\_\_\_\_\_\_\_\_\_\_\_\_\_\_（填写16进制，例如`0x00123000`，2分），x 地址上单字节的**内容**是\_\_\_\_\_\_（填写16进制，例如`0x00`，1分）。
%%% part-reference: q-b48bdc4603e2fe19
答案：3 次；0x00615000；0x48

依据：TLB 未命中且无缺页，需要访问页目录、二级页表和物理页，共 3 次。x 的 `VPN1=1`、`VPN2=0`、`PPO=0x4d0`，页目录项地址 `0x00e66000+1*4=0x00e66004`，按小端读出 `0x00615721`，故二级页表首地址为 `0x00615000`；该地址处的表项小端读出 `0xc0ee2d21`，物理页首地址 `0xc0ee2000`，故 x 的物理地址为 `0xc0ee2000+0x4d0=0xc0ee24d0`，内容为 `0x48`。
%%% part-stem: q-7e98b751f0325385
3.  考虑下面计算矩阵和向量乘法代码：

`1 int *mat_vec_mul(int **A, int *x, int n)`

2 {

3 int i, j;

`4 int *y = (int *)malloc(n * sizeof(int))`;

5 \*for\* (i = 0; i \< n; i++)

6 \*for\* (j = 0; j \< n; j++)

`7 y[i] += A[i][j] * x[j]`;

8 \*return\* y;

9 }

⑴ 在64位 Linux 机器中运行该代码，输入**同一组合法的参数**后，每次运行返回的向量的值都**不一样**，修复这一错误有一种简单的方法，将第\_\_\_\_行改为\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_。（第二空填写C代码，每空1分，共2分）

可能用到的函数：

`void *memcpy(void *dest, const void *src, size_t n)`;

`void *memset(void *s, int c, size_t n)`;

`void *calloc(size_t nelem, size_t elemsize)`;

`void *realloc(void *ptr, size_t size)`;
%%% part-reference: q-7e98b751f0325385
答案：第 4 行改为 int \*y = (int \*)calloc(n, sizeof(int)); 或 int \*y = (int \*)Calloc(n, sizeof(int));（calloc/Calloc 的两个参数只要乘起来等于 n \* sizeof(int) 即算对）

依据：`malloc` 不会清零所分配的内存区域，故同一组输入可能得到不同的输出；改用以清零方式分配的 calloc/Calloc 即可修复。
%%% part-stem: q-f7fcda18b34e3a29
⑵ 在进行前一问的测试**之前**，还在64位 Linux 机器上进行过如下用户代码测试（输入 `mat_vec_mul`的参数都**非零**）：

`int *y = mat_vec_mul(A, x, n)`;

`int z = y[0]`;

结果发生了段错误。通过`gdb`调试发现`mat_vec_mul`函数内并没有发生段错误，但是在初始化变量z时发生了段错误，后来发现是参数的输入有问题。写出出现这种错误的**充分必要条件**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_（1分）
%%% part-reference: q-f7fcda18b34e3a29
答案：n \< 0（或其他等价表达）

依据：若 `malloc` 分配成功则 y 非空指针，`y[0]` 不可能在外部访问时出现段错误，故 `malloc` 一定失败、y 为空指针；而 `mat_vec_mul` 内部没有触发段错误，说明两次循环都没有进入，即 `n<=0`，结合参数非零得 `n<0`。反过来，64 位 Linux 的用户虚拟地址空间为 48 位，`n<0` 时 `n*sizeof(int)` 经符号扩展后最高位至少有 33 个 1，乘 `sizeof(int)` 后仍大于 $2^{63}$ 与 $2^{48}$，`malloc` 必定失败，故 `n<0` 也是充分条件。
%%% part-stem: q-4689e57e852af72d
4.  Double fault：Intel处理器中有一种特殊的异常，被称为double fault。此异常发生表明调用某个**故障（fault）**A的处理程序后又触发了另一个故障B。正常情况下，故障B会有相应异常处理程序来处理，因此两个故障B和A可以被顺序解决。但是如果处理器无法正常处理故障B，或是处理了之后依然无法处理故障A，就会产生double fault，并终止（abort）。假设除了缺页异常处理程序外，其他异常处理程序**都不会产生新的故障**。如果在某次**缺页故障**时产生了double fault，其原因可能是\_\_\_\_\_\_\_\_\_\_（不定项选择，都选对才得分，1分）

> ① 运行缺页故障处理程序时， CPU上的权限位是内核态，但所执行代码段 `U/S=0`
>
> ② 运行缺页故障处理程序时，CPU接收到了键盘发送的Ctrl + C信号
>
> ③ 缺页故障处理程序没有加载到主存中
%%% part-reference: q-4689e57e852af72d
答案：③（选项为原文的 ①/②/③ 谓词，故保留原编号）

依据：① 权限位是内核态时可以正常运行用户级代码段，不会触发异常；② 外部中断不属于故障，不会触发新的故障；③ 缺页故障处理程序不在主存，调用它时会再次触发缺页故障，而该故障仍无法被解决，于是产生 double fault。
