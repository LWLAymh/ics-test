+++json
{"schemaVersion":"5","id":"q-f8a4beaf623e4fd5","revision":1,"paperId":"p-9c26b17e83af42d0","paperOrder":24,"number":{"display":"第14/15讲 14.2","major":{"display":"第14/15讲","value":"14/15"},"minor":{"display":"14.2","value":"2"},"parts":[]},"classification":{"primaryModuleId":"compilation_linking","moduleIds":["compilation_linking"],"tags":["linker-symbols"]},
"type":"multiple-choice","stem":{"format":"markdown"},"options":[{"id":"A","content":{"format":"markdown"}},{"id":"B","content":{"format":"markdown"}},{"id":"C","content":{"format":"markdown"}},{"id":"D","content":{"format":"markdown"}}],"solution":{"state":"available","grading":"choice","correctOptionIds":["A","C","D"],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"原文/阶段测验/2026-stage2/exam.pdf","provenance":"reflow","editorNote":"第9–10页，14.2；跨页选项合并。"},{"document":"原文/阶段测验/2026-stage2/answers.pdf","provenance":"reflow","editorNote":"第6页，14.2。"}]}
+++
%%% stem
### 14.2（3 分，不定项选择）

考虑以下源文件 `module.c`，编译生成未优化的可重定位目标文件，不含调试信息。

```c
static int bias = 3;
extern int helper(int);

int run(int x)
{
    int tmp = x + bias;
    return helper(tmp);
}
```

按课件中的链接器符号分类讨论，下列说法哪些正确？原卷多选允许少选部分分；网站须集合完全一致才算正确。
%%% option: A
`bias` 对应本模块的局部链接器符号。
%%% option: B
形参 `x` 和变量 `tmp` 都是需要跨模块解析的外部符号。
%%% option: C
本模块对 `helper` 的引用，需要与其定义关联。
%%% option: D
`run` 是可被其他模块引用的全局链接器符号。
%%% reference
正确选项：A、C、D。

文件作用域 `static` 对象具有局部链接器符号；普通形参和自动变量不是这里讨论的链接器符号。`helper` 在本模块中是外部引用，`run` 提供全局函数定义。
