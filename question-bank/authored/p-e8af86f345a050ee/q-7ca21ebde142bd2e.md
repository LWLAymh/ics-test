+++json
{
  "schemaVersion":"5","id":"q-7ca21ebde142bd2e","revision":2,"paperId":"p-e8af86f345a050ee","paperOrder":1,
  "number":{"display":"7.1","major":{"display":"第 7 章","value":"7"},"minor":{"display":"7.1","value":"1"},"parts":[]},
  "classification":{"primaryModuleId":"compilation_linking","moduleIds":["compilation_linking"],"tags":["csapp","practice","chapter-7"]},
  "type":"fill","stem":{"format":"markdown","blanks":[
    {"id":"buf-entry","marker":"{{blank:buf-entry}}","occurrence":0,"width":"short"},{"id":"buf-type","marker":"{{blank:buf-type}}","occurrence":0,"width":"short"},{"id":"buf-module","marker":"{{blank:buf-module}}","occurrence":0,"width":"short"},{"id":"buf-section","marker":"{{blank:buf-section}}","occurrence":0,"width":"short"},
    {"id":"p0-entry","marker":"{{blank:p0-entry}}","occurrence":0,"width":"short"},{"id":"p0-type","marker":"{{blank:p0-type}}","occurrence":0,"width":"short"},{"id":"p0-module","marker":"{{blank:p0-module}}","occurrence":0,"width":"short"},{"id":"p0-section","marker":"{{blank:p0-section}}","occurrence":0,"width":"short"},
    {"id":"p1-entry","marker":"{{blank:p1-entry}}","occurrence":0,"width":"short"},{"id":"p1-type","marker":"{{blank:p1-type}}","occurrence":0,"width":"short"},{"id":"p1-module","marker":"{{blank:p1-module}}","occurrence":0,"width":"short"},{"id":"p1-section","marker":"{{blank:p1-section}}","occurrence":0,"width":"short"},
    {"id":"swap-entry","marker":"{{blank:swap-entry}}","occurrence":0,"width":"short"},{"id":"swap-type","marker":"{{blank:swap-type}}","occurrence":0,"width":"short"},{"id":"swap-module","marker":"{{blank:swap-module}}","occurrence":0,"width":"short"},{"id":"swap-section","marker":"{{blank:swap-section}}","occurrence":0,"width":"short"},
    {"id":"temp-entry","marker":"{{blank:temp-entry}}","occurrence":0,"width":"short"},{"id":"temp-type","marker":"{{blank:temp-type}}","occurrence":0,"width":"short"},{"id":"temp-module","marker":"{{blank:temp-module}}","occurrence":0,"width":"short"},{"id":"temp-section","marker":"{{blank:temp-section}}","occurrence":0,"width":"short"}
  ]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[
    {"blankId":"buf-entry","method":"exact","acceptedAnswers":["是","yes"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"buf-type","method":"exact","acceptedAnswers":["外部","external"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"buf-module","method":"exact","acceptedAnswers":["m.o"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"buf-section","method":"exact","acceptedAnswers":[".data"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
    {"blankId":"p0-entry","method":"exact","acceptedAnswers":["是","yes"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"p0-type","method":"exact","acceptedAnswers":["全局","global"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"p0-module","method":"exact","acceptedAnswers":["swap.o"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"p0-section","method":"exact","acceptedAnswers":[".data"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
    {"blankId":"p1-entry","method":"exact","acceptedAnswers":["是","yes"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"p1-type","method":"exact","acceptedAnswers":["全局","global"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"p1-module","method":"exact","acceptedAnswers":["swap.o"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"p1-section","method":"exact","acceptedAnswers":["COMMON"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
    {"blankId":"swap-entry","method":"exact","acceptedAnswers":["是","yes"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"swap-type","method":"exact","acceptedAnswers":["全局","global"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"swap-module","method":"exact","acceptedAnswers":["swap.o"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"swap-section","method":"exact","acceptedAnswers":[".text"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
    {"blankId":"temp-entry","method":"exact","acceptedAnswers":["否","no"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"temp-type","method":"exact","acceptedAnswers":["—","-","不适用"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"temp-module","method":"exact","acceptedAnswers":["—","-","不适用"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"temp-section","method":"exact","acceptedAnswers":["—","-","不适用"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}
  ],"reference":{"format":"markdown"},"provenance":{"origin":"unknown","crossChecked":false,"note":"表格据来源仓库《练习题答案.md》；源码称模块m.o，参考答案误写main.o，按m.c产物改为m.o。"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第07章-链接/chapter.md#L259-L294","provenance":"rewritten"},{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第07章-链接/练习题答案.md#L3-L11","provenance":"reflow"}]
}
+++
%%% stem
练习题 7.1：根据以下两个模块，完成 `swap.o` 中每个定义或引用的符号表信息。每格填写“是/否”、符号类型、定义模块和节；没有符号表条目的字段填写“—”。

`m.c`：
```c
void swap();
int buf[2] = {1, 2};
int main() { swap(); return 0; }
```

`swap.c`：
```c
extern int buf[];
int *bufp0 = &buf[0];
int *bufp1;
void swap() {
    int temp;
    bufp1 = &buf[1];
    temp = *bufp0;
    *bufp0 = *bufp1;
    *bufp1 = temp;
}
```

| 符号 | `.symtab` 条目？ | 符号类型 | 定义模块 | 节 |
|---|---|---|---|---|
| `buf` | {{blank:buf-entry}} | {{blank:buf-type}} | {{blank:buf-module}} | {{blank:buf-section}} |
| `bufp0` | {{blank:p0-entry}} | {{blank:p0-type}} | {{blank:p0-module}} | {{blank:p0-section}} |
| `bufp1` | {{blank:p1-entry}} | {{blank:p1-type}} | {{blank:p1-module}} | {{blank:p1-section}} |
| `swap` | {{blank:swap-entry}} | {{blank:swap-type}} | {{blank:swap-module}} | {{blank:swap-section}} |
| `temp` | {{blank:temp-entry}} | {{blank:temp-type}} | {{blank:temp-module}} | {{blank:temp-section}} |
%%% reference
| 符号 | `.symtab` 条目？ | 符号类型 | 定义模块 | 节 |
|---|---|---|---|---|
| `buf` | 是 | 外部 | `m.o` | `.data` |
| `bufp0` | 是 | 全局 | `swap.o` | `.data` |
| `bufp1` | 是 | 全局 | `swap.o` | COMMON |
| `swap` | 是 | 全局 | `swap.o` | `.text` |
| `temp` | 否 | — | — | — |

`temp` 是 C 局部变量，不产生符号表条目。题源参考答案将 `buf` 模块名误写为 `main.o`；按题目给出的 `m.c` 应编译为 `m.o`，故此处更正。
