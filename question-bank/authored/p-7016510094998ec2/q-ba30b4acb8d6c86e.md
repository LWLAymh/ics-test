+++json
{
  "schemaVersion": "5",
  "id": "q-ba30b4acb8d6c86e",
  "revision": 4,
  "paperId": "p-7016510094998ec2",
  "paperOrder": 19,
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
    "primaryModuleId": "virtual_memory_and_malloc",
    "moduleIds": [
      "virtual_memory_and_malloc"
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
      "legacyId": "q-d92185485a797988",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 412,
        "end": 418
      },
      "curated": "_curated/期末/2022期末-无答案/412.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Linux 进程虚拟内存布局各区域内容（含图）"
    },
    {
      "legacyId": "q-443a702b2f36d4d9",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 420,
        "end": 420
      },
      "curated": "_curated/期末/2022期末-无答案/420.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "写只读代码段/映射区地址的后果分析"
    },
    {
      "legacyId": "q-7e4dbca71b0f137c",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 422,
        "end": 510
      },
      "curated": "_curated/期末/2022期末-无答案/422.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "堆上代码的 4 处内存安全错误定位"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-d92185485a797988",
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
        "virtual_memory_and_malloc"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {"id":"vm-code","marker":"{{blank:vm-code}}","occurrence":0,"width":"medium"},
          {"id":"vm-heap","marker":"{{blank:vm-heap}}","occurrence":0,"width":"medium"},
          {"id":"vm-map","marker":"{{blank:vm-map}}","occurrence":0,"width":"long"},
          {"id":"vm-stack","marker":"{{blank:vm-stack}}","occurrence":0,"width":"medium"}
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
          {"blankId":"vm-code","method":"exact","acceptedAnswers":["代码","程序代码","代码段","text",".text"],"normalize":{"caseSensitive":false,"trimWhitespace":true}},
          {"blankId":"vm-heap","method":"exact","acceptedAnswers":["运行时堆","堆","heap","run-time heap"],"normalize":{"caseSensitive":false,"trimWhitespace":true}},
          {"blankId":"vm-map","method":"exact","acceptedAnswers":["共享库的内存映射区域","共享库内存映射区域","共享库映射区","共享库","memory-mapped region for shared libraries"],"normalize":{"caseSensitive":false,"trimWhitespace":true}},
          {"blankId":"vm-stack","method":"exact","acceptedAnswers":["用户栈","运行时栈","栈","stack","user stack"],"normalize":{"caseSensitive":false,"trimWhitespace":true}}
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
          "legacyId": "q-d92185485a797988",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 412,
            "end": 418
          },
          "curated": "_curated/期末/2022期末-无答案/412.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "Linux 进程虚拟内存布局各区域内容（含图）"
        }
      ],
      "issues": []
    },
    {
      "id": "q-443a702b2f36d4d9",
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
          "legacyId": "q-443a702b2f36d4d9",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 420,
            "end": 420
          },
          "curated": "_curated/期末/2022期末-无答案/420.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "写只读代码段/映射区地址的后果分析"
        }
      ],
      "issues": []
    },
    {
      "id": "q-7e4dbca71b0f137c",
      "number": {
        "display": "第五题 3",
        "major": {
          "display": "第五题",
          "value": "5"
        },
        "minor": {
          "display": "3",
          "value": "3"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "virtual_memory_and_malloc"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "legacy-gap-0",
            "marker": "{{blank:legacy-gap-0}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "legacy-gap-1",
            "marker": "{{blank:legacy-gap-1}}",
            "occurrence": 0,
            "width": "long"
          },
          {"id":"bug-3","marker":"{{blank:bug-3}}","occurrence":0,"width":"long"},
          {"id":"bug-4","marker":"{{blank:bug-4}}","occurrence":0,"width":"long"}
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
            "blankId": "legacy-gap-0",
            "method": "self"
          },
          {
            "blankId": "legacy-gap-1",
            "method": "self"
          },
          {"blankId":"bug-3","method":"self"},
          {"blankId":"bug-4","method":"self"}
        ]
      },
      "sources": [
        {
          "legacyId": "q-7e4dbca71b0f137c",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 422,
            "end": 510
          },
          "curated": "_curated/期末/2022期末-无答案/422.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "堆上代码的 4 处内存安全错误定位"
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
第五题 虚拟内存管理

第(1)、(2)问共用下列教材中的典型 Linux 虚拟内存布局图。第(2)问假设未安装自定义信号处理程序，图中代码区只读，堆与共享库映射区之间的空隙尚未映射。

![Linux 进程虚拟内存地址空间布局图](assets/期末/2022期末-无答案/page-09-q.png)

%%% reference

%%% part-stem: q-d92185485a797988
1. 根据公共题面的 Linux 进程虚拟内存布局图，填写①②③④存放的内容。（每空1分，共4分）

① {{blank:vm-code}}；② {{blank:vm-heap}}；③ {{blank:vm-map}}；④ {{blank:vm-stack}}。
%%% part-reference: q-d92185485a797988
答案：
① 代码
② 运行时堆
③ 共享库的内存映射区域
④ 用户栈
%%% part-stem: q-443a702b2f36d4d9
2. 根据公共图和已给的映射/权限条件，如果执行 `*(int *)main = 0` 写代码区，会出现何种结果？如果执行 `mov $0x0a, count`，其中 `count` 所标识的目标地址位于②和③之间尚未映射的空隙，又会出现何种结果？忽略指令编译与链接的细节，只分析CPU写目标地址时的行为。（每问1分，共2分）
%%% part-reference: q-443a702b2f36d4d9
答案：① 写只读代码页触发保护性页故障；② 写未映射地址触发页故障。操作系统无法满足这两种访问，通常向进程递送 `SIGSEGV`；在题面假设的默认处理下终止进程。
%%% part-stem: q-7e4dbca71b0f137c
3、内存安全（共 4 分，找出一个错误给 1 分）

以下代码有 4 处内存安全错误，请指出所在代码行行号并简要说明。

注意：

1）请仔细阅读注释；

2）不需要考虑库函数的错误和库函数调用出错的情况（因此不需要考虑返回值检查）；

3）说明时加上必要的代码行号，请使用简洁的语言；

4）只需说明为什么会出错，无需给出修补方法。

```c
 5) #include <assert.h>
 6) #include <stdio.h>
 7) #include <stdlib.h>
 8)
 9) // There're 4 memory safety bugs
10)
11) // Assume all calls to library functions succeed
12) // For simplicity, our vector type can only hold ints.
13) typedef struct {
14)     int *data;      // Pointer to our array on the heap
15)     int length;     // How many elements are in our array
16)     int capacity;   // How many elements our array can hold
17) } Stack;
18)
19) // Get a chunk of heap memory that can accomodate `size` int number
20) int *get_heap_memory(int size) {
21)     int *new_data = (int *)malloc(size);
22)     assert(new_data != NULL);
23)     return new_data;
24) }
25)
26) Stack *stack_new() {
27)     Stack stack;
28)     stack.data      = get_heap_memory(1);
29)     stack.length    = 0;
30)     stack.capacity  = 1;
31)     return &stack;
32) }
33)
34) void stack_push(Stack *stack, int n) {
35)     if (stack->length == stack->capacity) {
36)         int new_capacity = stack->capacity * 2;
37)
38)         int *new_data = get_heap_memory(new_capacity);
39)
40)         for (int i = 0; i < stack->length; ++i) {
41)             new_data[i] = stack->data[i];
42)         }
43)
44)         free(stack->data);
45)         stack->data       = new_data;
46)         stack->capacity   = new_capacity;
47)     }
48)
49)     stack->data[stack->length] = n;
50)     stack->length += 1;
51) }
52)
53) int main() {
54)     Stack *stack = stack_new();
55)     stack_push(stack, 107);
56)
57)     int *n = &stack->data[0];
58)     stack_push(stack, 110);
59)     printf("%d\n", *n);
60)
61)     free(stack);
62) }
```

错误：

(1) {{blank:legacy-gap-0}}

(2) {{blank:legacy-gap-1}}

(3) {{blank:bug-3}}

(4) {{blank:bug-4}}
%%% part-reference: q-7e4dbca71b0f137c
答案：
① 第 21 行 所申请的内存大小不足，应该为 `malloc(size*sizeof(int))`;
② 第 27 与 31 行 不能返回局部变量的地址
③ 第 59 行 `n` 所指向的地址在 `push` 后可能已经被释放
④ 第 61 行 `stack.data` 没有被释放，造成内存泄露
