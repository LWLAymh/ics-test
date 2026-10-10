+++json
{"schemaVersion":"5","id":"q-2acbedcb62e2d75b","revision":1,"paperId":"p-c039f10f0dbe7e3e","paperOrder":43,"number":{"display":"6.43","major":{"display":"第 6 章","value":"6"},"minor":{"display":"6.43","value":"43"},"parts":[]},"classification":{"primaryModuleId":"memory_hierarchy","moduleIds":["memory_hierarchy"],"tags":["csapp","homework","chapter-6"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"rate","marker":"{{blank:rate}}","occurrence":0,"width":"short","label":"写不命中百分比"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"rate","method":"exact","acceptedAnswers":["100","100.0"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI推导，非官方解析"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/homework/6.38-6.46-cache-locality-and-optimization.md#L140","provenance":"rewritten","editorNote":"CSAPP3e家庭作业；补齐6.41条件，按题目把每次int写计为一次缓存访问；非官方解析。"}]}
+++
%%% stem
沿用6.41条件：64KB直接映射缓存，每块4字节，写分配，初始为空。char为1字节，int为4字节；buffer起始地址0，唯一内存访问为buffer，指针在寄存器。

```c
struct pixel {
    char r;
    char g;
    char b;
    char a;
};
struct pixel buffer[480][640];
int *iptr = (int *)buffer;
for (; iptr < ((int *)buffer + 640 * 480); iptr++)
    *iptr = 0;
```

按题意每次int存储计一次缓存访问。百分之多少的写不命中？{{blank:rate}}%（只填数值）。
%%% reference
100%。每次4字节写访问一个此前未访问的完整缓存块，之后直接进入下一块，共307200次写且全部不命中。此处按题目的内存访问模型分析，而不是要求实际编译器保留源代码每一次存储形式。
