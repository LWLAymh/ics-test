+++json
{
  "schemaVersion":"5", "id":"q-41d07aedb2ec62ce", "revision":1, "paperId":"p-3eac9aa5d6f749a1", "paperOrder":13,
  "number":{"display":"第4讲 4.4","major":{"display":"第4讲","value":"4"},"minor":{"display":"4.4","value":"4"},"parts":[]},
  "classification":{"primaryModuleId":"machine_prog","moduleIds":["machine_prog"],"tags":["lea","memory-operands"]},
  "type":"fill", "stem":{"format":"markdown","blanks":[
    {"id":"rax","marker":"{{blank:rax}}","occurrence":0,"width":"short","label":"第二条指令后 rax 的值"},
    {"id":"memory","marker":"{{blank:memory}}","occurrence":0,"width":"short","label":"最终 0x1008 处内存值"}
  ]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[
    {"blankId":"rax","method":"exact","acceptedAnswers":["11"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"memory","method":"exact","acceptedAnswers":["12"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}
  ],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null,"attribution":"随卷提供的 v2.0 纯答案 PDF，第3页"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"原文/阶段测验/2026-stage1/exam-v2.pdf","provenance":"reflow","editorNote":"第5页，4.4。"},{"document":"原文/阶段测验/2026-stage1/answers-v2.pdf","provenance":"reflow","editorNote":"第3页，4.4。"}]
}
+++
%%% stem
### 4.4 汇编程序（4 分）

某 x86-64 计算机的寄存器初始状态为 `%rdi = 0x1000`、`%rsi = 2`。内存中有两个 64 位整数，分别占据地址 `0x1000` 和 `0x1008` 开始的 8 个字节，初始值分别为 `7` 和 `11`。

执行以下 AT&T 汇编代码：

```asm
    leaq 8(%rdi), %rcx
    movq (%rcx), %rax
    leaq (%rax,%rsi,4), %rdx
    subq (%rdi), %rdx
    movq %rdx, (%rcx)
```

1. 第二条指令执行后，`%rax` 中的值为（十进制）：{{blank:rax}}（2 分）
2. 全部指令执行结束后，内存地址 `0x1008` 处的 64 位整数值为（十进制）：{{blank:memory}}（2 分）
%%% reference
各空依次为 `11`、`12`。

`%rcx` 指向 `0x1008`，第二条指令读取该处的 `11`。随后计算 `%rdx = 11 + 2*4 = 19`，减去 `0x1000` 处的 `7` 得到 `12`，最终将 `12` 写回 `0x1008`。
