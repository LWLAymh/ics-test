# CSAPP 第2–6章家庭作业选题记录

来源仓库：`SunnyMaria/csapp-zh-markdown`。固定来源版本：`7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66`。仅调查各章 `homework/`，不把章节练习题算入本清单。题面、表格、已有代码及解析逐题人工编写，未使用批量题目转换。全部参考解析为 AI 推导，**不是 CSAPP 官方家庭作业解答**，`origin=ai-derived`、`crossChecked=false`；发布依据为 `source-import`，无虚构审核者。

遵循本次任务的保守范围：要求画图、从零编写代码/表达式/结构声明、修改完整程序、运行实验的整题排除。已有骨架中的有限常量、寄存器和表达式空可以保留；地址字段填写视作填表。保留题均补足独立作答所需上下文，不要求跳转另一题或图。

| 章 | 调查数 | 纳入 | 排除 | 稳定paperId |
| --- | --- | --- | --- | --- |
| 2 | 43 | 10 | 33 | p-f4835e390ee6ce49 |
| 3 | 18 | 9 | 9 | p-f7485360f6c6060d |
| 4 | 15 | 1 | 14 | p-e855951134d0e9f7 |
| 5 | 7 | 0 | 7 | 不注册空章节；预定ID p-0db63d22232f572c |
| 6 | 25 | 22 | 3 | p-c039f10f0dbe7e3e |
| 合计 | 108 | 42 | 66 | |

题目ID为 `q-` 加 `sha256('csapp-homework-N.M')` 的前16位；章节ID按 `csapp-homework-chapter-N` 同法生成。`paperOrder=M` 以便与另一批章节练习题共享 SecN；最终合并索引由主任务负责。来源的题号是加粗段落，不是标题；每题 `source.document` 使用固定commit的GitHub原文件URL及真实 `#L行号`，定位原始题号。

## 第2章

来源：[2.55–2.60][s2a]、[2.61–2.81][s2b]、[2.82–2.91][s2c]、[2.92–2.97][s2d]。

| 题号 | 处理 | 题ID／原因 |
| --- | --- | --- |
| 2.55 | 排除 | 在不同机器编译运行实验 |
| 2.56 | 排除 | 运行show_bytes实验 |
| 2.57 | 排除 | 编写完整打印函数并运行 |
| 2.58 | 排除 | 编写完整字节序判定过程 |
| 2.59 | 排除 | 从零编写C表达式 |
| 2.60 | 排除 | 编写完整replace_byte函数 |
| 2.61 | 排除 | 从零编写4个C表达式 |
| 2.62 | 排除 | 编写函数并跨机器测试 |
| 2.63 | 排除 | 两个函数缺少完整实现主体 |
| 2.64 | 排除 | 编写完整any_odd_one函数 |
| 2.65 | 排除 | 编写完整odd_ones函数 |
| 2.66 | 排除 | 编写完整leftmost_one函数 |
| 2.67 | 排除 | B、C要求修改完整过程，整题排除 |
| 2.68 | 排除 | 编写完整lower_one_mask函数 |
| 2.69 | 排除 | 编写完整rotate_left函数 |
| 2.70 | 排除 | 编写完整fits_bits函数 |
| 2.71 | 排除 | B要求给出完整正确函数，整题排除 |
| 2.72 | 排除 | B要求从零改写条件表达式，整题排除 |
| 2.73 | 排除 | 编写完整saturating_add函数 |
| 2.74 | 排除 | 编写完整tsub_ok函数 |
| 2.75 | 排除 | 编写unsigned_high_prod完整实现 |
| 2.76 | 排除 | 实现完整calloc函数 |
| 2.77 | 排除 | 从零编写乘法替代表达式 |
| 2.78 | 排除 | 实现完整divide_power2函数 |
| 2.79 | 排除 | 实现完整mul3div4函数 |
| 2.80 | 排除 | 实现完整threefourths函数 |
| 2.81 | 排除 | 从零编写位模式表达式 |
| 2.82 | 纳入 | q-14bd226433913679；判断及解释，自评 |
| 2.83 | 纳入 | q-40eae851d24907df；公式自评，3个数值exact |
| 2.84 | 纳入 | q-06d8adc2438d633d；已有单一返回表达式空，自评等价写法 |
| 2.85 | 纳入 | q-72f5f49722d45dcc；参数化公式和位表示，自评 |
| 2.86 | 纳入 | q-f056683b1b65eedc；十进制近似表自评 |
| 2.87 | 纳入 | q-891259272b9c30b2；半精度表21个exact空 |
| 2.88 | 纳入 | q-663d8a321c079baf；9位格式转换表15个exact空 |
| 2.89 | 纳入 | q-0957a01aa1c7af9f；判断、证明与反例，自评 |
| 2.90 | 纳入 | q-3e41fd24ac20c647；已有代码骨架11个exact空 |
| 2.91 | 纳入 | q-96a266cdbb9db246；二进制小数及循环节解释，自评 |
| 2.92 | 排除 | 实现完整函数并穷举测试 |
| 2.93 | 排除 | 实现完整函数并穷举测试 |
| 2.94 | 排除 | 实现完整函数并穷举测试 |
| 2.95 | 排除 | 实现完整函数并穷举测试 |
| 2.96 | 排除 | 实现完整函数并穷举测试 |
| 2.97 | 排除 | 实现完整函数并穷举测试 |

必要限制：2.82/2.89明确教材32位补码字运算模型，区别于严格ISO C溢出语义，并把随机值理解为任意32位输入。2.85公式假定参数精度和阶码范围足够表示所给数（如7需要至少2位小数）。2.86十进制近似无数值容差接口，采用真简答自评，未伪装为空位未绑定的填空。2.87的D列明确默认6位小数；2.90等价代码表达式白名单有限，题面指定常见表达形式。

## 第3章

来源：[3.58–3.63][s3a]、[3.64–3.69][s3b]、[3.70–3.75][s3c]。

| 题号 | 处理 | 题ID／原因 |
| --- | --- | --- |
| 3.58 | 排除 | 从零重建完整C函数 |
| 3.59 | 纳入 | q-00fd59705ea47ab2；分析并注释已有汇编，自评 |
| 3.60 | 纳入 | q-612092e69e1b921d；寄存器与已有函数骨架空exact |
| 3.61 | 排除 | 编写完整cread_alt函数 |
| 3.62 | 排除 | 重建完整switch分支代码 |
| 3.63 | 排除 | 从反汇编重建完整switch主体 |
| 3.64 | 纳入 | q-386987c9307bd84b；位置公式自评，R/S/T exact |
| 3.65 | 纳入 | q-e99de6be6bcc7042；寄存器及维度3个exact空 |
| 3.66 | 纳入 | q-c2a9a2f0bcb68b70；既定宏NR/NC的有限表达式空exact |
| 3.67 | 排除 | 要求绘制并补充栈帧图 |
| 3.68 | 纳入 | q-775da05d618f67c8；结构布局常数2个exact空 |
| 3.69 | 排除 | 从零写出a_struct完整声明 |
| 3.70 | 纳入 | q-4115df441ce2be40；已有字段表达式及偏移空exact |
| 3.71 | 排除 | 编写完整good_echo函数 |
| 3.72 | 纳入 | q-cc225ba7cc1417ad；栈分配公式与对齐解释，自评 |
| 3.73 | 排除 | 编写汇编函数并测试 |
| 3.74 | 排除 | 编写汇编函数并测试 |
| 3.75 | 纳入 | q-40a597ce05d95c45；分析既有复数调用约定，自评 |

必要限制：3.60明确x86移位量掩码及有符号C骨架语义限制。3.72同时说明一般s1余数下e1最小1/最大24与实际ABI保证s1对齐时最小16/最大24，避免把这两个前提混同。所有汇编使用asm围栏，C代码有正常缩进；未保留“参见图”作为唯一题面上下文。

## 第4章

来源：[4.45–4.50][s4a]、[4.51–4.57][s4b]、[4.58–4.59][s4c]。

| 题号 | 处理 | 题ID／原因 |
| --- | --- | --- |
| 4.45 | 排除 | B要求重写汇编序列，整题排除 |
| 4.46 | 排除 | B要求重写汇编序列，整题排除 |
| 4.47 | 排除 | 实现并测试C和Y86完整程序 |
| 4.48 | 排除 | 修改冒泡排序代码 |
| 4.49 | 排除 | 修改冒泡排序代码 |
| 4.50 | 排除 | 实现Y86函数及测试程序 |
| 4.51 | 纳入 | q-88d2db0a30f24496；描述iaddq阶段计算，自评 |
| 4.52 | 排除 | 修改HCL并生成、测试模拟器 |
| 4.53 | 排除 | 实现HCL暂停控制并实验验证 |
| 4.54 | 排除 | 修改HCL实现指令并测试 |
| 4.55 | 排除 | 修改分支预测HCL及测试 |
| 4.56 | 排除 | 修改分支预测HCL及测试 |
| 4.57 | 排除 | B要求实现加载转发HCL及实验，整题排除 |
| 4.58 | 排除 | 修改单写端口处理器HCL并测试 |
| 4.59 | 排除 | 比较前述自行实现程序的实验性能 |

4.51补齐iaddq指令语义、编码长度和各阶段术语，不依赖练习4.3或图4-18才能作答。

## 第5章

来源：[5.13–5.17][s5a]、[5.18–5.19][s5b]。

| 题号 | 处理 | 原因 |
| --- | --- | --- |
| 5.13 | 排除 | A要求画数据依赖图，整题排除 |
| 5.14 | 排除 | 编写循环展开内积函数 |
| 5.15 | 排除 | 编写6×6展开函数 |
| 5.16 | 排除 | 编写6×1a展开函数 |
| 5.17 | 排除 | 实现优化memset完整函数 |
| 5.18 | 排除 | 编写优化多项式求值函数并测性能 |
| 5.19 | 排除 | 编写优化前缀和代码并测性能 |

本章没有符合范围的家庭作业，不创建空paper。其他代理纳入的章节练习题另行登记。

## 第6章

来源：[6.22–6.30][s6a]、[6.31–6.37][s6b]、[6.38–6.46][s6c]。6.27/28还补入[练习6.12缓存状态][s6d]；该练习不是本批新增的题目。

| 题号 | 处理 | 题ID／原因 |
| --- | --- | --- |
| 6.22 | 纳入 | q-9e8e0f44bbf0df0e；容量最优化exact |
| 6.23 | 纳入 | q-3918da43fd0f2705；磁盘平均访问时间exact |
| 6.24 | 纳入 | q-a6290729b21f28cc；连续/随机文件读时间exact |
| 6.25 | 纳入 | q-648ff478198a0aab；参数表24个exact空 |
| 6.26 | 纳入 | q-f944b313f0622053；参数表8个exact空 |
| 6.27 | 纳入 | q-f5605f3009d40dc5；两个有序地址列表exact |
| 6.28 | 纳入 | q-5806de49ca1af9ce；四组地址列表exact |
| 6.29 | 纳入 | q-9b4b302d390c38b5；字段位范围、顺序访问结果exact |
| 6.30 | 纳入 | q-bdbfe53bb26f3f23；容量及字段位范围exact |
| 6.31 | 纳入 | q-ca5f55956d03145c；完整缓存状态补齐，地址/返回值exact |
| 6.32 | 纳入 | q-47b69e3b61cd3a23；完整缓存状态补齐，地址/返回值exact |
| 6.33 | 纳入 | q-a280af9a9921d9b1；组2全部状态补齐，地址列表exact |
| 6.34 | 纳入 | q-59b8b0ce14f01d6e；矩阵每行4个h/m归入一个显式exact空 |
| 6.35 | 纳入 | q-fc9b5ebf93b37432；补齐6.34代码条件，8个行序列exact |
| 6.36 | 纳入 | q-7851d48fd43fa8c7；3个不命中率exact，容量/块解释自评 |
| 6.37 | 纳入 | q-792e6893a3c496f2；补齐图6-47的3个函数，6个百分比exact |
| 6.38 | 纳入 | q-bc908234f1e08260；写数、不命中数、百分比exact |
| 6.39 | 纳入 | q-cdff9df45e2136bb；补齐6.38上下文，3个exact空 |
| 6.40 | 纳入 | q-05b4c656fcf1ad07；补齐6.38上下文，3个exact空 |
| 6.41 | 纳入 | q-6865caf05518e6ba；写不命中百分比exact |
| 6.42 | 纳入 | q-850a2640dd55bf52；补齐6.41上下文，百分比exact |
| 6.43 | 纳入 | q-2acbedcb62e2d75b；补齐6.41上下文，百分比exact |
| 6.44 | 排除 | 下载并运行memory mountain实验 |
| 6.45 | 排除 | 设计完整优化转置函数 |
| 6.46 | 排除 | 设计完整优化图转换函数 |

必要限制：6.24明确2MB=2^21字节及理想连续传输忽略换头/换道开销。6.29源写“12位地址”却给出12至0的13格，按条件修正为11至0；读不命中加载块，第二次写是否命中由此前读决定；写入数据未知不伪造值。6.29–32原位格标字段按等价位范围填表，不创作新图。6.27/28/33列表题规定递增、4位十六进制、英文逗号无空格，以适配有限exact规则。6.34/35每行输入仍覆盖原4格，按原数组坐标而非访问顺序填写。6.37各函数独立冷缓存；6.38–43明确通常写分配模型，否则仅有“直接映射”条件不足以确定写不命中率。

验证：题目结构、空位绑定和规则由v5单题校验验证；6.34/35/37的访问序列通过独立只读缓存模拟核对。`crossChecked=false`表示未经过第二名人类维护者审核，不能将算法检算冒充官方答案或人类复核。无题目因无法可靠推导而缺失答案；上述模型前提和来源排版修正均已显式记录。此批题目无需新增图片资源。

[s2a]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第02章-信息的表示和处理/homework/2.55-2.60-data-representation.md
[s2b]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第02章-信息的表示和处理/homework/2.61-2.81-integer-coding.md
[s2c]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第02章-信息的表示和处理/homework/2.82-2.91-floating-point-basics.md
[s2d]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第02章-信息的表示和处理/homework/2.92-2.97-bit-level-floating-point.md
[s3a]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第03章-程序的机器级表示/homework/3.58-3.63-arithmetic-and-control-flow.md
[s3b]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第03章-程序的机器级表示/homework/3.64-3.69-arrays-and-structures.md
[s3c]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第03章-程序的机器级表示/homework/3.70-3.75-unions-stack-and-floating-point.md
[s4a]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第04章-处理器体系结构/homework/4.45-4.50-y86-programming.md
[s4b]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第04章-处理器体系结构/homework/4.51-4.57-processor-control.md
[s4c]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第04章-处理器体系结构/homework/4.58-4.59-write-back-and-performance.md
[s5a]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第05章-优化程序性能/homework/5.13-5.17-inner-product-and-memset.md
[s5b]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第05章-优化程序性能/homework/5.18-5.19-polynomial-and-prefix-sum.md
[s6a]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/homework/6.22-6.30-disks-and-cache-basics.md
[s6b]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/homework/6.31-6.37-cache-addressing-and-transpose.md
[s6c]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/homework/6.38-6.46-cache-locality-and-optimization.md
[s6d]: https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/6.4/6.4.4-fully-associative-caches.md#L27
