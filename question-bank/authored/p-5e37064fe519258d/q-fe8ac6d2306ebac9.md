+++json
{
  "schemaVersion": "5",
  "id": "q-fe8ac6d2306ebac9",
  "revision": 1,
  "paperId": "p-5e37064fe519258d",
  "paperOrder": 16,
  "number": {
    "display": "第二题",
    "major": {
      "display": "第二题",
      "value": "2"
    },
    "minor": null,
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
      "legacyId": "q-fe8ac6d2306ebac9",
      "document": "原文/期中/2017期中-带答案.md",
      "lines": {
        "start": 202,
        "end": 219
      },
      "curated": "_curated/期中/2017期中-带答案/202.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "9 位浮点格式 A 的字段、最值与精度"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "format-fields",
        "marker": "{{blank:format-fields}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "denormalized-bits",
        "marker": "{{blank:denormalized-bits}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "denormalized-value",
        "marker": "{{blank:denormalized-value}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "min-normal-bits",
        "marker": "{{blank:min-normal-bits}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "min-normal-value",
        "marker": "{{blank:min-normal-value}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "max-normal-bits",
        "marker": "{{blank:max-normal-bits}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "max-normal-value",
        "marker": "{{blank:max-normal-value}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "real-count-change",
        "marker": "{{blank:real-count-change}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "precision-change",
        "marker": "{{blank:precision-change}}",
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
        "blankId": "format-fields",
        "method": "exact",
        "acceptedAnswers": [
          "k = 4，n = 4",
          "k=4, n=4"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "denormalized-bits",
        "method": "exact",
        "acceptedAnswers": [
          "0 0000 1111"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "denormalized-value",
        "method": "exact",
        "acceptedAnswers": [
          "15/1024"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "min-normal-bits",
        "method": "exact",
        "acceptedAnswers": [
          "0 0001 0000"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "min-normal-value",
        "method": "exact",
        "acceptedAnswers": [
          "1/64"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "max-normal-bits",
        "method": "exact",
        "acceptedAnswers": [
          "0 1110 1111"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "max-normal-value",
        "method": "exact",
        "acceptedAnswers": [
          "248"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "real-count-change",
        "method": "exact",
        "acceptedAnswers": [
          "增加"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "precision-change",
        "method": "exact",
        "acceptedAnswers": [
          "降低"
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
第二题（15分）
考虑有一种基于IEEE浮点格式的9位浮点表示格式A。格式A有1个符号位，k
个阶码位，n 个小数位。现在已知 $−9/16$ 的位模式可以表示为“101100010”，请回答
以下问题：（注：阶码偏移量为 $2^{k−1}-1$）
1.  求k和n的值。（1分）{{blank:format-fields}}
2.  基于格式A，请填写下表。值的表示可以写成整数（如16），或者写成分数（如
17/64）。（注:每格2分）
| 描述 | 二进制位表示 | 值 |
| --- | --- | --- |
| 最大的非规格化数 | {{blank:denormalized-bits}} | {{blank:denormalized-value}} |
| 最小的正规格化数 | {{blank:min-normal-bits}} | {{blank:min-normal-value}} |
| 最大的规格化数 | {{blank:max-normal-bits}} | {{blank:max-normal-value}} |
3.  假设格式A变为1个符号位，k+1个阶码位，n-1个小数位，那么能表示的
实数数量会怎样变化，数值的精度会怎样变化？（回答增加、降低或不变即
可）（2分）实数数量：{{blank:real-count-change}}；数值精度：{{blank:precision-change}}。
%%% reference
答案：1. k = 4，n = 4
2. 最大的非规格化数：`0 0000 1111`，值 15/1024；最小的正规格化数：`0 0001 0000`，值 1/64；最大的规格化数：`0 1110 1111`，值 248
3. 小数位变少后，NaN 的数量减少了，所以实数数量增加（1 分），数值精度降低（1 分）。
