+++json
{"schemaVersion":"5","id":"q-cc225ba7cc1417ad","revision":1,"paperId":"p-f7485360f6c6060d","paperOrder":72,"number":{"display":"3.72","major":{"display":"第 3 章","value":"3"},"minor":{"display":"3.72","value":"72"},"parts":[]},"classification":{"primaryModuleId":"machine_prog","moduleIds":["machine_prog"],"tags":["csapp","homework","chapter-3"]},"type":"short-answer","stem":{"format":"markdown"},"solution":{"state":"available","grading":"self","reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI推导，非官方解析"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第03章-程序的机器级表示/homework/3.70-3.75-unions-stack-and-floating-point.md#L57","provenance":"rewritten","editorNote":"CSAPP3e家庭作业；补齐alloca代码和s1/s2/e1/e2定义；非官方解析。"}]}
+++
%%% stem
`alloca` 在运行时栈上分配空间，过程返回时自动释放。给定：

```c
#include <alloca.h>
long aframe(long n, long idx, long *q) {
    long i;
    long **p = alloca(n * sizeof(long *));
    p[0] = &i;
    for (i = 1; i < n; i++)
        p[i] = q;
    return *p[idx];
}
```

n 在 `%rdi`，指针为 8 字节。建立帧指针及分配空间的部分汇编如下：

```asm
aframe:
    pushq   %rbp
    movq    %rsp, %rbp
    subq    $16, %rsp             # 此时 %rsp = s1
    leaq    30(,%rdi,8), %rax
    andq    $-16, %rax
    subq    %rax, %rsp            # 此时 %rsp = s2
    leaq    15(%rsp), %r8
    andq    $-16, %r8             # %r8 = p
    # ...
```

定义 $e_2=p-s_2$，$e_1=s_1-(p+8n)$，即分配区域底部、顶部的额外空间。

A. 用数学语言解释计算 $s_2$ 的逻辑。

B. 用数学语言解释计算 p 的逻辑。

C. 确定使 $e_1$ 最小和最大的 n、$s_1$ 的条件。

D. 代码保证 $s_2$ 和 p 具有怎样的对齐属性？
%%% reference
A. $s_2=s_1-16\lfloor(8n+30)/16\rfloor$。分配量是把 8n+30 向下舍入到16的倍数；n 为偶数时是 8n+16，奇数时是 8n+24。

B. $p=16\lceil s_2/16\rceil$，即把 $s_2$ 向上舍入到16字节边界。

C. 令 $r=s_1\bmod16=s_2\bmod16$。r=0 时 $e_2=0$；否则 $e_2=16-r$。一般数学情况下，$e_1$ 最小为1（n偶数且r=1），最大为24（n奇数且r=0）。在所示遵守x86-64调用约定的实际过程里，$s_1$ 本已16字节对齐，r=0，因此 $e_1$ 最小16（n偶数），最大24（n奇数）。

D. p 总按16字节对齐；$s_2$ 与 $s_1$ 的模16余数相同，因此若 $s_1$ 已16字节对齐，$s_2$ 也对齐。以上假定分配量计算未溢出且n对应有效数组长度。
