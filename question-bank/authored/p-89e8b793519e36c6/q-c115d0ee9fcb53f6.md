+++json
{
  "schemaVersion": "5",
  "id": "q-c115d0ee9fcb53f6",
  "revision": 2,
  "paperId": "p-89e8b793519e36c6",
  "paperOrder": 3,
  "number": {
    "display": "选择题 3",
    "major": {
      "display": "选择题",
      "value": null
    },
    "minor": {
      "display": "3",
      "value": "3"
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
      "legacyId": "q-c115d0ee9fcb53f6",
      "document": "原文/期中/2015期中-带答案.md",
      "lines": {
        "start": 65,
        "end": 78
      },
      "curated": "_curated/期中/2015期中-带答案/65.md",
      "aliases": [
        "原文/期末/2015期末-20151109-带答案.md"
      ],
      "provenance": "rewritten",
      "editorNote": "C90 类型转换顺序与 INT_MIN"
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
3.  在32位平台上，按C90标准以下语句中，结果为假的是

使用ILP32：`int`、`long` 和对应无符号类型均32位；超范围无符号整数转为 `int` 时采用本题平台的低32位补码解释规则。无后缀十进制常量按严格C90的候选类型处理，不使用编译器的扩展 `long long` 规则。
%%% reference
答案：B。无后缀十进制常量2147483648不能由32位int或long表示，按C90选为unsigned long；前面的负号是一元运算，并不属于常量自身。取负后仍为无符号2147483648，与2147483647比较为假。C把这个位模式转换为本题平台的int后得到INT_MIN，比较为真。

参考信息（原卷红字）：
C90无后缀十进制整数常量的候选顺序：int → long int → unsigned long int；不能把十六进制常量的候选序列混入此处。现代C99及以后候选可包括long long，不能直接用现代默认编译结果判本题。
$2^{31}=2147483648$
%%% option: A
`return INT_MIN < INT_MAX;`
%%% option: B
`return -2147483648 < 2147483647;`
%%% option: C
`int a = -2147483648; return a < 2147483647;`
%%% option: D
`return -2147483647-1 < 2147483647;`
