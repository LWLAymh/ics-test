+++json
{
  "schemaVersion": "5",
  "id": "q-bad24c2768dae3dd",
  "revision": 1,
  "paperId": "p-12950876262955d9",
  "paperOrder": 16,
  "number": {
    "display": "第一题 16",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "16",
      "value": "16"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "memory_hierarchy",
    "moduleIds": [
      "memory_hierarchy"
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
      "legacyId": "q-bad24c2768dae3dd",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 245,
        "end": 255
      },
      "curated": "_curated/期中/2022期中-带答案/245.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "磁盘/SSD/SRAM易失性等存储器性质"
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
      "D"
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
16．以下关于存储器的说法中，错误的是：
%%% reference
答案：D。SRAM和DRAM都是易失性存储。
难度：简单
%%% option: A
对于旋转磁盘(rotating disk)，可以通过提高旋转速率(rotational
speed)的方式减少旋转时间(rotational latency)和传送时间(transfer
time)，从而降低访问时间(access time)。
%%% option: B
在 CPU 向磁盘控制器(disk controller)发送读取数据请求后，磁盘控制
器会读取指定扇区的内容，并将其传送到内存的指定位置，这一传送过程不需要
CPU参与，称为DMA(direct memory access)传送。
%%% option: C
对于同一个SSD，读取速度通常比写入速度快。
%%% option: D
SRAM是非易失性(nonvolatile)存储器，其数据在断电后不会丢失。
