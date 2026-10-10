# CSAPP 第 7–12 章章内练习覆盖

盘点范围：`csapp-zh-markdown` 第 07–12 章正文和各章《练习题答案.md》中编号 7.1–12.15 的章内练习（共 48 题）。本表逐题标记题库中已有的题、此次新增题，或因题目本质要求实现程序/绘制进度图而排除的题。所有题源均可找到；本范围内没有“题源缺失待确认”。章末 homework 另列在对应 paper 的 `sourceDocuments`，不属于本表编号范围。

状态：`已收录`=已有 authored 题；`新增`=本轮手工新增 authored 题；`必须编程绘图实验排除`=题目核心要求提交程序实现或绘制专门图形，不以猜测答案代替；`题源缺失待确认`=没有找到题源（本次无）。

| 练习 | 状态 | authored ID / 排除原因 | 题源位置 |
| --- | --- | --- | --- |
| 7.1 | 已收录 | `q-7ca21ebde142bd2e` | 第07章/7.5/7.5-symbols-and-symbol-tables.md |
| 7.2 | 已收录 | `q-5f63b1c0ad8e7429` | 第07章/7.6/7.6.1-how-linkers-resolve-multiply-defined-global-symbols.md |
| 7.3 | 已收录 | `q-6d128a37f9054bce` | 第07章/7.6/7.6.3-how-linkers-use-static-libraries-to-resolve-references.md |
| 7.4 | 新增 | `q-815a59c08c78f7d8` | 第07章/7.7/7.7.2-relocating-symbol-references.md；图 7-12 在 chapter.md |
| 7.5 | 新增 | `q-c4acdd4ef7f2a722` | 第07章/7.7/7.7.2-relocating-symbol-references.md |
| 8.1 | 已收录 | `q-b48ebb1ac5f7f48a` | 第08章/8.2/8.2.2-concurrent-flows.md |
| 8.2 | 已收录 | `q-c1ff9a63d4eb2780` | 第08章/8.4/8.4.2-creating-and-terminating-processes.md |
| 8.3 | 新增 | `q-64772091b17c343b` | 第08章/8.4/8.4.3-reaping-child-processes.md |
| 8.4 | 新增 | `q-6a0f4ec1da463f5b` | 第08章/8.4/8.4.3-reaping-child-processes.md |
| 8.5 | 必须编程绘图实验排除 | 编写 `sleep` 包装函数 `snooze` | 第08章/8.4/8.4.4-putting-processes-to-sleep.md |
| 8.6 | 必须编程绘图实验排除 | 编写 `myecho` 程序，枚举参数和环境变量 | 第08章/8.4/8.4.5-loading-and-running-programs.md |
| 8.7 | 必须编程绘图实验排除 | 编写可由 Ctrl+C 中断的 `snooze` 程序 | 第08章/8.5/8.5.3-receiving-signals.md |
| 8.8 | 新增 | `q-94b0ccb54bf7eec3` | 第08章/8.5/8.5.5-writing-signal-handlers.md |
| 9.1 | 已收录 | `q-5aaf382af9d9f858` | 第09章/9.2/9.2-address-spaces.md |
| 9.2 | 已收录 | `q-7a5627c3d1f04e8b` | 第09章/9.3/9.3.2-page-tables.md |
| 9.3 | 已收录 | `q-8bc1f79d4a25e630` | 第09章/9.6/9.6-address-translation.md |
| 9.4 | 新增 | `q-117ac6d39884b9ae` | 第09章/9.6/9.6.4-putting-it-together-end-to-end-address-translation.md；所需图表已手工转成题面表格 |
| 9.5 | 必须编程绘图实验排除 | 实现完整 `mmapcopy.c` 文件复制程序 | 第09章/9.8/9.8.4-user-level-memory-mapping-with-the-mmap-function.md |
| 9.6 | 新增 | `q-85a85b345e99accf` | 第09章/9.9/9.9.6-implicit-free-lists.md |
| 9.7 | 新增 | `q-19fb66b3ad5015a9` | 第09章/9.9/9.9.11-coalescing-with-boundary-tags.md |
| 9.8 | 必须编程绘图实验排除 | 实现隐式空闲链表的 `find_fit` 函数 | 第09章/9.9/9.9.12-putting-it-together.md |
| 9.9 | 必须编程绘图实验排除 | 实现分配器的 `place` 函数 | 第09章/9.9/9.9.12-putting-it-together.md |
| 9.10 | 新增 | `q-2a904e1c106f415b` | 第09章/9.9/9.9.14-segregated-free-lists.md |
| 10.1 | 已收录 | `q-9e2c5f714b30a681` | 第10章/10.3/10.3-opening-and-closing-files.md |
| 10.2 | 已收录 | `q-c7d3b2019a8465ef` | 第10章/10.8/10.8-sharing-files.md |
| 10.3 | 新增 | `q-7ba6169b8cb8d542` | 第10章/10.8/10.8-sharing-files.md |
| 10.4 | 已收录 | `q-59d17769e8300691` | 第10章/10.9/10.9-io-redirection.md |
| 10.5 | 新增 | `q-6b18b1d14f784bb3` | 第10章/10.9/10.9-io-redirection.md |
| 11.1 | 已收錄 | `q-a6a1811b8c984602` | 第11章/11.3/11.3.1-ip-addresses.md |
| 11.2 | 必须编程绘图实验排除 | 编写十六进制地址转点分十进制程序 | 第11章/11.3/11.3.1-ip-addresses.md |
| 11.3 | 必须编程绘图实验排除 | 编写点分十进制地址转十六进制程序 | 第11章/11.3/11.3.1-ip-addresses.md |
| 11.4 | 必须编程绘图实验排除 | 实现 `HOSTINFO` 变体，实际调用地址转换 API | 第11章/11.4/11.4.7-host-and-service-conversion.md |
| 11.5 | 已收录 | `q-97e1ac350d5f482c` | 第11章/11.5/11.5.4-serving-dynamic-content.md |
| 12.1 | 已收录 | `q-13ac9e7bfac45201` | 第12章/12.1/12.1.2-pros-and-cons-of-processes.md |
| 12.2 | 已收录 | `q-2b84cd60f37a1e95` | 第12章/12.1/12.1.2-pros-and-cons-of-processes.md |
| 12.3 | 已收录 | `q-2b8b77844036d027` | 第12章/12.2/12.2-io-multiplexing-based-concurrent-programming.md |
| 12.4 | 已收录 | `q-96bf14b578ce20a3` | 第12章/12.2/12.2.1-event-driven-server.md |
| 12.5 | 新增 | `q-7b26b4b6d2f975d1` | 第12章/12.3/12.3.8.md |
| 12.6 | 新增 | `q-c3b66a69df1a6feb` | 第12章/12.4/12.4.3.md |
| 12.7 | 新增 | `q-133803920b73149d` | 第12章/12.5/12.5-synchronizing-threads-with-semaphores.md |
| 12.8 | 新增 | `q-df5b4ed7b1339d23` | 第12章/12.5/12.5.1-progress-graphs.md |
| 12.9 | 已收录 | `q-6decb55123a89740` | 第12章/12.5/12.5.4-using-semaphores-to-schedule-shared-resources.md |
| 12.10 | 新增 | `q-746f8779f6847152` | 第12章/12.5/12.5.4-using-semaphores-to-schedule-shared-resources.md |
| 12.11 | 新增 | `q-ba5dea316c258123` | 第12章/12.6/12.6-using-threads-for-parallelism.md |
| 12.12 | 新增 | `q-94cf3a41c9e79f2a` | 第12章/12.7/12.7.2-reentrancy.md |
| 12.13 | 新增 | `q-ef0018499602cc08` | 第12章/12.7/12.7.4-races.md |
| 12.14 | 新增 | `q-c62b001d3da02a1b` | 第12章/12.7/12.7.4-races.md |
| 12.15 | 必须编程绘图实验排除 | 需要绘制原题要求的程序进度图（原文及参考答案依赖两幅图） | 第12章/12.7/12.7.5-deadlocks.md |

## 汇总

- 章内练习总数：48。
- 已收录：18；本轮新增：20；必须编程绘图实验排除：10；题源缺失待确认：0。
- 新增题均保留原章/练习号，文件位于相应 authored paper 目录，待主 agent 将其 ID 接入 papers 索引。
- 题面和答案根据各章正文及《练习题答案.md》逐题手工整理；未用脚本猜题面或答案。新增题已用 `format_v5.parse_authored` 与 `validate_question`（实际 `index.json` 模块集合）逐文件校验。未执行完整题库构建或测试。
