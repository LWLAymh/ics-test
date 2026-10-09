+++json
{
  "schemaVersion": "5",
  "id": "q-deba4de6becc5bf5",
  "revision": 1,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 30,
  "number": {
    "display": "选择题 3",
    "major": {
      "display": "选择题",
      "value": null
    },
    "minor": {
      "display": "3",
      "value": "3"
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
      "legacyId": "q-deba4de6becc5bf5",
      "document": "原文/期末/2021期末-带答案/chap 11-12 题目.md",
      "lines": {
        "start": 23,
        "end": 31
      },
      "curated": "_curated/期末/chap 11-12 题目/23.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Web 服务、HTTP 状态码、URL 与域名映射"
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
3\. 下列有关Web服务错误的是
%%% reference
答案：D

依据：A、B、C 分别对应 Web 服务的基本概念、HTTP 状态码和 URL 机制的内在思想，均正确；D 错误，因特网上域名与 IP 地址是多对多关系，一个域名也可以被映射到多个 IP 地址。
%%% option: A
Web服务使用客户端-服务器模型，使用了HTTP协议，可以传输文本，HTML页面，二进制文件等多种内容
%%% option: B
HTTP响应会返回状态码，它指示了对响应的处理状态
%%% option: C
Web服务使用URL来标明资源，这提供了一层抽象，使得客户端仿佛在访问远端的文件目录，而服务器处理了URL资源和具体文件/动态内容的映射关系
%%% option: D
多个域名可以映射到同一个IP地址，但一个域名不可以映射到多个IP地址
