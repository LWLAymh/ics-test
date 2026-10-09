+++json
{
  "schemaVersion": "5",
  "id": "q-6cf840e29aedb34c",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 4,
  "number": {
    "display": "Lab 任务 4",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "4",
      "value": "4"
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
      "legacyId": "q-6cf840e29aedb34c",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 71,
        "end": 78
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/71.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "tar/gcc/rm/rmdir/grep 命令用法辨误"
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
4.  （2分）下列关于 Linux 命令和命令行的使用，说法错误的一项是：
%%% reference
答案：C

解析：`rm -d 空目录`（或 `rm -r`）同样可以删除目录，"删除空目录只能用 rmdir" 不成立，故 C 是错误项。A 讲 Windows 解压 `tar` 的权限位/大小写问题、B 讲 `gcc` 的 -o 与 -O、D 讲 grep -i 忽略大小写，都正确。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
在Windows中解压tar文件可能导致权限位丢失和文件名大小写问题，因此最好
在 Linux 中使用tar命令解压
%%% option: B
gcc命令可用于编译 C 语言代码，其中 -o 选项用来指定输出的文件，-O 选项
用来指定优化级别
%%% option: C
rm命令用于删除单个文件或多个文件，如果要删除空目录只能用rmdir命令
%%% option: D
grep命令中，-i选项的含义是“忽略大小写”，如`grep -i "hello" file.txt`
可匹配Hello、HELLO等
