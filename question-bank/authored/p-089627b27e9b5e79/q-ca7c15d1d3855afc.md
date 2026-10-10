+++json
{
  "schemaVersion": "5",
  "id": "q-ca7c15d1d3855afc",
  "revision": 3,
  "paperId": "p-089627b27e9b5e79",
  "paperOrder": 25,
  "number": {
    "display": "第六题 1",
    "major": {
      "display": "第六题",
      "value": "6"
    },
    "minor": {
      "display": "1",
      "value": "1"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "ecf_and_system_io",
    "moduleIds": [
      "ecf_and_system_io"
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
      "legacyId": "q-ca7c15d1d3855afc",
      "document": "原文/期末/2014期末-带答案.md",
      "lines": {
        "start": 682,
        "end": 730
      },
      "curated": "_curated/期末/2014期末-带答案/682.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "fork/dup2/read/write 后文件内容与输出"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {"id":"out1","marker":"{{blank:out1}}","occurrence":0,"width":"short","label":"第 1 行输出字符"},
      {"id":"out2","marker":"{{blank:out2}}","occurrence":0,"width":"short","label":"第 2 行输出字符"},
      {"id":"out3","marker":"{{blank:out3}}","occurrence":0,"width":"short","label":"第 3 行输出字符"},
      {"id":"out4","marker":"{{blank:out4}}","occurrence":0,"width":"short","label":"第 4 行输出字符"},
      {"id":"file-content","marker":"{{blank:file-content}}","occurrence":0,"width":"long","label":"buffer.txt 最终内容"}
    ]
  },
  "solution": {
    "state": "available",
    "grading": "blanks",
    "blankAnswers": [
      {"blankId":"out1","method":"exact","acceptedAnswers":["p"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
      {"blankId":"out2","method":"exact","acceptedAnswers":["k"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
      {"blankId":"out3","method":"exact","acceptedAnswers":["n"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
      {"blankId":"out4","method":"exact","acceptedAnswers":["g"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
      {"blankId":"file-content","method":"exact","acceptedAnswers":["ppkknggniv"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}
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
第六题（10分）ECF

1.（5 分）以下程序运行时系统调用全部正确执行，`buffer.txt` 文件的内容为
pekinguniv。请给出代码运行后打印输出的结果，并给出程序运行结束后
`buffer.txt`文件的内容。
```
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
int main() {
    char c;
    int file1 = open("buffer.txt", O_RDWR);
    int file2;
    read(file1, &c, 1);
    file2 = dup(file1);
    write(file2, &c, 1);
    printf("1 = %c\n", c);
    int pid = fork() ;
    if (pid == 0) {
        read(file1, &c, 1);
        write(file2, &c, 1);
        printf("2 = %c\n", c);
        read(file1, &c, 1);
        printf("3 = %c\n", c);
        close(file1);
        exit(0);
    } else {
        waitpid(pid, NULL, 0);
        close(file2);
        dup2(file1, file2);
        read(file2, &c, 1);
        write(file2, &c, 1);
        printf("4 = %c\n", c);
    }
    return 0;
}
```

打印输出：`1 = {{blank:out1}}`、`2 = {{blank:out2}}`、`3 = {{blank:out3}}`、`4 = {{blank:out4}}`。

`buffer.txt` 最终内容：{{blank:file-content}}
%%% reference
答案：
```
1 = p
2 = k
3 = n
4 = g
```
`buffer.txt`文件内容为ppkknggniv
