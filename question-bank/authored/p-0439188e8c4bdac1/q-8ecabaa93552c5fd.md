+++json
{
  "schemaVersion": "5",
  "id": "q-8ecabaa93552c5fd",
  "revision": 2,
  "paperId": "p-0439188e8c4bdac1",
  "paperOrder": 21,
  "number": {
    "display": "第14/15讲 21",
    "major": {
      "display": "第14/15讲",
      "value": null
    },
    "minor": {
      "display": "21",
      "value": "21"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "compilation_linking",
    "moduleIds": [
      "compilation_linking"
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
      "legacyId": "q-8ecabaa93552c5fd",
      "document": "原文/阶段测验/2025第2次阶段测验-带答案.md",
      "lines": {
        "start": 254,
        "end": 294
      },
      "curated": "_curated/阶段测验/2025第2次阶段测验-带答案/254.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "目标文件反汇编中 0 填充与重定位、callq 偏移"
    }
  ],
  "type": "short-answer",
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
  }
}
+++
%%% stem
21.（8分）下面是一段C代码`main.c`和对应目标文件`main.o`反汇编得到的代码。

```c
int array[2] = {1, 2};
int main(int argc, char** argv){
    int val = sum(array, 2);
    return val;
}
```

```asm
0000000000000000 <main>:
0:   55                     push    %rbp
1:   48 89 e5               mov     %rsp,%rbp
4:   48 83 ec 20            sub     $0x20,%rsp
8:   89 7d ec               mov     %edi,-0x14(%rbp)
b:   48 89 75 e0            mov     %rsi,-0x20(%rbp)
f:   be 02 00 00 00         mov     $0x2,%esi
14:  bf 00 00 00 00         mov     $0x0,%edi
19:  e8 00 00 00 00         callq   1e <main+0x1e>
1e:  89 45 fc               mov     %eax,-0x4(%rbp)
21:  8b 45 fc               mov     -0x4(%rbp),%eax
24:  c9                     leaveq
25:  c3                     retq
```
（1）地址14对应的`mov`指令，为什么要把0放到`edi`寄存器中?按源代码看，应该
是要放什么数，这里为什么是0，后续还会有什么操作？


（2）地址19对应的`callq`指令，看起来会转到地址1e，即下一条指令，这不合常
理，为什么？
%%% reference
答案（原卷参考答案）：
（1）要放到`edi`中的数据是数组`array`的首地址（1分）；编译成目标文件时，`array`数组在内存中的位置还不确定，所以用0代替（1分）；后续由链接器（1分）进行重定位（1分），填上正确的数值。
（2）`callq`指令要跳转到`sum`函数的起始地址（1分）；编译成目标文件时，`sum`函数在内存中的位置还不确定，所以用0代替（1分）；按照`callq`指令的编码规则，指令中保存的是`callq`下一条指令和要跳转的目标地址的差值，因为现在用0填充，所以反汇编显示成下一条指令的地址，即1e（2分）。

解析：

1. 先看源码与汇编的对应：`int val = sum(array, 2);` 要调用 `sum(a, n)`，x86-64 用 `%rdi` 传第一个参数（数组首地址 `array`）、`%esi` 传第二个参数（整数 2）。汇编里 `f: mov $0x2,%esi` 正是第二个参数，`14: mov $0x0,%edi` 就是第一个参数——**本应**是 `&array[0]`，但这里是 0。
2. 为什么是 0：这份反汇编来自 **可重定位目标文件（`main.o`）**。此时链接还没发生，`array` 最终会被放在 `.data` 段的哪个地址、整个程序会被装载到哪个地址，编译器都不知道，因此它先在指令的立即数字段填 0 占位，并在目标文件里为这个位置产生一条**重定位记录**（relocation entry，指向符号 `array`）。
3. 「后续还会有什么操作」：链接器（linker）在链接阶段做**重定位**——把 `array` 在运行时（或按 `-no-pie` 的固定地址）的最终地址填回这条 `mov` 指令的 4 字节立即数域；类似地，`sum` 的地址会被填进 `callq` 的位移域。所以最终可执行文件里 `14: bf xx xx xx xx mov $<array 的地址>,%edi`。
4. 第（2）问的关键是 `callq` 的**相对寻址（PC-relative）**编码：`e8` 后面跟 4 字节有符号位移 rel32，目标地址 = **下一条指令的地址 + rel32**。目标文件里 rel32 全 0，反汇编器按公式算出「`1e + 0 = 1e`」，于是显示成 `callq 1e <main+0x1e>`，看起来像跳到自己下一条指令。链接器随后把这个 rel32 改成 `sum 的最终地址 − callq 下一条指令的地址`（重定位类型 `R_X86_64_PLT32`/`R_X86_64_PC32`），运行时才能真正跳到 `sum`。
5. 顺带一提：`mov $0x0,%edi` 用的是绝对地址立即数（`R_X86_64_32` 类重定位），这也是链接时能直接「填数」的原因；而 `callq` 填的是相对位移，所以链接后的机器码会随 `sum` 与本指令的距离而变。两者都属于链接**重定位**阶段解决的问题。

> 📌 答案有官方来源：原卷参考答案（原文/阶段测验/2025第2次阶段测验-带答案.md 第 280–294 行，红色答案逐条给出 1 分/1 分/1 分/1 分的评分点）。解析由 AI 整理（deepseek v4.1 flash · 大肥鱼小姐）。
