+++json
{
  "schemaVersion": "5",
  "id": "q-1d0faf42a8c296cf",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 5,
  "number": {
    "display": "Lab 任务 5",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "5",
      "value": "5"
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
      "legacyId": "q-1d0faf42a8c296cf",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 79,
        "end": 84
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/79.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "ssh-keygen 公钥/私钥的存放位置（兼 Unix 工具）"
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
5.  （2分）使用 ssh-keygen 命令可以生成用于 SSH 登录的密钥。该命令通常生成两
个文件：公钥 `key.pub` 和私钥 `key`。这两个文件应存放在：
%%% reference
答案：C

解析：私钥 `key` 必须只留在本地，公钥 `key.pub` 的内容要追加到服务器的 ~/.ssh/authorized_keys 供服务器验证身份；私钥上传等于把身份交出去。故选 C。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
公钥留存在本地；私钥留存在本地
%%% option: B
公钥留存在本地；私钥上传到服务器
%%% option: C
公钥上传到服务器；私钥留存在本地
%%% option: D
公钥上传到服务器；私钥上传到服务器
