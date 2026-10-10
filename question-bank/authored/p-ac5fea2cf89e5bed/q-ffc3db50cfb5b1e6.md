+++json
{
  "schemaVersion": "5",
  "id": "q-ffc3db50cfb5b1e6",
  "revision": 2,
  "paperId": "p-ac5fea2cf89e5bed",
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
    "state": "review",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": [
      "selection-multiplicity-unresolved"
    ]
  },
  "sources": [
    {
      "legacyId": "q-ffc3db50cfb5b1e6",
      "document": "原文/期末/2013期末-带答案.md",
      "lines": {
        "start": 77,
        "end": 82
      },
      "curated": "_curated/期末/2013期末-带答案/77.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "直接映射 cache 的每路行数"
    }
  ],
  "type": "unclassified-choice",
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
      "A"
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
（5~6） 如果直接映射高速缓存（Cache）的大小是4KB，并且块大小（block）
大小为32字节。
5、请问它每路（way）有多少行（line）？
%%% reference
答案：选 A，容量=路容量\*路数=cache 行大小*Set 数\*路数->set 数
=`4KB/32B=2^7=128`
%%% option: A
128
%%% option: B
64
%%% option: C
32
%%% option: D
1
