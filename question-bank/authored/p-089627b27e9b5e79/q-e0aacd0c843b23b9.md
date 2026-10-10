+++json
{
  "schemaVersion": "5",
  "id": "q-e0aacd0c843b23b9",
  "revision": 2,
  "paperId": "p-089627b27e9b5e79",
  "paperOrder": 26,
  "number": {
    "display": "第六题 2",
    "major": {
      "display": "第六题",
      "value": "6"
    },
    "minor": {
      "display": "2",
      "value": "2"
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
      "legacyId": "q-e0aacd0c843b23b9",
      "document": "原文/期末/2014期末-带答案.md",
      "lines": {
        "start": 731,
        "end": 761
      },
      "curated": "_curated/期末/2014期末-带答案/731.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "用 signal/alarm/pause 实现 sleep 的缺陷"
    }
  ],
  "type": "short-answer",
  "stem": {
    "format": "markdown",
    "blanks": []
  },
  "solution": {
    "state": "available",
    "grading": "self",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    }
  }
}
+++
%%% stem
2.（5分）某程序员实现了一个课程实验用的操作系统ICSNIX，其系统函数`sleep`
用以下代码实现。请分析该代码存在哪些问题。
```
1 #include    <signal.h>
2 #include    <unistd.h>
3 static void sig_alrm(int signo)
4 {
5    /* nothing to do, just return to wake up the pause */
6 }
7
8 unsigned int sleep(unsigned int seconds)
9 {
10    if (signal(SIGALRM, sig_alrm) == SIG_ERR)
11       return(seconds);
12
13    alarm(seconds); /* start the timer */
14    pause(); /* next caught signal wakes us up */
15    return(alarm(0)); /* turn off timer, return unslept time */
16}
```
%%% reference
答案：（三个问题若只回答了1个或2个则每个2分，全部回答了得5分）
问题1) 由于操作系统调度的原因，`alarm`信号触发时，`pause`可能还未执行，
导致`sleep`调用永不会返回。
问题 2) 如果应用程序在调用 `sleep` 之前已经调用了 `alarm`，则 `sleep` 中的
`alarm` 调用会取消之前设置的 `alarm` 闹钟。（若用户调用 alarm(5);
`sleep(10)`; 则第 5 秒 `sleep` 就应该唤醒；若用户调用 alarm(20);
`sleep(10)`; 则 `sleep` 在 10 秒返回后，再过 10 秒应继续产生一个 `SIGALRM`
信号。）
问题 3) sleep的`signal`调用改变了整个程序的`SIGALRM`信号处理方式。因
此`sleep`应该保留`signal`的返回值（旧的`SIGALRM`信号处理程序），并在返回
前恢复该值。
