+++json
{
  "schemaVersion": "5",
  "id": "q-ceb1f8abb2521a13",
  "revision": 2,
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
      "D",
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
21. 执行下面的C程序代码，假设内存分配、`fork`、`wait` 均成功，系统使用常见的写时复制机制。各选项讨论整个进程的页面，而不限于 `p` 所指的堆页。
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
答案：B、D、E。`fork` 后父子地址空间逻辑独立，子进程修改 `*p` 不改变父进程的值，父进程输出10。子进程的堆写入可能触发COW缺页；父进程虽然没有再显式写 `*p`，但 `wait`、`printf` 调用及其他栈／运行库写入同样可能触发其私有页面的COW缺页。D问的是“父进程可能发生COW缺页”，没有限定只看 `p` 的堆页，不能排除D。旧答案BE漏计了这种可能性，此处勘误为BDE。
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
