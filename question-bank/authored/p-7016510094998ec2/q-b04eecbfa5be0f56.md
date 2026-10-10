+++json
{
  "schemaVersion": "5",
  "id": "q-b04eecbfa5be0f56",
  "revision": 2,
  "paperId": "p-7016510094998ec2",
  "paperOrder": 21,
  "number": {
    "display": "第七题",
    "major": {
      "display": "第七题",
      "value": "7"
    },
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "concurrent_programming",
    "moduleIds": [
      "concurrent_programming"
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
      "legacyId": "q-51ff2770273733c0",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 645,
        "end": 685
      },
      "curated": "_curated/期末/2022期末-无答案/645.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "第一类读者-写者（读者优先）信号量 P/V 填空"
    },
    {
      "legacyId": "q-f83ca79637ff66b3",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 687,
        "end": 730
      },
      "curated": "_curated/期末/2022期末-无答案/687.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "第二类读者-写者（写者优先）信号量 P/V 填空"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-51ff2770273733c0",
      "number": {
        "display": "第七题 1",
        "major": {
          "display": "第七题",
          "value": "7"
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "concurrent_programming"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {"id":"r1","marker":"{{blank:r1}}","occurrence":0,"width":"medium","label":"读者优先空 1"},
          {"id":"r2","marker":"{{blank:r2}}","occurrence":0,"width":"medium","label":"读者优先空 2"},
          {"id":"r3","marker":"{{blank:r3}}","occurrence":0,"width":"medium","label":"读者优先空 3"},
          {"id":"r4","marker":"{{blank:r4}}","occurrence":0,"width":"medium","label":"读者优先空 4"},
          {"id":"r5","marker":"{{blank:r5}}","occurrence":0,"width":"medium","label":"读者优先空 5"},
          {"id":"r6","marker":"{{blank:r6}}","occurrence":0,"width":"medium","label":"读者优先空 6"},
          {"id":"r7","marker":"{{blank:r7}}","occurrence":0,"width":"medium","label":"读者优先空 7"},
          {"id":"r8","marker":"{{blank:r8}}","occurrence":0,"width":"medium","label":"读者优先空 8"}
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
          {"blankId":"r1","method":"exact","acceptedAnswers":["P(&mutex);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"r2","method":"exact","acceptedAnswers":["P(&w);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"r3","method":"exact","acceptedAnswers":["V(&mutex);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"r4","method":"exact","acceptedAnswers":["P(&mutex);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"r5","method":"exact","acceptedAnswers":["V(&w);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"r6","method":"exact","acceptedAnswers":["V(&mutex);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"r7","method":"exact","acceptedAnswers":["P(&w);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"r8","method":"exact","acceptedAnswers":["V(&w);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}
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
          "legacyId": "q-51ff2770273733c0",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 645,
            "end": 685
          },
          "curated": "_curated/期末/2022期末-无答案/645.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "第一类读者-写者（读者优先）信号量 P/V 填空"
        }
      ],
      "issues": []
    },
    {
      "id": "q-f83ca79637ff66b3",
      "number": {
        "display": "第七题 2",
        "major": {
          "display": "第七题",
          "value": "7"
        },
        "minor": {
          "display": "2",
          "value": "2"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "concurrent_programming"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {"id":"w1","marker":"{{blank:w1}}","occurrence":0,"width":"short","label":"w 信号量初值"},
          {"id":"w2","marker":"{{blank:w2}}","occurrence":0,"width":"medium","label":"写者优先空 2"},
          {"id":"w3","marker":"{{blank:w3}}","occurrence":0,"width":"long","label":"写者优先空 3"},
          {"id":"w4","marker":"{{blank:w4}}","occurrence":0,"width":"medium","label":"写者优先空 4"},
          {"id":"w5","marker":"{{blank:w5}}","occurrence":0,"width":"long","label":"写者优先空 5"},
          {"id":"w6","marker":"{{blank:w6}}","occurrence":0,"width":"long","label":"写者优先空 6"},
          {"id":"w7","marker":"{{blank:w7}}","occurrence":0,"width":"long","label":"写者优先空 7"}
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
          {"blankId":"w1","method":"exact","acceptedAnswers":["1"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"w2","method":"exact","acceptedAnswers":["P(&r);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"w3","method":"exact","acceptedAnswers":["if (readcnt == 1) P(&w);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"w4","method":"exact","acceptedAnswers":["V(&r);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"w5","method":"exact","acceptedAnswers":["if (readcnt == 0) V(&w);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"w6","method":"exact","acceptedAnswers":["if (writecnt == 1) P(&r);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
          {"blankId":"w7","method":"exact","acceptedAnswers":["if (writecnt == 0) V(&r);"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}
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
          "legacyId": "q-f83ca79637ff66b3",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 687,
            "end": 730
          },
          "curated": "_curated/期末/2022期末-无答案/687.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "第二类读者-写者（写者优先）信号量 P/V 填空"
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

%%% part-stem: q-51ff2770273733c0
1、第一类读者-写者问题（读者优先：总是给读者优先权，只要写者当前没有进行写操作，读者就能获得访问权；这种情况存在于读者很多，写者不经常更新的时候使用）

```c
int readcnt;    /* Initially 0 */
sem_t mutex, w; /* Both initially 1 */

void reader(void)
{
  while (1) {
    /* {{blank:r1}} */
    readcnt++;
    if (readcnt == 1) /* First in */
      /* {{blank:r2}} */
    /* {{blank:r3}} */

    /* Reading happens here */

    /* {{blank:r4}} */
    readcnt--;
    if (readcnt == 0) /* Last out */
      /* {{blank:r5}} */
    /* {{blank:r6}} */
  }
}

void writer(void)
{
```


```c
  while (1) {
    /* {{blank:r7}} */

    /* Writing here */

    /* {{blank:r8}} */
  }
}
```
%%% part-reference: q-51ff2770273733c0
答案：
/* 1 */ P(&mutex);
/* 2 */ P(&w);
/* 3 */ V(&mutex);
/* 4 */ P(&mutex);
/* 5 */ V(&w);
/* 6 */ V(&mutex);
/* 7 */ P(&w);
/* 8 */ V(&w);
%%% part-stem: q-f83ca79637ff66b3
2、第二类读者-写者问题（写者优先：写者具有优先权，将后来的读者延迟到所有等待的或活动的写者都完成为止；这种情况存在于经常更新的系统，而读者的目的是获取最新的数据）

```c
int readcnt, writecnt;      // Initially 0
sem_t rmutex, wmutex;       // Initially 1
sem_t r, w;                 // Initially /* {{blank:w1}} */
void reader(void)
{
  while (1) {
    /* {{blank:w2}} */
    P(&rmutex);
    readcnt++;
    /* {{blank:w3}} */
    V(&rmutex);
    /* {{blank:w4}} */

    /* Reading happens here */

    P(&rmutex);
    readcnt--;
    /* {{blank:w5}} */
    V(&rmutex);
  }
}

void writer(void)
{
  while (1) {
    P(&wmutex);
    writecnt++;
    /* {{blank:w6}} */
    V(&wmutex);

    P(&w);
    /* Writing here */
    V(&w);

    P(&wmutex);
    writecnt--;
    /* {{blank:w7}} */
    V(&wmutex);
  }
}
```
%%% part-reference: q-f83ca79637ff66b3
答案：
/* 1 */ 1
/* 2 */ P(&r);
`/* 3 */ if (readcnt == 1) P(&w)`;
/* 4 */ V(&r);
`/* 5 */ if (readcnt == 0) V(&w)`;
`/* 6 */ if (writecnt == 1) P(&r)`;
`/* 7 */ if (writecnt == 0) V(&r)`;
