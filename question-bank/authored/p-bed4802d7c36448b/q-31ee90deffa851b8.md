+++json
{
  "schemaVersion": "5",
  "id": "q-31ee90deffa851b8",
  "revision": 1,
  "paperId": "p-bed4802d7c36448b",
  "paperOrder": 18,
  "number": {
    "display": "第一题 18",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "18",
      "value": "18"
    },
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
      "legacyId": "q-31ee90deffa851b8",
      "document": "原文/期中/2023期中-带答案.md",
      "lines": {
        "start": 326,
        "end": 372
      },
      "curated": "_curated/期中/2023期中-带答案/326.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "磁盘访问时间：寻道、旋转延迟与传送时间"
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
      "A"
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
    },
    {
      "id": "E",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
18.假设一块32MB缓存、1TB容量的磁盘有如下配置：
```
Rotation rate = 7200 RPM,
Average seek time = 9 ms,
Average # sectors/track = 400
```
现磁头处在（Sector 0，Track 0）位置，请问访问（Sector 16，Track 1），
（Sector 48，Track 2），（Sector 32，Track 1），（Sector 16，Track 1）
最短需要花多长时间？（Track 0、1、2在一个zone内）

（修订：本题不计分、所有人都给分）
%%% reference
答案：A
正确答案：A
Transfer time of a sector costs 60 / 7200 x 1 / 400 x 1000
`ms/sec = 0.02 ms`
Rotation time of a sector costs 1 / 400 x (60 / 7200) x 1000
`ms/sec = 0.02 ms`
完成最短的访问时间，需要依次访问：（Sector 16，Track 1）（Sector 32，
Track 1）（Sector 48，Track 2），seek time x 2 + rotation time
x (16+16+16) + transfer time x 3 = 18 ms + 0.96 ms + 0.06 ms
= 19.02 ms。
错误答案：B 随便编了一个很小的数，11.3ms。
错误答案：C
依次访问：（Sector 16，Track 1）（Sector 48，Track 2）（Sector 32，
Track 1）（Sector 16，Track 1），seek time x 3 + rotation time
x (16 + 48 + 32 + 16) + transfer time x 3 = 27ms + 2.24ms +
`0.06ms = 29.3ms`。
错误答案：D
依次访问：（Sector 16，Track 1）（Sector 48，Track 2）（Sector 32，
Track 1）（Sector 16，Track 1），seek time x 3 + rotation time
x (400 + 400 + 16) + transfer time x 3 = 27ms + 16.32ms +
`0.06ms = 43.38ms`。
错误答案：E
依次访问：（Sector 16，Track 1）（Sector 48，Track 2）（Sector 32，
Track 1），seek time x 3 + rotation time x (400 + 32) + transfer
`time x 3 = 27ms + 8.64ms + 0.06ms = 35.7ms`。
%%% option: A
19.02 ms
%%% option: B
11.3 ms
%%% option: C
29.3 ms
%%% option: D
43.38 ms
%%% option: E
35.7 ms
