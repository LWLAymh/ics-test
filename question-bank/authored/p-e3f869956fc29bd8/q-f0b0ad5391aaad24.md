+++json
{
  "schemaVersion": "5",
  "id": "q-f0b0ad5391aaad24",
  "revision": 1,
  "paperId": "p-e3f869956fc29bd8",
  "paperOrder": 17,
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
    "primaryModuleId": "compilation_linking",
    "moduleIds": [
      "compilation_linking"
    ],
    "tags": []
  },
  "publication": {
    "state": "published",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": [
      "blank-positions-unresolved"
    ]
  },
  "sources": [
    {
      "legacyId": "q-fcdcf49e11759e0e",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 292,
        "end": 320
      },
      "curated": "_curated/期末/2018期末-带答案/292.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "各符号的 .symtab 条目、类型与所在节"
    },
    {
      "legacyId": "q-906e831c908a1bd5",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 321,
        "end": 404
      },
      "curated": "_curated/期末/2018期末-带答案/321.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "反汇编中的重定位条目与引用值计算"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-fcdcf49e11759e0e",
      "number": {
        "display": "第三题 1",
        "major": {
          "display": "第三题",
          "value": "3"
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "compilation_linking"
      ],
      "stem": {
        "format": "markdown",
        "blanks": []
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
      },
      "sources": [
        {
          "legacyId": "q-fcdcf49e11759e0e",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 292,
            "end": 320
          },
          "curated": "_curated/期末/2018期末-带答案/292.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "各符号的 .symtab 条目、类型与所在节"
        }
      ],
      "issues": [
        "blank-positions-unresolved"
      ]
    },
    {
      "id": "q-906e831c908a1bd5",
      "number": {
        "display": "第三题 2",
        "major": {
          "display": "第三题",
          "value": "3"
        },
        "minor": {
          "display": "2",
          "value": "2"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "compilation_linking"
      ],
      "stem": {
        "format": "markdown",
        "blanks": []
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
      },
      "sources": [
        {
          "legacyId": "q-906e831c908a1bd5",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 321,
            "end": 404
          },
          "curated": "_curated/期末/2018期末-带答案/321.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "反汇编中的重定位条目与引用值计算"
        }
      ],
      "issues": [
        "blank-positions-unresolved"
      ]
    }
  ],
  "solution": {
    "state": "available",
    "grading": "parts",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null
    }
  }
}
+++
%%% stem

%%% reference

%%% part-stem: q-fcdcf49e11759e0e
第三题（10分）
本题基于下列`m.c`及`foo.c`文件所编译生成的`m.o`和`foo.o`，编译过程未加优化选
项。
`m.c`：
```c
void foo();
int buf[2] = {1, 2};
int main() {
    foo();
    return 0;
}
```

`foo.c`：
```c
extern int buf[];
int *bufp0 = &buf[0];
int *bufp1;
void foo() {
    static int count = 0;
    int temp;
    bufp1 = &buf[1];
    temp = *bufp0;
    *bufp0 = *bufp1;
    *bufp1 = temp;
    count++;
}
```
对于每个`foo.o`中定义和引用的符号，请用“是”或“否”指出它是否在模块`foo.o`
的.symtab节中有符号表条目。如果存在条目，则请指出定义该符号的模块（`foo.o`
或`m.o`）、符号类型（局部、全局或外部）以及它在模块中所处的节；如果不存在条
目，则请将该行后继空白处标记为“/”。
第一问每行1分，该行全部答对才给分数，节名如果漏了“.”可以算对。
用英文回答的，如果正确也可以给分。
| 符号 | .symtab 条目？ | 符号类型 | 定义符号的模块 | 节 |
| --- | --- | --- | --- | --- |
| `bufp0` |  |  |  |  |
| `buf` |  |  |  |  |
| `bufp1` |  |  |  |  |
| `foo` |  |  |  |  |
| `temp` |  |  |  |  |
| `count` |  |  |  |  |
%%% part-reference: q-fcdcf49e11759e0e
| 符号 | .symtab 条目？ | 符号类型 | 定义符号的模块 | 节 |
| --- | --- | --- | --- | --- |
| `bufp0` | 是 | 全局 | `foo.o` | .data |
| `buf` | 是 | 外部 | `m.o` | .data |
| `bufp1` | 是 | 全局 | `foo.o` | COMMON |
| `foo` | 是 | 全局 | `foo.o` | .text |
| `temp` | 否 | / | / | / |
| `count` | 是 | 局部 | `foo.o` | .bss |
%%% part-stem: q-906e831c908a1bd5
下图左边给出了`m.o`和`foo.o`的反汇编文件，右边给出了采用某个配置链接成可执行程序后再反汇编出来的文件。根据答题需要，其中的信息略有删减。

```
0000000000......<main>:                                          0000000000000fe8 <main>:
55                    push    %rbp                    fe8:  55                    push   %rbp
48 89 e5                mov      %rsp,%rbp           fe9:  48 89 e5             mov    %rsp,%rbp
b8 00 00 00 00      mov      $0x0,%eax                fec:  b8 00 00 00 00      mov    $0x0,%eax
e8 00 00 00 00      callq   e <main+0xe>        ①     ff1:  e8       ①            callq   1000 <foo>
b8 00 00 00 00      mov      $0x0,%eax                ff6:  b8 00 00 00 00      mov    $0x0,%eax
5d                          pop      %rbp              ffb:  5d                     pop    %rbp
c3                          req                     ffc:  c3                     retq
  ......略去部分和答题无关的信息......                     ......略去部分和答题无关的信息......
0000000000......<foo>:                                        0000000000001000 <foo>:
55                            push    %rbp              1000:  55                    push   %rbp
48 89 e5                   mov      %rsp,%rbp           1001:  48 89 e5             mov    %rsp,%rbp
48 c7 05 00 00 00 00 00 00 00 00                       1004:  48 c7 05 ?? ?? ?? ?? ?? ?? ?? ??
                        movq      $0x0,0x0(%rip)               movq      ②  ,  ③  (%rip)
③②
48 8b 05 00 00 00 00 mov      0x0(%rip),%rax       ④   100f:  48 8b
8b 00                     mov      (%rax),%eax           05 ?? ?? ?? ??  mov      0x????(%rip),%rax
89 45 fc                    mov      %eax,-0x4(%rbp)      1016:  8b 00                  mov    (%rax),%eax
48 8b 05 00 00 00 00 mov      0x0(%rip),%rax       ⑤   1018:  89 45 fc              mov    %eax,-0x4(%rbp)
48 8b 15 00 00 00 00 mov      0x0(%rip),%rdx       ⑥   101b:  48 8b 05 ?? ?? ?? ??  mov      ⑤  (%rip),%rax
8b 12                         mov      (%rdx),%edx      1022:  48 8b 15 ?? ?? ?? ??  mov    0x????(%rip),%rdx
89 10                         mov      %edx,(%rax)         1029:  8b 12                  mov    (%rdx),%edx
48 8b 05 00 00 00 00 mov      0x0(%rip),%rax       ⑦   102b:  89 10                  mov    %edx,(%rax)
8b 55 fc                     mov      -0x4(%rbp),%edx  102d:  48 8b 05 ?? ?? ?? ??  mov    0x????(%rip),%rax
89 10                         mov      %edx,(%rax)      1034:  8b 55 fc               mov    -0x4(%rbp),%edx
8b  05  00  00  00  00        mov        0x0(%rip),%eax   1037:  89 10                  mov    %edx,(%rax)
⑧                                                      1039:  8b 05 ?? ?? ?? ??    mov    0x????(%rip),%eax
83 c0 01                     add      $0x1,%eax
89  05  00  00  00  00        mov        %eax,0x0(%rip)   103f:  83 c0 01               add    $0x1,%eax
⑨                                                      1042:  89 05 ?? ?? ?? ??    mov    %eax,  ⑨  (%rip)
90                               nop                   1048:  90                      nop
5d                               pop      %rbp           1049:  5d                      pop    %rbp
c3                               retq                  104a:  c3                      retq
  ......略去部分和答题无关的信息......                     ......略去部分和答题无关的信息......
                                                       0000000000002330 <buf>:
                                                          ......略去部分和答题无关的信息......
                                                       0000000000002338 <bufp0>:
                                                          ......略去部分和答题无关的信息......
                                                       0000000000003024 <count.1837>:
                                                          ......略去部分和答题无关的信息......
                                                       0000000000003028 <bufp1>:
```

在上图中对所涉及到的重定位条目进行用数字①至⑨进行了标记，请根据下表中所提供的重定位条目信息，计算相应的重定位引用值并填写下表。

| 编号 | 重定位条目信息 | 应填入的重定位引用值 |
| --- | --- | --- |
| ① | `r.offset = 0xa`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` |  |
| ② | `r.offset = 0xb`　　`r.symbol = buf` `r.type = R_X86_64_32`　　`r.addend = +4` |  |
| ③ | `r.offset = 0x7`　　`r.symbol = bufp1` `r.type = R_X86_64_PC32`　　`r.addend = -8` |  |
| ⑤ | `r.offset = 0x1e`　　`r.symbol = bufp0` `r.type = R_X86_64_PC32`　　`r.addend = -4` |  |
| ⑨ | `r.offset = 0x44`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` |  |
%%% part-reference: q-906e831c908a1bd5
| 编号 | 重定位条目信息 | 应填入的重定位引用值 |
| --- | --- | --- |
| ① | `r.offset = 0xa`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` | 0a 00 00 00 |
| ② | `r.offset = 0xb`　　`r.symbol = buf` `r.type = R_X86_64_32`　　`r.addend = +4` | `0x2334` |
| ③ | `r.offset = 0x7`　　`r.symbol = bufp1` `r.type = R_X86_64_PC32`　　`r.addend = -8` | `0x2019` |
| ⑤ | `r.offset = 0x1e`　　`r.symbol = bufp0` `r.type = R_X86_64_PC32`　　`r.addend = -4` | `0x1316` |
| ⑨ | `r.offset = 0x44`　　`r.symbol` = 本题不提供；`r.type = R_X86_64_PC32`　　`r.addend = -4` | `0x1fdc` |
