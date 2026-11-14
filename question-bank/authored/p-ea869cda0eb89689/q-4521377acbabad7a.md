+++json
{
  "schemaVersion": "5",
  "id": "q-4521377acbabad7a",
  "revision": 4,
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
        "marker": "{{blank:legacy-gap-0}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-1",
        "marker": "{{blank:legacy-gap-1}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-2",
        "marker": "{{blank:legacy-gap-2}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-3",
        "marker": "{{blank:legacy-gap-3}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-4",
        "marker": "{{blank:legacy-gap-4}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-5",
        "marker": "{{blank:legacy-gap-5}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-6",
        "marker": "{{blank:legacy-gap-6}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-7",
        "marker": "{{blank:legacy-gap-7}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-8",
        "marker": "{{blank:legacy-gap-8}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-9",
        "marker": "{{blank:legacy-gap-9}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-10",
        "marker": "{{blank:legacy-gap-10}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-11",
        "marker": "{{blank:legacy-gap-11}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-12",
        "marker": "{{blank:legacy-gap-12}}",
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
        "blankId": "legacy-gap-0",
        "method": "exact", "acceptedAnswers": ["len"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-1",
        "method": "exact", "acceptedAnswers": ["0"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-2",
        "method": "exact", "acceptedAnswers": ["0"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-3",
        "method": "exact", "acceptedAnswers": ["len-1"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-4",
        "method": "exact", "acceptedAnswers": ["0"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-5",
        "method": "exact", "acceptedAnswers": ["b"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-6",
        "method": "exact", "acceptedAnswers": ["a"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-7",
        "method": "exact", "acceptedAnswers": ["a"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-8",
        "method": "exact", "acceptedAnswers": ["b"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-9",
        "method": "exact", "acceptedAnswers": ["len"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-10",
        "method": "exact", "acceptedAnswers": ["len"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-11",
        "method": "exact", "acceptedAnswers": ["a"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      },
      {
        "blankId": "legacy-gap-12",
        "method": "exact", "acceptedAnswers": ["a"],
        "normalize": {"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
      }
    ]
  }
}
+++
%%% stem
1. The function below is hand-written assembly code for a sorting algorithm. Fill in the blanks
   on the next page by converting this assembly to C code　**(13pts)**

Assume `len >= 0` and all array elements are distinct. Fill only the missing identifiers or expressions, using `a` and `b` for the shown loop variables. This restriction makes the original strict `>` C template agree with the assembly's tie handling.


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
    while ({{blank:legacy-gap-0}} > {{blank:legacy-gap-1}})
    {
        a = {{blank:legacy-gap-2}};
        for (b = {{blank:legacy-gap-3}}; b > {{blank:legacy-gap-4}}; b--)
        {
            if (array[{{blank:legacy-gap-5}}] > array[{{blank:legacy-gap-6}}])
            {
                {{blank:legacy-gap-7}} = {{blank:legacy-gap-8}};
            }
        }

        len--;
        tmp = array[{{blank:legacy-gap-9}}];
        array[{{blank:legacy-gap-10}}] = array[{{blank:legacy-gap-11}}];
        array[{{blank:legacy-gap-12}}] = tmp;
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
