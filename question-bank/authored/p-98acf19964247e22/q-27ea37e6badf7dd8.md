+++json
{
  "schemaVersion": "5",
  "id": "q-27ea37e6badf7dd8",
  "revision": 1,
  "paperId": "p-98acf19964247e22",
  "paperOrder": 5,
  "number": {
    "display": "第一题 5",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "5",
      "value": "5"
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
      "legacyId": "q-27ea37e6badf7dd8",
      "document": "原文/期末/2019期末-无答案.md",
      "lines": {
        "start": 77,
        "end": 86
      },
      "curated": "_curated/期末/2019期末-无答案/77.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "磁盘/DRAM/SSD/SRAM 存储介质特性"
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
5.  下述关于各类存储介质的讨论，哪个是错误的？
%%% reference
答案：B（来源：2019、2020期末-答案解析）
解析：DRAM 按行组织，整行访问效率更高，连续访问与随机访问的延时并不相同；SSD 擦除远慢于读取；SRAM 晶体管多、存储密度最低。
%%% option: A
磁盘访问的延时和数据所在位置有关，连续数据访问的性能高于随机
数据访问
%%% option: B
DRAM是动态随机存储器，连续数据访问和随机数据访问延时是一样的
%%% option: C
对SSD设备进行数据擦除操作的延时，远高于进行数据读取的延时
%%% option: D
SRAM是静态随机存储器，它的存储密度比DRAM、SSD都要低
