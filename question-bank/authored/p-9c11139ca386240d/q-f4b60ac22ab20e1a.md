+++json
{
  "schemaVersion": "5",
  "id": "q-f4b60ac22ab20e1a",
  "revision": 1,
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
37. （2分）在ShellLab中，为了避免出现竞争（race），需要在特定的操作前屏蔽一
些信号。下列关于屏蔽信号与解除屏蔽的时机，说法错误的一项是？
%%% reference
答案：D

解析：子进程会继承父进程屏蔽的信号，正确顺序是：子进程先 `setpgid(0,0)` 进入自己的进程组，再解除屏蔽，最后 `execve`。若在 `setpgid` 之前就解除屏蔽，这段窗口里子进程仍属于 shell 所在的前台进程组，用户此时按 Ctrl-C/Ctrl-Z 会直接打到它（而 shell 的转发又依赖它已经独立成组），故 D 是错误项。A 对（sigint_handler 只读 job_list 并发信号，不修改共享数据）；B、C 对（handler 和 eval 修改 job_list 时都必须先屏蔽信号，既保护数据结构，也避免子进程已被回收、父进程才 addjob 的竞争）。

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
fork之后需要解除屏蔽信号，解除的时机可以在执行setpgid之前，也可以在执
行setpgid 之后
