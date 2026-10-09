+++json
{
  "schemaVersion": "5",
  "id": "q-5cf6817ce4f8db9c",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 1,
  "number": {
    "display": "Lab 任务 1",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "1",
      "value": "1"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "ecf_and_system_io",
    "moduleIds": [
      "ecf_and_system_io"
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
      "legacyId": "q-5cf6817ce4f8db9c",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 52,
        "end": 56
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/52.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "ls -a 显示隐藏文件（L0 命令行）"
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
1.  （2分）以下哪个`ls`命令选项用于显示所有文件（包括隐藏文件，以.开头的文件）
%%% reference
答案：B

解析：`ls` 的 -a（--all）列出目录下所有条目，包括以 . 开头的隐藏文件；-l 是长格式、-h 是配合 -l 的人类可读大小、-t 是按修改时间排序，都与隐藏文件无关。故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
ls -l
%%% option: B
ls -a
%%% option: C
ls -h
%%% option: D
ls -t
