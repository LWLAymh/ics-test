+++json
{
  "schemaVersion": "5",
  "id": "q-6b0dbcd4444ea9b3",
  "revision": 2,
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
    },
    "correctOptionIds": [
      "A",
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
38.（2分，多选）在 ShellLab 中，我们需要实现一系列内建命令。下列说法正确的是？

> 原卷按单选排版，网页复核后改为多选，并明确了D的设置信号时机。勘误原因见答题后的解析。
%%% reference
答案：A、D。`jobs` 遍历共享的任务表时，也可能被修改或删除表项的信号处理函数打断，应在该临界区屏蔽相关信号，A正确。`nohup` 使外部命令忽略或屏蔽 `SIGHUP`；可以在fork前设置后由子进程继承，也可以在子进程exec前设置，D正确。`bg` 是让停止的作业在后台继续，不是直接把正在前台运行的作业转到后台；本实验 `kill` 按规定发送 `SIGTERM`，B、C错误。

原卷未提供官方答案。旧AI解析仅选D，并错误地声称 `jobs` 只读任务表就不需要保护；网页复核后将本题改为多选AD。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
jobs命令中我们需要列出所有任务，且需要先屏蔽所有相关信号，避免竞争
%%% option: B
bg命令中我们需要将当前运行在前台的任务变为后台运行，且不使任务停止
%%% option: C
kill命令中我们需要向指定的进程或进程组发送SIGKILL信号以将其终止
%%% option: D
nohup命令应在执行外部程序前使其屏蔽或忽略 `SIGHUP`：可在fork前设置并由子进程继承，也可在子进程中、exec之前设置
