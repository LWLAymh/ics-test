+++json
{"schemaVersion":"5","id":"q-e99de6be6bcc7042","revision":1,"paperId":"p-f7485360f6c6060d","paperOrder":65,"number":{"display":"3.65","major":{"display":"第 3 章","value":"3"},"minor":{"display":"3.65","value":"65"},"parts":[]},"classification":{"primaryModuleId":"machine_prog","moduleIds":["machine_prog"],"tags":["csapp","homework","chapter-3"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"a","marker":"{{blank:a}}","occurrence":0,"width":"short","label":"A[i][j]指针"},{"id":"b","marker":"{{blank:b}}","occurrence":0,"width":"short","label":"A[j][i]指针"},{"id":"c","marker":"{{blank:c}}","occurrence":0,"width":"short","label":"M"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"a","method":"exact","acceptedAnswers":["%rdx","rdx"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"b","method":"exact","acceptedAnswers":["%rax","rax"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"c","method":"exact","acceptedAnswers":["15"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI推导，非官方解析"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第03章-程序的机器级表示/homework/3.64-3.69-arrays-and-structures.md#L38","provenance":"rewritten","editorNote":"CSAPP3e家庭作业；非官方解析。"}]}
+++
%%% stem
M 是 `#define` 定义的常数，`long` 为 8 字节：

```c
void transpose(long A[M][M]) {
    long i, j;
    for (i = 0; i < M; i++)
        for (j = 0; j < i; j++) {
            long t = A[i][j];
            A[i][j] = A[j][i];
            A[j][i] = t;
        }
}
```

GCC 以 `-O1` 生成的内循环把索引转为指针：

```asm
.L6:
    movq    (%rdx), %rcx
    movq    (%rax), %rsi
    movq    %rsi, (%rdx)
    movq    %rcx, (%rax)
    addq    $8, %rdx
    addq    $120, %rax
    cmpq    %rdi, %rax
    jne     .L6
```

A. 指向 `A[i][j]` 的指针在哪个寄存器？{{blank:a}}

B. 指向 `A[j][i]` 的指针在哪个寄存器？{{blank:b}}

C. M 的值是多少？{{blank:c}}
%%% reference
A 为 `%rdx`，B 为 `%rax`，C 为 15。

j 每增加 1，`A[i][j]` 地址增加一个 long，即 8 字节；`A[j][i]` 地址增加一行，即 8M 字节。由 `8M=120` 得 M=15。
