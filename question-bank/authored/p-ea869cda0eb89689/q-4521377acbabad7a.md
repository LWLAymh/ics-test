+++json
{
  "schemaVersion": "5",
  "id": "q-4521377acbabad7a",
  "revision": 2,
  "paperId": "p-ea869cda0eb89689",
  "paperOrder": 19,
  "number": {
    "display": "Problem C 1",
    "major": {
      "display": "Problem C",
      "value": "C"
    },
    "minor": {
      "display": "1",
      "value": "1"
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
      "legacyId": "q-4521377acbabad7a",
      "document": "原文/期中/2012期中-带答案.md",
      "lines": {
        "start": 255,
        "end": 359
      },
      "curated": "_curated/期中/2012期中-带答案/255.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "由汇编反推 C 代码：选择排序（含汇编清单与填空模板）"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "legacy-gap-0",
        "marker": "_____",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-1",
        "marker": "_____",
        "occurrence": 1,
        "width": "medium"
      },
      {
        "id": "legacy-gap-2",
        "marker": "_____",
        "occurrence": 2,
        "width": "medium"
      },
      {
        "id": "legacy-gap-3",
        "marker": "_____",
        "occurrence": 3,
        "width": "medium"
      },
      {
        "id": "legacy-gap-4",
        "marker": "_____",
        "occurrence": 4,
        "width": "medium"
      },
      {
        "id": "legacy-gap-5",
        "marker": "_____",
        "occurrence": 5,
        "width": "medium"
      },
      {
        "id": "legacy-gap-6",
        "marker": "_____",
        "occurrence": 6,
        "width": "medium"
      },
      {
        "id": "legacy-gap-7",
        "marker": "_____",
        "occurrence": 7,
        "width": "medium"
      },
      {
        "id": "legacy-gap-8",
        "marker": "_____",
        "occurrence": 8,
        "width": "medium"
      },
      {
        "id": "legacy-gap-9",
        "marker": "_____",
        "occurrence": 9,
        "width": "medium"
      },
      {
        "id": "legacy-gap-10",
        "marker": "_____",
        "occurrence": 10,
        "width": "medium"
      },
      {
        "id": "legacy-gap-11",
        "marker": "_____",
        "occurrence": 11,
        "width": "medium"
      },
      {
        "id": "legacy-gap-12",
        "marker": "_____",
        "occurrence": 12,
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
        "blankId": "legacy-gap-0",
        "method": "self"
      },
      {
        "blankId": "legacy-gap-1",
        "method": "self"
      },
      {
        "blankId": "legacy-gap-2",
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
      },
      {
        "blankId": "legacy-gap-7",
        "method": "self"
      },
      {
        "blankId": "legacy-gap-8",
        "method": "self"
      },
      {
        "blankId": "legacy-gap-9",
        "method": "self"
      },
      {
        "blankId": "legacy-gap-10",
        "method": "self"
      },
      {
        "blankId": "legacy-gap-11",
        "method": "self"
      },
      {
        "blankId": "legacy-gap-12",
        "method": "self"
      }
    ]
  }
}
+++
%%% stem
1. The function below is hand-written assembly code for a sorting algorithm. Fill in the blanks
   on the next page by converting this assembly to C code　**(13pts)**


```asm
	.globl mystery_sort	# exports the symbol so other .c files
				# can call the function

mystery_sort:
	jmp	loop1_check

loop1:
	xor	%rdx, %rdx
	mov	%rsi, %rcx
	jmp	loop2_check

loop2:
	mov	(%rdi, %rcx, 8), %rax
	cmp	%rax, (%rdi, %rdx, 8)
	jg	loop2_check
	mov	%rcx, %rdx

loop2_check:
	dec	%rcx
	test	%rcx, %rcx
	jnz	loop2

	dec	%rsi
	mov	(%rdi, %rsi, 8), %rax
	mov	(%rdi, %rdx, 8), %rcx
	mov	%rcx, (%rdi, %rsi, 8)
	mov	%rax, (%rdi, %rdx, 8)

loop1_check:
	test	%rsi, %rsi
	jnz	loop1

	ret
```




```c
void mystery_sort (long* array, long len)
{
    long a, b, tmp;
    while (_____ > _____)
    {
        a = _____;
        for (b = _____; b > _____; b--)
        {
            if (array[_____] > array[_____])
            {
                _____ = _____;
            }
        }

        len--;
        tmp = array[_____];
        array[_____] = array[_____];
        array[_____] = tmp;
    }
}
```
%%% reference
答案：参考 C 代码（原卷红色印刷）：

```c
void mystery_sort (long* array, long len)
{
    long a, b, tmp;
    while(len>0)
    {
        a = 0;
        for(b=len-1; b>0; b--)
        {
            if(array[b]>array[a])
            {
                a=b;
            }
        }
        len--;
        tmp = array[len];
        array[len] = array[a];
        array[a] = tmp;
    }
}
```
