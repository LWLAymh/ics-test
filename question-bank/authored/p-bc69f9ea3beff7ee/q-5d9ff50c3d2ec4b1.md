+++json
{
  "schemaVersion": "5",
  "id": "q-5d9ff50c3d2ec4b1",
  "revision": 2,
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
  "type": "short-answer",
  "stem": {
    "format": "markdown"
  },
  "solution": {
    "state": "available",
    "grading": "self",
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
1. 请根据上述汇编代码，根据提示，补全 `myfunction` 的代码。注意，每行一
条语句；不能定义新的变量。
```c
int myfunction(int a[], int b[], int c[], int d) {
  int i;
  for (i = 0; i <       ; i++) {
              =                                        ;
              =                                        ;
              =                                        ;
  }
  return       ;
}
```
2. 请给出以下程序的输出结果。
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
%%% reference
答案：
1. for (i = 0; i <  2 ; i++) { //（1分）
//下面第一二个等式左边都对得1分，第三个等式左边写对得1分
    `c[2*i] = b[0] * a[2*i] + b[2] * a[2*i+1]; //`（等式右边
乘加乘序列得1分，等式右边写对2\*i和2\*i+1得1分）
    `c[2*i+1] = b[1] * a[2*i] + b[3] * a[2*i+1]; //`（等式右
边乘加乘序列得1分，等式右边写对2\*i和2\*i+1得1分）
    `d = d + c[2*i] + c[2*i+1];  //`（等式右边两个加号得1分，等
式右边写对2\*i和2\*i+1得1分）
  return    d   ;  //（1分）
2. 139  （2分）
