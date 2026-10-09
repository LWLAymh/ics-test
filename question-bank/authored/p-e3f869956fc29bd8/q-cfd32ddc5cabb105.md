+++json
{
  "schemaVersion": "5",
  "id": "q-cfd32ddc5cabb105",
  "revision": 1,
  "paperId": "p-e3f869956fc29bd8",
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
      "legacyId": "q-cfd32ddc5cabb105",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 195,
        "end": 206
      },
      "curated": "_curated/期末/2018期末-带答案/195.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "套接字接口 API 与描述符读写"
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
11. 下面有关套接字接口(Socket API)的叙述中，错误的是
%%% reference
答案：B
  A选项是套接字的基本概念
  B选项出自书本652页，考察对套接字接口的理解。几乎所有的现代操作系统
都实现了套接字接口。
  C选项出自书本656页，考察套接字接口中协议无关的设计思想。
  D选项考察对Socket API和Linux文件描述符的基本理解
%%% option: A
套接字接口常常被用来创建网络应用
%%% option: B
Windows 10系统没有实现套接字接口
%%% option: C
getaddrinfo()和getnameinfo()可以被用于编写独立于特定版本的IP协议的
程序
%%% option: D
socket()函数返回的描述符，可以使用标准Unix I/O函数进行读写
