+++json
{
  "schemaVersion": "5",
  "id": "q-ca7f9653fe94b2de",
  "revision": 2,
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
18. 在Linux套接字API的一般范围内，以下哪些说法不正确？（多选；C讨论传统HTTP/1.1，不涉及HTTP/3。）
%%% reference
答案：A、C。localhost不必只映射127.0.0.1，常见IPv6配置还会使用::1，具体取决于本地配置。Linux套接字API不止AF_INET，AF_PACKET等可按链路层地址操作，因此不能把B在一般套接字范围内判错。HTTP/1.1通常在TCP连接上传输，应用层无状态不等于无连接，C错误；D的地址位宽正确。

旧解析把通用Linux套接字限定成IP套接字、又把HTTP无状态当无连接，已按明确范围改正。

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
