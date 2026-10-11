+++json
{
  "schemaVersion": "5",
  "id": "q-6e0eea29f44ce37d",
  "revision": 6,
  "paperId": "p-e3f869956fc29bd8",
  "paperOrder": 21,
  "number": {
    "display": "第七题",
    "major": {
      "display": "第七题",
      "value": "7"
    },
    "minor": null,
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
      "legacyId": "q-11519e4dc5364b32",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 758,
        "end": 787
      },
      "curated": "_curated/期末/2018期末-带答案/758.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "i++ 对应的 x86-64 汇编代码"
    },
    {
      "legacyId": "q-c36c9b861c58b521",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 792,
        "end": 872
      },
      "curated": "_curated/期末/2018期末-带答案/792.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "i++/j++ 竞态的输出可能性与信号量死锁"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-11519e4dc5364b32",
      "number": {
        "display": "第七题 1",
        "major": {
          "display": "第七题",
          "value": "7"
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "concurrent_programming"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [

        ]
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
          "legacyId": "q-11519e4dc5364b32",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 758,
            "end": 787
          },
          "curated": "_curated/期末/2018期末-带答案/758.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "i++ 对应的 x86-64 汇编代码"
        }
      ],
      "issues": []
    },
    {
      "id": "q-c36c9b861c58b521",
      "number": {
        "display": "第七题 2-4",
        "major": {
          "display": "第七题",
          "value": "7"
        },
        "minor": {
          "display": "2-4",
          "value": null
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "concurrent_programming"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
                                                  {
            "id": "legacy-gap-4",
            "marker": "{{blank:legacy-gap-4}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "legacy-gap-5",
            "marker": "{{blank:legacy-gap-5}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "legacy-gap-6",
            "marker": "{{blank:legacy-gap-6}}",
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
            "blankId": "legacy-gap-4",
            "method": "self"
          },
          {
            "blankId": "legacy-gap-5",
            "method": "self"
          },
          {
            "blankId": "legacy-gap-6",
            "method": "self"
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-c36c9b861c58b521",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 792,
            "end": 872
          },
          "curated": "_curated/期末/2018期末-带答案/792.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "i++/j++ 竞态的输出可能性与信号量死锁"
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

%%% part-stem: q-11519e4dc5364b32
第七题（10分）
给定如下程序：
```c
#include <stdio.h>
#include <pthread.h>

int i = 0;
int j = 0;

void *do_stuff1(void *arg __attribute__((unused))) {
    int a;
    for (a = 0; a < 1000; a++) {
        i++;
        j++;
    }
    return NULL;
}

void *do_stuff2(void *arg __attribute__((unused))) {
    int a;
    for (a = 0; a < 1000; a++) {
        j++;
        i++;
    }
    return NULL;
}

int main() {
    pthread_t tid1, tid2;
    pthread_create(&tid1, NULL, do_stuff1, NULL);
    pthread_create(&tid2, NULL, do_stuff2, NULL);
    pthread_join(tid1, NULL);
    pthread_join(tid2, NULL);
    printf("%d, %d\n", i, j);
    return 0;
}
```
1.  （2分）用以下元素的编号写出i++编译后的汇编代码。
`(a) mov   (b) add   (c) 0x601040   (d) %eax (e) $0x1`
比如，回答(a) (e) (d)表示`mov $0x1, %eax`
%%% part-reference: q-11519e4dc5364b32
```text
(a) (c) (d)
(b) (e) (d)
(a) (d) (c)
```

（写错任意一个不得分）
%%% part-stem: q-c36c9b861c58b521
2.  （4分）请回答该程序是否有可能输出如下结果，并简述原因。

    - (a) 2000, 2000
    - (b) 1500, 1500
    - (c) 1000, 1000
    - (d) 2, 2

3. （2分）卜廷江同学在学习了信号量之后，决定要让两个计数器最终稳定为 `2000, 2000`，于是对程序进行了如下改写。注释中的数字保留原卷行号；`P` / `V` 是信号量等待 / 释放操作，`Sem_init` 是初始化包装函数。

```c
/* 01 */ #include <stdio.h>
/* 02 */ #include <pthread.h>
/* 03 */ int i = 0;
/* 04 */ int j = 0;
/* 05 */ sem_t si;
/* 06 */ sem_t sj;
/* 07 */ void *do_stuff1(void *arg __attribute__((unused))) {
/* 08 */     int a;
/* 09 */     for (a = 0; a < 1000; a++) {
/* 10 */         P(&si);
/* 11 */         P(&sj);
/* 12 */         i++;
/* 13 */         j++;
/* 14 */         V(&si);
/* 15 */         V(&sj);
/* 16 */     }
/* 17 */     return NULL;
/* 18 */ }
/* 19 */ void *do_stuff2(void *arg __attribute__((unused))) {
/* 20 */     int a;
/* 21 */     for (a = 0; a < 1000; a++) {
/* 22 */         P(&sj);
/* 23 */         P(&si);
/* 24 */         j++;
/* 25 */         i++;
/* 26 */         V(&si);
/* 27 */         V(&sj);
/* 28 */     }
/* 29 */     return NULL;
/* 30 */ }
/* 31 */ int main() {
/* 32 */     pthread_t tid1, tid2;
/* 33 */     Sem_init(&si, 0, 1);
/* 34 */     Sem_init(&sj, 0, 1);
/* 35 */     pthread_create(&tid1, NULL, do_stuff1, NULL);
/* 36 */     pthread_create(&tid2, NULL, do_stuff2, NULL);
/* 37 */     pthread_join(tid1, NULL);
/* 38 */     pthread_join(tid2, NULL);
/* 39 */     printf("%d\n", i);
/* 40 */     return 0;
/* 41 */ }
```
请问卜廷江同学的程序有什么潜在问题？为什么？

4. （2分）如果对程序改动一处数字来消除上述问题，同时仍然保证两个计数器最终稳定为 `2000, 2000`，应该如何改动？（原代码第 39 行只打印 `i`，此处讨论 `i`、`j` 的最终值。）

回答：将{{blank:legacy-gap-4}}（填行号）行的{{blank:legacy-gap-5}}（填数字）改为{{blank:legacy-gap-6}}（填数字）。
%%% part-reference: q-c36c9b861c58b521
以下沿用原题将自增拆成读、加、写指令的交错执行模型；不是对存在数据竞争的 C 程序作语言层面的保证。

2. (a) 可能，两个函数完全串行执行即可。

   (b) 可能。`do_stuff1` 先读取 `i`，然后 `do_stuff2` 执行 500 次循环；接下来 `do_stuff1` 写回 `i` 并完成该次循环，此时 `i = 1`、`j = 501`。之后 `do_stuff2` 读取 `j`，`do_stuff1` 执行 500 次循环；接下来 `do_stuff2` 完成该次循环，此时 `i = 501`、`j = 501`。然后两个线程串行执行各自剩下的 499 次循环即可。

   (c) 不可能。在原题指令交错模型下，程序结束时 `i + j >= 2002`：一个线程的旧值写回可以覆盖另一线程的若干次自增，但两个线程的 `i++`、`j++` 顺序相反，首尾存在不能同时被覆盖的更新。

   (d) 不可能，理由同上。

（前一半对，后一半解释大致差不多得分，否则不得分。）

3. 死锁。两个线程分别持有一个信号量，在第 11 行和第 23 行等待对方释放另一个信号量。

4. 将第 33 行或第 34 行的 `1` 改为任意大于等于 `2` 的整数，另一处仍为 `1`。初值为 `2` 的信号量可同时供两个线程获取，避免循环等待；另一个初值为 `1` 的信号量仍保证计数器操作互斥。原解析写作“大于 2”，但 `2` 也足够。本小问允许多种相互关联的改法，保留自评。
