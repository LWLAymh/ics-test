+++json
{
  "schemaVersion": "5",
  "id": "q-818aba7f99c7eb6f",
  "revision": 2,
  "paperId": "p-382bf3b10bc8d35a",
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
    "primaryModuleId": "network",
    "moduleIds": [
      "network"
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
      "legacyId": "q-818aba7f99c7eb6f",
      "document": "原文/期末/2017期末-无答案.md",
      "lines": {
        "start": 195,
        "end": 201
      },
      "curated": "_curated/期末/2017期末-无答案/195.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "本地端口、私有 IP 与服务器端口"
    }
  ],
  "type": "multiple-choice",
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
    },
    "correctOptionIds": [
      "A",
      "B",
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
16. 一台校园网内笔记本通过IPv4/TCP直连公网服务器的80端口，无代理或端口转发。以下哪些情况可能成立？（多选，可能包含必然成立的项。）客户端允许在具备权限且端口空闲时显式bind本地端口；笔记本IP指校园网接口，服务器IP指本次连接目标的公网地址。
%%% reference
答案：A、B、C。客户端通常用自动分配的临时端口，但也可在有权限且不冲突时显式绑定80；经NAT上网的校园网接口可以是192.168.1.101；服务端该TCP连接的源端口为80。已确定为公网目标地址的服务器不能用私有192.168.1.102作该目标。

旧解析把“客户端通常自动用临时端口”说成“绝不可能用80”，又把“一定正确”排除在“可能正确”之外，逻辑不成立，已改为明确范围的多选。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
笔记本在通信过程中，本地使用的端口号是80
%%% option: B
笔记本的IP地址是192.168.1.101
%%% option: C
服务器向笔记本传送网页内容时，使用的服务器端口号是80
%%% option: D
服务器的IP地址是192.168.1.102
