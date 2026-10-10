+++json
{"schemaVersion":"5","id":"q-6ca244f85fe85fab","revision":1,"paperId":"p-146f52a44a7f14ec","paperOrder":14,"number":{"display":"8.14","major":{"display":"第 8 章","value":"8"},"minor":{"display":"8.14","value":"14"},"parts":[]},"classification":{"primaryModuleId":"ecf_and_system_io","moduleIds":["ecf_and_system_io"],"tags":["csapp","homework","chapter-8"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"n","marker":"{{n}}","occurrence":0,"width":"short"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"n","method":"exact","acceptedAnswers":["3"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI 整理推导，非 CSAPP 官方家庭作业解答"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第08章-异常控制流/homework/8.9-8.15-processes-and-fork.md#L95","provenance":"rewritten","editorNote":"CSAPP3e 家庭作业；非官方解析。"}]}
+++
%%% stem
程序输出多少行 `hello`？假定所有 `Fork` 成功。行数：{{n}}。

```c
#include "csapp.h"

void doit()
{
    if (Fork() == 0) {
        Fork();
        printf("hello\n");
        exit(0);
    }
    return;
}

int main()
{
    doit();
    printf("hello\n");
    exit(0);
}
```
%%% reference
3 行。原父进程返回 `main` 打印一次；第一次创建的子进程再创建一个子进程，两者都在 `doit` 内打印并 `exit`，不返回 `main`。
