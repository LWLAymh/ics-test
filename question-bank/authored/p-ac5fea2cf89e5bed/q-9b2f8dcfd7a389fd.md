+++json
{
  "schemaVersion": "5",
  "id": "q-9b2f8dcfd7a389fd",
  "revision": 2,
  "paperId": "p-ac5fea2cf89e5bed",
  "paperOrder": 16,
  "number": {
    "display": "第一题 16",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "16",
      "value": "16"
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
      "legacyId": "q-9b2f8dcfd7a389fd",
      "document": "原文/期末/2013期末-带答案.md",
      "lines": {
        "start": 198,
        "end": 237
      },
      "curated": "_curated/期末/2013期末-带答案/198.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "open 与 dup 的文件描述符/open file table"
    }
  ],
  "type": "single-choice",
  "stem": {
    "format": "markdown"
  },
  "solution": {
    "state": "available",
    "grading": "choice",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    },
    "correctOptionIds": [
      "B"
    ]
  },
  "options": [
    {
      "id": "A",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "B",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "C",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "D",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
16、已知如下代码段
```
write(fd1, str1, strlen(str1));
write(fd2, str2, strlen(str2));
```
可以在原本为空的文件`ICS.txt`中写下字符串 I love ICS!
对于下面这些对于变量fd1, fd2, str1, str2的定义：
```
(1)
int fd1 = open("ICS.txt", O_RDWR);
int fd2 = open("ICS.txt", O_RDWR);
char *str1 = "I love ";
char *str2 = "ICS!";
(2)
int fd1 = open("ICS.txt", O_RDWR);
int fd2 = dup(fd1);
```


```
char *str1 = "I love ";
char *str2 = "ICS!";
(3)
int fd1 = open("ICS.txt", O_RDWR);
int fd2 = open("ICS.txt", O_RDWR);
char *str1 = "I love ";
char *str2 = "I love ICS!";
(4)
int fd1 = open("ICS.txt", O_RDWR);
int fd2 = dup(fd1);
char *str1 = "I love ";
char *str2 = "I love ICS!";
```
下面哪一个组合是正确的：
%%% reference
答案：B
说明：考察两种不同文件描述符指向同一文件v的不同，一种是指向了同一的`open`
file table，一种是指向了同一的v-node table。
%%% option: A
(1)(4)
%%% option: B
(2)(3)
%%% option: C
(1)(2)(3)(4)
%%% option: D
都不正确
