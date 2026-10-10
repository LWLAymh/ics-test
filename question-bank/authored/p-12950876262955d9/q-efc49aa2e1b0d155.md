+++json
{
  "schemaVersion": "5",
  "id": "q-efc49aa2e1b0d155",
  "revision": 2,
  "paperId": "p-12950876262955d9",
  "paperOrder": 15,
  "number": {
    "display": "第一题 15",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "15",
      "value": "15"
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
      "legacyId": "q-efc49aa2e1b0d155",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 233,
        "end": 244
      },
      "curated": "_curated/期中/2022期中-带答案/233.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "循环展开与编译优化的限制"
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
15. 下面说法正确的是
%%% reference
答案：C
A循环展开次数增加会导致代码膨胀、增大寄存器压力，影响性能（课本5.11.1）。
B编译器能处理函数调用和内存别名，只是代价很高；（课本章节5.1用词“限制
了可能的优化”“大多数编译器不会”。此外，函数内联优化就是一个很好的反例）。
C很直白的正确的话，用来在这里坑一下喜欢猜答案的同学。
D吞吐量界限才是程序性能的终极限制（课本章节5.6最后一句话）。
%%% option: A
随着循环展开次数越多，分支预测次数更少，指令调度空间更大，代码性能更
好。
%%% option: B
编译优化无法跨越函数调用和内存别名的阻碍。
%%% option: C
算法的渐进复杂度对于程序优化十分重要。
%%% option: D
由于处理器硬件带来的延迟界限（latency bound）是程序性能的终极限制。
