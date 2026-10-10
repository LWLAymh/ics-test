+++json
{"schemaVersion":"5","id":"q-f8705aa5cefeddfd","revision":1,"paperId":"p-146f52a44a7f14ec","paperOrder":18,"number":{"display":"8.18","major":{"display":"第 8 章","value":"8"},"minor":{"display":"8.18","value":"18"},"parts":[]},"classification":{"primaryModuleId":"ecf_and_system_io","moduleIds":["ecf_and_system_io"],"tags":["csapp","homework","chapter-8"]},"type":"multiple-choice","stem":{"format":"markdown"},"options":[{"id":"A","content":{"format":"markdown"}},{"id":"B","content":{"format":"markdown"}},{"id":"C","content":{"format":"markdown"}},{"id":"D","content":{"format":"markdown"}},{"id":"E","content":{"format":"markdown"}}],"solution":{"state":"available","grading":"choice","correctOptionIds":["A","C","E"],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI 整理推导，非 CSAPP 官方家庭作业解答"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/homework/8.16-8.21-process-graphs-and-waiting.md#L30","provenance":"rewritten","editorNote":"CSAPP3e 家庭作业；明确选出所有可能输出；非官方解析。"}]}
+++
%%% stem
选出下面程序所有可能的输出。假定所有 `Fork` 成功，每次字符输出及随后的刷新按教材作为一个输出事件分析。`atexit` 将函数加入退出回调列表（初始为空），`exit` 会调用列表中的函数。

```c
#include "csapp.h"

void end(void)
{
    printf("2");
    fflush(stdout);
}

int main()
{
    if (Fork() == 0)
        atexit(end);
    if (Fork() == 0) {
        printf("0");
        fflush(stdout);
    }
    else {
        printf("1");
        fflush(stdout);
    }
    exit(0);
}
```
%%% option: A
`112002`
%%% option: B
`211020`
%%% option: C
`102120`
%%% option: D
`122001`
%%% option: E
`100212`
%%% reference
A、C、E。四个进程的输出片段分别为 `1`、`0`、按顺序的 `12`、按顺序的 `02`，片段间可交错。B 以 `2` 开头，违反回调必须在该进程打印 0 或 1 后执行的约束。D 在任何 0 之前出现了两个 2，不可能同时满足 `12` 与 `02`。A、C、E 都可分配字符使这两项顺序成立。
