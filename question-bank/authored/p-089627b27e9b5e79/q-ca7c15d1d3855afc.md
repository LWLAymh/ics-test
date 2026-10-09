+++json
{
  "schemaVersion": "5",
  "id": "q-ca7c15d1d3855afc",
  "revision": 1,
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
    "issues": [
      "blank-positions-unresolved"
    ]
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
%%% reference
答案：
```
1 = p
2 = k
3 = n
4 = g
```
`buffer.txt`文件内容为ppkknggniv
