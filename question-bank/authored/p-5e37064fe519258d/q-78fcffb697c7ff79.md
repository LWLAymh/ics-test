+++json
{
  "schemaVersion": "5",
  "id": "q-78fcffb697c7ff79",
  "revision": 1,
  "paperId": "p-5e37064fe519258d",
  "paperOrder": 1,
  "number": {
    "display": "第一题 1",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "1",
      "value": "1"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "data_representation",
    "moduleIds": [
      "data_representation"
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
      "legacyId": "q-78fcffb697c7ff79",
      "document": "原文/期中/2017期中-带答案.md",
      "lines": {
        "start": 48,
        "end": 54
      },
      "curated": "_curated/期中/2017期中-带答案/48.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "大端法下最小负数的字节内容"
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
1. 假定一个特殊设计的计算机将 `int` 型数据的长度从 4 Byte 扩展为 4N Byte，并采用大端法（Big Endian）。现将该 `int` 型所能表示的最小负数写入内存，如下图所示。每个小矩形代表一个 Byte，请问 X 位置这个 Byte 中的值是多少？

![4N Byte 整数在大端内存中的排列示意图，X 位于靠近低地址一侧的指定字节](assets/期中/2017期中-带答案/q1-memory-layout.svg)
%%% reference
答案：C

最小负数的二进制表示为最高位是 1、其余位均为 0。大端法把最高有效字节放在最低地址，因此 X 所在字节为 $10000000_2$。
%%% option: A
$00000000_2$
%%% option: B
$01111111_2$
%%% option: C
$10000000_2$
%%% option: D
$11111111_2$
