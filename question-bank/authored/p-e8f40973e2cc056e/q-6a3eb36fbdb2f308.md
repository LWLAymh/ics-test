+++json
{
  "schemaVersion": "5",
  "id": "q-6a3eb36fbdb2f308",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 18,
  "number": {
    "display": "二 18",
    "major": {
      "display": "二",
      "value": null
    },
    "minor": {
      "display": "18",
      "value": "18"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "ecf_and_system_io",
    "moduleIds": [
      "ecf_and_system_io"
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
      "legacyId": "q-6a3eb36fbdb2f308",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 249,
        "end": 269
      },
      "curated": "_curated/期末/2025期末-无答案/249.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "SIGCHLD 不排队、waitpid 回收与 zombie"
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
      "A",
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
18. 观察下面的 C 程序代码：

```c
volatile sig_atomic_t reap = 0;

void handler(int sig) {
    while (waitpid(-1, NULL, WNOHANG) > 0) {
        reap++;
    }
}

int main(void) {
    Signal(SIGCHLD, handler);
    for (int i = 0; i < 2; i++) {
        if (fork() == 0) {
            _exit(0);
        }
    }
    while (reap < 2) {
        ;
    }
    printf("OK\n");
}
```

下列说法哪些正确？
%%% reference
答案：A、B

`SIGCHLD` 可能合并递送；一次进入 `handler` 时，循环调用 `waitpid` 可以回收多个已经退出的子进程，所以 A 正确。`reap == 2` 表示两个子进程均已被回收，所以 B 正确。C、D、E 均不成立。
%%% option: A
`handler` 可能只被调用 1 次，但 `reap` 最终仍可能变为 2
%%% option: B
程序打印 `OK` 时，通常不会残留 zombie 子进程
%%% option: C
因为 `SIGCHLD` 不排队，`reap` 最大只能到 1
%%% option: D
若把 `handler` 里的 `while` 改为只调用一次 `waitpid`，则一定不会留下 zombie
%%% option: E
`OK` 可能在任意时刻打印，包括子进程尚未退出时
