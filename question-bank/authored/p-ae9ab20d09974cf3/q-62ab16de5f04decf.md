+++json
{
  "schemaVersion": "5",
  "id": "q-62ab16de5f04decf",
  "revision": 1,
  "paperId": "p-ae9ab20d09974cf3",
  "paperOrder": 7,
  "number": {
    "display": "第一题 7",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "7",
      "value": "7"
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
      "legacyId": "q-62ab16de5f04decf",
      "document": "原文/期末/2024期末-带答案.md",
      "lines": {
        "start": 245,
        "end": 259
      },
      "curated": "_curated/期末/2024期末-带答案/245.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "进程调度/fork/异常返回/信号辨析"
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
7. 下列陈述中，错误陈述的数量为：
①进程调度的实现在一定程度上依赖于定时器中断（timer interrupts）。
②execv()函数成功调用后不会返回。
③使用`fork()`创建的子进程与父进程对内存的修改是共享的。
④在X86-64 Linux中，访存缺页异常属于故障。
⑤异常处理的返回行为包括：返回当前指令、返回下一条指令和终止(abort)。
⑥如果处理得当（如设置`SIGFPE`的信号处理函数），除以零引发的除法错误不会
导致终止(abort)。
⑦单核处理器上，可以通过不断地上下文切换交替运行并发的程序，给用户呈现一
种并发的程序在同时运行的感觉。
⑧进入信号处理函数时会创建新的进程。
%%% reference
答案：C， ③⑧错误。使用 fork 创建的子进程和父进程在 初始阶段 的内存内
容是相同的，但它们并不是直接共享内存。父子进程初期的内存内容是相同的，但
它们对内存的修改是 独立的，并不共享。进入信号处理函数并不会创建新的进程。
%%% option: A
0个
%%% option: B
1个
%%% option: C
2个
%%% option: D
3个
