+++json
{
  "schemaVersion": "5",
  "id": "q-a70c753abad8eb3c",
  "revision": 2,
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
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {"id": "case-1", "marker": "{{blank:case-1}}", "occurrence": 0, "width": "short", "label": "① case 常量"},
      {"id": "case-2", "marker": "{{blank:case-2}}", "occurrence": 0, "width": "short", "label": "② case 常量"},
      {"id": "case-3", "marker": "{{blank:case-3}}", "occurrence": 0, "width": "short", "label": "③ case 常量"},
      {"id": "case-4", "marker": "{{blank:case-4}}", "occurrence": 0, "width": "short", "label": "④ case 常量"},
      {"id": "case-5", "marker": "{{blank:case-5}}", "occurrence": 0, "width": "short", "label": "⑤ case 常量"},
      {"id": "case-6", "marker": "{{blank:case-6}}", "occurrence": 0, "width": "short", "label": "⑥ case 常量"},
      {"id": "case-7", "marker": "{{blank:case-7}}", "occurrence": 0, "width": "short", "label": "⑦ case 常量"},
      {"id": "expr-8", "marker": "{{blank:expr-8}}", "occurrence": 0, "width": "long", "label": "⑧ c 的右侧表达式"},
      {"id": "expr-9", "marker": "{{blank:expr-9}}", "occurrence": 0, "width": "long", "label": "⑨ val 的右侧表达式"},
      {"id": "expr-10", "marker": "{{blank:expr-10}}", "occurrence": 0, "width": "long", "label": "⑩ c 的右侧表达式"},
      {"id": "expr-11", "marker": "{{blank:expr-11}}", "occurrence": 0, "width": "long", "label": "⑪ val 的右侧表达式"},
      {"id": "expr-12", "marker": "{{blank:expr-12}}", "occurrence": 0, "width": "long", "label": "⑫ val 的右侧表达式"},
      {"id": "stmt-13", "marker": "{{blank:stmt-13}}", "occurrence": 0, "width": "long", "label": "⑬ 赋值语句，不含分号"},
      {"id": "expr-14", "marker": "{{blank:expr-14}}", "occurrence": 0, "width": "long", "label": "⑭ val 的右侧表达式"},
      {"id": "stmt-15", "marker": "{{blank:stmt-15}}", "occurrence": 0, "width": "long", "label": "⑮ 赋值语句，不含分号"}
    ]
  },
  "solution": {
    "state": "available",
    "grading": "blanks",
    "blankAnswers": [
      {"blankId": "case-1", "method": "exact", "acceptedAnswers": ["5"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "case-2", "method": "exact", "acceptedAnswers": ["2"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "case-3", "method": "exact", "acceptedAnswers": ["0"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "case-4", "method": "exact", "acceptedAnswers": ["1"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "case-5", "method": "exact", "acceptedAnswers": ["3"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "case-6", "method": "exact", "acceptedAnswers": ["7"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "case-7", "method": "exact", "acceptedAnswers": ["6"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "expr-8", "method": "exact", "acceptedAnswers": ["b ^ 31", "b^31"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "expr-9", "method": "exact", "acceptedAnswers": ["c + 2022", "c+2022", "2022 + c", "2022+c"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "expr-10", "method": "exact", "acceptedAnswers": ["c - 54", "c-54"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "expr-11", "method": "exact", "acceptedAnswers": ["(c + b) * 3", "(c+b)*3", "(b + c) * 3", "(b+c)*3", "3 * (b + c)", "3*(b+c)", "3 * (c + b)", "3*(c+b)", "3 * b + 3 * c", "3*b+3*c", "3 * c + 3 * b", "3*c+3*b"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "expr-12", "method": "exact", "acceptedAnswers": ["sp->s.x"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "stmt-13", "method": "exact", "acceptedAnswers": ["sp->s.z = 1898", "sp->s.z=1898"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "expr-14", "method": "exact", "acceptedAnswers": ["*(sp->p)", "*sp->p", "sp->p[0]"], "normalize": {"trimWhitespace": true, "caseSensitive": true}},
      {"blankId": "stmt-15", "method": "exact", "acceptedAnswers": ["sp->next = sp", "sp->next=sp"], "normalize": {"trimWhitespace": true, "caseSensitive": true}}
    ],
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
第三题 根据 GCC 生成的汇编代码，补全下面的 `switcher`。

为便于逐空核对，请保持模板中各分支的顺序。标号处只填常量，赋值右侧只填表达式；⑬、⑮ 填赋值语句，均不含题面已有的分号。

```c
struct prob {
    long *p;
    struct {
        long x;
        long y;
        long z;
    } s;
    struct prob *next;
};

void switcher(long a, long b, long c, struct prob *sp) {
    long val;
    switch (a) {
    case {{blank:case-1}}:
        c = {{blank:expr-8}};
        /* fall through */
    case {{blank:case-2}}:
        val = {{blank:expr-9}};
        break;
    case {{blank:case-3}}:
        c = {{blank:expr-10}};
        /* fall through */
    case {{blank:case-4}}:
        val = {{blank:expr-11}};
        break;
    case {{blank:case-5}}:
        val = {{blank:expr-12}};
        break;
    case {{blank:case-6}}:
        {{blank:stmt-13}};
        break;
    case {{blank:case-7}}:
        val = {{blank:expr-14}};
        break;
    default:
        {{blank:stmt-15}};
        break;
    }
    sp->s.y = val;
}
```

原卷的部分分支没有给 `val` 赋值。本题只要求还原所示语句，不据此讨论那些分支中 `sp->s.y` 的确定值，也不自行补入原卷没有的初始化。

```asm
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
各空实际填入内容如下；不要重复已有的 `case`、`c =` 或 `val =`。

| 原卷标号 | 填入内容 |
| --- | --- |
| ① | `5` |
| ② | `2` |
| ③ | `0` |
| ④ | `1` |
| ⑤ | `3` |
| ⑥ | `7` |
| ⑦ | `6` |
| ⑧ | `b ^ 31` |
| ⑨ | `c + 2022` |
| ⑩ | `c - 54` |
| ⑪ | `(c + b) * 3` |
| ⑫ | `sp->s.x` |
| ⑬ | `sp->s.z = 1898` |
| ⑭ | `*(sp->p)` |
| ⑮ | `sp->next = sp` |

完整代码（用于对照，不是要求每个空填写完整语句）：

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

原卷允许语义等价的分支重排；本在线模板固定分支顺序以便逐空核对。⑪ 接受 `(b+c)*3`、`3*(b+c)`、`3*(c+b)` 和 `3*b+3*c` 等显式列出的写法。⑬、⑮ 已经在题面末尾提供分号，输入时不要重复。
