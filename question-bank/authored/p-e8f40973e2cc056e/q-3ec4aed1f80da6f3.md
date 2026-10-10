+++json
{
  "schemaVersion": "5",
  "id": "q-3ec4aed1f80da6f3",
  "revision": 2,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 28,
  "number": {
    "display": "四 2",
    "major": {
      "display": "四",
      "value": null
    },
    "minor": {
      "display": "2",
      "value": "2"
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
      "legacyId": "q-51332fd0f4b3baa8",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 499,
        "end": 504
      },
      "curated": "_curated/期末/2025期末-无答案/499.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Lightswitch 读者-写者：调整信号量操作后的竞争/死锁判断"
    },
    {
      "legacyId": "q-6b0d64ca8f0741b2",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 505,
        "end": 601
      },
      "curated": "_curated/期末/2025期末-无答案/505.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Lightswitch 读者-写者：给定到达时刻的并发状态选择"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-51332fd0f4b3baa8",
      "number": {
        "display": "四 2（1）",
        "major": {
          "display": "四",
          "value": null
        },
        "minor": {
          "display": "2（1）",
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
            "id": "swap-result",
            "marker": "{{blank:swap-result}}",
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
            "blankId": "swap-result",
            "method": "selection",
            "correctValues": [
              "no"
            ]
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-51332fd0f4b3baa8",
          "document": "原文/期末/2025期末-无答案.md",
          "lines": {
            "start": 499,
            "end": 504
          },
          "curated": "_curated/期末/2025期末-无答案/499.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "Lightswitch 读者-写者：调整信号量操作后的竞争/死锁判断"
        }
      ],
      "issues": []
    },
    {
      "id": "q-6b0d64ca8f0741b2",
      "number": {
        "display": "四 2（2）",
        "major": {
          "display": "四",
          "value": null
        },
        "minor": {
          "display": "2（2）",
          "value": null
        },
        "parts": []
      },
      "type": "single-choice",
      "moduleIds": [
        "concurrent_programming"
      ],
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
          "C"
        ]
      },
      "sources": [
        {
          "legacyId": "q-6b0d64ca8f0741b2",
          "document": "原文/期末/2025期末-无答案.md",
          "lines": {
            "start": 505,
            "end": 601
          },
          "curated": "_curated/期末/2025期末-无答案/505.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "Lightswitch 读者-写者：给定到达时刻的并发状态选择"
        }
      ],
      "issues": [],
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

%%% part-stem: q-51332fd0f4b3baa8
2.（3分）小明在学习了读者-写者问题后，编写了以下代码用来解决读者-写者问题。其中，Lightswitch结构体封装了进入临界区的读者计数counter的操作逻辑，保证当有读者在临界区时，其他读者仍然可以进入，但写者无法进入。请阅读下面代码（代码阅读提示：主要关注`reader`和writer两个函数），回答问题：
（1）交换 `reader` 函数里的 `lock(&reader_switch, &wmutex);` 和 `V(&empty);` 两行，是否会导致竞争或死锁问题？答：{{blank:swap-result}}（填“是”或“否”）
%%% part-reference: q-51332fd0f4b3baa8
答案：（1）否（1分）
%%% part-stem: q-6b0d64ca8f0741b2
（2）在本题的reader和writer实现基础上，考虑一共有3个读者（R1，R2，R3）和2个写者（W1，W2）依次到来，且循环仅执行一次（NUM_OPERATIONS=1）的情况，读者执行读操作时间为7，写者执行写操作时间为8，其到达时间如下：R1:0, R2:1, W1:2, W2:4, R3:5。在时刻6时，R1、R2、W1、W2、R3依次处于的位置可能是：答：（ ）
（注意，为简单起见，只考虑读写时间，忽略所有其他时间，包括代码中其他语句的执行时间、线程切换、调度等等，亦假设没有更多的读者或写者或其他线程。）
```c
#include “csapp.h”
#define NUM_READERS 5
#define NUM_WRITERS 10
#define NUM_OPERATIONS 100
typedef struct {
    int counter;
    sem_t mutex;
} Lightswitch;
void lightswitch_init(Lightswitch* ls) {
    ls->counter = 0;
    sem_init(&ls->mutex, 0, 1);
}
void lock(Lightswitch* ls, sem_t* semaphore) {
    P(&ls->mutex);
    ls->counter += 1;
    if (ls->counter == 1) {
        P(semaphore);
    }
    V(&ls->mutex);
}
void unlock(Lightswitch* ls, sem_t* semaphore) {
    P(&ls->mutex);
    ls->counter -= 1;
    if (ls->counter == 0) {
        V(semaphore);
    }
    V(&ls->mutex);
}
void lightswitch_destroy(Lightswitch* ls) {
    sem_destroy(&ls->mutex);
}
sem_t wmutex;
sem_t empty;
Lightswitch reader_switch;
void* writer(void* arg) {
    (1) for (int i = 0; i < NUM_OPERATIONS; i++) {
        (2) P(&empty);
        (3) P(&wmutex);
        (4) // writing here, need 8 time unit
        (5) V(&wmutex);
        (6) V(&empty);
    }
    return NULL;
}
void* reader(void* arg) {
    (7) for (int i = 0; i < NUM_OPERATIONS; i++) {
        (8) P(&empty);
        (9) lock(&reader_switch, &wmutex);
        (10) V(&empty);
        (11) // reading here, need 7 time unit
        (12) unlock(&reader_switch, &wmutex);
    }
    return NULL;
}
int main() {
    pthread_t readers[NUM_READERS];
    pthread_t writers[NUM_WRITERS];
    sem_init(&wmutex, 0, 1);
    sem_init(&empty, 0, 1);
    lightswitch_init(&reader_switch);
    for (int i = 0; i < NUM_READERS; i++)
        pthread_create(&readers[i], NULL, reader, NULL);
    for (int i = 0; i < NUM_WRITERS; i++)
        pthread_create(&writers[i], NULL, writer, NULL);
    for (int i = 0; i < NUM_READERS; i++)
        pthread_join(readers[i], NULL);
    for (int i = 0; i < NUM_WRITERS; i++)
        pthread_join(writers[i], NULL);
    sem_destroy(&wmutex);
    sem_destroy(&empty);
    lightswitch_destroy(&reader_switch);
    return 0;
}
```
%%% part-reference: q-6b0d64ca8f0741b2
答案：C（2分）
%%% part-option: q-6b0d64ca8f0741b2 A
(9),(8),(4),(2),(11)
%%% part-option: q-6b0d64ca8f0741b2 B
(11),(8),(3),(3),(8)
%%% part-option: q-6b0d64ca8f0741b2 C
(11),(11),(3),(2),(8)
%%% part-option: q-6b0d64ca8f0741b2 D
(9),(11),(4),(3),(11)
