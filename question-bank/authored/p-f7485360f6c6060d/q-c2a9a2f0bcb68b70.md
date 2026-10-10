+++json
{"schemaVersion":"5","id":"q-c2a9a2f0bcb68b70","revision":1,"paperId":"p-f7485360f6c6060d","paperOrder":66,"number":{"display":"3.66","major":{"display":"第 3 章","value":"3"},"minor":{"display":"3.66","value":"66"},"parts":[]},"classification":{"primaryModuleId":"machine_prog","moduleIds":["machine_prog"],"tags":["csapp","homework","chapter-3"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"nr","marker":"{{blank:nr}}","occurrence":0,"width":"medium","label":"NR(n)"},{"id":"nc","marker":"{{blank:nc}}","occurrence":0,"width":"medium","label":"NC(n)"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"nr","method":"exact","acceptedAnswers":["3*n","3 * n","n*3","n * 3","(3*n)","(3 * n)","3*n+0","3 * n + 0","(3*n+0)","(3 * n + 0)"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"nc","method":"exact","acceptedAnswers":["4*n+1","4 * n + 1","(4*n+1)","(4 * n + 1)","1+4*n","1 + 4 * n"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI推导，非官方解析"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第03章-程序的机器级表示/homework/3.64-3.69-arrays-and-structures.md#L74","provenance":"rewritten","editorNote":"CSAPP3e家庭作业；补全既定维度宏表达式；非官方解析。"}]}
+++
%%% stem
NR、NC 是计算矩阵维度的宏表达式，`long` 为 8 字节。代码计算第 j 列之和：

```c
long sum_col(long n, long A[NR(n)][NC(n)], long j) {
    long i;
    long result = 0;
    for (i = 0; i < NR(n); i++)
        result += A[i][j];
    return result;
}
```

n、A、j 分别在 `%rdi`、`%rsi`、`%rdx`。GCC 生成：

```asm
sum_col:
    leaq    1(,%rdi,4), %r8
    leaq    (%rdi,%rdi,2), %rax
    movq    %rax, %rdi
    testq   %rax, %rax
    jle     .L4
    salq    $3, %r8
    leaq    (%rsi,%rdx,8), %rcx
    movl    $0, %eax
    movl    $0, %edx
.L3:
    addq    (%rcx), %rax
    addq    $1, %rdx
    addq    %r8, %rcx
    cmpq    %rdi, %rdx
    jne     .L3
    rep; ret
.L4:
    movl    $0, %eax
    ret
```

确定宏定义，使用 `a*n+b` 形式（允许省略零项）：

```c
#define NR(n) ({{blank:nr}})
#define NC(n) ({{blank:nc}})
```
%%% reference
`NR(n) = 3*n`，`NC(n) = 4*n+1`。`%rdi` 保存循环上界 3n；`%r8` 保存跨行步长 `(4n+1)*8`。
