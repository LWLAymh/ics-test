+++json
{
  "schemaVersion": "5",
  "id": "q-c40f969cf9b4dcbf",
  "revision": 2,
  "paperId": "p-ac5fea2cf89e5bed",
  "paperOrder": 8,
  "number": {
    "display": "第一题 8",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "8",
      "value": "8"
    },
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
    "issues": []
  },
  "sources": [
    {
      "legacyId": "q-c40f969cf9b4dcbf",
      "document": "原文/期末/2013期末-带答案.md",
      "lines": {
        "start": 116,
        "end": 123
      },
      "curated": "_curated/期末/2013期末-带答案/116.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "哪些符号一定不需要重定位"
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
8、在链接时，对于什么样的符号一定不需要进行重定位？
%%% reference
答案：C
说明：考察需要进行重定位的条件。A 在链接前不在同一目标文件中，BD 都位
于.data段中，这些都需要重定位。C位于栈中或者寄存器中，不需要重定位。
%%% option: A
不同C语言源文件中定义的函数
%%% option: B
同一C语言源文件中定义的全局变量
%%% option: C
同一函数中定义时不带`static`的变量
%%% option: D
同一函数中定义时带有`static`的变量
