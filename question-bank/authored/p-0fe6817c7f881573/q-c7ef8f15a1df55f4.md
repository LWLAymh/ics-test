+++json
{
  "schemaVersion": "5",
  "id": "q-c7ef8f15a1df55f4",
  "revision": 1,
  "paperId": "p-0fe6817c7f881573",
  "paperOrder": 5,
  "number": {
    "display": "第一题 5",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "5",
      "value": "5"
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
      "legacyId": "q-c7ef8f15a1df55f4",
      "document": "原文/期中/2024期中-带答案.md",
      "lines": {
        "start": 129,
        "end": 141
      },
      "curated": "_curated/期中/2024期中-带答案/129.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "x86-64栈结构与参数构造区"
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
      "C"
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
5.下述关于 x86-64 的栈结构说法错误的是？
%%% reference
答案：C。
4


在参数构造区中存放 7 及以上的参数，参数 7 是最后压栈的。
%%% option: A
被调用者保存寄存器包括：`%rbp %rbx %r12 %r13 %r14 %r15`
%%% option: B
过程的返回地址属于调用者的帧栈
%%% option: C
过程传参时，参数 1~6 通过寄存器传递，在参数构造区中存放其他参数，其
中，参数 7 最先压栈
%%% option: D
`call` 指令的执行过程是：先将下一条指令的地址压栈，随后将PC设为目标
地址
