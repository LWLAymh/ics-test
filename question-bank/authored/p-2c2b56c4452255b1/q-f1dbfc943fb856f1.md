+++json
{
  "schemaVersion": "5",
  "id": "q-f1dbfc943fb856f1",
  "revision": 1,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 49,
  "number": {
    "display": "第 3 题",
    "major": {
      "display": "第",
      "value": null
    },
    "minor": {
      "display": "3",
      "value": "3"
    },
    "parts": [
      "题"
    ]
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
      "legacyId": "q-f1dbfc943fb856f1",
      "document": "原文/期末/2021期末-带答案/chap 7 解析.md",
      "lines": {
        "start": 75,
        "end": 131
      },
      "curated": "_curated/期末/chap 7 解析/75.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "动态链接：dlopen 与 PLT/GOT、库的符号解析顺序（含答案与解析）"
    }
  ],
  "type": "single-choice",
  "stem": {
    "format": "markdown"
  },
  "solution": {
    "state": "available",
    "grading": "choice",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    },
    "correctOptionIds": [
      "B"
    ]
  },
  "options": [
    {
      "id": "A",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "B",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "C",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "D",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
3. 以下程序可以使用 `gcc dl.c -ldl` 编译并正常运行。如果缺少 `-ldl` 标志，链接时会报错 `undefined reference to 'dlopen'`。基于你对动态链接的理解，以下说法中**不正确**的是：

```c
// dl.c
#include <dlfcn.h>

const char *path = "/lib/libc.so";
int (*printf)(const char *x);

int main() {
    void *handle = dlopen(path, RTLD_NOW);
    printf = dlsym(handle, "printf");
    printf("2022 is coming!\n");
    dlclose(handle);
}
```
%%% reference
答案：B。

解析：

省略 -ldl 标志报错，表明 `ld` 默认不会包含 libdl.so (与之对比，libc.so 默认包含)，并且 `dlopen` 的定义来自于该共享库。

选项 1 正确。.dynsym 含有一个符号表条目。格式形如

0000000000001390 g DF .text 0000000000000085 GLIBC_2.2.5 dlopen

“动态链接符号表”的描述是准确的，也不影响理解。

选项 2 错误，`printf` 只是一个未初始化的全局变量。它不是内置的 `printf` 函数。

选项 3 正确。默认程序动态绑定 `dlopen` 到共享库，它需要自己的 PLT 表和 GOT 表。

选项 4 正确。`gcc` 按照命令行顺序解析。不管是动态库还是静态库只解析当前已经被引用的符号（这一点容易推断，否则没有必要建立专门的库文件格式了。因此没有补充在题目中交代动态链接符号解析的规则。），所以 -ldl 放在第一个位置没有任何效果。最后会在链接阶段产生 `dlopen`、`dlsym` 或者 `dlclose` 未能解析的错误。

额外说明，libc.so 和 libdl.so 在实际系统上可能会带上版本号，路径名一般也更复杂。这里为了出题，做了合适的简化。
%%% option: A
该机器上的 `libdl.so` 模块中包含符号名为 `dlopen` 的动态链接符号表条目
%%% option: B
在 `a.out` 文件中包含 `printf` 的 PLT 条目和相应的 GOT 条目
%%% option: C
在 `a.out` 文件中包含 `dlopen` 的 PLT 条目和相应的 GOT 条目
%%% option: D
如果使用 `gcc -ldl dl.c` 编译程序，则会在链接时发生同样错误
