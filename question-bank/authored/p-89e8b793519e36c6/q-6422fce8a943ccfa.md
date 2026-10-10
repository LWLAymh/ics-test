+++json
{
  "schemaVersion": "5",
  "id": "q-6422fce8a943ccfa",
  "revision": 3,
  "paperId": "p-89e8b793519e36c6",
  "paperOrder": 26,
  "number": {
    "display": "第五题",
    "major": {
      "display": "第五题",
      "value": "5"
    },
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "memory_hierarchy",
    "moduleIds": [
      "memory_hierarchy"
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
      "legacyId": "q-6acdab44e2b32dd2",
      "document": "原文/期中/2015期中-带答案.md",
      "lines": {
        "start": 595,
        "end": 627
      },
      "curated": "_curated/期中/2015期中-带答案/595.md",
      "aliases": [
        "原文/期末/2015期末-20151109-带答案.md"
      ],
      "provenance": "rewritten",
      "editorNote": "组相连 Cache 失效次数与最终状态"
    },
    {
      "legacyId": "q-80c11cfc4df40242",
      "document": "原文/期中/2015期中-带答案.md",
      "lines": {
        "start": 633,
        "end": 655
      },
      "curated": "_curated/期中/2015期中-带答案/633.md",
      "aliases": [
        "原文/期末/2015期末-20151109-带答案.md"
      ],
      "provenance": "rewritten",
      "editorNote": "全相联 Cache 的 tag/失效次数与状态"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-6acdab44e2b32dd2",
      "number": {
        "display": "第五题 1",
        "major": {
          "display": "第五题",
          "value": "5"
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "memory_hierarchy"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
        {"id": "miss-1a", "marker": "{{blank:miss-1a}}", "occurrence": 0, "width": "short"},
        {"id": "miss-1b", "marker": "{{blank:miss-1b}}", "occurrence": 0, "width": "short"},
        {"id": "desc-1", "marker": "{{blank:desc-1}}", "occurrence": 0, "width": "short"},
        {"id": "miss-1c", "marker": "{{blank:miss-1c}}", "occurrence": 0, "width": "short"},
        {"id": "state-1", "marker": "{{blank:state-1}}", "occurrence": 0, "width": "long"}
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
        {"blankId": "miss-1a", "method": "exact", "acceptedAnswers": ["4", "4次", "4 次"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "miss-1b", "method": "exact", "acceptedAnswers": ["16", "16次", "16 次"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "desc-1", "method": "exact", "acceptedAnswers": ["A", "A）", "a"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "miss-1c", "method": "exact", "acceptedAnswers": ["14", "14次", "14 次"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "state-1", "method": "self"}
        ],
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "unknown",
          "crossChecked": null,
          "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
        }
      },
      "sources": [
        {
          "legacyId": "q-6acdab44e2b32dd2",
          "document": "原文/期中/2015期中-带答案.md",
          "lines": {
            "start": 595,
            "end": 627
          },
          "curated": "_curated/期中/2015期中-带答案/595.md",
          "aliases": [
            "原文/期末/2015期末-20151109-带答案.md"
          ],
          "provenance": "rewritten",
          "editorNote": "组相连 Cache 失效次数与最终状态"
        }
      ],
      "issues": []
    },
    {
      "id": "q-80c11cfc4df40242",
      "number": {
        "display": "第五题 2",
        "major": {
          "display": "第五题",
          "value": "5"
        },
        "minor": {
          "display": "2",
          "value": "2"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "memory_hierarchy"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
        {"id": "tag-bits", "marker": "{{blank:tag-bits}}", "occurrence": 0, "width": "short"},
        {"id": "miss-2a", "marker": "{{blank:miss-2a}}", "occurrence": 0, "width": "short"},
        {"id": "miss-2b", "marker": "{{blank:miss-2b}}", "occurrence": 0, "width": "short"},
        {"id": "desc-2", "marker": "{{blank:desc-2}}", "occurrence": 0, "width": "short"},
        {"id": "state-2", "marker": "{{blank:state-2}}", "occurrence": 0, "width": "long"}
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
        {"blankId": "tag-bits", "method": "exact", "acceptedAnswers": ["6", "6位", "6 位"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "miss-2a", "method": "exact", "acceptedAnswers": ["4", "4次", "4 次"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "miss-2b", "method": "exact", "acceptedAnswers": ["4", "4次", "4 次"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "desc-2", "method": "exact", "acceptedAnswers": ["C", "C）", "c"], "normalize": {"trimWhitespace": true, "caseSensitive": false}},
        {"blankId": "state-2", "method": "self"}
        ],
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "unknown",
          "crossChecked": null,
          "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
        }
      },
      "sources": [
        {
          "legacyId": "q-80c11cfc4df40242",
          "document": "原文/期中/2015期中-带答案.md",
          "lines": {
            "start": 633,
            "end": 655
          },
          "curated": "_curated/期中/2015期中-带答案/633.md",
          "aliases": [
            "原文/期末/2015期末-20151109-带答案.md"
          ],
          "provenance": "rewritten",
          "editorNote": "全相联 Cache 的 tag/失效次数与状态"
        }
      ],
      "issues": []
    }
  ],
  "solution": {
    "state": "available",
    "grading": "parts",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null
    }
  }
}
+++
%%% stem

%%% reference

%%% part-stem: q-6acdab44e2b32dd2
第五题（20分）
 (每个填空和选择1分，表格每相邻两格1分)

1.仔细阅读下面的程序，根据条件回答下列各题（10分）
•  地址宽度为7，数组的起始地址为`0x1000000`
•  `Block Size = 4 Byte`，`Set = 4`，两路组相连.
•  替换算法为 LRU（最近最少使用）
```
#define LENGTH 8
void clear4x4 ( char array[LENGTH][LENGTH] )  {
  int row, col ;
  for ( col = 0 ; col < 4; col++ ) {
    for ( row = 0; row < 4 ; row++ ) {
      array[ row] [ col] = 0;
    }
  }
}
```
1)  以上程序执行会引起多少次失效？{{blank:miss-1a}}

2)  如果`LENGTH`改为16，会引起多少次失效？{{blank:miss-1b}}

3)  如果`LENGTH`变为17，与2)相比，下面描述正确的是：{{blank:desc-1}}，会引起 {{blank:miss-1c}} 次失效。

A） 16×16 比17×17产生更多的失效次数

B） 16×16 和17×17产生的失效次数相同

C） 16×16 比17×17产生更少的失效次数

4)  请画出3）运行后cache中set0和set1的最终状态。{{blank:state-1}}
%%% part-reference: q-6acdab44e2b32dd2
答案：1) 4 次失效
2) 16 次失效
3) A；会引起 14 次失效
4) 3) 运行后 cache 的最终状态：

|  | V | Tag | Data | V | Tag | Data |
| --- | --- | --- | --- | --- | --- | --- |
| set0 | 1 | 101 | `Array[1][0]~Array[1][3]` | 1 | 100 | `Array[0][0]~Array[0][3]` |
| set1 | 1 | 110 | `Array[2][0]~Array[2][3]` | 1 | 111 | `Array[3][0]~Array[3][3]` |
%%% part-stem: q-80c11cfc4df40242
2.改变假设条件，回答下列各题（10分）
•  地址宽度为8，数组的起始地址为`0x10000000`
•  Cache容量为16 Byte，`Block Size = 4 Byte`，全相联Cache
•  替换算法为 LRU（最近最少使用）
1)  Tag的位数为 {{blank:tag-bits}}

2)  如果执行上述程序，当`LENGTH=8`时，会引起多少次失效？{{blank:miss-2a}}

3)  如果`LENGTH`改为16，会引起多少次失效？{{blank:miss-2b}}

4)  如果`LENGTH`变为17，与3)相比，下面描述正确的是：{{blank:desc-2}}

A） 16×16 比17×17产生更多的失效次数

B） 16×16 和17×17产生的失效次数相同

C） 16×16 比17×17产生更少的失效次数

5)  请画出4）执行后cache的最终状态{{blank:state-2}}
%%% part-reference: q-80c11cfc4df40242
答案：1) Tag 的位数为 6
2) `LENGTH=8` 时，会引起 4 次失效
3) `LENGTH` 改为 16 时，会引起 4 次失效
4) C（16×16 比 17×17 产生更少的失效次数）
5) 4) 执行后 cache 的最终状态：

| | V | Tag | Data |
| --- | --- | --- | --- |
| | 1 | 100000 | `Array[0][0]~Array[0][3]` |
| | 1 | 100101 | `Array[1][0]~Array[1][3]` |
| | 1 | 101001 | `Array[2][0]~Array[2][3]` |
| | 1 | 101101 | `Array[3][0]~Array[3][3]` |
