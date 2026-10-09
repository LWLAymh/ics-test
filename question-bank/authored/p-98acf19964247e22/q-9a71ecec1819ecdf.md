+++json
{
  "schemaVersion": "5",
  "id": "q-9a71ecec1819ecdf",
  "revision": 1,
  "paperId": "p-98acf19964247e22",
  "paperOrder": 20,
  "number": {
    "display": "第一题 20",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "20",
      "value": "20"
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
      "legacyId": "q-9a71ecec1819ecdf",
      "document": "原文/期末/2019期末-无答案.md",
      "lines": {
        "start": 232,
        "end": 239
      },
      "curated": "_curated/期末/2019期末-无答案/232.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "信号量与 P/V 操作语义"
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
      "D"
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
20. 下列关于信号量及P、V操作的叙述中，哪一个是不正确的？
%%% reference
答案：D（来源：2019、2020期末-答案解析）
解析：sem_wait/sem_post 会阻塞整个进程，而 pthread_mutex_lock/unlock 只阻塞相应线程，后者效率更高，所以 D 说反了。
%%% option: A
信号量是一个非负整数，对信号量只能执行P操作和V操作
%%% option: B
当信号量的值为0时，调用P操作的线程被挂起
%%% option: C
P(s)的实现代码中语句：`while (s == 0)  wait(); s--;` 应
该由内核保证其执行的不可分割性
%%% option: D
在保护临界区的解决方案中使用 `sem_wait()`和 `sem_post()`比使
用 pthread_mutex_lock()和 pthread_mutex_unlock()性能
好
