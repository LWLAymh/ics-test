+++json
{
  "schemaVersion":"5","id":"q-94b0ccb54bf7eec3","revision":1,"paperId":"p-146f52a44a7f14ec","paperOrder":8,
  "number":{"display":"8.8","major":{"display":"第 8 章","value":"8"},"minor":{"display":"8.8","value":"8"},"parts":[]},
  "classification":{"primaryModuleId":"ecf_and_system_io","moduleIds":["ecf_and_system_io"],"tags":["csapp","practice","chapter-8"]},
  "type":"fill","stem":{"format":"markdown","blanks":[{"id":"output","marker":"{{blank:output}}","occurrence":0,"width":"short"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"output","method":"exact","acceptedAnswers":["213"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"unknown","crossChecked":false,"note":"输出据来源仓库《练习题答案.md》；未独立复核。"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/8.5/8.5.5-writing-signal-handlers.md#L257-L294","provenance":"rewritten"},{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/练习题答案.md#L102-L108","provenance":"reflow"}]
}
+++
%%% stem
练习题 8.8：下面程序最终打印什么？

```c
volatile long counter = 2;

void handler1(int sig)
{
    sigset_t mask, prev_mask;

    Sigfillset(&mask);
    Sigprocmask(SIG_BLOCK, &mask, &prev_mask);
    Sio_putl(--counter);
    Sigprocmask(SIG_SETMASK, &prev_mask, NULL);
    _exit(0);
}

int main()
{
    pid_t pid;
    sigset_t mask, prev_mask;

    printf("%ld", counter);
    fflush(stdout);
    signal(SIGUSR1, handler1);
    if ((pid = Fork()) == 0) {
        while (1) {};
    }
    Kill(pid, SIGUSR1);
    Waitpid(-1, NULL, 0);
    Sigfillset(&mask);
    Sigprocmask(SIG_BLOCK, &mask, &prev_mask);
    printf("%ld", ++counter);
    Sigprocmask(SIG_SETMASK, &prev_mask, NULL);
    exit(0);
}
```

输出：{{blank:output}}
%%% reference
输出为 `213`。父进程先打印 2；子进程被信号处理程序中断并打印 1；父进程 wait 后加一并打印 3。
