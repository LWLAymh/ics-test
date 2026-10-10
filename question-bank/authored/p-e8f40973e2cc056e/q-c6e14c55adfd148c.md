+++json
{
  "schemaVersion": "5",
  "id": "q-c6e14c55adfd148c",
  "revision": 2,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 7,
  "number": {
    "display": "一 7",
    "major": {
      "display": "一",
      "value": null
    },
    "minor": {
      "display": "7",
      "value": "7"
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
      "legacyId": "q-c6e14c55adfd148c",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 130,
        "end": 153
      },
      "curated": "_curated/期末/2025期末-无答案/130.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "8 个 long 参数的寄存器/栈传递与 ABI"
    }
  ],
  "type": "multiple-choice",
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
      "A",
      "B",
      "C"
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
7. 调用一个有 8 个 `long` 参数的函数 `f(a1,...,a8)`，调用点使用如下汇编代码序列
（省略取值细节）：
```asm
    movq a1, %rdi
    movq a2, %rsi
    movq a3, %rdx
    movq a4, %rcx
    movq a5, %r8
    movq a6, %r9
    pushq a8
    pushq a7
    callq f
    addq $16, %rsp
```
下列说法哪些正确？
%%% reference
答案：ABC
解析：超过 6 个整数参数后，其余从栈上传递；在被调函数入口，`0(%rsp)` 是返回地址，因此第 7 个参数在 `8(%rsp)`，第 8 个在 `16(%rsp)`。caller 负责把自己 `push` 的参数空间收回。`%r10/%r11` 不是传参寄存器；是否用 `%rbp` 是编译器选择，不是 ABI 强制。
%%% option: A
在 `f` 的入口处（尚未动 `%rsp`），`a7` 位于 `8(%rsp)`
%%% option: B
若把两条 `push` 顺序改为先 `push a7` 再 `push a8`，则 `f` 看到的 `a7/a8` 会互换
%%% option: C
应当由 caller 回收栈上的传参空间（用 `addq $16, %rsp`）
%%% option: D
`a7,a8` 也可以放在 `%r10,%r11` 中传递
%%% option: E
因为用了栈传参，所以`f`中必须设置和管理`%rbp`帧指针
