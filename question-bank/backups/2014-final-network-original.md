+++json
{
  "schemaVersion": "5",
  "id": "q-a7e7d2984076c296",
  "revision": 4,
  "paperId": "p-089627b27e9b5e79",
  "paperOrder": 17,
  "number": {
    "display": "第一题 17",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "17",
      "value": "17"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "network",
    "moduleIds": [
      "network"
    ],
    "tags": []
  },
  "publication": {
    "state": "review",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": [
      "source-question-missing-protocol-conversion-gateway"
    ]
  },
  "sources": [
    {
      "legacyId": "q-a7e7d2984076c296",
      "document": "原文/期末/2014期末-带答案.md",
      "lines": {
        "start": 267,
        "end": 274
      },
      "curated": "_curated/期末/2014期末-带答案/267.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "不同协议局域网互连设备"
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
17. 如果两个局域网高层分别采用TCP/IP协议和SPX/IPX协议，那么可以选择
的互连设备应是
%%% reference
原卷答案为 C，但题目不足以支持该结论：如果要求 TCP/IP 与 SPX/IPX 高层应用直接互通，需要协议转换网关，而选项中没有网关。支持两类网络层协议的多协议路由器可以分别转发对应协议的数据包，却不自动实现端到端的高层协议转换。原题未区分这些目的，暂保留备份并维持待复核状态，不参与已发布题库。
%%% option: A
网桥
%%% option: B
集线器
%%% option: C
路由器
%%% option: D
交换机
