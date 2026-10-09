+++json
{
  "schemaVersion": "5",
  "id": "q-f2bd165c7fbed479",
  "revision": 1,
  "paperId": "p-662d741f28b2bed0",
  "paperOrder": 15,
  "number": {
    "display": "第一题 15",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "15",
      "value": "15"
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
      "legacyId": "q-f2bd165c7fbed479",
      "document": "原文/期中/2016期中-带答案.md",
      "lines": {
        "start": 156,
        "end": 162
      },
      "curated": "_curated/期中/2016期中-带答案/156.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "unsigned short 转 int 零扩展"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "y",
        "marker": "{{blank:y}}",
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
        "blankId": "y",
        "method": "exact",
        "acceptedAnswers": [
          "0000FFFA",
          "0x0000FFFA",
          "0000fffa",
          "0x0000fffa"
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
15. 假定编译器规定`int`和`short`型长度分别为32位和16位，执行下列语句：
`unsigned short x = 65530`;
`unsigned int y = x`;
得到y的机器数为 {{blank:y}}。（用16进制表示，勿省略前导的0）
%%% reference
答案：0000FFFA
解析：x的机器数是FFFA
      y的机器数是0000FFFA，注意无符号数使用零扩展
