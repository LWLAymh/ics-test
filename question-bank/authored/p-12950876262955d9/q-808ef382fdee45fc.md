+++json
{
  "schemaVersion": "5",
  "id": "q-808ef382fdee45fc",
  "revision": 2,
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
码来判断是否需要将一个立即数传送到寄存器内。补充本题编码方案：为它分配独立的 `icode`，指令编码含1字节指令码、1字节寄存器字段和8字节立即数。则下列叙述错误的是：
%%% reference
答案：C。不仅要在执行阶段让 `valE = valC`，还需要在取指阶段识别新指令与长度，并按条件控制目的寄存器写回。

原解析声称“可以和 rrmovq 共用一个 icode”，没有给出如何区分2字节寄存器传送与10字节立即数传送的完整编码方案。本题现在明确采用独立 `icode` 的实现，A、B、D均与此方案一致；不把它说成唯一可能的 ISA 编码设计。
%%% option: A
需要增加一个新的icode标识符
%%% option: B
该指令的长度为10字节
%%% option: C
只需要修改SEQ处理器的执行阶段的硬件逻辑
%%% option: D
在执行阶段valE信号的值会被赋值为valC的值
