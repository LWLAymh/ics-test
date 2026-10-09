+++
# ---------------------------------------------------------------- v4.1 题目模板
# 用法：复制本文件到 question-bank/authored/<paper-id>/<question-id>.md，再逐项填写。
# 接口规范见 docs/QUESTION_AUTHORING_V4_1.md，机器可读 schema 见
# question-bank/schema/question-v4.1.schema.json。
#
# 注意：v4.1 尚未接入构建，本模板暂时不会被任何脚本读取。

schema_version = "4.1"            # 固定字符串 "4.1"
id = "q-0000000000000000"         # q- + 16 位小写十六进制；永久稳定，排版改动不改变它
revision = 1                      # 内容修订号，从 1 开始；每次改内容加一
type = "single-choice"            # single-choice | multiple-choice | fill | short-answer | composite

paper_id = "p-0000000000000000"   # 稳定试卷 ID，必须能在 papers.json 里找到
paper_order = 1                   # 原卷顺序，从 1 开始，与试卷 questionIds 下标一致

number_display = "第一题 1"        # 原卷题号原样文本，只用于展示
number_major_display = "第一题"    # 大题号原样文本
number_major_value = "1"          # 大题号规范值
number_minor_display = "1"        # 没有小题号时，本行与下一行一起删掉
number_minor_value = "1"
# number_parts = ["a", "iii"]     # 更深层级；无法可靠识别时留空，不要猜

module_primary = "data_representation"
modules = ["data_representation"] # 必须包含 module_primary
tags = ["标签一", "标签二"]

[solution]
state = "verified"                # verified | missing | needs-review
kind = "choice"                   # choice（选择题）| blanks（填空）| reference（简答）
correct_option_ids = ["A"]        # 单选恰好 1 个；多选 ≥1 个

[solution.provenance]
origin = "official"               # official | human-derived | ai-derived
cross_checked = true              # 是否与官方答案核对过
# attribution = "deepseek v4.1 flash · 大肥鱼小姐"   # origin = "ai-derived" 时必填

[publish]
state = "draft"                   # draft | review | published
reviewer = ""                     # published 时必填；未发布留空串或删掉整块
reviewed_at = ""                  # published 时必填，ISO 日期，例如 2026-10-10

[source]
document = "原文/期中/待填.md"
start = 1
end = 1
provenance = "rewritten"          # verbatim | reflow | rewritten
+++

%%% stem
这里是题干。程序表达式必须写成行内代码，例如 `%rax`、`cmpq`、`SF ^ OF`；
数学公式才用 $x = 2^k$。

需要整段代码时用专门的代码段，不要手写围栏：

%%% code: c
int main(void)
{
    return 0;
}

%%% option: A
选项 A 的内容

%%% option: B
选项 B 的内容（选项里也可以出现 %%% code: c 段）

%%% explanation
这里写解析。注意：**不要**在这里写「答案：A」这类字样——答案键已经在
[solution] 的 correct_option_ids 里；题面与选项里出现「答案：」会被直接拒绝。
