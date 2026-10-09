+++json
{
  "schemaVersion": "5",
  "id": "q-6b0dbcd4444ea9b3",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 38,
  "number": {
    "display": "Lab 任务 38",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "38",
      "value": "38"
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
      "legacyId": "q-6b0dbcd4444ea9b3",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 771,
        "end": 776
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/771.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "ShellLab 内建命令 jobs/bg/kill/nohup"
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
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
38. （2 分）在 ShellLab 中，我们需要实现一系列内建命令。下列关于内建命令的说法
正确的是？
%%% reference
答案：D

解析：writeup 规定 `nohup [command]` 要让后续命令阻塞/忽略 `SIGHUP`（参考实现先阻塞 `SIGHUP` 再执行命令，子进程继承该信号屏蔽），故 D 对。jobs 直接调用 listjobs 输出即可，不需要先屏蔽信号（A 错）；bg 是给已停止的后台任务发 `SIGCONT` 让它继续在后台运行，而不是把前台运行的任务转后台（B 错）；kill 内建命令按 writeup 发送的是 `SIGTERM` 而不是 `SIGKILL`（C 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
jobs命令中我们需要列出所有任务，且需要先屏蔽所有相关信号，避免竞争
%%% option: B
bg命令中我们需要将当前运行在前台的任务变为后台运行，且不使任务停止
%%% option: C
kill命令中我们需要向指定的进程或进程组发送SIGKILL信号以将其终止
%%% option: D
nohup命令中我们需要在创建子进程后阻塞SIGHUP信号或设置忽略该信号
