# 有限候选填空核对记录（2026-10-10）

## 范围与结果

检查当前全库的 244 个原有填空小问，并补查标为简答但题面给出了固定候选范围的题。逐空指定候选集，不添加运行时推断，不运行自动题面转换脚本，不修改 Markdown 渲染器。

本轮修改 67 道完整题目，新增 424 处选择控件。加上此前的 10 处，目前 69 道完整题目共 434 处选择控件（417 处单选，17 处多选）；按同一小问内的逻辑空 ID 去重后为 433 个空。根题和综合题小问共 257 个 fill；未能可靠标注空位的小问从 37 个减为 26 个。

这些数字是空位/控件数量，不是新增试题数量；总题数仍为 738，线上仍发布 712 道。原题 ID、考试归属、题目顺序、图片、来源记录与参考解析均保留；本轮改动题目的 revision 各加 1。

## 判定原则

- 题面明确给出候选项：比较关系、是/否、判断正误、固定字词/函数/符号列表、单选或多选选项。
- 知识点本身有小而封闭的取值集合：有效位 0/1、流水线 normal/stall/bubble、F/D/E/M/W 阶段、SRAM/DRAM、局部/全局/外部、ELF 节名等。
- 候选集合列出完整可选范围，而非仅列正确答案。例如 2025 第一次阶段测验第 2 题提供“大于、小于、等于”全部三项。
- 数值计算、地址、位串、自由表达式、任意代码和解释题不因参考答案只有一个就改下拉。
- 有多种可能答案、对行顺序不敏感的表格，或包含尚未配置判分的开放小问，仍保留整体自评。选择控件和自动判分是两个独立配置，不能只核对其中几个空便宣称整题正确。
- 单选为空时不预选答案；多选以集合完全一致判分。none/X 类互斥选项显式声明 exclusiveValues。

## 写法与维护

候选与答案写在每道题的 JSON 头中，题面仍为人工 Markdown。复用 v5 的 `stem.blanks[].input`、`solution.blankAnswers[]`，无需新 schema 版本。

```json
{
  "id": "relation",
  "marker": "{{blank:relation}}",
  "occurrence": 0,
  "width": "medium",
  "input": {
    "kind": "select",
    "multiple": false,
    "options": [
      {"value": "gt", "label": "大于"},
      {"value": "lt", "label": "小于"},
      {"value": "eq", "label": "等于"}
    ]
  }
}
```

判分规则：`{"blankId":"relation","method":"selection","correctValues":["gt"]}`。多选用 `multiple:true` 与多个 correctValues；没有可靠自动答案则用 `method:self`，不能硬塞一个猜测的答案。

同一道题可以同时有下拉和文本输入。重复出现同一逻辑空时，声明相同 id、不同 occurrence，input 必须一致。选择会同步、保存本次练习草稿，切题后恢复；提交后锁定。详细接口见 [v5 编写指南](QUESTION_AUTHORING_V5.md#候选项有限单选下拉--多选下拉)。

## 本轮一并修正的空位

- 2024 期中第二大题：取消误落在 `__asm__ __volatile__` 中的四个伪空位，按本地原文恢复两道判断及输出题；联合体判断保留后续数值输出空，防止漏判。
- 2021 期末第三大题：取消误落在 `__libc_start_main` 中的伪空位。
- 补标流水线控制表、符号属性表、网络协议表中的真实空格；表格仍使用 Markdown，而不是把表格放进代码块。
- 标成简答但具有有限选项的题补为 fill，包括 2021 生产者/消费者、2016 内存映射题、2025 共享变量及符号表等。其余开放部分保留自评，没有批量推测缺失题面。

## 当前覆盖清单

下表包含此前已完成的两道题，点击题号可编辑对应规范 Markdown。

| 试卷 | 选择控件数 | 对应完整题目 |
| --- | ---: | --- |
| 2025阶段测验（第2次） | 8 | [第11讲 8](../question-bank/authored/p-0439188e8c4bdac1/q-60b2f52b1c77f356.md)、[第12讲 11](../question-bank/authored/p-0439188e8c4bdac1/q-638077a818336b95.md)、[第13讲 17](../question-bank/authored/p-0439188e8c4bdac1/q-edd81cd422e2601c.md)、[第16/17讲 23](../question-bank/authored/p-0439188e8c4bdac1/q-f0b98b6dbd158843.md) |
| 2014期末 | 15 | [第四题](../question-bank/authored/p-089627b27e9b5e79/q-dce1153891e59f40.md)、[第五题](../question-bank/authored/p-089627b27e9b5e79/q-e7e0b2274550651e.md) |
| 2015期末 | 22 | [第四题](../question-bank/authored/p-08e665c0f6e47348/q-4c2ab0e8b67755ee.md)、[第六题](../question-bank/authored/p-08e665c0f6e47348/q-a3e6929db333a3d1.md)、[第七题](../question-bank/authored/p-08e665c0f6e47348/q-c42dbf66f5c328f4.md) |
| 2024期中 | 19 | [第五题](../question-bank/authored/p-0fe6817c7f881573/q-3000615f0e2c7873.md)、[第二题](../question-bank/authored/p-0fe6817c7f881573/q-48830bbf91e759fa.md)、[第四题](../question-bank/authored/p-0fe6817c7f881573/q-a2b60d2e0a94d42b.md) |
| 2022期中 | 9 | [第五题](../question-bank/authored/p-12950876262955d9/q-398fe9f606ec567b.md)、[第四题](../question-bank/authored/p-12950876262955d9/q-67ee13bfb461a052.md)、[第二题](../question-bank/authored/p-12950876262955d9/q-d077d3270d2bb69f.md) |
| 2021期末 | 46 | [第五题](../question-bank/authored/p-2c2b56c4452255b1/q-3843863f7e2c5084.md)、[第二题 (1)](../question-bank/authored/p-2c2b56c4452255b1/q-39ef95d61aee8b39.md)、[第三题](../question-bank/authored/p-2c2b56c4452255b1/q-53b7581785c41178.md)、[第六题](../question-bank/authored/p-2c2b56c4452255b1/q-59acf52820891cfb.md)、[第二题 (2)](../question-bank/authored/p-2c2b56c4452255b1/q-5be6279e59ba1151.md)、[第 4 题](../question-bank/authored/p-2c2b56c4452255b1/q-bcf53a1d45ecdc51.md)、[第二题](../question-bank/authored/p-2c2b56c4452255b1/q-c4db69af5ae828fe.md) |
| 2017期末 | 8 | [第八题 2](../question-bank/authored/p-382bf3b10bc8d35a/q-24598d7deeb69df7.md)、[第六题](../question-bank/authored/p-382bf3b10bc8d35a/q-ec77a14af219f706.md) |
| 2017期中 | 6 | [第五题](../question-bank/authored/p-5e37064fe519258d/q-48a073bf38414881.md)、[第二题](../question-bank/authored/p-5e37064fe519258d/q-fe8ac6d2306ebac9.md) |
| 2016期中 | 19 | [第四题](../question-bank/authored/p-662d741f28b2bed0/q-4a6077bec6fc2f43.md)、[第二题 1](../question-bank/authored/p-662d741f28b2bed0/q-e4c733a4eceae52e.md) |
| 2022期末 | 32 | [第四题](../question-bank/authored/p-7016510094998ec2/q-0534efd83d6a6a83.md)、[第一题 1](../question-bank/authored/p-7016510094998ec2/q-7d2a26a53d81e35c.md)、[第二题](../question-bank/authored/p-7016510094998ec2/q-80560a1ecf2223dd.md)、[第一题 13](../question-bank/authored/p-7016510094998ec2/q-923088b4fef4799c.md)、[第六题](../question-bank/authored/p-7016510094998ec2/q-9eb1f8b0e041bbe7.md)、[第三题](../question-bank/authored/p-7016510094998ec2/q-c448153415e0dd8d.md) |
| 2015期中 | 20 | [第二题 1](../question-bank/authored/p-89e8b793519e36c6/q-1737c983c32fea14.md)、[第四题](../question-bank/authored/p-89e8b793519e36c6/q-61bd7ec829d2642e.md) |
| 2019期末 | 16 | [第三题](../question-bank/authored/p-98acf19964247e22/q-96576bae25379ede.md) |
| 2019期中 | 16 | [第二题 1](../question-bank/authored/p-a12b4c73bf0c30d2/q-b9417a58e44059bb.md)、[第二题 2](../question-bank/authored/p-a12b4c73bf0c30d2/q-d3c830eb8ed35d68.md)、[第五题](../question-bank/authored/p-a12b4c73bf0c30d2/q-e9162b5ebf244c22.md) |
| 2013期末 | 12 | [第四题](../question-bank/authored/p-ac5fea2cf89e5bed/q-cd43f371ef053fb9.md) |
| 2024期末 | 15 | [第三题 Part B](../question-bank/authored/p-ae9ab20d09974cf3/q-226325586bcfc18b.md)、[第四题 Part A](../question-bank/authored/p-ae9ab20d09974cf3/q-492c07fd54f9b065.md)、[第五题 Part B](../question-bank/authored/p-ae9ab20d09974cf3/q-c686bf5ca67f4ed8.md) |
| 2016期末 | 8 | [第六题](../question-bank/authored/p-bc69f9ea3beff7ee/q-f8e10c8048661052.md) |
| 2023期中 | 10 | [第二题](../question-bank/authored/p-bed4802d7c36448b/q-15b1a73349ac7405.md)、[第五题 2](../question-bank/authored/p-bed4802d7c36448b/q-1a8cc69307ec0038.md)、[第四题](../question-bank/authored/p-bed4802d7c36448b/q-67f217d16c378540.md) |
| 2013期中 | 24 | [选择题 11-13](../question-bank/authored/p-d0ae6162300a90de/q-1a2cda8997517802.md)、[第二题 1)](../question-bank/authored/p-d0ae6162300a90de/q-f4ab8ae043083a94.md)、[第八题](../question-bank/authored/p-d0ae6162300a90de/q-f5e6c2afdaa570f0.md) |
| 2018期末 | 36 | [第八题](../question-bank/authored/p-e3f869956fc29bd8/q-116083ef80b5731e.md)、[第六题](../question-bank/authored/p-e3f869956fc29bd8/q-b72158b8a694d842.md)、[第三题](../question-bank/authored/p-e3f869956fc29bd8/q-f0b0ad5391aaad24.md) |
| 2025期末 | 30 | [四 2](../question-bank/authored/p-e8f40973e2cc056e/q-3ec4aed1f80da6f3.md)、[四 1](../question-bank/authored/p-e8f40973e2cc056e/q-c5a45b9c928fb3ce.md)、[三](../question-bank/authored/p-e8f40973e2cc056e/q-c799f2158ed1e841.md) |
| 2012期中 | 4 | [Problem B 1](../question-bank/authored/p-ea869cda0eb89689/q-52663df67e4a8257.md) |
| 2018期中 | 14 | [第四题](../question-bank/authored/p-eaef0ab4d19e72c9/q-0d7bc75a367777ab.md)、[第二题](../question-bank/authored/p-eaef0ab4d19e72c9/q-7b8ae9d0614c29bf.md)、[第五题](../question-bank/authored/p-eaef0ab4d19e72c9/q-91d52adb5f08e3b9.md) |
| 2020期末 | 20 | [第三题](../question-bank/authored/p-f99ca20e1a729e32/q-0db09198d5c9f64c.md) |
| 2025阶段测验（第1次） | 14 | [第2讲 2](../question-bank/authored/p-febcfbeee0f364b2/q-be9654f19b9b4b25.md)、[第6讲 17](../question-bank/authored/p-febcfbeee0f364b2/q-c14b1d06d6cfa8ba.md)、[第8讲 24](../question-bank/authored/p-febcfbeee0f364b2/q-fb0c6fbc0e9f5b44.md) |
| 2021期中 | 11 | [第四题](../question-bank/authored/p-ffd1f5f688babe1b/q-bcf23ec71ae6c080.md)、[第二题 1](../question-bank/authored/p-ffd1f5f688babe1b/q-beb1170e1a0ed2fe.md)、[第二题 2](../question-bank/authored/p-ffd1f5f688babe1b/q-c9a40cdea839080f.md)、[第二题 4](../question-bank/authored/p-ffd1f5f688babe1b/q-ce72197e573dfd2e.md) |

## 验证与限制

- `npm run compile-bank`、`npm run check`、`npm run build`。
- 所有显式 selection 答案逐空做正确、错误、缺项判分回归；开放文本输入不变；含 self 的题不伪装自动判分。
- 浏览器核验截图对应比较题、20 空符号表、含汇编的综合题、下拉与文本混合题；验证草稿恢复和提交锁定。
- 浏览器遍历 738 道完整题 / 861 个小问，逐题比对声明的选择控件数量与实际 DOM，检查 56 个图片资源。
- 不据此声称所有历年题内容或参考答案已经重新审定。剩余 26 个无可靠空位的小问，以及原卷或参考有歧义的题，仍需后续人工复核；不通过猜测制造候选项或判分键。

