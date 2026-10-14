+++json
{
  "schemaVersion":"5", "id":"q-c6e96a18c6cfe64a", "revision":1, "paperId":"p-3eac9aa5d6f749a1", "paperOrder":15,
  "number":{"display":"第5讲 5.2","major":{"display":"第5讲","value":"5"},"minor":{"display":"5.2","value":"2"},"parts":[]},
  "classification":{"primaryModuleId":"machine_prog","moduleIds":["machine_prog"],"tags":["conditional-jump"]},
  "type":"fill", "stem":{"format":"markdown","blanks":[
    {"id":"compare","marker":"{{blank:compare}}","occurrence":0,"width":"long","label":"第1条缺失的完整指令"},
    {"id":"jump","marker":"{{blank:jump}}","occurrence":0,"width":"long","label":"第2条缺失的完整指令"}
  ]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[
    {"blankId":"compare","method":"exact","acceptedAnswers":["cmpq %rsi, %rdi","cmp %rsi, %rdi","cmpq rsi, %rdi","cmp rsi, %rdi","cmpq %rsi, rdi","cmp %rsi, rdi","cmpq rsi, rdi","cmp rsi, rdi"],"normalize":{"trimWhitespace":true,"caseSensitive":true,"syntax":"att-instruction"}},
    {"blankId":"jump","method":"exact","acceptedAnswers":["jle .Ldone","jng .Ldone"],"normalize":{"trimWhitespace":true,"caseSensitive":true,"syntax":"att-instruction"}}
  ],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null,"attribution":"随卷提供的 v2.0 纯答案 PDF，第3页","note":"明确接受原卷允许的省略%/q，以及jle的同义助记符jng；不靠判分器剥除前缀。"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"原文/阶段测验/2026-stage1/exam-v2.pdf","provenance":"rewritten","editorNote":"第6页，5.2。把原卷部分挖空改为整条指令空位，并保留第一操作数为%rsi的已知条件；删除没有给出参数或作答项的泛称计算返回值。"},{"document":"原文/阶段测验/2026-stage1/answers-v2.pdf","provenance":"reflow","editorNote":"第3页，5.2；第1页批卷说明。"}]
}
+++
%%% stem
### 5.2 条件跳转（4 分）

考虑下面的 C 语言代码：

```c
long adjust(long x, long y) {
    long t = x + 5;
    if (x > y)
        t = y - 2;
    return t;
}
```

假设 `x`、`y` 分别存放在 `%rdi`、`%rsi`，返回值存放在 `%rax`，计算不发生有符号整数溢出。下面是一种对应的 x86-64、AT&T 汇编实现，请补全两条完整指令（每空 2 分）。

第（1）条指令的第一个操作数已知为 `%rsi`。每个框填写整条指令，不要只填操作数。

```asm
adjust:
    leaq 5(%rdi), %rax
    {{blank:compare}}
    {{blank:jump}}
    leaq -2(%rsi), %rax
.Ldone:
    ret
```

按原卷批卷说明，含义明确时可省略寄存器前的 `%` 和指令的 `q` 后缀；指令中的空格或制表符差异不影响核对。
%%% reference
两空实际填入的完整指令为：

```asm
    cmpq %rsi, %rdi
    jle .Ldone
```

先默认计算 `x + 5`。`cmpq %rsi, %rdi` 按 `x - y` 设置条件码；当 `x <= y` 时跳过重新赋值，否则执行 `y - 2`。`jng .Ldone` 与这里的 `jle .Ldone` 等价。
