+++json
{
  "schemaVersion": "5",
  "id": "q-cab4d99a8340fede",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 19,
  "number": {
    "display": "Lab 任务 19",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "19",
      "value": "19"
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
      "legacyId": "q-cab4d99a8340fede",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 311,
        "end": 358
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/311.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "BombLab phase_2 反汇编（数列递推）分析"
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
    },
    "correctOptionIds": [
      "D"
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
19. （2分）下面是 `phase_2` 函数的反汇编代码。下列哪个输入不会使 `bomb` 爆炸？
```asm
00000000000027bc <phase_2>:
    27bc:  f3 0f 1e fa           endbr64
    27c0:  53                    push   %rbx
    27c1:  48 83 ec 20           sub    $0x20,%rsp
    27c5:  64 48 8b 04 25 28 00  mov    %fs:0x28,%rax
    27cc:  00 00
    27ce:  48 89 44 24 18        mov    %rax,0x18(%rsp)
    27d3:  31 c0                 xor    %eax,%eax
    27d5:  48 89 e6              mov    %rsp,%rsi
    27d8:  e8 d0 06 00 00        call   2ead <read_six_numbers>
    27dd:  83 3c 24 00           cmpl   $0x0,(%rsp)
    27e1:  78 07                 js     27ea <phase_2+0x2e>
    27e3:  bb 01 00 00 00        mov    $0x1,%ebx
    27e8:  eb 0a                 jmp    27f4 <phase_2+0x38>
    27ea:  e8 92 06 00 00        call   2e81 <explode_bomb>
    27ef:  eb f2                 jmp    27e3 <phase_2+0x27>
    27f1:  83 c3 01              add    $0x1,%ebx
    27f4:  83 fb 05              cmp    $0x5,%ebx
    27f7:  7f 1c                 jg     2815 <phase_2+0x59>
    27f9:  48 63 c3              movslq %ebx,%rax
    27fc:  8d 53 ff              lea    -0x1(%rbx),%edx
    27ff:  48 63 d2              movslq %edx,%rdx
    2802:  8b 14 94              mov    (%rsp,%rdx,4),%edx
    2805:  8d 54 12 ff           lea    -0x1(%rdx,%rdx,1),%edx
    2809:  39 14 84              cmp    %edx,(%rsp,%rax,4)
    280c:  74 e3                 je     27f1 <phase_2+0x35>
    280e:  e8 6e 06 00 00        call   2e81 <explode_bomb>
    2813:  eb dc                 jmp    27f1 <phase_2+0x35>
    2815:  48 8b 44 24 18        mov    0x18(%rsp),%rax
    281a:  64 48 2b 04 25 28 00  sub    %fs:0x28,%rax
    2821:  00 00
    2823:  75 06                 jne    282b <phase_2+0x6f>
    2825:  48 83 c4 20           add    $0x20,%rsp
    2829:  5b                    pop    %rbx
    282a:  c3                    ret
    282b:  e8 60 fa ff ff        call   2290 <__stack_chk_fail@plt>
```
%%% reference
答案：D

解析：先要求 `a[0] >= 0`（`cmpl $0x0,(%rsp)` 之后是 `js explode_bomb`），再对 `i = 1..5` 要求 `a[i] = 2*a[i-1] - 1`。逐项代入，只有 D 的 `2 3 5 9 17 33` 满足完整递推，因此不会爆炸。

> 勘误：原题题面漏印了“不”字。若按“使 `bomb` 爆炸”理解，A、B、C 都会爆炸，题目便没有唯一答案；此处按单选题本意修正为“不会使 `bomb` 爆炸”。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
`0 1 1 2 3 5`
%%% option: B
`0 1 1 3 5 11`
%%% option: C
`2 3 5 8 12 17`
%%% option: D
`2 3 5 9 17 33`
