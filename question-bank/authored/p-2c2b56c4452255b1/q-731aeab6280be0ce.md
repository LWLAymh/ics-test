+++json
{
  "schemaVersion": "5",
  "id": "q-731aeab6280be0ce",
  "revision": 1,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 12,
  "number": {
    "display": "第一题 12",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "12",
      "value": "12"
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
      "legacyId": "q-731aeab6280be0ce",
      "document": "原文/期末/2021期末-无答案.md",
      "lines": {
        "start": 190,
        "end": 198
      },
      "curated": "_curated/期末/2021期末-无答案/190.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "waitpid、信号与用户态/内核态转换"
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
      "C"
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
12.  关于进程和异常控制流，以下说法正确的是：
%%% reference
答案：C
%%% option: A
调用`waitpid (-1, NULL, WNOHANG & WUNTRACED)` 会立即返回：
如果调用进程的所有子进程都没有被停止或终止，则返回 0；如果有停止或
终止的子进程，则返回其中一个的ID。
%%% option: B
进程可以通过使用signal函数修改和信号相关联的默认行为，唯一的例
外是SIGKILL，它的默认行为是不能修改的。
%%% option: C
从内核态转换到用户态有多种方法，例如设置程序状态字；从用户态转换
到内核态的唯一途径是通过中断/异常/陷入机制。
%%% option: D
中断一定是异步发生的，陷阱可能是同步发生的，也可能是异步发生的。
