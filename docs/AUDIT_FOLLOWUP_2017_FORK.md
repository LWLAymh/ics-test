# 2017期末第五题闭环复核（2026-11-14）

目标：`question-bank/authored/p-382bf3b10bc8d35a/q-46374f8a549b7cd5.md`。本轮候选revision 2→3，review→published，清除本题两项已解决问题。保留题ID、paperId、原文439–507行和curated出处；保留AI来源，crossChecked=false，不宣称官方答案或人工认证。

源核：已读 `docs/AUDIT_2016_2017_2026-11-14.md` 的全部既有记录；对照 `往年题/期末/2017期末-无答案.pdf` 第13–14页，实际渲染并检查两页。有限for循环、空E、exit(0)、读/打印/wait位置均与源卷一致。源卷没有官方答案。补 `<signal.h>`，题面补教学模型，并把原来的单一末行填空改为“选出所有可能的最后一行”。这是公开的题面修订，不冒充原卷已有条件。

## 采用模型及限制

各进程最终得到调度，调用成功并读满，waitpid确实等指定子结束；本轮用户信号双方恰各处理一次且各在第一次read前完成；计数器递增按教学抽象操作处理；每行printf完整且立即刷新，fork不复制未刷新的输出；共享offset的read原子化。read和printf是不同调度事件，不把整个读取/输出段原子化。sleep不保证父子先后，也不能代替信号屏障。模型只限定教学信号交付边界，不通过虚构“短sleep必先执行”维持旧键。

原题不满足完整可移植C程序的要求（普通int由异步handler访问等），全缓冲stdout还会产生fork复制缓冲的额外问题；本轮明确排除这些运行环境差异。补充信号在读前完成的条件独立于sleep语义，不声称它能由原代码自动推出。若撤销该条件，本轮末行集合不直接适用。

## 独立推导

记u=(1,1)，a和b分别为A/B递增的单位向量。

N=2/E空：P先fork C，C随后fork D，P等待C后才在最后轮fork F；4进程、3fork、6printf。六输出计数器依次按节点为P0:u+b、C0:u+a、C1:u+a+b、D:u+2a、P1:u+2b、F:u+a+b。节点的全局交错不限于这一书写顺序。每个进程自己的i均递增到2终止，旧“无限输出”错误。

N=3/exit：P每轮fork一个打印即退出的子，共3fork、4进程、6printf。第k轮（k=0,1,2）父计数器u+(k+1)b，子计数器u+kb+a。

fd1在全部fork前打开，所有进程共享打开文件描述和offset。fd2每次读取前新open，字母段均为从a开始的counter2字节。N2总数字长度6+5a1+5b1；N3总长度6+3a1+9b1，最大18，未触及30字节EOF。

N2最后一对读取前offset=4+4a1+2b1，父/子计数器u+2b与u+a+b。N3最后一对前offset=4+2a1+4b1，父/子计数器u+3b与u+2b+a。wait保证之前子树全部输出已经结束；末行只能来自最后一对。分别枚举父/子先read与父/子最后printf，四种组合全部可达，重复字符串合并。

| 小问 | N2末行全集 | N3末行全集 |
| --- | --- | --- |
| AA | `123 a`、`456 a` | `1234 a`、`5678 a` |
| AB | `9 abc`、`1 abc`、`90 ab`、`01 ab` | `7 abcd`、`9 abcd`、`78 abc`、`89 abc` |
| BA | `789 a`、`901 a`、`78 ab`、`01 ab` | `9012 a`、`2345 a`、`901 ab`、`345 ab` |
| BB | `5 abc`、`6 abc` | `5 abcd`、`6 abcd` |

N2-BA父(3,1)、子(2,2)，字母分别a/ab；这是关键边界，不能再多加一次A。AB/BA每组四行，既包含“最后读后打印”也包含“先读但最后打印”，不能误减为两行。

## 有限枚举和判分验证

根代理与两名独立复核代理得到相同八集合：动态fork/read/print状态枚举（完整进程树及wait）和独立DAG拓扑序枚举，均允许read/printf分事件。动态枚举N2状态AA/AB/BA/BB为348/477/466/337，N3为73/113/113/73，所有终态均6行；独立DAG也得到相同集合。两套模型均不依赖候选correctValues生成期望值。

客观规则：保留原10个blank ID。两个行数exact=6；八个末行blank均显式multiple select，每题正确2或4个选项，加两个不可能干扰项。option label直接为一整行，selection必须与完整correctValues集合相等，少选/多选/重复选均不接受；不使用解析文本猜键，不把“调度相关”当成答案。

本候选已只读调用现有format_v5完成parse/schema/全部10个anchor验证，通过。实际调用site/question-v5.js的gradeBlank，86条正反例全通过：行数6与前后空格接受；旧无限/不终止、4/8行拒绝；八个完整选择集及反序选择接受；逐一漏选正确项、逐一加入干扰项、空集、重复选择均拒绝；N2-BA误加ab/abc选项拒绝。独立复核代理另准备同集合的DAG边界测试，由根代理统一运行。未运行compile/build。

不改共享papers/generated/tests，不compile、commit或push。子代理实际只写issues工作区的本候选及本记录，根代理负责映射到仓库目标路径。

## 技术依据

官方primary references：[POSIX fork](https://pubs.opengroup.org/onlinepubs/9799919799/functions/fork.html)、[POSIX sleep](https://pubs.opengroup.org/onlinepubs/9799919799/functions/sleep.html)、[POSIX read](https://pubs.opengroup.org/onlinepubs/9799919799/functions/read.html)。本轮访问Open Group官网返回403，未将未读网页冒充已验证证据；源卷与教学模型为主要推导依据。[Linux man-pages官方fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html)所述fork复制地址空间、共享打开文件描述/文件偏移与本题处理一致。候选不依赖任何第三方博客答案。
