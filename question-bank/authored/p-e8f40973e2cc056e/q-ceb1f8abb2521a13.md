+++json
{
  "schemaVersion": "5",
  "id": "q-ceb1f8abb2521a13",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 21,
  "number": {
    "display": "二 21",
    "major": {
      "display": "二",
      "value": null
    },
    "minor": {
      "display": "21",
      "value": "21"
    },
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
      "legacyId": "q-ceb1f8abb2521a13",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 307,
        "end": 321
      },
      "curated": "_curated/期末/2025期末-无答案/307.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "fork 后地址空间与 COW 缺页（兼 fork 语义）"
    }
  ],
  "type": "multiple-choice",
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
      "B",
      "E"
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
    },
    {
      "id": "E",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
21.执行下面的C程序代码
```c
int *p = malloc(sizeof(int));
*p = 10;
pid_t pid = fork();
if (pid == 0) {
    *p = 20;
    _exit(0);
}
wait(NULL);
printf("%d\n", *p);
```
下列说法哪些正确？
%%% reference
答案：BE
解析：`fork` 后父子地址空间逻辑上独立，但常用 COW 让它们先共享物理页；一方写入时再复制，因此父仍读到 10，而子写可能触发一次“为了复制而产生”的 fault。改成共享匿名映射则写入可见。
%%% option: A
输出一定为 20
%%% option: B
输出一定为 10
%%% option: C
输出有可能是10，也有可能是20，取决于进程调度顺序
%%% option: D
`fork`之后，父进程由于Copy-on-Write可能会发生缺页异常
%%% option: E
`fork`之后，子进程由于Copy-on-Write可能会发生缺页异常
