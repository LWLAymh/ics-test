+++json
{
  "schemaVersion": "5",
  "id": "q-fbfd26453d35e6bf",
  "revision": 1,
  "paperId": "p-98acf19964247e22",
  "paperOrder": 4,
  "number": {
    "display": "第一题 4",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "4",
      "value": "4"
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
      "legacyId": "q-fbfd26453d35e6bf",
      "document": "原文/期末/2019期末-无答案.md",
      "lines": {
        "start": 72,
        "end": 76
      },
      "curated": "_curated/期末/2019期末-无答案/72.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "RISC 与 CISC 指令集特点"
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
4.  下述关于RISC和CISC的讨论，哪个是错误的
%%% reference
答案：C（来源：2019、2020期末-答案解析）
解析：CISC 是变长指令集，部分指令可以比 RISC 的指令还短；手机常用 RISC（ARM），对能耗或结构要求高的设备一般用 RISC。
%%% option: A
RISC指令集包含的指令数量通常比CISC的少
%%% option: B
RISC的寻址方式通常比CISC的寻址方式少
%%% option: C
RISC的指令长度通常短于CISC的指令长度
%%% option: D
手机处理器通常采用RISC，而PC采用CISC
