+++json
{
  "schemaVersion": "5",
  "id": "q-af342c9ccb98e2cf",
  "revision": 1,
  "paperId": "p-e3f869956fc29bd8",
  "paperOrder": 6,
  "number": {
    "display": "第一题 6",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "6",
      "value": "6"
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
      "legacyId": "q-af342c9ccb98e2cf",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 133,
        "end": 149
      },
      "curated": "_curated/期末/2018期末-带答案/133.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "dup2 链式重定向后的文件引用关系"
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
      "A"
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
6.  假设某进程有且仅有五个已打开的文件描述符：0~4，分别引用了五个不同的文
件，尝试运行以下代码：

```c
dup2(3,2); dup2(0,3); dup2(1,10); dup2(10,4); dup2(4,0);
```

关于得到的结果，说法正确的是：
%%% reference
答案：A
说明：一开始打开文件描述符(0,1,2,3,4)对应文件(A,B,C,D,E)，结束后打开描述
符(0,1,2,3,4,10)对应(B,B,D,A,B,B)，A正确，B应该为引用三个不同文件。教材
637页说明过可以向未打开的描述符进行复制，因此D错误；虽然教材未提及从未
打开的描述符进行复制的后果，但执行过程中并没有发生这种情况，因此C错误。
%%% option: A
运行正常完成，现在有四个描述符引用同一个文件
%%% option: B
运行正常完成，现在进程共引用四个不同的文件
%%% option: C
由于试图从一个未打开的描述符进行复制，发生错误
%%% option: D
由于试图向一个未打开的描述符进行复制，发生错误
