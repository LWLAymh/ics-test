+++json
{"schemaVersion":"5","id":"q-d3bfff8fb116c31c","revision":1,"paperId":"p-0854288fe48c1276","paperOrder":29,"number":{"display":"12.29","major":{"display":"第 12 章","value":"12"},"minor":{"display":"12.29","value":"29"},"parts":[]},"classification":{"primaryModuleId":"concurrent_programming","moduleIds":["concurrent_programming"],"tags":["csapp","homework","chapter-12"]},"type":"short-answer","stem":{"format":"markdown"},"solution":{"state":"available","grading":"self","reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI 整理推导，非 CSAPP 官方家庭作业解答"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第12章-并发编程/homework/12.16-12.39-concurrent-programming.md#L111","provenance":"rewritten","editorNote":"CSAPP3e 家庭作业；非官方解析。"}]}
+++
%%% stem
下面程序会死锁吗？解释为什么。初始 `a=b=c=1`，`P` 是获取信号量，`V` 是释放信号量。各线程按自身列从上到下执行，表格同一行不表示同时发生。

| 线程 1 | 线程 2 |
| --- | --- |
| `P(a);` | `P(c);` |
| `P(b);` | `P(b);` |
| `V(b);` | `V(b);` |
| `P(c);` | `V(c);` |
| `V(c);` | |
| `V(a);` | |
%%% reference
不会死锁。只有线程 1 使用 a，不会因 a 等待线程 2。线程 1 等待 c 时已经释放 b；线程 2 即使持有 c 并等待 b，也能够在 b 可用后继续执行并释放 c。若线程 1 在 b 处等待，线程 2 不会等待 a，仍可释放 b、c。不存在循环等待。线程调度长期不公平导致的饥饿与资源死锁是不同问题。
