+++json
{
  "schemaVersion": "5",
  "id": "q-9248c6dbdd450dee",
  "revision": 1,
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
19. 有如下代码：
```
int counter = 0;
void * thread(void * vargp)
{
  int thread_var = (int) vargp;
  static int thread_counter = 0;
  thread_internal(thread_var);
  thread_counter ++;
  return NULL;
}
int main (int argc, const char ** argv)
{
  int tid1, tid2;
  int var = atoi(argv[1]);
  Pthread_create(&tid1, NULL, thread, (void *)var);
  Pthread_create(&tid2, NULL, thread, (void *)var);
  Pthread_join(tid1, NULL);
  Pthread_join(tid2, NULL);
  return 0;
}
```
则，线程 `tid1` 与线程 `tid2` 可以共享的变量是
%%% reference
答案：B
（本题考查对线程中共享变量的概念的理解。因为 `counter` 是全局变量；
`thread_counter`是静态局部变量，所以两个线程可以共享它们）
%%% option: A
counter, var
%%% option: B
counter, thread_counter
%%% option: C
var, thread_counter
%%% option: D
thread_var, thread_counter
