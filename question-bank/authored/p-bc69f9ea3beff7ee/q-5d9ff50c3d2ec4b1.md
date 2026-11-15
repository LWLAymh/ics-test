+++json
{
  "schemaVersion": "5",
  "id": "q-5d9ff50c3d2ec4b1",
  "revision": 5,
  "paperId": "p-bc69f9ea3beff7ee",
  "paperOrder": 21,
  "number": {
    "display": "第二题",
    "major": {
      "display": "第二题",
      "value": "2"
    },
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog"
    ],
    "tags": []
  },
  "publication": {
    "state": "published",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": []
  },
  "sources": [
    {
      "legacyId": "q-5d9ff50c3d2ec4b1",
      "document": "原文/期末/2016期末-带答案.md",
      "lines": {
        "start": 323,
        "end": 409
      },
      "curated": "_curated/期末/2016期末-带答案/323.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "32 位汇编反推 C 函数并计算返回值"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts":[
    {"id":"q-5d9ff50c3d2ec4b1-A","number":{"display":"1","major":null,"minor":null,"parts":["1"]},"type":"fill","moduleIds":["machine_prog"],"stem":{"format":"markdown","blanks":[
      {"id":"limit","marker":"{{blank:limit}}","occurrence":0,"width":"short"},
      {"id":"lhs1","marker":"{{blank:lhs1}}","occurrence":0,"width":"medium"},
      {"id":"rhs1","marker":"{{blank:rhs1}}","occurrence":0,"width":"long"},
      {"id":"lhs2","marker":"{{blank:lhs2}}","occurrence":0,"width":"medium"},
      {"id":"rhs2","marker":"{{blank:rhs2}}","occurrence":0,"width":"long"},
      {"id":"lhs3","marker":"{{blank:lhs3}}","occurrence":0,"width":"short"},
      {"id":"rhs3","marker":"{{blank:rhs3}}","occurrence":0,"width":"long"},
      {"id":"return","marker":"{{blank:return}}","occurrence":0,"width":"short"}
    ]},"solution":{"state":"available","grading":"blanks","blankAnswers":[
      {"blankId":"limit","method":"exact","acceptedAnswers":["2"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
      {"blankId":"lhs1","method":"exact","acceptedAnswers":["c[2*i]","c[i*2]","c[i+i]"],"normalize":{"trimWhitespace":true,"caseSensitive":true,"syntax":"c-tokens"}},
      {"blankId":"rhs1","method":"self"},
      {"blankId":"lhs2","method":"exact","acceptedAnswers":["c[2*i+1]","c[i*2+1]","c[i+i+1]","c[1+2*i]"],"normalize":{"trimWhitespace":true,"caseSensitive":true,"syntax":"c-tokens"}},
      {"blankId":"rhs2","method":"self"},
      {"blankId":"lhs3","method":"exact","acceptedAnswers":["d"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
      {"blankId":"rhs3","method":"self"},
      {"blankId":"return","method":"exact","acceptedAnswers":["d"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}
    ],"reference":{"format":"markdown"},"provenance":{"origin":"unknown","crossChecked":null,"note":"源卷第9–10页，右侧表达式有多种等价写法，保留自评；循环上界、赋值目标和返回值可核对。"}},"sources":[{"document":"原文/期末/2016期末-带答案.md","lines":{"start":323,"end":409},"provenance":"reflow"}],"issues":[]},
    {"id":"q-5d9ff50c3d2ec4b1-B","number":{"display":"2","major":null,"minor":null,"parts":["2"]},"type":"fill","moduleIds":["machine_prog"],"stem":{"format":"markdown","blanks":[{"id":"output","marker":"{{blank:output}}","occurrence":0,"width":"short"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"output","method":"exact","acceptedAnswers":["139"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"unknown","crossChecked":null,"note":"源卷答案139，独立计算四个c元素核对。"}},"sources":[{"document":"原文/期末/2016期末-带答案.md","lines":{"start":323,"end":409},"provenance":"reflow"}],"issues":[]}
  ],
  "solution": {
    "state": "available",
    "grading": "parts",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    }
  }
}
+++
%%% stem
第二题（12分）
下面程序是一个完整C函数`myfunction`经编译器优化后生成的32位汇编语言
代码：
```
myfunction:
  pushl  %ecx
  movl 0x10(%esp), %ecx
  movl 8(%esp), %edx
  pushl %ebx
  movl 0x18(%esp), %ebx
  pushl %esi
  movl 0x14(%esp), %esi
  pushl %ebp
  xorl %eax, %eax
  pushl %edi
  jmp .L2
  leal (%esp), %esp
.L2:
  movl 8(%esi), %edi
  imull 4(%edx,%eax,8), %edi
  movl (%esi), %ebp
  imull (%edx,%eax,8), %ebp
  addl %ebp, %edi
  movl %edi, (%ecx)
  movl 0xc(%esi), %edi
  imull 4(%edx,%eax,8), %edi
  movl 4(%esi), %ebp
  imull (%edx,%eax,8), %ebp
  addl %ebp, %edi
  movl (%ecx), %ebp
  addl %edi, %ebp
  addl %ebp, %ebx
  movl %edi, 4(%ecx)
  incl %eax
  addl $8, %ecx
  cmpl $2, %eax
  jl .L2
  popl %edi
  popl %ebp
  popl %esi
  movl %ebx, %eax
  popl %ebx
  popl %ecx
  ret
```
提示：32位汇编使用栈来传递所有参数，参数压栈顺序为从右至左。
%%% reference

%%% part-stem: q-5d9ff50c3d2ec4b1-A
1. 请根据上述汇编代码，根据提示，补全 `myfunction` 的代码。每行一条赋值语句，不能定义新的变量；只填缺失部分，不重复等号、分号和 `return`。三个赋值右侧允许等价表达，提交后对照解析自评；其它空自动核对。
```c
int myfunction(int a[], int b[], int c[], int d) {
  int i;
  for (i = 0; i < {{blank:limit}}; i++) {
    {{blank:lhs1}} = {{blank:rhs1}};
    {{blank:lhs2}} = {{blank:rhs2}};
    {{blank:lhs3}} = {{blank:rhs3}};
  }
  return {{blank:return}};
}
```
%%% part-stem: q-5d9ff50c3d2ec4b1-B
2. 根据公共题面的汇编语义，以下程序输出的整数为 {{blank:output}}，不填写引号或换行。
```c
int main( )
{
    int a[5] = {1, 2, 3, 4, 5};
    int b[5] = {9, 8, 5, 6, 4};
    int c[5] = {7, 9, 8, 10, 11};
    int d = 5;
    int ret = myfunction(a, b, c, d);
    printf("%d\n", ret);
    return 0;
}
```
%%% part-reference: q-5d9ff50c3d2ec4b1-A
1. 完整函数如下：

```c
int myfunction(int a[], int b[], int c[], int d) {
    int i;
    for (i = 0; i < 2; i++) {
        c[2*i] = b[0] * a[2*i] + b[2] * a[2*i+1];
        c[2*i+1] = b[1] * a[2*i] + b[3] * a[2*i+1];
        d = d + c[2*i] + c[2*i+1];
    }
    return d;
}
```

原卷评分：循环上界 1 分；前两个赋值左侧共同 1 分，第三个赋值左侧 1 分；前两个右侧的乘、加、乘序列各 1 分，三个右侧的 `2*i` 与 `2*i+1` 各 1 分；第三个右侧的两个加号 1 分；返回值 1 分。

%%% part-reference: q-5d9ff50c3d2ec4b1-B
输出 `139`（2分）。两次循环分别得到 `c[0]=19`、`c[1]=20`、`c[2]=47`、`c[3]=48`；`d=5+19+20+47+48=139`。
