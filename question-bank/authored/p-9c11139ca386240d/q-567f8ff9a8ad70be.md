+++json
{
  "schemaVersion": "5",
  "id": "q-567f8ff9a8ad70be",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 40,
  "number": {
    "display": "Lab 任务 40",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "40",
      "value": "40"
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
      "legacyId": "q-567f8ff9a8ad70be",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 803,
        "end": 835
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/803.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "waitfg 前台等待的正确实现（sigsuspend）"
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
40. （2分）在ShellLab中，我们在sigchld_handler中使用`waitpid`来回收子进
程，同时我们定义了`waitfg`函数用来等待特定`pid`的前台任务结束。下面`waitfg`
函数的实现，正确的一项是？
%%% reference
答案：C

解析：writeup 明令禁止忙等（如 while(1);）和用 `sleep` 轮询，要求用 `sigsuspend` 把父进程挂起，让 sigchld_handler 去回收子进程并更新 job 状态，故 C（配合 `while` 反复判断前台任务是否还在）是正确写法；A 是纯忙等、B 用 `sleep` 轮询，都会被扣分。D 用 `waitpid` 会和 sigchld_handler 抢着回收同一个子进程，而且前台任务被暂停（尚未退出）时会永久阻塞。注：选项里 `oldmask` 未初始化，实际写法应先用 sigprocmask 取出原屏蔽字再传给 `sigsuspend`。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
```c
void waitfg(pid_t pid) {
    int timeout = 0;
    struct job_t *j = getjobpid(job_list, pid);
    while (j->pid == pid && j->state == FG) {
        if (++timeout > MAX_TIME) {
            break;
        }
    }
}
```
%%% option: B
```c
void waitfg(pid_t pid) {
    struct job_t *j = getjobpid(job_list, pid);
    while (j->pid == pid && j->state == FG) {
        sleep(1);
    }
}
```
%%% option: C
```c
sigset_t oldmask;
void waitfg(pid_t pid) {
    struct job_t *j = getjobpid(job_list, pid);
    while (j->pid == pid && j->state == FG) {
        sigsuspend(&oldmask);
    }
}
```
%%% option: D
```c
int status;
void waitfg(pid_t pid) {
    struct job_t *j = getjobpid(job_list, pid);
    while (j->pid == pid && j->state == FG) {
        waitpid(pid, &status, 0);
    }
}
```
