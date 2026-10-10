+++json
{
  "schemaVersion": "5",
  "id": "q-c5a45b9c928fb3ce",
  "revision": 3,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 27,
  "number": {
    "display": "四 1",
    "major": {
      "display": "四",
      "value": null
    },
    "minor": {
      "display": "1",
      "value": "1"
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
      "legacyId": "q-c5a45b9c928fb3ce",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 434,
        "end": 497
      },
      "curated": "_curated/期末/2025期末-无答案/434.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "多线程代码中的共享变量识别"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "shared-vars",
        "marker": "{{blank:shared-vars}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": true,
          "options": [
            {
              "value": "i",
              "label": "i"
            },
            {
              "value": "niters",
              "label": "niters"
            },
            {
              "value": "local_thread",
              "label": "local_thread"
            },
            {
              "value": "static_local",
              "label": "static_local"
            },
            {
              "value": "cnt",
              "label": "cnt"
            },
            {
              "value": "index",
              "label": "index"
            },
            {
              "value": "shared_array",
              "label": "shared_array"
            },
            {
              "value": "dynamic_ptr",
              "label": "dynamic_ptr"
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
        "blankId": "shared-vars",
        "method": "selection",
        "correctValues": [
          "static_local",
          "cnt",
          "shared_array",
          "dynamic_ptr"
        ]
      }
    ]
  }
}
+++
%%% stem
四 并发相关主题（15分）

1.（4分）以下是一段改编自教材上的多线程代码。对于`thread`函数内出现的以下8个
变量：i,niters,local_thread,static_local,cnt,index,shared_array,
`dynamic_ptr`。哪几个是共享变量？
答：{{blank:shared-vars}}（可多选）

```c
#define N 100
void *thread(void *vargp);
volatile long cnt = 0;
int shared_array[N];
int *dynamic_ptr;
int main(int argc, char** argv) {
    long niters;
    pthread_t tid1, tid2;
    int local_main = 0;
    if(argc!=2) {
        printf("usage: %s <niters>\n", argv[0]);
        exit(0);
    }
    niters = atoi(argv[1]);
    dynamic_ptr = (int*)malloc(N * sizeof(int));
    if(dynamic_ptr == NULL) {
        printf("Memory allocation failed\n");
        exit(1);
    }
    for(int i = 0; i < N; i++) {
        shared_array[i] = i;
    }
    int thread_arg = niters;
    pthread_create(&tid1, NULL, thread, &thread_arg);
    pthread_create(&tid2, NULL, thread, &thread_arg);
    pthread_join(tid1, NULL);
    pthread_join(tid2, NULL);
    if (cnt != 2 * niters) {
        printf("BOOM! cnt = %ld (expected %ld)\n", cnt, 2 * niters);
    } else {
        printf("OK cnt = %ld\n", cnt);
    }
    free(dynamic_ptr);
    exit(0);
}
void* thread(void *arg) {
    long i;
    int niters = *(int *)arg;
    int local_thread = 0;
    static int static_local = 0;
    for(i = 0; i < niters; i++) {
        cnt++;
        int index = i % N;
        shared_array[index]++;
        dynamic_ptr[index]++;
        static_local++;
        local_thread++;
    }
    printf("Thread finished: local_thread=%d, static_local=%d\n",
           local_thread, static_local);
    return NULL;
}
```
%%% reference
答案：static_local；cnt；shared_array；dynamic_ptr（每个 1 分）
