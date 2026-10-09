+++json
{
  "schemaVersion": "5",
  "id": "q-bf1eb89c46abaafa",
  "revision": 1,
  "paperId": "p-98acf19964247e22",
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
    "primaryModuleId": "processor_arch",
    "moduleIds": [
      "processor_arch"
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
      "legacyId": "q-bf1eb89c46abaafa",
      "document": "原文/期末/2019期末-无答案.md",
      "lines": {
        "start": 56,
        "end": 60
      },
      "curated": "_curated/期末/2019期末-无答案/56.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "PIPE 流水线数据冒险的判定"
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
2.  在本课程的PIPE流水线中，下列情况会出现数据冒险的是：
%%% reference
答案：B（来源：2019、2020期末-答案解析）
解析：数据冒险指当前指令尚未写回结果，后续指令在流水线中就要用到它写的结果。
%%% option: A
当前指令会改变下一条指令的目的操作数
%%% option: B
当前指令会改变下一条指令的源操作数
%%% option: C
下一条指令会改变当前指令的目的操作数
%%% option: D
下一条指令会改变当前指令的源操作数
