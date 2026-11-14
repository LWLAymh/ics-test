+++json
{
  "schemaVersion": "5",
  "id": "q-f4b60ac22ab20e1a",
  "revision": 2,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 37,
  "number": {
    "display": "Lab 任务 37",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "37",
      "value": "37"
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
      "legacyId": "q-f4b60ac22ab20e1a",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 757,
        "end": 766
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/757.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "为避免竞态的信号屏蔽与解除时机"
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
      "A"
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
37.（2分）在 ShellLab 中，为了避免竞争，需要在特定操作前屏蔽相关信号。下列说法错误的一项是？

> 为消除原题时序描述的歧义，网页已根据实验规范重写D的操作顺序。具体勘误见答题后的解析。
%%% reference
答案：A。即使 `sigint_handler` 只读 `job_list`，其读取过程也可能被 `SIGCHLD` 处理函数打断并删除或更新相关条目，所以“只读就不需要保护”不成立。修改共享表的 `sigchld_handler` 和 `eval` 也需要屏蔽能并发访问它的相关信号。

子进程继承父进程的屏蔽集合。D现在明确为：先建立独立进程组，再在 `execve` 前恢复原掩码。此顺序避免子进程尚属于shell进程组时就在原处理环境下接收终端信号。父进程则应在 `addjob` 后恢复掩码。原题D未要求这一先后次序，也存在不安全窗口；为使题目有唯一错误项，网页明确D的安全时序，并依据ShellLab原规范“Warnings/Hints”及教材信号同步规则改为按A判分。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
sigint_handler中不需要屏蔽信号，因为只需要读取全局数据结构job_list，
而无需对其进行修改
%%% option: B
sigchld_handler中需要屏蔽信号，因为需要修改全局数据结构job_list，更
新job的状态等相关信息
%%% option: C
eval 中需要屏蔽信号，因为需要修改全局数据结构 job_list，在创建新任务时
添加新创建的job信息
%%% option: D
fork后的子进程先执行 `setpgid(0,0)` 建立独立进程组，再在 `execve` 之前恢复原信号掩码；父进程在 `addjob` 之后恢复原掩码
