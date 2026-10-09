+++json
{
  "schemaVersion": "5",
  "id": "q-808ef382fdee45fc",
  "revision": 1,
  "paperId": "p-12950876262955d9",
  "paperOrder": 14,
  "number": {
    "display": "第一题 14",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "14",
      "value": "14"
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
      "legacyId": "q-808ef382fdee45fc",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 220,
        "end": 229
      },
      "curated": "_curated/期中/2022期中-带答案/220.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "SEQ新增条件传送立即数指令（行218附图归属存疑）"
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
14.如果在SEQ中添加一条新的指令ircmovq，其作用是根据当前处理器的条件
码来判断是否需要将一个立即数传送到寄存器内，则下列叙述错误的是：
%%% reference
答案：C，可以和rrmovq指令共用一个icode
%%% option: A
需要增加一个新的icode标识符
%%% option: B
该指令的长度为10字节
%%% option: C
只需要修改SEQ处理器的执行阶段的硬件逻辑
%%% option: D
在执行阶段valE信号的值会被赋值为valC的值
