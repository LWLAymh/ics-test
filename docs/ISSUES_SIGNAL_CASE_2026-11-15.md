# 2026-11-15 信号函数大小写报告

报告：2022期末第四题第1问 `q-0534efd83d6a6a83` / `q-9bc46cc82b1120f4`，认为 `sigsuspend` 应首字母小写。报告时间 `2026-11-15T14:28:07.567242+08:00`，1次报告。

核查结果：当前E空的答案键本已同时接受 `Sigsuspend`、`sigsuspend`；C空同样同时接受 `Sigprocmask`、`sigprocmask`。题面包含 `csapp.h`，教材官方头文件声明和C实现均提供首字母大写的封装；其中Sigsuspend调用小写接口，并将预期的EINTR返回与真正错误区分。当前代码不使用函数返回值，原解析的大写封装写法成立，报告不是判分错误。

来源：

- https://csapp.cs.cmu.edu/3e/ics3/code/include/csapp.h（信号封装声明）
- https://csapp.cs.cmu.edu/3e/ics3/code/src/csapp.c（Sigprocmask及Sigsuspend实现）

处理：不改题面、不改答案键、不改全局大小写规则；只在第1问解析说明大小写两个函数的关系及本题接受范围。revision 6→7，来源与人工审核标记保留。检索全库仅此处有单独的Sigsuspend/sigsuspend函数名空，未发现需要批量修正的同类键。

验证：直接调用既有判分接口核查两种写法均正确，任意混写大小写、其它函数名及重复括号仍不被接受；运行全量题库校验和静态构建，检查本题浏览器参考答案展示。上线核对题库数据后，在报告计数与时间未变化的情况下清理此条报告。
