+++json
{"schemaVersion":"5","id":"q-e4025cbdaa78b15e","revision":1,"paperId":"p-c081961b91de6e5c","paperOrder":9,"number":{"display":"10.9","major":{"display":"第 10 章","value":"10"},"minor":{"display":"10.9","value":"9"},"parts":[]},"classification":{"primaryModuleId":"ecf_and_system_io","moduleIds":["ecf_and_system_io"],"tags":["csapp","homework","chapter-10"]},"type":"short-answer","stem":{"format":"markdown"},"solution":{"state":"available","grading":"self","reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI 整理推导，非 CSAPP 官方家庭作业解答"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第10章-系统级IO/homework/10.6-10.10-system-level-io.md#L31","provenance":"rewritten","editorNote":"CSAPP3e 家庭作业；仅要求补几行重定向伪代码，非完整函数；补齐fstatcheck语义；非官方解析。"}]}
+++
%%% stem
`fstatcheck` 从命令行取得一个文件描述符数字，并使用它查询、显示文件元数据。运行：

```console
linux> fstatcheck 3 < foo.txt
```

本以为它会显示 `foo.txt` 的元数据，实际却得到“坏的文件描述符”。假定 shell 初始只有描述符 0、1、2 打开，根据此现象补出 shell 在 `fork` 与 `execve` 之间执行的重定向伪代码：

```c
if (Fork() == 0) { /* child */
    /* 补出此处的重定向操作 */
    Execve("fstatcheck", argv, envp);
}
```
%%% reference
一种符合现象的伪代码为：

```c
int fd = Open("foo.txt", O_RDONLY, 0); /* fd = 3 */
Dup2(fd, STDIN_FILENO);              /* 0 now refers to foo.txt */
Close(fd);                          /* 3 is no longer open */
```

shell 将文件接到标准输入 0，并关闭临时描述符 3。命令行参数 `3` 只是交给程序的字符串，不会令 shell 保留 3。程序应查询描述符 0 才能访问重定向输入。此题只需解释并补出重定向片段，不要求实现完整 `fstatcheck`。
