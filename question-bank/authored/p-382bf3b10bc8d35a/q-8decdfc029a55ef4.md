+++json
{
  "schemaVersion": "5",
  "id": "q-8decdfc029a55ef4",
  "revision": 1,
  "paperId": "p-382bf3b10bc8d35a",
  "paperOrder": 1,
  "number": {
    "display": "第一题 1",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "1",
      "value": "1"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog"
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
      "legacyId": "q-8decdfc029a55ef4",
      "document": "原文/期末/2017期末-无答案.md",
      "lines": {
        "start": 53,
        "end": 55
      },
      "curated": "_curated/期末/2017期末-无答案/53.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "gdb 单步进入被调函数（si/ni）"
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
1.  在`gdb`调试中，下一条指令是`call func1`。下面哪条`gdb`指令能执行该指令并
且停留在`func1`的第一条指令？
%%% reference
答案：B
解析：si（stepi）执行一条机器指令并在被调函数的第一条指令处停下；ni 会越过 `call`，br/disas 不是单步执行。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
br func1
%%% option: B
si
%%% option: C
ni
%%% option: D
disas func1
