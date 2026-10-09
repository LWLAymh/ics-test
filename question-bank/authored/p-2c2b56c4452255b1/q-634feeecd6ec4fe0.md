+++json
{
  "schemaVersion": "5",
  "id": "q-634feeecd6ec4fe0",
  "revision": 1,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 13,
  "number": {
    "display": "第一题 13",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "13",
      "value": "13"
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
      "legacyId": "q-634feeecd6ec4fe0",
      "document": "原文/期末/2021期末-无答案.md",
      "lines": {
        "start": 199,
        "end": 209
      },
      "curated": "_curated/期末/2021期末-无答案/199.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Unix I/O、文件描述符与 RIO"
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
13.  下列关于系统I/O的说法中，正确的是：
%%% reference
答案：B
%%% option: A
Linux shell创建的每个进程开始时都有三个打开的文件：标准输入
（文件描述符为0）、标准输出（文件描述符为1）、标准错误（文件描述符
为2），这使得程序始终不能使用保留的描述符0、1、2读写其他文件。
%%% option: B
Unix I/O的read/write函数是异步信号安全的，故可以在信号处
理函数中使用。
%%% option: C
RIO函数包的健壮性保证了对于同一个文件描述符，任意顺序调用
RIO包中的任意函数不会造成问题。
%%% option: D
使用`int fd1 = open(“ICS.txt”, O_RDWR);` 打开`ICS.txt`文
件后，再用int fd2 = open(“ICS.txt”, O_RDWR); 再次打开文
件，会使得fd1对应的打开文件表中的引用计数refcnt加一。
