+++json
{
  "schemaVersion": "5",
  "id": "q-5bda1cdcfd5e9cdd",
  "revision": 1,
  "paperId": "p-d72f88c4198cf267",
  "paperOrder": 2,
  "number": {
    "display": "第一题 2",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "2",
      "value": "2"
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
      "legacyId": "q-5bda1cdcfd5e9cdd",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 62,
        "end": 68
      },
      "curated": "_curated/期中/2020期中-带答案/62.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "条件码与 set/cmp/test/leaq 指令"
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
2、条件码描述了最近一次算术或逻辑操作的属性。下列关于条件码的叙述中，哪
一个是不正确的？
%%% reference
答案：C
%%% option: A
set指令可以根据条件码的组合将一个字节设置为0或1
%%% option: B
`cmp`指令和`test`指令可以设置条件码但不更改目的寄存器
%%% option: C
leaq指令可以设置条件码`CF`和`OF`
%%% option: D
除无条件跳转指令`jmp`外，其他跳转指令都是根据条件码的某种组合跳转到标号指示的位置
