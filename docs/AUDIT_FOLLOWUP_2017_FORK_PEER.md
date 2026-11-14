# 独立复核：2017期末第五题

日期：2026-11-14。最终独立验收通过，未发现实质错漏。仅查`q-46374f8a549b7cd5`，未修改repo。已直接读取原程序及[最终revision 3候选题稿](../followup-2017-fork/q-46374f8a549b7cd5.md)。以下结论以候选明确的教学模型为前提：每轮fork双方各发送的通知在接收方该轮read前处理完成；每条read/printf分别可被抢占；stdout完整行即时输出且无缓冲复制；所有操作成功并完整读取；进程最终获得调度。此处不将sleep当成POSIX信号送达保证。每个process在本轮read后至printf期间没有新的信号来源，故counter稳定；不需另添调度限制。

独立手推后再用`peer-check.py`枚举进程事件（不读取候选答案），结果：

| 设置 | A/B | 末行可能值的完整集合 |
| --- | --- | --- |
| N=2，E为空 | USR1/USR1 | {123 a, 456 a} |
| 同上 | USR1/USR2 | {9 abc, 1 abc, 90 ab, 01 ab} |
| 同上 | USR2/USR1 | {789 a, 901 a, 78 ab, 01 ab} |
| 同上 | USR2/USR2 | {5 abc, 6 abc} |
| N=3，E=exit(0) | USR1/USR1 | {1234 a, 5678 a} |
| 同上 | USR1/USR2 | {7 abcd, 9 abcd, 78 abc, 89 abc} |
| 同上 | USR2/USR1 | {9012 a, 2345 a, 901 ab, 345 ab} |
| 同上 | USR2/USR2 | {5 abcd, 6 abcd} |

八种case的终止状态行数集合均只有{6}。N=2仍是有限for：首轮父子各输出1次；它们各自剩余一轮又各产出2次，共2+2+2=6；不存在for索引重置。N=3 exit则是根进程3轮，每轮父子各1次，共6。

末行结构证明：根进程最后一次fork一定晚于它此前的printf和wait，而wait必须等旧子进程（及其等待的后代）退出。因此在最后fork前，其余4次输出已完成；最后一行只可能来自最后父子对之一。最后对的两个number read顺序可以交换；同一read顺序下，先读者可被抢占到另一方printf之后，故最后printf者也可交换。父wait在其printf之后，不强制父最后打印。

最后对开始前number共享偏移，N=2四种A/B分别是10、8、6、4；N=3分别是10、6、8、4。以USR1/USR2的N=2为例，父读1字节并输出字母abc，子读2字节并输出字母ab。在偏移8处父先读产生9、子后读产生01；子先读产生90、父后读产生1。任一方都可最后printf，故恰四个末行，不能只接受最终推进文件偏移的一次read。

枚举实现把每个process的fork、number read、printf、wait分开。当前轮通知仅提前合并进fork状态，是因为显式模型保证在read前送达、下一次fork晚于该process自己的read，不改变fork继承的上一轮counter。letter每次open重新从0读取且counter稳定，故将letter read与该process的number read合并不改变可见字符串或其他process状态。枚举得到N=2四个case的memo状态数348/477/466/337；N=3为73/113/113/73。

已对照最终候选的实际模型段：第一次read前处理本轮通知、read原子推进共享偏移、read与printf间可任意暂停、printf完整行即时刷新、sleep不保证父子顺序，均与独立模型一致。候选保留printf之后的waitpid，没有强迫父进程最后打印。

已解析最终候选并运行schema及语义检查；两个行数键均为exact 6。将八个多选correctValues映射为实际label后，与本peer枚举得到的全部可达集合逐个比较，八组完全相等，16个干扰项均不可达，前导0保留正确。未将原题在未约束信号时序下的行为冒充这些唯一有限集合。

可复现实验为[独立动态进程事件枚举源码](../tests/models/2017-fork-output.py)，只用Python标准库，可运行`python tests/models/2017-fork-output.py`，不依赖题稿、不读取任何答案键。根代理可将其原样落地为`tests/models/2017-fork-output.py`作旁证；无需接入npm。另一个代理的Node DAG枚举采用预先构建递归事件偏序的不同实现，也得到完全相同八集合。
