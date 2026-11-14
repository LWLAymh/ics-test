+++json
{
  "schemaVersion": "5",
  "id": "q-c40f969cf9b4dcbf",
  "revision": 3,
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
自动局部变量由栈偏移或寄存器表示，不是需由链接器解析地址的静态存储符号。全局和静态变量可能在 `.data` 或 `.bss`，不能像原解析一样一概说它们都在 `.data`。其他选项也不能保证所有引用一定需要重定位，例如某些同节PC相对引用可由汇编器提前解决；本题问的是C所述对象本身不需要链接重定位。
%%% option: A
不同C语言源文件中定义的函数
%%% option: B
同一C语言源文件中定义的全局变量
%%% option: C
同一函数中定义的自动局部变量（非`static`，非`extern`）
%%% option: D
同一函数中定义时带有`static`的变量
