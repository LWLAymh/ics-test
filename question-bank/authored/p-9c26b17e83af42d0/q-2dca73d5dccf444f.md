+++json
{
"schemaVersion":"5","id":"q-2dca73d5dccf444f","revision":1,"paperId":"p-9c26b17e83af42d0","paperOrder":4,
"number":{"display":"第9讲 9.4","major":{"display":"第9讲","value":"9"},"minor":{"display":"9.4","value":"4"},"parts":[]},
"classification":{"primaryModuleId":"processor_arch","moduleIds":["processor_arch"],"tags":["timing","register"]},
"type":"fill","stem":{"format":"markdown","blanks":[{"id":"sum1","marker":"{{blank:sum1}}","occurrence":0,"width":"short"},{"id":"sum2","marker":"{{blank:sum2}}","occurrence":0,"width":"short"},{"id":"out1","marker":"{{blank:out1}}","occurrence":0,"width":"short"},{"id":"out2","marker":"{{blank:out2}}","occurrence":0,"width":"short"}]},
"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"sum1","method":"exact","acceptedAnswers":["6"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"sum2","method":"exact","acceptedAnswers":["11"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"out1","method":"exact","acceptedAnswers":["9"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"out2","method":"exact","acceptedAnswers":["11"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null}},
"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
"sources":[{"document":"原文/阶段测验/2026-stage2/exam.pdf","provenance":"reflow","editorNote":"第3页，9.4；电路与波形各裁成一张图，四空依原图顺序。"},{"document":"原文/阶段测验/2026-stage2/answers.pdf","provenance":"reflow","editorNote":"第1页，9.4。"}]
}
+++
%%% stem
### 9.4（4 分）

分析如下电路和对应的时序图。其中：

- `Reg` 是上升沿触发的寄存器，输出 `Out` 初值为 `2`。
- `ALU` 计算 `sum = Out + In`。
- `MUX` 是多选器，根据 `Load` 的值，选择对应编号的输入通道输出到 `Next`。

![累加器电路与反馈通路](assets/2026-stage2/accumulator-circuit.png)

![待补全的 Clock、Load、In、sum、Out 时序图](assets/2026-stage2/accumulator-timing.png)

根据时序图中已有信息，缺失的信号值依次是（同一行从左到右，每空 1 分）：

- `sum`：{{blank:sum1}} 和 {{blank:sum2}}。
- `Out`：{{blank:out1}} 和 {{blank:out2}}。
%%% reference
`sum` 两空为 `6`、`11`；`Out` 两空为 `9`、`11`。

`sum` 始终等于 `In + Out`。在 T3 上升沿前 `Load = 1`，寄存器采样 `sum = 9` 输出到 `Out`；在 T6 上升沿前 `Load = 0`，寄存器采样反馈的 `Out = 11`，保持输出 `11`。
