+++json
{
  "schemaVersion": "5",
  "id": "q-567f8ff9a8ad70be",
  "revision": 2,
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
函数的实现，正确的一项是？调用协议如下：调用者已屏蔽 `SIGCHLD`，任务表条目已创建，`oldmask` 保存屏蔽前的信号掩码且其中未阻塞 `SIGCHLD`；`sigchld_handler` 更新或清空固定任务表条目，不释放该条目的存储。返回后由调用者恢复原掩码。各选项省略获取条目后的空指针检查。
%%% reference
答案：C

解析：按题面明确的调用协议，检查任务状态时 `SIGCHLD` 被阻塞；`sigsuspend(&oldmask)` 原子地解除阻塞并等待，返回后重新阻塞它，下一轮再检查状态，因此C不会在“检查后、休眠前”丢失唤醒。若省略此前提，仅把 `sigsuspend` 放进循环也可能发生竞争。`oldmask` 必须由调用者真实保存，不能依赖全局对象默认全零就假定它一定代表所需掩码。

实验禁止A的忙等和B的sleep轮询。D与 `sigchld_handler` 竞争回收同一子进程，而且无 `WUNTRACED` 的等待可能在作业暂停时持续阻塞。依据教材8.5.7的显式信号等待协议，选C。

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
