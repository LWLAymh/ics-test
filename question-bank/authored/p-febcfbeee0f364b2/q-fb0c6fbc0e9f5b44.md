+++json
{
  "schemaVersion": "5",
  "id": "q-fb0c6fbc0e9f5b44",
  "revision": 1,
  "paperId": "p-febcfbeee0f364b2",
  "paperOrder": 24,
  "number": {
    "display": "第8讲 24",
    "major": {
      "display": "第8讲",
      "value": null
    },
    "minor": {
      "display": "24",
      "value": "24"
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
      "legacyId": "q-fb0c6fbc0e9f5b44",
      "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
      "lines": {
        "start": 405,
        "end": 418
      },
      "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/405.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "缓冲区溢出攻击防御方法对比（兼 VM 保护机制）"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "q24-aslr-source",
        "marker": "{{blank:q24-aslr-source}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-aslr-recompile",
        "marker": "{{blank:q24-aslr-recompile}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-aslr-hardware",
        "marker": "{{blank:q24-aslr-hardware}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-nx-source",
        "marker": "{{blank:q24-nx-source}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-nx-recompile",
        "marker": "{{blank:q24-nx-recompile}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-nx-hardware",
        "marker": "{{blank:q24-nx-hardware}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-canary-source",
        "marker": "{{blank:q24-canary-source}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-canary-recompile",
        "marker": "{{blank:q24-canary-recompile}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q24-canary-hardware",
        "marker": "{{blank:q24-canary-hardware}}",
        "occurrence": 0,
        "width": "medium"
      }
    ]
  },
  "solution": {
    "state": "available",
    "grading": "blanks",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    },
    "blankAnswers": [
      {
        "blankId": "q24-aslr-source",
        "method": "exact",
        "acceptedAnswers": [
          "否"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-aslr-recompile",
        "method": "exact",
        "acceptedAnswers": [
          "否"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-aslr-hardware",
        "method": "exact",
        "acceptedAnswers": [
          "否"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-nx-source",
        "method": "exact",
        "acceptedAnswers": [
          "否"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-nx-recompile",
        "method": "exact",
        "acceptedAnswers": [
          "否"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-nx-hardware",
        "method": "exact",
        "acceptedAnswers": [
          "是"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-canary-source",
        "method": "exact",
        "acceptedAnswers": [
          "否"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-canary-recompile",
        "method": "exact",
        "acceptedAnswers": [
          "是"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q24-canary-hardware",
        "method": "exact",
        "acceptedAnswers": [
          "否"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      }
    ]
  }
}
+++
%%% stem
24.课上讲授了防御或者避免缓冲区攻击的几种主要方法，分析它们的特点。以普遍性情况
为准，不用考虑少见的软硬件需求。（每行算作一空）
| 方法 | 是否需要修改用户程序源代码？ | 是否需要重新编译用户程序？ | 是否需要更换新的 CPU 硬件？ |
| --- | --- | --- | --- |
| 使用 `fgets()` 等安全的库函数 | 是 | 是 | 否 |
| 栈初始位置随机化 | {{blank:q24-aslr-source}} | {{blank:q24-aslr-recompile}} | {{blank:q24-aslr-hardware}} |
| 在内存访问权限上设置“可执行”位 | {{blank:q24-nx-source}} | {{blank:q24-nx-recompile}} | {{blank:q24-nx-hardware}} |
| “金丝雀”（哨兵）机制 | {{blank:q24-canary-source}} | {{blank:q24-canary-recompile}} | {{blank:q24-canary-hardware}} |
%%% reference
| 方法 | 是否需要修改用户程序源代码？ | 是否需要重新编译用户程序？ | 是否需要更换新的 CPU 硬件？ |
| --- | --- | --- | --- |
| 使用 `fgets()` 等安全的库函数 | 是 | 是 | 否 |
| 栈初始位置随机化 | 否 | 否 | 否 |
| 在内存访问权限上设置“可执行”位 | 否 | 否 | 是 |
| “金丝雀”（哨兵）机制 | 否 | 是 | 否 |
