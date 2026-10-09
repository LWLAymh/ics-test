+++json
{
  "schemaVersion": "5",
  "id": "q-3b2b40ee8bf7ecfe",
  "revision": 1,
  "paperId": "p-a12b4c73bf0c30d2",
  "paperOrder": 11,
  "number": {
    "display": "第一题 11",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "11",
      "value": "11"
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
      "legacyId": "q-3b2b40ee8bf7ecfe",
      "document": "原文/期中/2019期中-带答案.md",
      "lines": {
        "start": 206,
        "end": 212
      },
      "curated": "_curated/期中/2019期中-带答案/206.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "插入流水线寄存器后的最大吞吐率"
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
11. 如下图所示，①~④为四个组合逻辑单元，对应的延迟已在图上标出，REG0为
一寄存器，延迟为20ps。通过插入额外的2个流水线寄存器REG1、REG2（延
迟均为 20ps），可以对其进行流水化改造。改造后的流水线的吞吐率最大为
________GIPS。

![四个组合逻辑单元与 REG0 的延迟链](assets/期中/2019期中-带答案/p6-logic-units.png)
%%% reference
答案：C
额外的 2 个寄存器应当插入 ①② 之间、②③ 之间，最慢的一级延迟为 `30+50+20=100ps`，吞吐率为 `1000/100 = 10 GIPS`
%%% option: A
7.69
%%% option: B
8.33
%%% option: C
10.00
%%% option: D
11.11
