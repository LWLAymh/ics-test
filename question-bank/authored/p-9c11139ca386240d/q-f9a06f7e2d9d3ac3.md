+++json
{
  "schemaVersion": "5",
  "id": "q-f9a06f7e2d9d3ac3",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 36,
  "number": {
    "display": "Lab 任务 36",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "36",
      "value": "36"
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
      "legacyId": "q-f9a06f7e2d9d3ac3",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 747,
        "end": 756
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/747.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "ShellLab tsh 与真实 shell 的功能对比"
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
36. （2分）在ShellLab中，我们实现了一个简单的shell程序tsh。和真实的Linux
shell相比，下列哪一项说法是错误的？
%%% reference
答案：C

解析：tsh 之所以要捕获 `SIGINT/SIGTSTP` 再转发给前台进程组，是因为它没有终端控制权；真实 shell 用 tcsetpgrp 把前台进程组交给终端，内核直接把 ctrl-c/ctrl-z 送给该组，shell 自身并不需要"捕获再转发"（tshlab writeup 的脚注明确指出这是对真实 shell 的简化），故 C 的类比不成立。A（不支持变量与搜索路径、运行系统程序要写 /bin/cat）、B（不支持管道但必须支持 < 和 >，且同一条命令可同时重定向）、D（& 后台执行 + fg 内建命令）都与 writeup 一致。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
tsh中不支持变量，也不支持搜索路径，无法直接运行系统程序如cat，需要输入
完整路径/bin/cat
%%% option: B
tsh中不支持管道（|），但支持I/O重定向（<, >），且可以在一条命令里同时
进行输入、输出重定向
%%% option: C
tsh和真实的shell一样，需要捕获SIGINT和SIGTSTP信号，然后再将这些信
号发送给前台进程组
%%% option: D
tsh和真实的shell一样，支持通过&设置程序在后台执行，也支持通过fg命令
将后台任务转移到前台
