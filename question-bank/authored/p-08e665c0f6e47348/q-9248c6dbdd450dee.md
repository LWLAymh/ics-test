+++json
{
  "schemaVersion": "5",
  "id": "q-9248c6dbdd450dee",
  "revision": 2,
  "paperId": "p-08e665c0f6e47348",
  "paperOrder": 19,
  "number": {
    "display": "第一题 19",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "19",
      "value": "19"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "concurrent_programming",
    "moduleIds": [
      "concurrent_programming"
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
      "legacyId": "q-9248c6dbdd450dee",
      "document": "原文/期末/2015期末-20160104-带答案.md",
      "lines": {
        "start": 281,
        "end": 316
      },
      "curated": "_curated/期末/2015期末-20160104-带答案/281.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "多线程可共享的变量（全局/静态局部）"
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
19. 有如下代码（已将原清单的线程标识符改为 `pthread_t`，并用 `intptr_t` 传递整数参数）：
```c
#include <stdint.h>
#include "csapp.h"
void thread_internal(int);
int counter = 0;
void * thread(void * vargp)
{
  int thread_var = (int)(intptr_t)vargp;
  static int thread_counter = 0;
  thread_internal(thread_var);
  thread_counter ++;
  return NULL;
}
int main (int argc, const char ** argv)
{
  pthread_t tid1, tid2;
  int var = atoi(argv[1]);
  Pthread_create(&tid1, NULL, thread, (void *)(intptr_t)var);
  Pthread_create(&tid2, NULL, thread, (void *)(intptr_t)var);
  Pthread_join(tid1, NULL);
  Pthread_join(tid2, NULL);
  return 0;
}
```
按变量存储期和词法作用域分类，以下哪一对是两个线程函数可使用的全局/静态共享对象？本题不把传值产生的局部副本算作同一对象，也不假设额外传递了局部变量地址。
%%% reference
答案：B
（本题考查对线程中共享变量的概念的理解。因为 `counter` 是全局变量；
`thread_counter` 是静态局部变量，两次调用引用同一存储对象。`thread_var` 是每次调用自己的自动变量，`var` 的值作为参数复制，不是把 `main` 中变量对象的地址传过去。线程共享地址空间，若显式传递一个仍存活的栈对象地址，也可访问该对象；不能笼统说“栈变量绝不能共享”。）
%%% option: A
counter, var
%%% option: B
counter, thread_counter
%%% option: C
var, thread_counter
%%% option: D
thread_var, thread_counter
