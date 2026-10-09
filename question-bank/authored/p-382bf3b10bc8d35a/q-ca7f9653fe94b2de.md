+++json
{
  "schemaVersion": "5",
  "id": "q-ca7f9653fe94b2de",
  "revision": 1,
  "paperId": "p-382bf3b10bc8d35a",
  "paperOrder": 18,
  "number": {
    "display": "第一题 18",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "18",
      "value": "18"
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
      "legacyId": "q-ca7f9653fe94b2de",
      "document": "原文/期末/2017期末-无答案.md",
      "lines": {
        "start": 208,
        "end": 214
      },
      "curated": "_curated/期末/2017期末-无答案/208.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "localhost、套接字地址与 IPv4/IPv6"
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
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
18. 下列关于计算机网络的说法中，错误的是：
%%% reference
答案：B
解析：套接字编程中只能用 IP 地址（不能用网卡 MAC 地址）作为地址，B 错；A、C、D 都正确。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
在Linux系统中，每台主机都有本地定义的域名localhost，这个域名总是
被映射为IP地址127.0.0.1
%%% option: B
在套接字编程中，既可以用网卡地址作为地址，也可以用IP地址作为地址
%%% option: C
Web客户端和服务器间的交互采用的是基于文本的无连接协议
%%% option: D
IPv4中的IP地址是一个32位无符号整数，IPv6中的IP地址是一个128
位无符号整数
