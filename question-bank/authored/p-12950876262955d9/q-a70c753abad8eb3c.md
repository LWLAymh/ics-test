+++json
{
  "schemaVersion": "5",
  "id": "q-a70c753abad8eb3c",
  "revision": 1,
  "paperId": "p-12950876262955d9",
  "paperOrder": 22,
  "number": {
    "display": "第三题",
    "major": {
      "display": "第三题",
      "value": "3"
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
      "legacyId": "q-a70c753abad8eb3c",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 367,
        "end": 440
      },
      "curated": "_curated/期中/2022期中-带答案/367.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "switch跳转表汇编还原C代码与结构体"
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
第三题 下列的C代码描述了一个`switcher`：
```
struct prob{
  long *p;
  struct { long x; long y; long z;}s;
  struct prob *next;
};
void switcher(long a, long b, long c, struct prob *sp){
  long val;
  switch(a){
    case ①            : c = ⑧                ;
    case ②            : val = ⑨              ; break;
    case ③            : c = ⑩               ;
    case ④            : val = ⑪              ; break;
    case ⑤            : val = ⑫               ; break;
    case ⑥            : ⑬                  ;break;
    case ⑦            : val = ⑭                ;break;
    default: ⑮                ; break;
  }
  sp->s.y = val;
}
```
采用GCC编译器产生的汇编代码如下所示，请根据此进行分析，补全上述代码。
```
switcher:
        cmpq    $7, %rdi
        ja      .L2
        jmp     *.L4(,%rdi,8)
.L4:
        .quad   .L3
        .quad   .L5
        .quad   .L6
        .quad   .L7
        .quad   .L2
        .quad   .L8
        .quad   .L9
        .quad   .L10
```


```
.L8:
        movq    %rsi, %rdx
        xorq    $31, %rdx
.L6:
        leaq    2022(%rdx), %rax
        movq    %rax, 16(%rcx)
        ret
.L3:
        subq    $54, %rdx
.L5:
        addq    %rdx, %rsi
        leaq    (%rsi,%rsi,2), %rax
        movq    %rax, 16(%rcx)
        ret
.L7:
        movq    8(%rcx), %rax
        movq    %rax, 16(%rcx)
        ret
.L10:
        movq    $1898, 24(%rcx)
        movq    %rax, 16(%rcx)
        ret
.L9:
        movq    (%rcx), %rax
        movq    (%rax), %rax
        movq    %rax, 16(%rcx)
        ret
.L2:
        movq    %rcx, 32(%rcx)
        movq    %rax, 16(%rcx)
        ret
```
%%% reference
```c
void switcher(long a, long b, long c, struct prob *sp){
  long val;
  switch(a){
    case 5: c = b ^ 31;
    case 2: val = c + 2022; break;
    case 0: c = c - 54;
    case 1: val = (c + b) * 3; break;
    case 3: val = sp->s.x; break;
    case 7: sp->s.z = 1898; break;
    case 6: val = *(sp->p); break;
    default: sp->next = sp; break;
  }
  sp->s.y = val;
}
```

原卷说明：各单元格原则上可以互换，但应保持程序基本语义不变。`(c+b)*3` 可写为 `(b+c)*3`、`3*(b+c)` 或 `3*(c+b)`；`3*b+3*c` 也可接受。必须符合 C 语言语法。
