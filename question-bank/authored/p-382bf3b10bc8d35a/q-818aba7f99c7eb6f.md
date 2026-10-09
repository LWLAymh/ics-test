+++json
{
  "schemaVersion": "5",
  "id": "q-818aba7f99c7eb6f",
  "revision": 1,
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
16. 一台处于校园网内的笔记本电脑访问一台处于公网上的服务器上的网页服务。
网页服务使用默认的80端口。以下答案有三项一定不正确，可能正确的那一
项是：
%%% reference
答案：B
解析：客户端一定使用临时端口而不是 80（A 必错）；公网服务器不可能是 `192.168.x.x`（D 必错）。剩下 B/C 中，C 是「一定正确」而不是「可能正确」，题面要求选「可能正确的那一项」，故取 B：校园网内的笔记本若在私有路由器之后，确实可能拿到 192.168.1.101。
（存疑：若按「校园网主机持公网 IP」理解，则 C 才是唯一正确项。）

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
笔记本在通信过程中，本地使用的端口号是80
%%% option: B
笔记本的IP地址是192.168.1.101
%%% option: C
服务器向笔记本传送网页内容时，使用的服务器端口号是80
%%% option: D
服务器的IP地址是192.168.1.102
