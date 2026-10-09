+++json
{
  "schemaVersion": "5",
  "id": "q-3f9ed52da109fab6",
  "revision": 1,
  "paperId": "p-bc69f9ea3beff7ee",
  "paperOrder": 7,
  "number": {
    "display": "第一题 7",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "7",
      "value": "7"
    },
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
      "legacyId": "q-3f9ed52da109fab6",
      "document": "原文/期末/2016期末-带答案.md",
      "lines": {
        "start": 124,
        "end": 142
      },
      "curated": "_curated/期末/2016期末-带答案/124.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "同名全局变量的符号解析与 extern"
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
      "A"
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
7. C 源文件 `f1.c` 和 `f2.c` 如下。编译、链接并运行生成的可执行文件，输出结果为：

`f1.c`：

```c
#include <stdio.h>

static int var = 100;

int main(void) {
    extern int var;
    extern void f(void);
    f();
    printf("%d\n", var);
    return 0;
}
```

`f2.c`：

```c
int var = 200;

void f(void) {
    var++;
}
```
%%% reference
答案：A。

`f1.c` 中的 `var` 是文件内静态变量，`main` 中的 `extern int var` 仍引用同一翻译单元内已经声明的该变量；`f2.c` 中的全局 `var` 是另一个符号。`f()` 递增后者，不改变 `f1.c` 中打印的静态 `var`。
%%% option: A
100
%%% option: B
200
%%% option: C
201
%%% option: D
链接错误
