+++json
{
  "schemaVersion": "5",
  "id": "q-b04eecbfa5be0f56",
  "revision": 1,
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
    "issues": [
      "blank-positions-unresolved"
    ]
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
        "blanks": []
      },
      "solution": {
        "state": "available",
        "grading": "self",
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
      "issues": [
        "blank-positions-unresolved"
      ]
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
        "blanks": []
      },
      "solution": {
        "state": "available",
        "grading": "self",
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
      "issues": [
        "blank-positions-unresolved"
      ]
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
    /* 1 */
    readcnt++;
    if (readcnt == 1) /* First in */
      /* 2 */
    /* 3 */

    /* Reading happens here */

    /* 4 */
    readcnt--;
    if (readcnt == 0) /* Last out */
      /* 5 */
    /* 6 */
  }
}

void writer(void)
{
```


```c
  while (1) {
    /* 7 */

    /* Writing here */

    /* 8 */
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
sem_t r, w;                 // Initially /* 1 */
void reader(void)
{
  while (1) {
    /* 2 */
    P(&rmutex);
    readcnt++;
    /* 3 */
    V(&rmutex);
    /* 4 */

    /* Reading happens here */

    P(&rmutex);
    readcnt--;
    /* 5 */
    V(&rmutex);
  }
}

void writer(void)
{
  while (1) {
    P(&wmutex);
    writecnt++;
    /* 6 */
    V(&wmutex);

    P(&w);
    /* Writing here */
    V(&w);

    P(&wmutex);
    writecnt--;
    /* 7 */
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
