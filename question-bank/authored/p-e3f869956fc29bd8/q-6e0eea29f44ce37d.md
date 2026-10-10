+++json
{
  "schemaVersion": "5",
  "id": "q-6e0eea29f44ce37d",
  "revision": 2,
  "paperId": "p-e3f869956fc29bd8",
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
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog",
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
      "legacyId": "q-11519e4dc5364b32",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 758,
        "end": 787
      },
      "curated": "_curated/期末/2018期末-带答案/758.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "i++ 对应的 x86-64 汇编代码"
    },
    {
      "legacyId": "q-c36c9b861c58b521",
      "document": "原文/期末/2018期末-带答案.md",
      "lines": {
        "start": 792,
        "end": 872
      },
      "curated": "_curated/期末/2018期末-带答案/792.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "i++/j++ 竞态的输出可能性与信号量死锁"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-11519e4dc5364b32",
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
        "machine_prog"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
                    {
            "id": "legacy-gap-1",
            "marker": "__",
            "occurrence": 1,
            "width": "medium"
          },
                    {
            "id": "legacy-gap-3",
            "marker": "__",
            "occurrence": 3,
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
            "blankId": "legacy-gap-1",
            "method": "self"
          },
                    {
            "blankId": "legacy-gap-3",
            "method": "self"
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-11519e4dc5364b32",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 758,
            "end": 787
          },
          "curated": "_curated/期末/2018期末-带答案/758.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "i++ 对应的 x86-64 汇编代码"
        }
      ],
      "issues": []
    },
    {
      "id": "q-c36c9b861c58b521",
      "number": {
        "display": "第七题 2-4",
        "major": {
          "display": "第七题",
          "value": "7"
        },
        "minor": {
          "display": "2-4",
          "value": null
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
                    {
            "id": "legacy-gap-1",
            "marker": "__",
            "occurrence": 1,
            "width": "medium"
          },
                    {
            "id": "legacy-gap-3",
            "marker": "__",
            "occurrence": 3,
            "width": "medium"
          },
          {
            "id": "legacy-gap-4",
            "marker": "_____",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "legacy-gap-5",
            "marker": "_________",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "legacy-gap-6",
            "marker": "__________",
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
            "blankId": "legacy-gap-1",
            "method": "self"
          },
                    {
            "blankId": "legacy-gap-3",
            "method": "self"
          },
          {
            "blankId": "legacy-gap-4",
            "method": "self"
          },
          {
            "blankId": "legacy-gap-5",
            "method": "self"
          },
          {
            "blankId": "legacy-gap-6",
            "method": "self"
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-c36c9b861c58b521",
          "document": "原文/期末/2018期末-带答案.md",
          "lines": {
            "start": 792,
            "end": 872
          },
          "curated": "_curated/期末/2018期末-带答案/792.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "i++/j++ 竞态的输出可能性与信号量死锁"
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

%%% part-stem: q-11519e4dc5364b32
第七题（10分）
给定如下程序：
```
#include <stdio.h>
#include <pthread.h>
int i = 0;
int j = 0;
void *do_stuff1(void * arg __attribute__((unused))) {
int a;
for (a = 0; a < 1000; a++)
{i++; j++;}
return NULL;
}
void *do_stuff2(void * arg __attribute__((unused))) {
int a;
for (a = 0; a < 1000; a++)
{j++; i++;}
return NULL;
}
int main() {
pthread_t tid1, tid2;
pthread_create(&tid1, NULL, do_stuff1, NULL);
pthread_create(&tid2, NULL, do_stuff2, NULL);
pthread_join(tid1, NULL);
pthread_join(tid2, NULL);
printf("%d, %d\n", i, j);
return 0;
}
```
1.  （2分）用以下元素的编号写出i++编译后的汇编代码。
`(a) mov   (b) add   (c) 0x601040   (d) %eax (e) $0x1`
比如，回答(a) (e) (d)表示`mov $0x1, %eax`
%%% part-reference: q-11519e4dc5364b32
1.  (a)(c)(d)
(b)(e)(d)
(a)(d)(c)
（写错任意一个不得分）
%%% part-stem: q-c36c9b861c58b521
2.  （4分）请回答该程序是否有可能输出如下结果，并简述原因。

    - (a) 2000, 2000
    - (b) 1500, 1500
    - (c) 1000, 1000
    - (d) 2, 2

3.  （2分）卜廷江同学在学习了信号量之后，决定要让程序能稳定输出2000, 2000，
于是对程序进行了如下改写。
```c
1.  #include <stdio.h>
2.  #include <pthread.h>
3.  int i = 0;
4.  int j = 0;
5.  sem_t si;
6.  sem_t sj;
7.  void *do_stuff1(void * arg __attribute__((unused))) {
    8.  int a;
    9.    for (a = 0; a < 1000; a++) {
        10. P(&si);
        11. P(&sj);
        12. i++;
        13. j++;
        14. V(&si);
        15. V(&sj);
        16. }
    17. return NULL;
    18. }
19. void *do_stuff2(void * arg __attribute__((unused))) {
    20. int a;
    21. for (a = 0; a < 1000; a++) {
        22. P(&sj);
        23. P(&si);
        24. j++;
        25. i++;
        26. V(&si);
        27. V(&sj);
        28. }
29. return NULL;
30. }
31. int main() {
32. pthread_t tid1, tid2;
33. Sem_init(&si, 0, 1);
34. Sem_init(&sj, 0, 1);
35. pthread_create(&tid1, NULL, do_stuff1, NULL);
36. pthread_create(&tid2, NULL, do_stuff2, NULL);
37. pthread_join(tid1, NULL);
38. pthread_join(tid2, NULL);
39. printf("%d\n", i);
40. return 0;
41. }
```
请问卜廷江同学的程序有什么潜在问题？为什么？
4.  （2 分）如果对卜廷江同学的程序改动一处数字来消除上述问题，同时仍然保
证输出结果稳定为2000, 2000，应该如何改动？
回答：将_____（填行号）行的_________（填数字）改为__________（填数字）。
%%% part-reference: q-c36c9b861c58b521
2.  (a) 可能，do_stuff俩函数全串行执行即可
(b) 可能，`do_stuff1`先执行了读取`i`的操作，然后`do_stuff2`执行500次循
环，接下来`do_stuff1`写回`i`完成该次循环，`i`变成1，`j`变成501。之后
`do_stuff2` 执行了读取 `j` 的操作，然后 `do_stuff1` 执行 500 次循环，接下来
`do_stuff2`完成该次循环，`i`变成501，`j`变成501。然后两个线程串行执行
剩下的499次循环即可。
(c) 不可能。可以证明程序结束时一定有`i+j>=2002`。只能当某线程先执行了
读i (j)操作，之后另一个线程执行了若干次i++ (j++)，然后`h`该线程执行
了写i (j)操作可以将另一个线程的i++ (j++)效果抵消掉。这个过程中，抵
消掉的加法次数一定不会多于执行的加法次数。同时，由于两个线程交错执行
i++和j++的顺序相反，所以头尾一定存在一次i++或j++无法被抵消，因此增
加的总次数大于等于2002。
(d) 不可能。理由同上。
（前一半对，后一半解释大致差不多得分，否则不得分。）
3.  死锁。两个线程分别执行到11行和23行时会发生。
4.  将33行或34行中的1改为任意大于2的数。（错任意一空不得分）
