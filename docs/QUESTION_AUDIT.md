# ics-test 题库逐题校对报告

> 由 `_audit/report_final.py` 生成。基线提交 `2e4c231`。

## 一、结论

| 指标 | 校对前 | 校对后 |
|---|---|---|
| 题库总题数 | 1009 | 871 |
| 显示「本题答案尚未完成结构化校对」 | 670 | 0 |
| 已校对答案 (status=verified) | 339 | 871 |
| 显式声明单选/多选的题 | 5 | 438 |
| 仍是「未声明交互类型」的题 | 399 | 67 |
| 改动的 curated 文件 | — | 931 |

题数从 1009 降到 871，不是删题，而是**把 138 条并不存在的「题目」退回了它们
本来的身份**：它们来自答案/解析材料，被当成了试卷逐段或逐块收进题库。

## 二、三个根因

### 1. 把「答案/解析」材料当成试卷

`_cls/*.json` 的 `kind` 缺省是 `questions`，于是答案材料被当成题目发布，
而它们本身没有 `答案：` 标记，全部落到 `missing`，正好是「待校对」里最大的一块。

| 答案材料 | 被误当题目数 | 现在的身份 |
|---|---|---|
| `2019、2020期末-答案解析` | 61 | `kind: answers` / 答案段，2019/2020 期末的答案来源 |
| `期末往年题勘误、详解 by Arthals` | 36 | `kind: answers` / 答案段，2015–2022 期末的勘误/详解 |
| `2022期末-答案` | 21 | `kind: answers` / 答案段，2022 期末的答案来源 |
| `chap 9 解析` | 10 | `kind: answers` / 答案段，chap 9 题目的答案来源 |
| `chap 11-12 解析` | 8 | `kind: answers` / 答案段，chap 11-12 题目的答案来源 |
| `2016期中-带答案 的 `第三题 (1)/(2) 答案` 段` | 2 | `kind: answers` / 答案段，移入该卷 `answer_sections` |

### 2. 选项写在代码围栏里 → 选择题被判成填空/简答

`_tools/scaffold_curated.py` 的 `classify()` 判定选项时会跳过代码围栏内的行。
原卷里不少选择题的 A/B/C/D 恰好排在一个 ``` 代码块中（HCL 片段、C 代码之后直接跟选项），
于是找不到选项，退化成 `fill`（切片里有 `（1）`、`____`）或 `short`。
已经按「围栏内外都算选项」重新判定并搬运到 `%%% choices`。

### 3. 答案内联在题目正文里

带答案版把答案用红字直接印在空位/冒号之后（阶段测验、2020–2024 期中、2024 期末等），
而脚手架只认行首的 `答案：`，于是这些答案既没进 `%%% answer`，又留在题干里。
对同时存在「带答案 / 无答案」两份原文的卷子，用逐行差分把答案精确切出来；
切分结果带**无损断言**：新内容的字符多重集必须等于原切片，只搬家不丢字。

## 三、逐卷状态

| 试卷 | 题数 | 待校对 | 单选/多选 | 未声明 |
|---|---|---|---|---|
| 2012期中 | 29 | 0 | 15 | 0 |
| 2013期中 | 30 | 0 | 13 | 0 |
| 2013期末 | 28 | 0 | 10 | 8 |
| 2014期中 | 31 | 0 | 15 | 0 |
| 2014期末 | 30 | 0 | 7 | 13 |
| 2015期中 | 33 | 0 | 20 | 0 |
| 2015期末 | 27 | 0 | 15 | 4 |
| 2016期中 | 26 | 0 | 14 | 0 |
| 2016期末 | 27 | 0 | 14 | 6 |
| 2017期中 | 19 | 0 | 15 | 0 |
| 2017期末 | 28 | 0 | 21 | 0 |
| 2018期中 | 21 | 0 | 14 | 0 |
| 2018期末 | 24 | 0 | 12 | 3 |
| 2019期中 | 25 | 0 | 15 | 0 |
| 2019期末 | 30 | 0 | 20 | 0 |
| 2020期中 | 22 | 0 | 3 | 8 |
| 2020期末 | 32 | 0 | 25 | 0 |
| 2021期中 | 37 | 0 | 4 | 11 |
| 2021期末 | 28 | 0 | 20 | 0 |
| 2021期末（第 10 讲） | 2 | 0 | 2 | 0 |
| 2021期末（第 11–12 讲） | 8 | 0 | 6 | 0 |
| 2021期末（第 2–6 讲） | 12 | 0 | 10 | 0 |
| 2021期末（第 7 讲） | 6 | 0 | 0 | 0 |
| 2021期末（第 8 讲） | 4 | 0 | 1 | 0 |
| 2021期末（第 9 讲） | 11 | 0 | 6 | 0 |
| 2022期中 | 25 | 0 | 17 | 2 |
| 2022期末 | 43 | 0 | 3 | 0 |
| 2023期中 | 26 | 0 | 20 | 0 |
| 2024期中 | 24 | 0 | 12 | 4 |
| 2024期末 | 23 | 0 | 8 | 7 |
| 2025Lab测验 | 50 | 0 | 50 | 0 |
| 2025期末 | 31 | 0 | 27 | 0 |
| 2025期末（答案速查表） | 31 | 0 | 2 | 0 |
| 2025阶段测验（第1次） | 24 | 0 | 0 | 1 |
| 2025阶段测验（第2次） | 24 | 0 | 2 | 0 |

## 四、已知例外（故意保持 fill/short 的题）

有 12 道题的题干里能扫到 A/B/C/D 字样，但**不应**改判成选择题，
自动化改判脚本（`_audit/fix_mode.py`）对它们明确让开：

- **多道小题聚在一个区间**（如 `(11-13)、…` 下面 11/12/13 各自带选项和答案）：
  整体改判只会显示第一小题的选项，答案却是三题拼起来的。
- **带标签的作答区**（`A: 0  B: 1  C: Sigprocmask …`）：A–F 是空位编号，不是选项。
- **选项是多行代码/表格行**（2014期中 第一题 14）：
  A/B/C/D 是四种代码变换的表格行标签，`%%% choices` 只能内联渲染，装不下代码块，
  因此保留 `short-answer` 并展示参考答案。

这 12 道之外，`fix_mode.py` 已无可安全改判的对象（`converted 0`）。

## 五、AI 推导的答案（全部带署名）

有 78 道题的原卷与仓库内所有配套材料都**没有**官方答案，它们的答案与解析由 AI 推导，
并在答案区逐题署名为 **deepseek v4.1 flash · 大肥鱼小姐**，读者一眼能区分官方答案与推导：

- `2025Lab测验-无答案` 50 道（全卷无答案）
- `2017期末-无答案` 28 道（该卷无答案，Arthals 详解也没有 2017 一节）

逐题答案与解析汇总见 **[AI_DERIVED_ANSWERS.md](AI_DERIVED_ANSWERS.md)**。
另有 10 道题最初被误标为「无官方答案」，实际上带答案版/PDF 红字里有答案，
已改标为「答案来自原卷，解析由 AI 整理」；`2013期末 第一题 20` 原卷自己注明
「四个选项都有问题，无正确答案」，单独标注。

## 六、仍然待校对的原因

**已归零**：871 道题全部有结构化答案。


## 五、逐题清单

| 试卷 | 题号 | 题型 | 答案状态 |
|---|---|---|---|
| 2012期中 | Problem A 1 | single-choice | verified |
| 2012期中 | Problem A 2 | multiple-choice | verified |
| 2012期中 | Problem A 3 | single-choice | verified |
| 2012期中 | Problem A 4 | multiple-choice | verified |
| 2012期中 | Problem A 5 | single-choice | verified |
| 2012期中 | Problem A 6 | single-choice | verified |
| 2012期中 | Problem A 7 | single-choice | verified |
| 2012期中 | Problem A 8 | single-choice | verified |
| 2012期中 | Problem A 9 | single-choice | verified |
| 2012期中 | Problem A 10 | single-choice | verified |
| 2012期中 | Problem A 11 | single-choice | verified |
| 2012期中 | Problem A 12 | single-choice | verified |
| 2012期中 | Problem A 13 | single-choice | verified |
| 2012期中 | Problem A 14 | single-choice | verified |
| 2012期中 | Problem A 15 | single-choice | verified |
| 2012期中 | Problem B 1 | fill | verified |
| 2012期中 | Problem B 2 | short-answer | verified |
| 2012期中 | Problem B 3 | fill | verified |
| 2012期中 | Problem C 1 | fill | verified |
| 2012期中 | Problem C 2 a) | short-answer | verified |
| 2012期中 | Problem C 2 b) | short-answer | verified |
| 2012期中 | Problem C 2 c) | short-answer | verified |
| 2012期中 | Problem C 2 d) | short-answer | verified |
| 2012期中 | Problem D A | short-answer | verified |
| 2012期中 | Problem D B | short-answer | verified |
| 2012期中 | Problem E A | short-answer | verified |
| 2012期中 | Problem E B | short-answer | verified |
| 2012期中 | Problem E C | short-answer | verified |
| 2012期中 | Problem F A | short-answer | verified |
| 2013期中 | 选择题 1 | short-answer | verified |
| 2013期中 | 选择题 2 | multiple-choice | verified |
| 2013期中 | 选择题 3 | single-choice | verified |
| 2013期中 | 选择题 4 | single-choice | verified |
| 2013期中 | 选择题 5 | single-choice | verified |
| 2013期中 | 选择题 6 | single-choice | verified |
| 2013期中 | 选择题 7 | multiple-choice | verified |
| 2013期中 | 选择题 8 | multiple-choice | verified |
| 2013期中 | 选择题 9 | multiple-choice | verified |
| 2013期中 | 选择题 10 | multiple-choice | verified |
| 2013期中 | 选择题 11-13 | short-answer | verified |
| 2013期中 | 选择题 14 | multiple-choice | verified |
| 2013期中 | 选择题 15 | multiple-choice | verified |
| 2013期中 | 选择题 16 | single-choice | verified |
| 2013期中 | 选择题 17 | single-choice | verified |
| 2013期中 | 第二题 1) | short-answer | verified |
| 2013期中 | 第二题 2) | short-answer | verified |
| 2013期中 | 第三题 1) | short-answer | verified |
| 2013期中 | 第三题 2) | fill | verified |
| 2013期中 | 第四题 | fill | verified |
| 2013期中 | 第五题 1) | short-answer | verified |
| 2013期中 | 第五题 2) | short-answer | verified |
| 2013期中 | 第五题 3) | short-answer | verified |
| 2013期中 | 第五题 4) | short-answer | verified |
| 2013期中 | 第六题 | short-answer | verified |
| 2013期中 | 第七题 1) | short-answer | verified |
| 2013期中 | 第七题 2)3) | fill | verified |
| 2013期中 | 第八题 1) | fill | verified |
| 2013期中 | 第八题 2) | fill | verified |
| 2013期中 | 第八题 3) | fill | verified |
| 2013期末 | 第一题 1 | single-choice | verified |
| 2013期末 | 第一题 2 | choice | verified |
| 2013期末 | 第一题 3 | choice | verified |
| 2013期末 | 第一题 4 | short-answer | verified |
| 2013期末 | 第一题 5 | choice | verified |
| 2013期末 | 第一题 6 | choice | verified |
| 2013期末 | 第一题 7 | choice | verified |
| 2013期末 | 第一题 8 | single-choice | verified |
| 2013期末 | 第一题 9 | single-choice | verified |
| 2013期末 | 第一题 10 | single-choice | verified |
| 2013期末 | 第一题 11 | choice | verified |
| 2013期末 | 第一题 12 | choice | verified |
| 2013期末 | 第一题 13 | single-choice | verified |
| 2013期末 | 第一题 14 | single-choice | verified |
| 2013期末 | 第一题 15 | single-choice | verified |
| 2013期末 | 第一题 16 | single-choice | verified |
| 2013期末 | 第一题 17 | single-choice | verified |
| 2013期末 | 第一题 18 | short-answer | verified |
| 2013期末 | 第一题 19 | single-choice | verified |
| 2013期末 | 第一题 20 | choice | verified |
| 2013期末 | 第二题 | short-answer | verified |
| 2013期末 | 第三题 | short-answer | verified |
| 2013期末 | 第四题 | fill | verified |
| 2013期末 | 第五题 Part I | fill | verified |
| 2013期末 | 第五题 Part II | fill | verified |
| 2013期末 | 第六题 | fill | verified |
| 2013期末 | 第七题 | fill | verified |
| 2013期末 | 第八题 | fill | verified |
| 2014期中 | 第一题 1 | single-choice | verified |
| 2014期中 | 第一题 2 | single-choice | verified |
| 2014期中 | 第一题 3 | single-choice | verified |
| 2014期中 | 第一题 4 | single-choice | verified |
| 2014期中 | 第一题 5 | single-choice | verified |
| 2014期中 | 第一题 6 | single-choice | verified |
| 2014期中 | 第一题 7 | single-choice | verified |
| 2014期中 | 第一题 8 | single-choice | verified |
| 2014期中 | 第一题 9 | single-choice | verified |
| 2014期中 | 第一题 10 | single-choice | verified |
| 2014期中 | 第一题 11 | single-choice | verified |
| 2014期中 | 第一题 12 | single-choice | verified |
| 2014期中 | 第一题 13 | single-choice | verified |
| 2014期中 | 第一题 14 | short-answer | verified |
| 2014期中 | 第一题 15 | single-choice | verified |
| 2014期中 | 第一题 16 | single-choice | verified |
| 2014期中 | 第二题 1） | short-answer | verified |
| 2014期中 | 第二题 2） | short-answer | verified |
| 2014期中 | 第三题 | short-answer | verified |
| 2014期中 | 第四题 1） | short-answer | verified |
| 2014期中 | 第四题 2） | short-answer | verified |
| 2014期中 | 第四题 3） | short-answer | verified |
| 2014期中 | 第五题 | short-answer | verified |
| 2014期中 | 第六题 | short-answer | verified |
| 2014期中 | 第七题 1） | short-answer | verified |
| 2014期中 | 第七题 2） | short-answer | verified |
| 2014期中 | 第七题 3） | short-answer | verified |
| 2014期中 | 第八题 1） | short-answer | verified |
| 2014期中 | 第八题 2） | fill | verified |
| 2014期中 | 第八题 3） | short-answer | verified |
| 2014期中 | 第八题 4） | fill | verified |
| 2014期末 | 第一题 1 | single-choice | verified |
| 2014期末 | 第一题 2 | single-choice | verified |
| 2014期末 | 第一题 3 | choice | verified |
| 2014期末 | 第一题 4 | single-choice | verified |
| 2014期末 | 第一题 5 | single-choice | verified |
| 2014期末 | 第一题 6 | single-choice | verified |
| 2014期末 | 第一题 7 | single-choice | verified |
| 2014期末 | 第一题 8 | choice | verified |
| 2014期末 | 第一题 9 | choice | verified |
| 2014期末 | 第一题 10 | choice | verified |
| 2014期末 | 第一题 11 | choice | verified |
| 2014期末 | 第一题 12 | choice | verified |
| 2014期末 | 第一题 13 | choice | verified |
| 2014期末 | 第一题 14 | choice | verified |
| 2014期末 | 第一题 15 | single-choice | verified |
| 2014期末 | 第一题 16 | choice | verified |
| 2014期末 | 第一题 17 | choice | verified |
| 2014期末 | 第一题 18 | choice | verified |
| 2014期末 | 第一题 19 | choice | verified |
| 2014期末 | 第一题 20 | choice | verified |
| 2014期末 | 第二题 1 | fill | verified |
| 2014期末 | 第二题 2 | fill | verified |
| 2014期末 | 第三题 | short-answer | verified |
| 2014期末 | 第四题 | fill | verified |
| 2014期末 | 第五题 | fill | verified |
| 2014期末 | 第六题 1 | fill | verified |
| 2014期末 | 第六题 2 | fill | verified |
| 2014期末 | 第七题 | short-answer | verified |
| 2014期末 | 第八题 | fill | verified |
| 2014期末 | 第九题 | fill | verified |
| 2015期中 | 选择题 1 | single-choice | verified |
| 2015期中 | 选择题 2 | single-choice | verified |
| 2015期中 | 选择题 3 | single-choice | verified |
| 2015期中 | 选择题 4 | single-choice | verified |
| 2015期中 | 选择题 5 | single-choice | verified |
| 2015期中 | 选择题 6 | single-choice | verified |
| 2015期中 | 选择题 7 | single-choice | verified |
| 2015期中 | 选择题 8 | single-choice | verified |
| 2015期中 | 选择题 9 | single-choice | verified |
| 2015期中 | 选择题 10 | single-choice | verified |
| 2015期中 | 选择题 11 | single-choice | verified |
| 2015期中 | 选择题 12 | single-choice | verified |
| 2015期中 | 选择题 13 | single-choice | verified |
| 2015期中 | 选择题 14 | single-choice | verified |
| 2015期中 | 选择题 15 | single-choice | verified |
| 2015期中 | 选择题 16 | single-choice | verified |
| 2015期中 | 选择题 17 | single-choice | verified |
| 2015期中 | 选择题 18 | single-choice | verified |
| 2015期中 | 选择题 19 | single-choice | verified |
| 2015期中 | 选择题 20 | single-choice | verified |
| 2015期中 | 第二题 1 | short-answer | verified |
| 2015期中 | 第二题 2 | fill | verified |
| 2015期中 | 第三题 1 | fill | verified |
| 2015期中 | 第三题 2 | fill | verified |
| 2015期中 | 第三题 3 | short-answer | verified |
| 2015期中 | 第三题 4 | short-answer | verified |
| 2015期中 | 第四题 1 | short-answer | verified |
| 2015期中 | 第四题 2 | fill | verified |
| 2015期中 | 第四题 3 | fill | verified |
| 2015期中 | 第四题 4 | fill | verified |
| 2015期中 | 第四题 5 | fill | verified |
| 2015期中 | 第五题 1 | short-answer | verified |
| 2015期中 | 第五题 2 | short-answer | verified |
| 2015期末 | 第一题 1 | single-choice | verified |
| 2015期末 | 第一题 2 | single-choice | verified |
| 2015期末 | 第一题 3 | single-choice | verified |
| 2015期末 | 第一题 4 | choice | verified |
| 2015期末 | 第一题 5 | choice | verified |
| 2015期末 | 第一题 6 | single-choice | verified |
| 2015期末 | 第一题 7 | single-choice | verified |
| 2015期末 | 第一题 8 | choice | verified |
| 2015期末 | 第一题 9 | single-choice | verified |
| 2015期末 | 第一题 10 | single-choice | verified |
| 2015期末 | 第一题 11 | single-choice | verified |
| 2015期末 | 第一题 12 | single-choice | verified |
| 2015期末 | 第一题 13 | single-choice | verified |
| 2015期末 | 第一题 14 | single-choice | verified |
| 2015期末 | 第一题 15 | short-answer | verified |
| 2015期末 | 第一题 16 | single-choice | verified |
| 2015期末 | 第一题 17 | choice | verified |
| 2015期末 | 第一题 18 | single-choice | verified |
| 2015期末 | 第一题 19 | single-choice | verified |
| 2015期末 | 第一题 20 | single-choice | verified |
| 2015期末 | 第二题 | fill | verified |
| 2015期末 | 第三题 | short-answer | verified |
| 2015期末 | 第四题 | fill | verified |
| 2015期末 | 第五题 | fill | verified |
| 2015期末 | 第六题 | fill | verified |
| 2015期末 | 第七题 | short-answer | verified |
| 2015期末 | 第八题 | fill | verified |
| 2016期中 | 第一题 1 | single-choice | verified |
| 2016期中 | 第一题 2 | single-choice | verified |
| 2016期中 | 第一题 3 | single-choice | verified |
| 2016期中 | 第一题 4 | single-choice | verified |
| 2016期中 | 第一题 5 | single-choice | verified |
| 2016期中 | 第一题 6 | single-choice | verified |
| 2016期中 | 第一题 7 | single-choice | verified |
| 2016期中 | 第一题 8 | single-choice | verified |
| 2016期中 | 第一题 9 | single-choice | verified |
| 2016期中 | 第一题 10 | single-choice | verified |
| 2016期中 | 第一题 11 | single-choice | verified |
| 2016期中 | 第一题 12 | single-choice | verified |
| 2016期中 | 第一题 13 | single-choice | verified |
| 2016期中 | 第一题 14 | single-choice | verified |
| 2016期中 | 第一题 15 | fill | verified |
| 2016期中 | 第一题 16 | fill | verified |
| 2016期中 | 第一题 17 | fill | verified |
| 2016期中 | 第一题 18 | fill | verified |
| 2016期中 | 第一题 19 | short-answer | verified |
| 2016期中 | 第一题 20 | short-answer | verified |
| 2016期中 | 第二题 1 | short-answer | verified |
| 2016期中 | 第二题 2 | fill | verified |
| 2016期中 | 第三题 (1) | fill | verified |
| 2016期中 | 第三题 (2) | fill | verified |
| 2016期中 | 第四题 | fill | verified |
| 2016期中 | 第五题 | fill | verified |
| 2016期末 | 第一题 1 | single-choice | verified |
| 2016期末 | 第一题 2 | single-choice | verified |
| 2016期末 | 第一题 3 | single-choice | verified |
| 2016期末 | 第一题 4 | single-choice | verified |
| 2016期末 | 第一题 5 | single-choice | verified |
| 2016期末 | 第一题 6 | choice | verified |
| 2016期末 | 第一题 7 | choice | verified |
| 2016期末 | 第一题 8 | choice | verified |
| 2016期末 | 第一题 9 | single-choice | verified |
| 2016期末 | 第一题 10 | choice | verified |
| 2016期末 | 第一题 11 | single-choice | verified |
| 2016期末 | 第一题 12 | single-choice | verified |
| 2016期末 | 第一题 13 | single-choice | verified |
| 2016期末 | 第一题 14 | single-choice | verified |
| 2016期末 | 第一题 15 | single-choice | verified |
| 2016期末 | 第一题 16 | single-choice | verified |
| 2016期末 | 第一题 17 | single-choice | verified |
| 2016期末 | 第一题 18 | single-choice | verified |
| 2016期末 | 第一题 19 | choice | verified |
| 2016期末 | 第一题 20 | choice | verified |
| 2016期末 | 第二题 | short-answer | verified |
| 2016期末 | 第三题 | short-answer | verified |
| 2016期末 | 第四题 | fill | verified |
| 2016期末 | 第五题 | fill | verified |
| 2016期末 | 第六题 | short-answer | verified |
| 2016期末 | 第七题 | fill | verified |
| 2016期末 | 第八题 | fill | verified |
| 2017期中 | 第一题 1 | single-choice | verified |
| 2017期中 | 第一题 2 | single-choice | verified |
| 2017期中 | 第一题 3 | single-choice | verified |
| 2017期中 | 第一题 4 | multiple-choice | verified |
| 2017期中 | 第一题 5 | single-choice | verified |
| 2017期中 | 第一题 6 | single-choice | verified |
| 2017期中 | 第一题 7 | single-choice | verified |
| 2017期中 | 第一题 8 | single-choice | verified |
| 2017期中 | 第一题 9 | single-choice | verified |
| 2017期中 | 第一题 10 | single-choice | verified |
| 2017期中 | 第一题 11 | single-choice | verified |
| 2017期中 | 第一题 12 | single-choice | verified |
| 2017期中 | 第一题 13 | single-choice | verified |
| 2017期中 | 第一题 14 | single-choice | verified |
| 2017期中 | 第一题 15 | single-choice | verified |
| 2017期中 | 第二题 | short-answer | verified |
| 2017期中 | 第三题 | fill | verified |
| 2017期中 | 第四题 | fill | verified |
| 2017期中 | 第五题 | fill | verified |
| 2017期末 | 第一题 1 | single-choice | verified |
| 2017期末 | 第一题 2 | single-choice | verified |
| 2017期末 | 第一题 3 | single-choice | verified |
| 2017期末 | 第一题 4 | single-choice | verified |
| 2017期末 | 第一题 5 | single-choice | verified |
| 2017期末 | 第一题 6 | single-choice | verified |
| 2017期末 | 第一题 7 | single-choice | verified |
| 2017期末 | 第一题 8 | single-choice | verified |
| 2017期末 | 第一题 9 | single-choice | verified |
| 2017期末 | 第一题 10 | single-choice | verified |
| 2017期末 | 第一题 11 | single-choice | verified |
| 2017期末 | 第一题 12 | single-choice | verified |
| 2017期末 | 第一题 13 | single-choice | verified |
| 2017期末 | 第一题 14 | single-choice | verified |
| 2017期末 | 第一题 15 | single-choice | verified |
| 2017期末 | 第一题 16 | single-choice | verified |
| 2017期末 | 第一题 17 | single-choice | verified |
| 2017期末 | 第一题 18 | single-choice | verified |
| 2017期末 | 第一题 19 | single-choice | verified |
| 2017期末 | 第一题 20 | single-choice | verified |
| 2017期末 | 第二题 1 | fill | verified |
| 2017期末 | 第二题 2 | fill | verified |
| 2017期末 | 第三题 | fill | verified |
| 2017期末 | 第四题 | short-answer | verified |
| 2017期末 | 第五题 | fill | verified |
| 2017期末 | 第六题 | fill | verified |
| 2017期末 | 第七题 | multiple-choice | verified |
| 2017期末 | 第八题 | short-answer | verified |
| 2018期中 | 第一题 1 | single-choice | verified |
| 2018期中 | 第一题 2 | single-choice | verified |
| 2018期中 | 第一题 3 | single-choice | verified |
| 2018期中 | 第一题 4 | single-choice | verified |
| 2018期中 | 第一题 5 | single-choice | verified |
| 2018期中 | 第一题 6 | single-choice | verified |
| 2018期中 | 第一题 7 | single-choice | verified |
| 2018期中 | 第一题 8 | single-choice | verified |
| 2018期中 | 第一题 9 | single-choice | verified |
| 2018期中 | 第一题 10 | single-choice | verified |
| 2018期中 | 第一题 11 | short-answer | verified |
| 2018期中 | 第一题 12 | single-choice | verified |
| 2018期中 | 第一题 13 | single-choice | verified |
| 2018期中 | 第一题 14 | single-choice | verified |
| 2018期中 | 第一题 15 | single-choice | verified |
| 2018期中 | 第二题 | fill | verified |
| 2018期中 | 第三题 1 | fill | verified |
| 2018期中 | 第三题 2、3 | fill | verified |
| 2018期中 | 第四题 | short-answer | verified |
| 2018期中 | 第五题 | fill | verified |
| 2018期中 | 第六题 | short-answer | verified |
| 2018期末 | 第一题 1 | single-choice | verified |
| 2018期末 | 第一题 2 | choice | verified |
| 2018期末 | 第一题 3 | single-choice | verified |
| 2018期末 | 第一题 4 | choice | verified |
| 2018期末 | 第一题 5 | single-choice | verified |
| 2018期末 | 第一题 6 | single-choice | verified |
| 2018期末 | 第一题 7 | single-choice | verified |
| 2018期末 | 第一题 8 | single-choice | verified |
| 2018期末 | 第一题 9 | single-choice | verified |
| 2018期末 | 第一题 10 | single-choice | verified |
| 2018期末 | 第一题 11 | single-choice | verified |
| 2018期末 | 第一题 12 | choice | verified |
| 2018期末 | 第一题 13 | single-choice | verified |
| 2018期末 | 第一题 14 | single-choice | verified |
| 2018期末 | 第一题 15 | single-choice | verified |
| 2018期末 | 第二题 | short-answer | verified |
| 2018期末 | 第三题 1 | short-answer | verified |
| 2018期末 | 第三题 2 | short-answer | verified |
| 2018期末 | 第四题 | fill | verified |
| 2018期末 | 第五题 | short-answer | verified |
| 2018期末 | 第六题 | short-answer | verified |
| 2018期末 | 第七题 1 | fill | verified |
| 2018期末 | 第七题 2-4 | fill | verified |
| 2018期末 | 第八题 | fill | verified |
| 2019期中 | 第一题 1 | single-choice | verified |
| 2019期中 | 第一题 2 | single-choice | verified |
| 2019期中 | 第一题 3 | single-choice | verified |
| 2019期中 | 第一题 4 | single-choice | verified |
| 2019期中 | 第一题 5 | single-choice | verified |
| 2019期中 | 第一题 6 | single-choice | verified |
| 2019期中 | 第一题 7 | single-choice | verified |
| 2019期中 | 第一题 8 | single-choice | verified |
| 2019期中 | 第一题 9 | single-choice | verified |
| 2019期中 | 第一题 10 | single-choice | verified |
| 2019期中 | 第一题 11 | single-choice | verified |
| 2019期中 | 第一题 12 | single-choice | verified |
| 2019期中 | 第一题 13 | single-choice | verified |
| 2019期中 | 第一题 14 | single-choice | verified |
| 2019期中 | 第一题 15 | single-choice | verified |
| 2019期中 | 第二题 1 | short-answer | verified |
| 2019期中 | 第二题 2 | short-answer | verified |
| 2019期中 | 第三题 | fill | verified |
| 2019期中 | 第四题 1 | short-answer | verified |
| 2019期中 | 第四题 2(1) | fill | verified |
| 2019期中 | 第四题 2(2) | fill | verified |
| 2019期中 | 第四题 2(3) | fill | verified |
| 2019期中 | 第五题 1) | short-answer | verified |
| 2019期中 | 第五题 2) | short-answer | verified |
| 2019期中 | 第六题 | fill | verified |
| 2019期末 | 第一题 1 | single-choice | verified |
| 2019期末 | 第一题 2 | single-choice | verified |
| 2019期末 | 第一题 3 | single-choice | verified |
| 2019期末 | 第一题 4 | single-choice | verified |
| 2019期末 | 第一题 5 | single-choice | verified |
| 2019期末 | 第一题 6 | single-choice | verified |
| 2019期末 | 第一题 7 | single-choice | verified |
| 2019期末 | 第一题 8 | multiple-choice | verified |
| 2019期末 | 第一题 9 | single-choice | verified |
| 2019期末 | 第一题 10 | single-choice | verified |
| 2019期末 | 第一题 11 | single-choice | verified |
| 2019期末 | 第一题 12 | single-choice | verified |
| 2019期末 | 第一题 13 | single-choice | verified |
| 2019期末 | 第一题 14 | single-choice | verified |
| 2019期末 | 第一题 15 | single-choice | verified |
| 2019期末 | 第一题 16 | single-choice | verified |
| 2019期末 | 第一题 17 | single-choice | verified |
| 2019期末 | 第一题 18 | single-choice | verified |
| 2019期末 | 第一题 19 | single-choice | verified |
| 2019期末 | 第一题 20 | single-choice | verified |
| 2019期末 | 第二题 (1) | fill | verified |
| 2019期末 | 第二题 (2) | fill | verified |
| 2019期末 | 第二题 (3) | fill | verified |
| 2019期末 | 第二题 (4) | fill | verified |
| 2019期末 | 第二题 (5) | fill | verified |
| 2019期末 | 第三题 | short-answer | verified |
| 2019期末 | 第四题 | short-answer | verified |
| 2019期末 | 第五题 | short-answer | verified |
| 2019期末 | 第六题 | short-answer | verified |
| 2019期末 | 第七题 | short-answer | verified |
| 2020期中 | 第一题 1 | single-choice | verified |
| 2020期中 | 第一题 2 | choice | verified |
| 2020期中 | 第一题 3 | choice | verified |
| 2020期中 | 第一题 4 | choice | verified |
| 2020期中 | 第一题 5 | choice | verified |
| 2020期中 | 第一题 6 | choice | verified |
| 2020期中 | 第一题 7 | choice | verified |
| 2020期中 | 第一题 8 | choice | verified |
| 2020期中 | 第一题 9 | short-answer | verified |
| 2020期中 | 第一题 10 | single-choice | verified |
| 2020期中 | 第一题 11 | single-choice | verified |
| 2020期中 | 第一题 12 | choice | verified |
| 2020期中 | 第二题 第一段 | fill | verified |
| 2020期中 | 第二题 第二段 | fill | verified |
| 2020期中 | 第三题 1 | fill | verified |
| 2020期中 | 第三题 2 | fill | verified |
| 2020期中 | 第三题 3 | short-answer | verified |
| 2020期中 | 第四题 1 | fill | verified |
| 2020期中 | 第四题 2 | fill | verified |
| 2020期中 | 第五题 1 | fill | verified |
| 2020期中 | 第五题 2 | fill | verified |
| 2020期中 | 第五题 3 | fill | verified |
| 2020期末 | 第一题 1 | single-choice | verified |
| 2020期末 | 第一题 2 | single-choice | verified |
| 2020期末 | 第一题 3 | single-choice | verified |
| 2020期末 | 第一题 4 | single-choice | verified |
| 2020期末 | 第一题 5 | single-choice | verified |
| 2020期末 | 第一题 6 | single-choice | verified |
| 2020期末 | 第一题 7 | single-choice | verified |
| 2020期末 | 第一题 8 | single-choice | verified |
| 2020期末 | 第一题 9 | single-choice | verified |
| 2020期末 | 第一题 10 | single-choice | verified |
| 2020期末 | 第一题 11 | single-choice | verified |
| 2020期末 | 第一题 12 | single-choice | verified |
| 2020期末 | 第一题 13 | single-choice | verified |
| 2020期末 | 第一题 14 | single-choice | verified |
| 2020期末 | 第一题 15 | single-choice | verified |
| 2020期末 | 第一题 16 | single-choice | verified |
| 2020期末 | 第一题 17 | single-choice | verified |
| 2020期末 | 第一题 18 | single-choice | verified |
| 2020期末 | 第一题 19 | single-choice | verified |
| 2020期末 | 第一题 20 | single-choice | verified |
| 2020期末 | 第一题 21 | single-choice | verified |
| 2020期末 | 第一题 22 | single-choice | verified |
| 2020期末 | 第一题 23 | single-choice | verified |
| 2020期末 | 第一题 24 | single-choice | verified |
| 2020期末 | 第一题 25 | single-choice | verified |
| 2020期末 | 第二题 1) | fill | verified |
| 2020期末 | 第二题 2) | fill | verified |
| 2020期末 | 第二题 3) | fill | verified |
| 2020期末 | 第三题 | short-answer | verified |
| 2020期末 | 第四题 | short-answer | verified |
| 2020期末 | 第五题 | short-answer | verified |
| 2020期末 | 第六题 | short-answer | verified |
| 2021期中 | 第一题 1 | single-choice | verified |
| 2021期中 | 第一题 2 | choice | verified |
| 2021期中 | 第一题 3 | choice | verified |
| 2021期中 | 第一题 4 | choice | verified |
| 2021期中 | 第一题 5 | choice | verified |
| 2021期中 | 第一题 6 | choice | verified |
| 2021期中 | 第一题 7 | choice | verified |
| 2021期中 | 第一题 8 | choice | verified |
| 2021期中 | 第一题 9 | single-choice | verified |
| 2021期中 | 第一题 10 | choice | verified |
| 2021期中 | 第一题 11 | choice | verified |
| 2021期中 | 第一题 12 | choice | verified |
| 2021期中 | 第一题 13 | choice | verified |
| 2021期中 | 第一题 14 | single-choice | verified |
| 2021期中 | 第一题 15 | single-choice | verified |
| 2021期中 | 第二题 1 | fill | verified |
| 2021期中 | 第二题 2 | fill | verified |
| 2021期中 | 第二题 3 | fill | verified |
| 2021期中 | 第二题 4 | fill | verified |
| 2021期中 | 第三题 1 | fill | verified |
| 2021期中 | 第三题 2 | fill | verified |
| 2021期中 | 第三题 3 | fill | verified |
| 2021期中 | 第四题 1 | fill | verified |
| 2021期中 | 第四题 2 | fill | verified |
| 2021期中 | 第四题 3 | fill | verified |
| 2021期中 | 第四题 4 | fill | verified |
| 2021期中 | 第五题 1 | short-answer | verified |
| 2021期中 | 第五题 2(1) | fill | verified |
| 2021期中 | 第五题 2(2) | fill | verified |
| 2021期中 | 第五题 2(3) | fill | verified |
| 2021期中 | 第六题 1 | fill | verified |
| 2021期中 | 第六题 2 | short-answer | verified |
| 2021期中 | 第六题 3 | fill | verified |
| 2021期中 | 第六题 4 | fill | verified |
| 2021期中 | 第六题 5 | fill | verified |
| 2021期中 | 第六题 6 | fill | verified |
| 2021期中 | 第六题 7 | fill | verified |
| 2021期末 | 第一题 1 | single-choice | verified |
| 2021期末 | 第一题 2 | single-choice | verified |
| 2021期末 | 第一题 3 | single-choice | verified |
| 2021期末 | 第一题 4 | single-choice | verified |
| 2021期末 | 第一题 5 | single-choice | verified |
| 2021期末 | 第一题 6 | single-choice | verified |
| 2021期末 | 第一题 7 | single-choice | verified |
| 2021期末 | 第一题 8 | single-choice | verified |
| 2021期末 | 第一题 9 | single-choice | verified |
| 2021期末 | 第一题 10 | single-choice | verified |
| 2021期末 | 第一题 11 | single-choice | verified |
| 2021期末 | 第一题 12 | single-choice | verified |
| 2021期末 | 第一题 13 | single-choice | verified |
| 2021期末 | 第一题 14 | single-choice | verified |
| 2021期末 | 第一题 15 | single-choice | verified |
| 2021期末 | 第一题 16 | single-choice | verified |
| 2021期末 | 第一题 17 | single-choice | verified |
| 2021期末 | 第一题 18 | single-choice | verified |
| 2021期末 | 第一题 19 | single-choice | verified |
| 2021期末 | 第一题 20 | single-choice | verified |
| 2021期末 | 第二题 | fill | verified |
| 2021期末 | 第三题 | fill | verified |
| 2021期末 | 第四题 | fill | verified |
| 2021期末 | 第五题 1 | fill | verified |
| 2021期末 | 第五题 2 | fill | verified |
| 2021期末 | 第五题 3 | fill | verified |
| 2021期末 | 第五题 4 | fill | verified |
| 2021期末 | 第六题 | short-answer | verified |
| 2021期末（第 10 讲） | 选择题 1 | single-choice | verified |
| 2021期末（第 10 讲） | 选择题 2 | single-choice | verified |
| 2021期末（第 11–12 讲） | 选择题 1 | single-choice | verified |
| 2021期末（第 11–12 讲） | 选择题 2 | single-choice | verified |
| 2021期末（第 11–12 讲） | 选择题 3 | single-choice | verified |
| 2021期末（第 11–12 讲） | 备选题 4 | single-choice | verified |
| 2021期末（第 11–12 讲） | 备选题 5 | single-choice | verified |
| 2021期末（第 11–12 讲） | 选择题 1 | single-choice | verified |
| 2021期末（第 11–12 讲） | 大题 小题1 | short-answer | verified |
| 2021期末（第 11–12 讲） | 大题 小题2 | short-answer | verified |
| 2021期末（第 2–6 讲） | 第一题 1 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 2 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 3 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 4 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 5 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 6 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 7 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 8 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 9 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第一题 10 | single-choice | verified |
| 2021期末（第 2–6 讲） | 第二题 (1) | fill | verified |
| 2021期末（第 2–6 讲） | 第二题 (2) | fill | verified |
| 2021期末（第 7 讲） | 第 1 题 | short-answer | verified |
| 2021期末（第 7 讲） | 第 2 题 | short-answer | verified |
| 2021期末（第 7 讲） | 第 3 题 | short-answer | verified |
| 2021期末（第 7 讲） | 第 4 题 题干+Part A | short-answer | verified |
| 2021期末（第 7 讲） | 第 4 题 Part B | short-answer | verified |
| 2021期末（第 7 讲） | 第 4 题 Part C | short-answer | verified |
| 2021期末（第 8 讲） | 第 1 题 | short-answer | verified |
| 2021期末（第 8 讲） | 第 2 题 | single-choice | verified |
| 2021期末（第 8 讲） | 大题 PART A | short-answer | verified |
| 2021期末（第 8 讲） | 大题 PART B | short-answer | verified |
| 2021期末（第 9 讲） | 选择题 1 | single-choice | verified |
| 2021期末（第 9 讲） | 选择题 2 | single-choice | verified |
| 2021期末（第 9 讲） | 大题 1 | short-answer | verified |
| 2021期末（第 9 讲） | 大题 2 | short-answer | verified |
| 2021期末（第 9 讲） | 大题 3(1) | short-answer | verified |
| 2021期末（第 9 讲） | 大题 3(2) | short-answer | verified |
| 2021期末（第 9 讲） | 大题 4 | short-answer | verified |
| 2021期末（第 9 讲） | 备选题 1 | single-choice | verified |
| 2021期末（第 9 讲） | 备选题 2 | single-choice | verified |
| 2021期末（第 9 讲） | 备选题 3 | single-choice | verified |
| 2021期末（第 9 讲） | 备选题 4 | single-choice | verified |
| 2022期中 | 第一题 1 | single-choice | verified |
| 2022期中 | 第一题 2 | single-choice | verified |
| 2022期中 | 第一题 3 | single-choice | verified |
| 2022期中 | 第一题 4 | single-choice | verified |
| 2022期中 | 第一题 5 | single-choice | verified |
| 2022期中 | 第一题 6 | single-choice | verified |
| 2022期中 | 第一题 7 | single-choice | verified |
| 2022期中 | 第一题 8 | short-answer | verified |
| 2022期中 | 第一题 9 | single-choice | verified |
| 2022期中 | 第一题 10 | single-choice | verified |
| 2022期中 | 第一题 11 | single-choice | verified |
| 2022期中 | 第一题 12 | choice | verified |
| 2022期中 | 第一题 13 | choice | verified |
| 2022期中 | 第一题 14 | single-choice | verified |
| 2022期中 | 第一题 15 | single-choice | verified |
| 2022期中 | 第一题 16 | single-choice | verified |
| 2022期中 | 第一题 17 | single-choice | verified |
| 2022期中 | 第一题 18 | single-choice | verified |
| 2022期中 | 第一题 19 | single-choice | verified |
| 2022期中 | 第一题 20 | single-choice | verified |
| 2022期中 | 第二题 | short-answer | verified |
| 2022期中 | 第三题 | short-answer | verified |
| 2022期中 | 第四题 | short-answer | verified |
| 2022期中 | 第五题 1 | fill | verified |
| 2022期中 | 第五题 2 | fill | verified |
| 2022期末 | 第一题 1 | fill | verified |
| 2022期末 | 第一题 2 | fill | verified |
| 2022期末 | 第一题 3 | fill | verified |
| 2022期末 | 第一题 4 | fill | verified |
| 2022期末 | 第一题 5 | fill | verified |
| 2022期末 | 第一题 6 | fill | verified |
| 2022期末 | 第一题 7 | fill | verified |
| 2022期末 | 第一题 8 | fill | verified |
| 2022期末 | 第一题 9 | fill | verified |
| 2022期末 | 第一题 10 | fill | verified |
| 2022期末 | 第一题 11 | fill | verified |
| 2022期末 | 第一题 12 | fill | verified |
| 2022期末 | 第一题 13 | fill | verified |
| 2022期末 | 第一题 14 | fill | verified |
| 2022期末 | 第一题 15 | fill | verified |
| 2022期末 | 第二题 (1) | fill | verified |
| 2022期末 | 第二题 (2) | fill | verified |
| 2022期末 | 第二题 (3) | fill | verified |
| 2022期末 | 第二题 (4) | fill | verified |
| 2022期末 | 第二题 (5) | fill | verified |
| 2022期末 | 第二题 (6) | fill | verified |
| 2022期末 | 第三题 (1) | fill | verified |
| 2022期末 | 第三题 (2) | fill | verified |
| 2022期末 | 第三题 (3) | single-choice | verified |
| 2022期末 | 第三题 (4) | fill | verified |
| 2022期末 | 第四题 1(1) | fill | verified |
| 2022期末 | 第四题 1(2) | fill | verified |
| 2022期末 | 第四题 2 | fill | verified |
| 2022期末 | 第五题 1 | short-answer | verified |
| 2022期末 | 第五题 2 | short-answer | verified |
| 2022期末 | 第五题 3 | fill | verified |
| 2022期末 | 第六题 1 | fill | verified |
| 2022期末 | 第六题 2 | fill | verified |
| 2022期末 | 第六题 3 | fill | verified |
| 2022期末 | 第六题 4 | short-answer | verified |
| 2022期末 | 第六题 5 | fill | verified |
| 2022期末 | 第六题 6 | single-choice | verified |
| 2022期末 | 第六题 3（第 14 页重复） | fill | verified |
| 2022期末 | 第六题 4（第 14 页重复） | short-answer | verified |
| 2022期末 | 第六题 5（第 14 页重复） | fill | verified |
| 2022期末 | 第六题 6（第 14 页重复） | single-choice | verified |
| 2022期末 | 第七题 1 | fill | verified |
| 2022期末 | 第七题 2 | fill | verified |
| 2023期中 | 第一题 1 | single-choice | verified |
| 2023期中 | 第一题 2 | single-choice | verified |
| 2023期中 | 第一题 3 | single-choice | verified |
| 2023期中 | 第一题 4 | single-choice | verified |
| 2023期中 | 第一题 5 | single-choice | verified |
| 2023期中 | 第一题 6 | single-choice | verified |
| 2023期中 | 第一题 7 | single-choice | verified |
| 2023期中 | 第一题 8 | single-choice | verified |
| 2023期中 | 第一题 9 | single-choice | verified |
| 2023期中 | 第一题 10 | single-choice | verified |
| 2023期中 | 第一题 11 | single-choice | verified |
| 2023期中 | 第一题 12 | single-choice | verified |
| 2023期中 | 第一题 13 | single-choice | verified |
| 2023期中 | 第一题 14 | single-choice | verified |
| 2023期中 | 第一题 15 | single-choice | verified |
| 2023期中 | 第一题 16 | single-choice | verified |
| 2023期中 | 第一题 17 | multiple-choice | verified |
| 2023期中 | 第一题 18 | single-choice | verified |
| 2023期中 | 第一题 19 | single-choice | verified |
| 2023期中 | 第一题 20 | single-choice | verified |
| 2023期中 | 第二题 | fill | verified |
| 2023期中 | 第三题 | fill | verified |
| 2023期中 | 第四题 | fill | verified |
| 2023期中 | 第五题 1 | fill | verified |
| 2023期中 | 第五题 2 | short-answer | verified |
| 2023期中 | 第五题 3 | short-answer | verified |
| 2024期中 | 第一题 1 | single-choice | verified |
| 2024期中 | 第一题 2 | choice | verified |
| 2024期中 | 第一题 3 | single-choice | verified |
| 2024期中 | 第一题 4 | single-choice | verified |
| 2024期中 | 第一题 5 | single-choice | verified |
| 2024期中 | 第一题 6 | single-choice | verified |
| 2024期中 | 第一题 7 | single-choice | verified |
| 2024期中 | 第一题 8 | single-choice | verified |
| 2024期中 | 第一题 9 | choice | verified |
| 2024期中 | 第一题 10 | single-choice | verified |
| 2024期中 | 第一题 11 | single-choice | verified |
| 2024期中 | 第一题 12 | choice | verified |
| 2024期中 | 第一题 13 | choice | verified |
| 2024期中 | 第一题 14 | single-choice | verified |
| 2024期中 | 第一题 15 | short-answer | verified |
| 2024期中 | 第二题 1 | fill | verified |
| 2024期中 | 第二题 2 | fill | verified |
| 2024期中 | 第二题 3 | fill | verified |
| 2024期中 | 第三题 | fill | verified |
| 2024期中 | 第四题 | fill | verified |
| 2024期中 | 第五题 1 | single-choice | verified |
| 2024期中 | 第五题 2 | single-choice | verified |
| 2024期中 | 第五题 3 | short-answer | verified |
| 2024期中 | 第五题 4 | short-answer | verified |
| 2024期末 | 第一题 1 | single-choice | verified |
| 2024期末 | 第一题 2 | single-choice | verified |
| 2024期末 | 第一题 3 | choice | verified |
| 2024期末 | 第一题 4 | single-choice | verified |
| 2024期末 | 第一题 5 | single-choice | verified |
| 2024期末 | 第一题 6 | single-choice | verified |
| 2024期末 | 第一题 7 | choice | verified |
| 2024期末 | 第一题 8 | choice | verified |
| 2024期末 | 第一题 9 | choice | verified |
| 2024期末 | 第一题 10 | choice | verified |
| 2024期末 | 第一题 11 | choice | verified |
| 2024期末 | 第一题 12 | choice | verified |
| 2024期末 | 第一题 13 | multiple-choice | verified |
| 2024期末 | 第一题 14 | single-choice | verified |
| 2024期末 | 第一题 15 | single-choice | verified |
| 2024期末 | 第二题 | fill | verified |
| 2024期末 | 第三题 Part A | fill | verified |
| 2024期末 | 第三题 Part B | fill | verified |
| 2024期末 | 第三题 Part C | fill | verified |
| 2024期末 | 第四题 Part A | short-answer | verified |
| 2024期末 | 第四题 Part B | fill | verified |
| 2024期末 | 第五题 Part A | fill | verified |
| 2024期末 | 第五题 Part B | fill | verified |
| 2025Lab测验 | Lab 任务 1 | single-choice | verified |
| 2025Lab测验 | Lab 任务 2 | single-choice | verified |
| 2025Lab测验 | Lab 任务 3 | single-choice | verified |
| 2025Lab测验 | Lab 任务 4 | single-choice | verified |
| 2025Lab测验 | Lab 任务 5 | single-choice | verified |
| 2025Lab测验 | Lab 任务 6 | single-choice | verified |
| 2025Lab测验 | Lab 任务 7 | single-choice | verified |
| 2025Lab测验 | Lab 任务 8 | single-choice | verified |
| 2025Lab测验 | Lab 任务 9 | single-choice | verified |
| 2025Lab测验 | Lab 任务 10 | single-choice | verified |
| 2025Lab测验 | Lab 任务 11 | single-choice | verified |
| 2025Lab测验 | Lab 任务 12 | single-choice | verified |
| 2025Lab测验 | Lab 任务 13 | single-choice | verified |
| 2025Lab测验 | Lab 任务 14 | single-choice | verified |
| 2025Lab测验 | Lab 任务 15 | single-choice | verified |
| 2025Lab测验 | Lab 任务 16 | single-choice | verified |
| 2025Lab测验 | Lab 任务 17 | single-choice | verified |
| 2025Lab测验 | Lab 任务 18 | single-choice | verified |
| 2025Lab测验 | Lab 任务 19 | single-choice | verified |
| 2025Lab测验 | Lab 任务 20 | single-choice | verified |
| 2025Lab测验 | Lab 任务 21 | single-choice | verified |
| 2025Lab测验 | Lab 任务 22 | single-choice | verified |
| 2025Lab测验 | Lab 任务 23 | single-choice | verified |
| 2025Lab测验 | Lab 任务 24 | single-choice | verified |
| 2025Lab测验 | Lab 任务 25 | single-choice | verified |
| 2025Lab测验 | Lab 任务 26 | single-choice | verified |
| 2025Lab测验 | Lab 任务 27 | single-choice | verified |
| 2025Lab测验 | Lab 任务 28 | single-choice | verified |
| 2025Lab测验 | Lab 任务 29 | single-choice | verified |
| 2025Lab测验 | Lab 任务 30 | single-choice | verified |
| 2025Lab测验 | Lab 任务 31 | single-choice | verified |
| 2025Lab测验 | Lab 任务 32 | single-choice | verified |
| 2025Lab测验 | Lab 任务 33 | single-choice | verified |
| 2025Lab测验 | Lab 任务 34 | single-choice | verified |
| 2025Lab测验 | Lab 任务 35 | single-choice | verified |
| 2025Lab测验 | Lab 任务 36 | single-choice | verified |
| 2025Lab测验 | Lab 任务 37 | single-choice | verified |
| 2025Lab测验 | Lab 任务 38 | single-choice | verified |
| 2025Lab测验 | Lab 任务 39 | single-choice | verified |
| 2025Lab测验 | Lab 任务 40 | single-choice | verified |
| 2025Lab测验 | Lab 任务 41 | single-choice | verified |
| 2025Lab测验 | Lab 任务 42 | single-choice | verified |
| 2025Lab测验 | Lab 任务 43 | single-choice | verified |
| 2025Lab测验 | Lab 任务 44 | single-choice | verified |
| 2025Lab测验 | Lab 任务 45 | single-choice | verified |
| 2025Lab测验 | Lab 任务 46 | single-choice | verified |
| 2025Lab测验 | Lab 任务 47 | single-choice | verified |
| 2025Lab测验 | Lab 任务 48 | single-choice | verified |
| 2025Lab测验 | Lab 任务 49 | single-choice | verified |
| 2025Lab测验 | Lab 任务 50 | single-choice | verified |
| 2025期末 | 一 1 | multiple-choice | verified |
| 2025期末 | 一 2 | multiple-choice | verified |
| 2025期末 | 一 3 | multiple-choice | verified |
| 2025期末 | 一 4 | multiple-choice | verified |
| 2025期末 | 一 5 | multiple-choice | verified |
| 2025期末 | 一 6 | multiple-choice | verified |
| 2025期末 | 一 7 | multiple-choice | verified |
| 2025期末 | 一 8 | multiple-choice | verified |
| 2025期末 | 一 9 | multiple-choice | verified |
| 2025期末 | 一 10 | multiple-choice | verified |
| 2025期末 | 一 11 | multiple-choice | verified |
| 2025期末 | 一 12 | multiple-choice | verified |
| 2025期末 | 一 13 | multiple-choice | verified |
| 2025期末 | 二 14 | multiple-choice | verified |
| 2025期末 | 二 15 | multiple-choice | verified |
| 2025期末 | 二 16 | multiple-choice | verified |
| 2025期末 | 二 17 | multiple-choice | verified |
| 2025期末 | 二 18 | multiple-choice | verified |
| 2025期末 | 二 19 | single-choice | verified |
| 2025期末 | 二 20 | multiple-choice | verified |
| 2025期末 | 二 21 | multiple-choice | verified |
| 2025期末 | 二 22 | multiple-choice | verified |
| 2025期末 | 二 23 | multiple-choice | verified |
| 2025期末 | 二 24 | multiple-choice | verified |
| 2025期末 | 二 25 | multiple-choice | verified |
| 2025期末 | 三 1 | short-answer | verified |
| 2025期末 | 三 2 | fill | verified |
| 2025期末 | 三 3 | single-choice | verified |
| 2025期末 | 四 1 | fill | verified |
| 2025期末 | 四 2 | single-choice | verified |
| 2025期末 | 四 3 | fill | verified |
| 2025期末（答案速查表） | 一 1 | short-answer | verified |
| 2025期末（答案速查表） | 一 2 | short-answer | verified |
| 2025期末（答案速查表） | 一 3 | short-answer | verified |
| 2025期末（答案速查表） | 一 4 | short-answer | verified |
| 2025期末（答案速查表） | 一 5 | short-answer | verified |
| 2025期末（答案速查表） | 一 6 | short-answer | verified |
| 2025期末（答案速查表） | 一 7 | short-answer | verified |
| 2025期末（答案速查表） | 一 8 | short-answer | verified |
| 2025期末（答案速查表） | 一 9 | short-answer | verified |
| 2025期末（答案速查表） | 一 10 | short-answer | verified |
| 2025期末（答案速查表） | 一 11 | short-answer | verified |
| 2025期末（答案速查表） | 一 12 | short-answer | verified |
| 2025期末（答案速查表） | 一 13 | short-answer | verified |
| 2025期末（答案速查表） | 二 14 | short-answer | verified |
| 2025期末（答案速查表） | 二 15 | short-answer | verified |
| 2025期末（答案速查表） | 二 16 | short-answer | verified |
| 2025期末（答案速查表） | 二 17 | short-answer | verified |
| 2025期末（答案速查表） | 二 18 | short-answer | verified |
| 2025期末（答案速查表） | 二 19 | short-answer | verified |
| 2025期末（答案速查表） | 二 20 | short-answer | verified |
| 2025期末（答案速查表） | 二 21 | short-answer | verified |
| 2025期末（答案速查表） | 二 22 | short-answer | verified |
| 2025期末（答案速查表） | 二 23 | short-answer | verified |
| 2025期末（答案速查表） | 二 24 | short-answer | verified |
| 2025期末（答案速查表） | 二 25 | short-answer | verified |
| 2025期末（答案速查表） | 三 1 | short-answer | verified |
| 2025期末（答案速查表） | 三 2 | fill | verified |
| 2025期末（答案速查表） | 三 3 | single-choice | verified |
| 2025期末（答案速查表） | 四 1 | short-answer | verified |
| 2025期末（答案速查表） | 四 2 | single-choice | verified |
| 2025期末（答案速查表） | 四 3 | fill | verified |
| 2025阶段测验（第1次） | 第2讲 1 | fill | verified |
| 2025阶段测验（第1次） | 第2讲 2 | short-answer | verified |
| 2025阶段测验（第1次） | 第2讲 3 | short-answer | verified |
| 2025阶段测验（第1次） | 第3讲 4 | fill | verified |
| 2025阶段测验（第1次） | 第3讲 5 | short-answer | verified |
| 2025阶段测验（第1次） | 第3讲 6 | choice | verified |
| 2025阶段测验（第1次） | 第4讲 7 | short-answer | verified |
| 2025阶段测验（第1次） | 第4讲 8 | short-answer | verified |
| 2025阶段测验（第1次） | 第4讲 9 | short-answer | verified |
| 2025阶段测验（第1次） | 第5讲 10 | short-answer | verified |
| 2025阶段测验（第1次） | 第5讲 11 | fill | verified |
| 2025阶段测验（第1次） | 第5讲 12 | fill | verified |
| 2025阶段测验（第1次） | 第5讲 13 | short-answer | verified |
| 2025阶段测验（第1次） | 第5讲 14 | short-answer | verified |
| 2025阶段测验（第1次） | 第6讲 15 | fill | verified |
| 2025阶段测验（第1次） | 第6讲 16 | fill | verified |
| 2025阶段测验（第1次） | 第6讲 17 | short-answer | verified |
| 2025阶段测验（第1次） | 第7讲 18 | short-answer | verified |
| 2025阶段测验（第1次） | 第7讲 19 | short-answer | verified |
| 2025阶段测验（第1次） | 第7讲 20 | short-answer | verified |
| 2025阶段测验（第1次） | 第7讲 21 | short-answer | verified |
| 2025阶段测验（第1次） | 第7讲 22 | short-answer | verified |
| 2025阶段测验（第1次） | 第8讲 23 | short-answer | verified |
| 2025阶段测验（第1次） | 第8讲 24 | short-answer | verified |
| 2025阶段测验（第2次） | 第9讲 1 | multiple-choice | verified |
| 2025阶段测验（第2次） | 第9讲 2 | short-answer | verified |
| 2025阶段测验（第2次） | 第9讲 3 | fill | verified |
| 2025阶段测验（第2次） | 第9讲 4 | short-answer | verified |
| 2025阶段测验（第2次） | 第10讲 5 | short-answer | verified |
| 2025阶段测验（第2次） | 第10讲 6 | short-answer | verified |
| 2025阶段测验（第2次） | 第11讲 7 | short-answer | verified |
| 2025阶段测验（第2次） | 第11讲 8 | short-answer | verified |
| 2025阶段测验（第2次） | 第11讲 9 | short-answer | verified |
| 2025阶段测验（第2次） | 第11讲 10 | short-answer | verified |
| 2025阶段测验（第2次） | 第12讲 11 | short-answer | verified |
| 2025阶段测验（第2次） | 第12讲 12 | short-answer | verified |
| 2025阶段测验（第2次） | 第12讲 13 | short-answer | verified |
| 2025阶段测验（第2次） | 第12讲 14 | multiple-choice | verified |
| 2025阶段测验（第2次） | 第12讲 15 | short-answer | verified |
| 2025阶段测验（第2次） | 第13讲 16 | short-answer | verified |
| 2025阶段测验（第2次） | 第13讲 17 | short-answer | verified |
| 2025阶段测验（第2次） | 第13讲 18 | short-answer | verified |
| 2025阶段测验（第2次） | 第14/15讲 19 | fill | verified |
| 2025阶段测验（第2次） | 第14/15讲 20 | short-answer | verified |
| 2025阶段测验（第2次） | 第14/15讲 21 | fill | verified |
| 2025阶段测验（第2次） | 第16/17讲 22 | short-answer | verified |
| 2025阶段测验（第2次） | 第16/17讲 23 | fill | verified |
| 2025阶段测验（第2次） | 第16/17讲 24 | fill | verified |

## 六、复现与校验

```powershell
cd ics-test
python question-bank/_tools/validate_cls.py
python question-bank/_tools/verify_verbatim.py
python question-bank/_tools/verify_curated.py
python question-bank/_tools/build_web_data.py
python question-bank/_tools/validate_web_data.py
npm run check
npm run build
```

`verify_curated.py` 对每个 `_curated` 文件证明它与 `原文` 切片等价；
本次重构过（`provenance: rewritten`）的文件全部登记在 
`question-bank/_tools/_rewritten_allowlist.txt`，可逐条复核。
