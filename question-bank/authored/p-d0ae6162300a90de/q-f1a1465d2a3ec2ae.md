+++json
{
  "schemaVersion": "5",
  "id": "q-f1a1465d2a3ec2ae",
  "revision": 1,
  "paperId": "p-d0ae6162300a90de",
  "paperOrder": 8,
  "number": {
    "display": "选择题 8",
    "major": {
      "display": "选择题",
      "value": null
    },
    "minor": {
      "display": "8",
      "value": "8"
    },
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
      "legacyId": "q-f1a1465d2a3ec2ae",
      "document": "原文/期中/2013期中-带答案.md",
      "lines": {
        "start": 82,
        "end": 87
      },
      "curated": "_curated/期中/2013期中-带答案/82.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "leal 用途、传参、寄存器保存与条件码"
    }
  ],
  "type": "multiple-choice",
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
      "A",
      "C",
      "D"
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
8、 x86体系结构中，下面哪些选项是错误的？答：（      ）
%%% reference
答案：ACD
%%% option: A
`leal`指令只能够用来计算内存地址
%%% option: B
x86_64机器可以使用栈来给函数传递参数
%%% option: C
在一个函数内，改变任一寄存器的值之前必须先将其原始数据保存在栈内
%%% option: D
判断两个寄存器中值大小关系，只需要`SF`（符号）和`ZF`（零）两个conditional code
