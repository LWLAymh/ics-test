+++json
{
  "schemaVersion":"5", "id":"q-8f0ed4dbad2e3cc2", "revision":1, "paperId":"p-3eac9aa5d6f749a1", "paperOrder":9,
  "number":{"display":"第4讲 4.1","major":{"display":"第4讲","value":"4"},"minor":{"display":"4.1","value":"1"},"parts":[]},
  "classification":{"primaryModuleId":"machine_prog","moduleIds":["machine_prog"],"tags":["instruction-encoding"]},
  "type":"fill", "stem":{"format":"markdown","blanks":[
    {"id":"length","marker":"{{blank:length}}","occurrence":0,"width":"short","label":"0x400503 处指令的字节数"},
    {"id":"total","marker":"{{blank:total}}","occurrence":0,"width":"short","label":"三条指令的总字节数"}
  ]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[
    {"blankId":"length","method":"exact","acceptedAnswers":["4"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"total","method":"exact","acceptedAnswers":["8"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}
  ],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null,"attribution":"随卷提供的 v2.0 纯答案 PDF，第2页"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"原文/阶段测验/2026-stage1/exam-v2.pdf","provenance":"reflow","editorNote":"第4页，4.1；机器码与反汇编保持同一代码块。"},{"document":"原文/阶段测验/2026-stage1/answers-v2.pdf","provenance":"reflow","editorNote":"第2页，4.1。"}]
}
+++
%%% stem
### 4.1 机器指令（2 分）

默认采用 x86-64、Linux、AT&T 汇编。某程序经过编译、汇编和链接后，使用 `objdump` 反汇编得到以下代码：

```asm
400500: 48 89 d8       mov %rbx, %rax
400503: 48 83 c0 05    add $5, %rax
400507: c3             ret
```

1. 地址 `0x400503` 处的指令，其机器代码占用 {{blank:length}} 字节。（1 分）
2. 以上三条指令的机器代码共占用 {{blank:total}} 字节。（1 分）
%%% reference
各空依次为 `4`、`8`。

三条指令的机器码分别占 `3`、`4`、`1` 字节，总计 `3 + 4 + 1 = 8` 字节。
