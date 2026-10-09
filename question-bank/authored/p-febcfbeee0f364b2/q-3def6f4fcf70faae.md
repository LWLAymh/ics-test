+++json
{
  "schemaVersion": "5",
  "id": "q-3def6f4fcf70faae",
  "revision": 1,
  "paperId": "p-febcfbeee0f364b2",
  "paperOrder": 1,
  "number": {
    "display": "第2讲 1",
    "major": {
      "display": "第2讲",
      "value": null
    },
    "minor": {
      "display": "1",
      "value": "1"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "data_representation",
    "moduleIds": [
      "data_representation"
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
      "legacyId": "q-3def6f4fcf70faae",
      "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
      "lines": {
        "start": 50,
        "end": 54
      },
      "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/50.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "二进制转十进制/十六进制、按位与、逻辑非"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "q1-a-decimal",
        "marker": "{{blank:q1-a-decimal}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q1-b-hex",
        "marker": "{{blank:q1-b-hex}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q1-and",
        "marker": "{{blank:q1-and}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q1-not",
        "marker": "{{blank:q1-not}}",
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
        "blankId": "q1-a-decimal",
        "method": "exact",
        "acceptedAnswers": [
          "181"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q1-b-hex",
        "method": "exact",
        "acceptedAnswers": [
          "0x5C",
          "5C"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q1-and",
        "method": "exact",
        "acceptedAnswers": [
          "0x14",
          "14"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q1-not",
        "method": "exact",
        "acceptedAnswers": [
          "0x01",
          "0x1",
          "01",
          "1"
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
1. 两个 8 位二进制数 `10110101` 和 `01011100`，分别记为 `a` 和 `b`。问：

（1）`a` 转换为十进制表示为：{{blank:q1-a-decimal}}

（2）`b` 转换为十六进制表示为：{{blank:q1-b-hex}}

（3）`a` 和 `b` 按位与操作，`a & b`（用十六进制表示）：{{blank:q1-and}}

（4）用 C 语言中的“非”操作，`!!b`（用十六进制表示）：{{blank:q1-not}}
%%% reference
答案：

（1）`181`

（2）`0x5C`

（3）`0x14`

（4）`0x01`
