+++json
{
  "schemaVersion": "5",
  "id": "q-8370b4f9bdb8db0c",
  "revision": 2,
  "paperId": "p-98acf19964247e22",
  "paperOrder": 9,
  "number": {
    "display": "第一题 9",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "9",
      "value": "9"
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
      "legacyId": "q-8370b4f9bdb8db0c",
      "document": "原文/期末/2019期末-无答案.md",
      "lines": {
        "start": 109,
        "end": 114
      },
      "curated": "_curated/期末/2019期末-无答案/109.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "fork/setjmp/longjmp/execve 返回次数"
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
9.  进程管理相关函数的调用和返回行为，下列那些函数都是可能返回多于一
次的？
%%% reference
答案：C（来源：2019、2020期末-答案解析）
解析：成功 fork 分别在父、子进程返回；setjmp 初次返回0，还可因后续 longjmp 再次返回。longjmp 不返回到自己的调用处；成功 execve 不返回，失败可返回 -1，但不属于多次返回。
%%% option: A
longjmp和fork
%%% option: B
execve和longjmp
%%% option: C
fork和setjmp
%%% option: D
setjmp和execve
