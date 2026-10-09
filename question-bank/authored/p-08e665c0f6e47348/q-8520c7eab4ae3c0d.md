+++json
{
  "schemaVersion": "5",
  "id": "q-8520c7eab4ae3c0d",
  "revision": 1,
  "paperId": "p-08e665c0f6e47348",
  "paperOrder": 6,
  "number": {
    "display": "第一题 6",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "6",
      "value": "6"
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
      "legacyId": "q-8520c7eab4ae3c0d",
      "document": "原文/期末/2015期末-20160104-带答案.md",
      "lines": {
        "start": 97,
        "end": 104
      },
      "curated": "_curated/期末/2015期末-20160104-带答案/97.md",
      "aliases": [],
      "provenance": "verbatim",
      "editorNote": "阻塞信号与待处理信号只处理一次"
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
6.  一段程序中阻塞了`SIGCHLD`和SIGUSR1信号。接下来，向它按顺序发送
`SIGCHLD`，SIGUSR1，`SIGCHLD`信号，当程序取消阻塞继续执行时，将处理
这三个信号中的哪几个？
%%% reference
答案：C。
%%% option: A
都不处理
%%% option: B
处理一次SIGCHLD
%%% option: C
处理一次SIGCHLD，一次SIGUSR1
%%% option: D
处理所有三个信号
