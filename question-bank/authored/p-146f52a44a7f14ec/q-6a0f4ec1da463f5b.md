+++json
{
  "schemaVersion":"5","id":"q-6a0f4ec1da463f5b","revision":1,"paperId":"p-146f52a44a7f14ec","paperOrder":4,
  "number":{"display":"8.4","major":{"display":"第 8 章","value":"8"},"minor":{"display":"8.4","value":"4"},"parts":[]},
  "classification":{"primaryModuleId":"ecf_and_system_io","moduleIds":["ecf_and_system_io"],"tags":["csapp","practice","chapter-8"]},
  "type":"short-answer","stem":{"format":"markdown"},"solution":{"state":"available","grading":"self","reference":{"format":"markdown"},"provenance":{"origin":"unknown","crossChecked":false,"note":"输出行数和示例序列据来源仓库《练习题答案.md》；未独立复核。"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/8.4/8.4.3-reaping-child-processes.md#L138-L163","provenance":"rewritten"},{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/练习题答案.md#L45-L56","provenance":"reflow"}]
}
+++
%%% stem
练习题 8.4：分析下面程序。

```c
printf("Hello\n");
pid = Fork();
printf("%d\n", !pid);
if (pid != 0) {
    if (waitpid(-1, &status, 0) > 0 && WIFEXITED(status))
        printf("%d\n", WEXITSTATUS(status));
}
printf("Bye\n");
exit(2);
```

A. 程序一共输出多少行？

B. 写出一种可能的输出顺序。
%%% reference
A. 6 行。

B. 一种可能顺序为：`Hello`、`1`、`0`、`Bye`、`2`、`Bye`。`Hello` 在 fork 前只打印一次；`!pid` 在子进程为 1、父进程为 0；子进程先退出状态 2，父进程 wait 后打印状态，再打印 `Bye`。子进程的 `Bye` 与父进程的 `0`/等待输出存在调度交错，因此答案只要求给出可能序列。
