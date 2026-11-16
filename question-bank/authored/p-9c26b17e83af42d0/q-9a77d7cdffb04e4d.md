+++json
{
"schemaVersion":"5","id":"q-9a77d7cdffb04e4d","revision":1,"paperId":"p-9c26b17e83af42d0","paperOrder":7,
"number":{"display":"第10讲 10.3","major":{"display":"第10讲","value":"10"},"minor":{"display":"10.3","value":"3"},"parts":[]},
"classification":{"primaryModuleId":"processor_arch","moduleIds":["processor_arch"],"tags":["seq","rmmovq"]},
"type":"fill","stem":{"format":"markdown","blanks":[{"id":"valp","marker":"{{blank:valp}}","occurrence":0,"width":"medium"},{"id":"rb","marker":"{{blank:rb}}","occurrence":0,"width":"short","input":{"kind":"select","multiple":false,"options":[{"value":"rA","label":"rA"},{"value":"rB","label":"rB"},{"value":"RRSP","label":"RRSP"},{"value":"RNONE","label":"RNONE"}]}},{"id":"alu","marker":"{{blank:alu}}","occurrence":0,"width":"short","input":{"kind":"select","multiple":false,"options":[{"value":"valA","label":"valA"},{"value":"valB","label":"valB"},{"value":"valC","label":"valC"},{"value":"0","label":"0"}]}},{"id":"address","marker":"{{blank:address}}","occurrence":0,"width":"short"},{"id":"writeback","marker":"{{blank:writeback}}","occurrence":0,"width":"short"},{"id":"pc","marker":"{{blank:pc}}","occurrence":0,"width":"medium"}]},
"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"valp","method":"exact","acceptedAnswers":["PC+10","10+PC"],"normalize":{"trimWhitespace":true,"caseSensitive":true,"syntax":"c-tokens"}},{"blankId":"rb","method":"selection","correctValues":["rB"]},{"blankId":"alu","method":"selection","correctValues":["valB"]},{"blankId":"address","method":"exact","acceptedAnswers":["valE"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"writeback","method":"exact","acceptedAnswers":["无","none","无需操作","无操作"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"pc","method":"exact","acceptedAnswers":["PC←valP","PC ← valP","PC=valP","PC = valP","PC <- valP","PC<-valP"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null}},
"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
"sources":[{"document":"原文/阶段测验/2026-stage2/exam.pdf","provenance":"reflow","editorNote":"第4页，10.3；原卷表格手写为Markdown表格，六个空位保留原始边界。"},{"document":"原文/阶段测验/2026-stage2/answers.pdf","provenance":"reflow","editorNote":"第2页，10.3。"}]
}
+++
%%% stem
### 10.3（6 分）

Y86-64 的 `rmmovq` 指令编码格式如下。第一个字节的两个半字节为 `4`、`0`，第二个字节为 `rA:rB`，后接 8 字节位移 `D`。

```asm
    rmmovq rA, D(rB)
```

根据该指令的操作，补全下表（共 6 空，每空 1 分）。若无需任何操作，则填“无”。`M1`、`M8` 分别表示读取或写入 1、8 字节。

| 阶段 | `rmmovq rA, D(rB)` |
| --- | --- |
| Fetch | `icode:ifun ← M1[PC]` |
| Fetch | `rA:rB ← M1[PC+1]` |
| Fetch | `valC ← M8[PC+2]` |
| Fetch | `valP ←` {{blank:valp}} |
| Decode | `valA ← R[rA]` |
| Decode | `valB ← R[`{{blank:rb}}`]` |
| Execute | `valE ←` {{blank:alu}} `+ valC` |
| Memory | `M8[`{{blank:address}}`] ← valA` |
| Write back | {{blank:writeback}} |
| PC update | {{blank:pc}} |

最后一空填写完整的更新操作，例如用 `←`、`<-` 或 `=` 表示赋值。
%%% reference
六空依次为 `PC+10`、`rB`、`valB`、`valE`、无、`PC ← valP`。

指令共 10 字节，基址来自 `rB`，地址为 `valB + valC`；访存阶段将 `valA` 写入该地址。不写回寄存器，PC 更新为顺序后继 `valP`。最后一空需要包含 `PC` 及赋值符号，不能只填右侧。
