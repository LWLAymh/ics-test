# 由 AI 推导的答案与解析

> 本文件由 `_audit/gen_ai_doc.py` 生成。

这些题目的原卷、以及本仓库内所有配套材料（答案页、解析文档、带答案版本）
都**没有**官方答案。下面的答案与解析是由 AI 推导出来的，**未与官方答案核对**，
署名：**deepseek v4.1 flash · 大肥鱼小姐**。
网页上每道题的答案区也有同样的署名提示，不会与官方答案混淆。

共 **78** 道，分布在 2 份材料里。

| 材料 | 题数 |
|---|---|
| 2017期末-无答案 | 28 |
| 2025Lab测验-无答案 | 50 |

## 2017期末-无答案

### 2017期末-无答案 · 第一题 2

- 题型：`single-choice`　模块：`data_representation`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/56.md`
- 题干（节选）：

```
2.  浮点数的阶码没有设计成补码的形式的原因是：
```

**答案与解析**

答案：B
解析：阶码采用移码（偏置）表示，使得浮点数可以按无符号整数直接比较大小，便于排序与比较；同时也让全 0/全 1 的阶码留给 0、非规格化数、无穷与 NaN。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第二题 2

- 题型：`fill`　模块：`data_representation`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/338.md`
- 题干（节选）：

```
2. 程序执行会产生7行输出。请写出每一行所有可能的输出值，不同可能性之间
逗号分隔
第一行：_____________________________________________________
第二行：_____________________________________________________
第三行：_____________________________________________________
第四行：_____________________________________________________
第五行：_____________________________________________________
第六行：_____________________________________________________
第七行：_____________________________________________________
```

**答案与解析**

答案：第 1~3 行依次为 12、20、20；第 5 行恒为 2；第 4、6、7 行可能为 0 或 1
逐行说明：
- 第 1 行 12：`struct a` 中 `char c[2][3]` 占 6 字节，`int i` 对齐到偏移 8，共 12 字节。
- 第 2 行 20：`struct b` 中 `float f` 占 0~3，`struct a` 对齐到偏移 4 占 4~15，`char c` 在偏移 16，补齐到 4 的倍数得 20。
- 第 3 行 20：`sizeof(union c)` = max(12, 20) = 20。
- 第 4 行 0 或 1：proc1 比较「先做 float 加法再转 double」与「转 double 后做 double 加法」的结果是否相等。
- 第 5 行 2：proc2 中 a = &c[1][1]（偏移 4），b = (c+1)[1] = c[2]（偏移 6），b-a 恒为 2。
- 第 6、7 行 0 或 1：取决于第 1 问中 y 的填空内容。
（第 1~3 行确定性高；第 4~7 行属部分推导。）

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 1

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/53.md`
- 题干（节选）：

```
1.  在gdb调试中，下一条指令是call func1。下面哪条gdb指令能执行该指令并
且停留在func1的第一条指令？
```

**答案与解析**

答案：B
解析：si（stepi）执行一条机器指令并在被调函数的第一条指令处停下；ni 会越过 call，br/disas 不是单步执行。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 3

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/59.md`
- 题干（节选）：

```
3.  下面说法正确的是：
```

**答案与解析**

答案：B
解析：test %rax,%rax 只把 rax 与自身相与，其 ZF/SF/PF 与 cmp $0,%rax 完全一致，CF 与 OF 也同为 0，二者在条件转移上等价；A 错（指令长度可变），C 错（switch 只有分支密集时才生成跳转表）。
注：若按「标志位完全相同」的严格口径（TEST 的 AF 未定义），本题也可选 D「以上都不对」，此处取课程教材中「TEST 与 CMP $0 等价」的表述。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第二题 1

- 题型：`fill`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/258.md`
- 题干（节选）：

```
第二题（12分）
假设程序运行在x86-64的小端法机器上，编译器按照标准规则对齐，并且有nan
参与的算术比较运算都返回0。请回答下列问题：
1. 请根据左边C程序和右边对应的汇编代码，填写空白处的代码。
struct a {  ……
  char c[2][3];  proc1:
  int i;    ……
};  movss  (%rcx), %xmm1
struct b {    movss  .LC0(%rip), %xmm0
  float f;    addss  %xmm1, %xmm0
  struct a a;    cvtss2sd  %xmm0, %xmm2
  char c;    movsd  %xmm2, -8(%rbp)
};    movss  (%rcx), %xmm0
union c {    cvtss2sd  %xmm0, %xmm0
  struct a a;    movsd  .LC1(%rip), %xmm1
  struct b b;    addsd  %xmm1, %xmm0
```
  struct b* pb;    movq  %xmm0, -16(%rbp)
```
};  ……
void proc1(union c* u){  proc2:
  double a = u->b.f          ;  ……
  double b = u->b.f          ;  proc3:
  printf("%d\n", a==b);    ……
}
```
    movb  %al, -1(%rbp)
```
void proc2(union c* u){    movzbl  2(%rcx), %eax
```
  char* a = u->a.c[1] + 1;    movb  %al, -2(%rbp)
```
  char* b = (u->a.c + 1)[1];  ……
  printf("%d\n", b - a);   proc4:
}      ……
    movl  8(%rc
```

**答案与解析**

答案：
(1) `a = u->b.f + 0.25f`（即空白处填 `+ 0.25f`）
(2) `b = u->b.f + 0.25`（即空白处填 `+ 0.25`，常量是 double）
(3) `y = u->b.c`（即空白处填 `u->b.c`；写成 `*((char*)u + 16)` 等价）

第 2 小问（程序共 7 行输出，每行可能的值）：
第一行：0, 1
第二行：0, 1
第三行：0
第四行：0, 1
第五行：0, 1
第六行：0
第七行：0

解析：
**结构体布局**（x86-64，标准对齐，小端）：`struct a` 偏移 0..5 是 `char c[2][3]`，
偏移 8..11 是 `int i`，对齐 4 ⇒ `sizeof(struct a) = 12`；`struct b` 偏移 0 是 `float f`，
偏移 4..15 是 `struct a a`（内部 4..7 是填充），偏移 16 是 `char c`，偏移 24 是
`struct b* pb`，对齐 8 ⇒ `sizeof(struct b) = 32`；`union c` 取三者最大值 ⇒ 32。

**proc1**：`.LC0` 处 `.long 1048576000 = 0x3E800000`，按 IEEE 754 单精度分解：
符号 0、阶码 0x7D = 125 ⇒ 125−127 = −2、尾数 1.0 ⇒ 1×2⁻² = **0.25**（不是 2.5！）。
`.LC1` 处 `.long 0, 1070596096 = 0x3FD0000000000000`，按双精度分解：阶码 0x3FD = 1021
⇒ 1021−1023 = −2、尾数 1.0 ⇒ **0.25**。于是同一个 0.25 因常量类型不同走了两条不同
路径：一条先 `addss`（单精度加法，再 `cvtss2sd` 提升为 double），另一条先 `cvtss2sd`
再用 `addsd`（双精度加法）。所以两空分别是 `+ 0.25f` 与 `+ 0.25`。
两空若写成同一类型就只会产生一份代码，无法解释汇编里的 `addss`+`addsd` 并存。

**proc3**：`x = u->a.c[1][0]` 读的是字节 3（汇编 `movzbl 2(%rcx)` 与之相邻的字节 3，
即 `c[1][0]`）。`y` 处汇编是 `movzbl 16(%rcx), %eax` 读 1 字节、`movsbl %al, %eax`
符号扩展后存入 int，说明 y 是取自偏移 16 的**有符号 char**，而偏移 16 正是
`struct b` 的 `char c` ⇒ `y = u->b.c`。

**proc4**：`x = u->a.i` 是偏移 8 的 int（`movl 8(%rcx), %eax`）；偏移 16 处再取一个
char（`movzbl 16(%rcx), %eax` ⇒ `movsbl`），即 `y = u->b.c`。

**7 行输出的推导**（每行的输出都来自 `printf`，顺序为 proc1、proc2、proc3、proc4）：
- 第 1 行 `a==b`：`a = (double)(float)(f + 0.25f)`，`b = (double)f + 0.25`。0.25 是
  2⁻²，故 f+0.25 时阶码最多升 2。设 f 无溢出时阶码为 E：(i) E ≤ 21 ⇒ 间距 ≤ 2⁻²，
  f+0.25 可精确表示，两条路径都得精确值 ⇒ **1**；(ii) E ≥ 22 ⇒ f 的间距 ≥ 0.5 > 0.25，
  f+0.25 舍入到 f 或 f+间距，单精度结果 ≠ 双精度结果 ⇒ **0**；(iii) f 是 NaN（或 ±Inf）
  ⇒ `a==b` 为假 ⇒ **0**。随机初始化能取到 (i)(ii)(iii)，所以可能值为 0 和 1。
- 第 2 行同 proc1 另一空：同样可能是 0 或 1。
- 第 3 行 `b - a`（两个 `char*`）：`u->a.c[1] + 1` 与 `(u->a.c + 1)[1]` 都表示
  `&c[1][1]`，恒等于 ⇒ 恒为 **0**。
- 第 4 行（proc3）：`x` 是 `u->a.i` 的低位字节，`y` 是同一个 int 的**次低字节**
  （`u->a.i` 占字节 8..11，低位在 8，小端 ⇒ 字节 9 就是 `(i >> 8) & 0xFF`）。
  - `x ≠ 0x7F` 或 `(y & 0x80) != 0x80` ⇒ 走 else，打印 **0**；
  - 两者都成立时，float f 的 4 个字节是 `7F y b10 b11`（小端组装），
    `f < i` 前 C 会把 int 转成 float：`y ≥ 0x80` 时是负数（比较用同一个 i 的真值，
    只有 int→float 的舍入误差，不影响符号），与同为负的 i 比较；`y < 0x80` 时是
    正的小数（次正规/极小正规数），必然小于巨大的负数 i ⇒ 该比较为真，打印 **1**。
  即条件里 `y & 0x80` 这一半恰好决定了比较结果，第 4 行可能打印 0 或 1。
- 第 5 行 `(x > y) != (-x < -y)`：令 t = (x > y)。若 x ≠ INT_MIN，则 −x 无溢出，
  (−x < −y) 恰为 ¬t，两式不等 ⇒ **1**；若 x == INT_MIN，则 −x == INT_MIN，两式同为
  (INT_MIN > y) ⇒ 相等 ⇒ **0**。随机初始化两种情况都能取到 ⇒ {0, 1}。
- 第 6 行 `b - a`（proc2）恒为 **0**。
- 第 7 行 proc3 恒打印 **0**（见上）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 4

- 题型：`single-choice`　模块：`processor_arch`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/64.md`
- 题干（节选）：

```
4.  分析下图的指令执行步骤，请问这是Y86指令系统的哪条指令？
```

**答案与解析**

答案：B
解析：执行步骤为 Decode: valA←R[%esp]、valB←R[%esp]；Execute: valE←valB+4；Memory: valM←M4[valA]；Write back: R[%esp]←valE；PC update: PC←valM，这正是 ret 的 SEQ 实现。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第三题

- 题型：`fill`　模块：`processor_arch`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/352.md`
- 题干（节选）：

```
第三题（12分）
如图所示，每个模块表示一个单独的组合逻辑单元，每个单元的延迟以及数据依赖
关系已在图中标出。通过在两个单元间添加寄存器的方式，可以对该数据通路进行
流水化改造。假设每个寄存器的延迟为10ps。
R
A  B  C  D  E
G
60ps  30ps  30ps  40ps  10ps
R
E  F  G  H  E
G
20ps  60ps  40ps  30ps  10ps
1. 如果改造为一个二级流水线，为获得最大的吞吐率：
a) 需要在_______模块之间和_______模块之间插入寄存器；
b) 插入寄存器改造后二级流水线的最长延时路径为_____，最长延时为____
c) 流水线最大吞吐率为：____________________________________
（用分数表示，约分到最简形式，并写明单位）
2. 如果改造为一个三级流水线，为获得最大的吞吐率：
a) 需要在________________________________________________
模块之间插入寄存器；
b) 插入寄存器改造后三级流水线的最长路径延时为:__________；
c) 流水线最大吞吐率为：____________________________________
（用分数表示，约分到最简形式，并写明单位）
```

**答案与解析**

答案：二级流水线在 B 与 C 之间、F 与 G 之间插入寄存器（最长延时 100ps，最大吞吐率 1/100ps）；三级流水线在 A|B、B|C、E|F、F|G 之间插入寄存器（最长延时 80ps，最大吞吐率 1/80ps）。
模块延迟：A 60、B 30、C 30、D 40、E 20、F 60、G 40、H 30 ps，寄存器 10ps；跨链依赖为 A→F、C→H，故最长路径是 A→F→G→H→REG = 200ps。
1. 二级流水线：
a) 在 **B 与 C 之间**、**F 与 G 之间**插入寄存器；
b) 第一级为 A→B（90ps，E→F 只有 80ps），第二级为 C→D→REG 与 G→H→REG（各 70ps）；
   最长延时路径为 A→B（90ps），含流水线寄存器的最长延时为 100ps；
c) 最大吞吐率 = 1/100ps = 1/(10⁻¹⁰ s) = 10¹⁰ 条/秒。
2. 三级流水线：
a) 在 A 与 B 之间、B 与 C 之间，以及 E 与 F 之间、F 与 G 之间插入寄存器；
b) 最长路径延时为 80ps（第三级 G→H→REG 或 C→D→REG 均为 40+30+10 = 80ps）；
c) 最大吞吐率 = 1/80ps = 1/(8×10⁻¹¹ s) = 1.25×10¹⁰ 条/秒。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 5

- 题型：`single-choice`　模块：`memory_hierarchy`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/73.md`
- 题干（节选）：

```
5.  如果四路组相联的高速缓存大小是32KB，并且块（block）大小为32字节，
那么它每路（way）有多少行（line）？
```

**答案与解析**

答案：D
解析：32KB / 32B = 1024 块，4 路组相联 → 256 组，每路 256 行。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 6

- 题型：`single-choice`　模块：`memory_hierarchy`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/79.md`
- 题干（节选）：

```
6.  某个机械硬盘的部分指标数据如下，则该硬盘标称的容量最有可能是多少？
```
◦  1024 bytes/sector
◦  400 sectors/track (on average)
◦  20000 tracks/surface
◦  5 platters/disk
```
```

**答案与解析**

答案：A
解析：1024B/sector × 400 sector/track × 20000 track/surface × 2 surface/platter × 5 platter ≈ 81.9 GB，标称容量取 80 GB。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 7

- 题型：`single-choice`　模块：`compilation_linking`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/90.md`
- 题干（节选）：

```
7.  C源文件f1.c 和 f2.c的代码分别如下所示：
```
// f1.c  //f2.c
#include <stdio.h>  float x ;
void f();  void f()
int x ;  {
int main(void)      x = 2 ;
{  }
x = 1;
f() ;
    printf("%x\n", x) ;
    return 0;
}
```
运行下面的命令后得到的结果是:
```
$ gcc f1.c f2.c
$ ./a.out
```
```

**答案与解析**

答案：D
解析：f1.c 的 int x 与 f2.c 的 float x 都是未初始化的全局变量（COMMON 弱符号），链接器把它们合并成同一个 4 字节符号；f() 写入的是浮点 2.0（位模式 0x40000000），main 再按 int 以 %x 打印就得到 40000000。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 8

- 题型：`single-choice`　模块：`compilation_linking`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/110.md`
- 题干（节选）：

```
8.  下面关于链接的说法，正确的是：
```

**答案与解析**

答案：B
解析：链接发生在编译之后、可执行程序运行之前（静态链接）；A 错（多个弱符号由链接器任选其一，不保证取第一个），C 错（未初始化或初值为 0 的静态变量在 .bss），D 用的是教材原话的宽松表述（链接器实际复制的模块集合是引用关系的传递闭包，并非「只」有被应用程序直接引用的模块），故本题按单选取 B。
存疑：若把 D 按教材原话宽松理解，则 D 也成立，本题存在歧义。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第四题

- 题型：`short-answer`　模块：`compilation_linking`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/380.md`
- 题干（节选）：

```
第四题（10分）
考虑以下三个文件：
polygon.h                            main.c（函数中部分内容折叠）
```
struct Node {  #include "polygon.h"
float pos[2];  node* root_ptr ;
int marked;  int main(){
struct Node* next;  node* p;
struct Node* prev;  init();
};  p=alloc();
typedef struct Node node;  root_ptr =p;
  ...
node* alloc();  gc();
void init();  ...
void gc();  return 0;
}
```
gc.c（函数体被折叠）
```
#include "polygon.h"
#define N (1<<20)
static node polygon [N];
static node* free_ptr ;
static node* root_ptr ;
void mark(node* v){...}
void sweep() {...}
void gc() {...}
void init() {...}
node* alloc() {...}
```
使用命令gcc –o polygon main.c gc.c得到可执行文件polygon。
11

<!-- ===== page 12 ===== -->

1. 对于每个程序中的相应符号，给出它的属性（局部或全局，强符号或弱符号）
提示：如果某表项中的内容无法确定，请画X。
main.c
  局部或全局？  强或弱？
```
root_ptr
init
main
gc.c
```
  局部或全局？  强或弱？
```
N
polygon
alloc
```
2. 解释为何其中一些符号被定义了多次，链接器仍然可以成功创建可执行文件。
3. gc.c 的功能是实现一个垃圾收集器。解释为何前面的命令能够编译、链接成
功，
```

**答案与解析**

答案：main.c —— root_ptr 全局/弱（COMMON）、init 全局（外部引用，非强非弱）、main 全局/强；gc.c —— N 无符号表条目（预处理宏）、polygon 局部（static）/非强非弱、alloc 全局/强。同名不冲突是因为 gc.c 里的 root_ptr 带 static（局部符号）；潜在错误是 gc() 用的是 gc.c 私有的 root_ptr（恒为 NULL），会把仍在使用的对象当垃圾回收。
2. main.c 的全局 root_ptr 与 gc.c 的 `static node* root_ptr` 同名，但后者是 static 局部符号，不参与全局符号解析；gc.c 里对外可见的 init/alloc/gc/mark/sweep 都只定义一次，所以链接器不会报多重定义错误。
3. main 把根指针写进的是 main.c 的全局 root_ptr，而 gc() 读的是 gc.c 自己的静态 root_ptr，mark 阶段找不到任何根，sweep 会把在用的对象回收。修复：去掉 gc.c 中 root_ptr 的 static，或把根指针作为参数/接口传给 gc()。
逐项符号属性（与上面结论一致，便于对照答题纸表格）：
| 文件 | 符号 | 局部/全局 | 强/弱 |
| --- | --- | --- | --- |
| main.c | root_ptr | 全局 | 弱（未初始化，COMMON）|
| main.c | init | 全局（外部引用）| 非强非弱 |
| main.c | main | 全局 | 强 |
| gc.c | N | 无符号表条目（预处理宏）| 画 X |
| gc.c | polygon | 局部（static）| 非强非弱 |
| gc.c | alloc | 全局 | 强 |

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 9

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/119.md`
- 题干（节选）：

```
9.  下列程序输出的数字顺序可能是：
```
int count = 1;
if (fork() == 0) {
  if (fork() == 0) {
    printf("%d\n", ++count);
  }
  else {
    printf("%d\n", --count);
  }
}
printf("%d\n", ++count);
```
```

**答案与解析**

答案：C
解析：三个进程各打印：父进程 ++count → 2；子进程 --count → 0，再 ++count → 1（顺序 0、1）；孙进程 ++count → 2，再 ++count → 3（顺序 2、3）。所以输出必是 {0,1,2,2,3} 的一个排列，且 0 在 1 之前、2 在 3 之前。A、B 里 3 之前的 2 缺失，D 里 1 在 0 之前，只有 C「2 0 1 3 2」满足约束。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 10

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/134.md`
- 题干（节选）：

```
10. 下列关于信号的说法不正确的是：
```

**答案与解析**

答案：D
解析：SIGSTOP/SIGKILL 的默认行为不能被 signal 修改，D 错；A、B、C 都正确。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 14

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/160.md`
- 题干（节选）：

```
14. 以下关于文件I/O的说法中，正确的是：
```

**答案与解析**

答案：D
解析：A 的表述其实也成立（dup/dup2 只改描述符表项、不动打开文件表），本题存疑；B 错：fork 时文件描述符表与打开文件表是共享的，不是写时拷贝；C 错：带缓冲的 rio_readlineb 与不带缓冲的 rio_readnb 不能在同一描述符上任意交叉使用；D 对：RIO 同时提供无缓冲与带缓冲两类函数，用带缓冲的要先声明 rio_t 并调用 rio_readinitb。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 15

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/169.md`
- 题干（节选）：

```
15. 以下程序执行完成后，ICS.txt文件中的内容是：
```
int main(int argc, char** argv) {
int fd1 = open("ICS.txt", O_CREAT|O_RDWR,
 S_IRUSR|S_IWUSR);
write(fd1, "ics ", 4);
int fd2 = fd1;
int fd3 = dup(fd2);
int fd4 = open("ICS.txt", O_APPEND|O_RDWR);
write(fd2, "segmentation fault ", 19);
write(fd4, "tao", 3);
int fd5 = fd4;
dup2(fd3, fd5);
write(fd4, "lab", 3);
close(fd1);
return 0;
}
```
```

**答案与解析**

答案：A
解析：fd1 写入 "ics " 后偏移为 4；fd2=fd1、fd3=dup(fd2) 共享同一打开文件表项，fd4 以 O_APPEND 打开（每次写前定位到文件末尾）。fd2 写 "segmentation fault " 追加到 4；fd4 写 "tao" 追加到末尾；dup2(fd3, fd5) 让 fd4 也指向 fd1/fd3 的打开文件表项，此后 write(fd4,"lab") 写在偏移 23 处，覆盖掉 "tao"，最终文件为 "ics segmentation fault lab"。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第五题

- 题型：`fill`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/439.md`
- 题干（节选）：

```
第五题（10分）
代码如下：（仅为示例代码，答题时不考虑任何出错的情况）
```
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/wait.h>
int counter1 = 1;
int counter2 = 1;
void handler(int sig) {
        if (sig == SIGUSR1)     counter1++;
        if (sig == SIGUSR2)     counter2++;
}
int main(int argc, char **argv)
{
        int i;
        pid_t ppid, cpid;
        int fd1, fd2;
        unsigned char buf1[64], buf2[64];
        signal(SIGUSR1, handler);
        signal(SIGUSR2, handler);
        fd1 = open("number.txt", O_RDWR);
        for (i = 0; i <   N   ; i++) {
                ppid = getpid();
                cpid = fork();
                if (cpid) {
```
13

<!-- ===== page 14 ===== -->

```
                        kill(cpid,     A       );
                        while (sleep(4)) ;
                } else {
                        kill(ppid,     B      
```

**答案与解析**

答案：
1. 共 **7** 行输出（A/B 四种组合下都是 7 行）
   a) A=SIGUSR1, B=SIGUSR1 → 最后一行 `123 ab`
   b) A=SIGUSR1, B=SIGUSR2 → 最后一行 `23 ab`
   c) A=SIGUSR2, B=SIGUSR1 → 最后一行 `23 a`
   d) A=SIGUSR2, B=SIGUSR2 → 最后一行 `1 ab`
2. 共 **6** 行输出（E=exit(0) 时，A/B 四种组合下都是 6 行）
   a) A=SIGUSR1, B=SIGUSR1 → 最后一行 `12 a`
   b) A=SIGUSR1, B=SIGUSR2 → 最后一行 `1 ab`
   c) A=SIGUSR2, B=SIGUSR1 → 最后一行 `12 a`
   d) A=SIGUSR2, B=SIGUSR2 → 最后一行 `1 ab`

解析：
**① 计数器是「每进程一份」。** `counter1/counter2` 是全局变量，fork 之后父子各持
一份副本；handler 里的自增只作用于**收到信号的那个进程自己**的副本。而 handler
结尾的 `kill(ppid/cpid, …)` 会给对方再补一次信号——于是每次「一次 kill」在程序
里实际表现为**两个进程各加一个计数器**。

**② 谁加哪个计数器**（这是本题的关键）：一次完整的往返是
`P: kill(C, A)` → C 的 handler 被调用（C 自增：A=SIGUSR1 则 C.counter1++，
A=SIGUSR2 则 C.counter2++）→ 该 handler 末尾 `kill(P, B')` → P 的 handler 被调用
（P 自增：B=SIGUSR1 则 P.counter1++，B=SIGUSR2 则 P.counter2++）。
所以口径是：**A 给子进程加计数器，B 给父进程加计数器**，一次往返两边各 +1。
- 新 fork 出来的孙子继承的是**那一刻**父进程的计数器快照。

**③ sleep 的语义。** `while (sleep(k));` —— 信号处理函数会打断 sleep，sleep 返回
未睡满的秒数（非 0），于是 while 再睡一整轮。每个进程每轮只被 kill 一次，所以
最后每个进程每轮都睡满 k 秒（P 睡 4 秒、子进程睡 2 秒）。

**④ 行数怎么数。** 每个进程每轮打印 1 行。
- 第 1 组（E 为空）：子进程打印完**不退出**，继续自己的 for 循环，所以每一代
  「同样的树」再展开一次。设 L(n) 为 N=n 时整棵树的行数，则
  L(n) = 1 + 2·L(n−1)（自己打印 1 行，再等 2 个孩子各展开一棵 L(n−1) 的子树），
  L(1) = 3 ⇒ L(2) = 7、L(3) = 15。故 N=2 时共 **7 行**。
- 第 2 组（E = exit(0)）：子进程打印完就退出，**不再 fork 孙子**，每轮只有
  「P 1 行 + 子进程 1 行」，N=3 ⇒ **6 行**。

**⑤ 谁打印最后一行、内容是什么。**
- 一行的两个字段 = 打印者当时的 `counter1`、`counter2`：数字串取 number.txt 从头
  （按各自打开文件表项的偏移）起的 counter1 个字符，字母串取 letter.txt 从 'a'
  起的 counter2 个字符。
- P 在每轮结尾都有 `waitpid(cpid,0,0)`，所以 **P 必须等到它的子树跑完才进入下一轮**；
  而 P 的每轮都比子进程慢（P 每轮睡 4 秒、子进程只睡 2 秒），因此 **P 最后一轮的
  打印就是整个程序的最后一行**。P 的最终计数器可以这样记账：

第 1 组（N=2，E 为空）：P 每轮各得 +1（来自 B 那一侧），两轮共 +2；字母串长度就是
P 当时的 `counter2`，数字串按 P 自己的 `counter1` 与它已消费的共享偏移取：

| A / B | P 第 1 轮末 (c1,c2) | P 第 2 轮末 (c1,c2) | 最后一行 |
| --- | --- | --- | --- |
| USR1 / USR1 | (2,1) | (3,2) | `123 ab` |
| USR1 / USR2 | (2,2) | (2,3) | `23 ab` |
| USR2 / USR1 | (2,1) | (2,1) | `23 a` |
| USR2 / USR2 | (1,2) | (1,3) | `1 ab` |

第 2 组（N=3，E=exit(0)）：子进程每轮只跑一轮就 `exit(0)`，**A 加在子进程上的增量
随子进程退出而丢失**，P 只从 B 侧每轮得到 +1，而 P 每轮之后还会被下一轮子进程的
handler 再补一次同名信号，最终值：
- (a) A=SIGUSR1, B=SIGUSR1：P.c1 = 2，c2 = 1 ⇒ 最后一行 `12 a`
- (b) A=SIGUSR1, B=SIGUSR2：P.c1 = 1，c2 = 2 ⇒ 最后一行 `1 ab`
- (c) A=SIGUSR2, B=SIGUSR1：P.c1 = 2，c2 = 1 ⇒ 最后一行 `12 a`
- (d) A=SIGUSR2, B=SIGUSR2：P.c1 = 1，c2 = 2 ⇒ 最后一行 `1 ab`

**⑥ 输出行数小结。**
- 第 1 组（N=2，E 为空）均为 **7 行**：P 打 2 行；P 每轮 fork 出的子进程各自再展开
  一棵「N=1 的 3 行」小树（2×3 = 6 行）—— 合计 2 + 6 = 7。
- 第 2 组（N=3，E=exit(0)）均为 **6 行**：P 打 3 行，每轮的子进程各打 1 行后
  `exit(0)`，合计 3×2 = 6。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 11

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/140.md`
- 题干（节选）：

```
11. 关于动态内存分配，下列说法中正确的是：
```

**答案与解析**

答案：C
解析：显式分配器不能重排请求、也不能搬移已分配块（A、B 错）；已分配块不可达也不会自动释放（D 错）；显式分配器因为不必搜索就能直接操作空闲链表，通常比隐式分配器快。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 12

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/145.md`
- 题干（节选）：

```
12. 在设计分配器时，下列说法中错误的是：
```

**答案与解析**

答案：A
解析：搜索空闲链表时三种策略的存储利用率并没有「best fit > next fit > first fit」这样的确定排序（next fit 的利用率通常比 first fit 还差），A 错；带头部的隐式空闲链表只需按块大小跳过当前块即可在常数时间内找到并合并下一个块（B 对）；立即合并会在某些请求模式下反复合并又分割，降低吞吐率（C 对）；显式/分离空闲链表中用（平衡）二叉树组织，正是为了更快找到适配的空闲块（D 对）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 13

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/155.md`
- 题干（节选）：

```
13. 下列说法错误的是：
```

**答案与解析**

答案：D
解析：使用动态内存的主要原因是程序在编译时无法确定所需空间大小（以及对象生命周期需要跨越函数调用），而不是「栈容易受缓冲区溢出腐蚀」，D 错。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第六题

- 题型：`fill`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/513.md`
- 题干（节选）：

```
第六题（12分）
通常处理器中的MMU通过页表实现虚拟内存地址到物理内存地址的转换，而
TLB被用于提升地址转换的效率。然而TLB必须和页表之间保持一致，才能保证
MMU正确按页表转换虚拟地址。当修改页表内容时，需要通过invlpg指令将对应
的TLB表项置为失效，以确保TLB与页表一致。
指令invlpg m把包含虚拟地址m的页面在TLB中的表项置为失效。
假设当前状态下，TLB与页表是一致的。部分TLB表项如下（假设TLB是全
相联的）：
有效位  TLB标记  页面号
1  0x8040201  0x4801
1  0x8040233  0x4812
0  0x8040382  0x9C33
1  0x8046740  0x4801
0  0x8046621  0x8845
1  0x80467CD  0x6734
与上述TLB表项相关的两个页表页的地址及其中的部分页表项如下：
页面号  存在位    页面号  存在位
索引号  索引号
Bits: 51 - 12  Bit: 0    Bits: 51 - 12  Bit: 0
0x1  0x4801  1    0x10  0x2312  1
0x33  0x4812  1    0x21  0x8845  1
0x54  0x8745  1    0x73  0x4521  1
0x180  0x3212  1    0x140  0x4801  1
0x182  0x9C33  1    0x182  0x8ACD  1
0x1A1  0x9078  1    0x1CD  0x6734  1
基地址为0x4801000的页表页    基地址为0x4812000的页表页
设处理器采用的是64位虚拟地址和64位物理地址，页面大小为4KB，页表为
4级。
1. 分析下面的指令序列：
15

<!-- ===== page 16 ===== -->

```
1. movq $0x8040233000, %rbx
2. movq 0xA00(%rbx), %rcx
3. addq 0x11000, %rcx
4.
```

**答案与解析**

答案：
1.
a) 0x4812（第 2 条指令读的是虚拟地址 0x8040233A00，命中 TLB 表项
   0x8040233 → 0x4812）
b) 0x15812（0x4812 + 0x11000）
c) %rcx 是**取数地址**（页表项的物理地址），%rax 是该地址处读出的内容
   （即 `%rax = *(%rcx)`）。数值上 %rcx = 0x15812、%rax = 0x4801，两者不等；
   %rcx 指向页表页 0x15812 中的第 0x21 项，%rax 就是这一项的值。
   一句话：%rcx 是指向页表项的指针，%rax 是该页表项的内容。
d) 1 次 TLB miss
e) 0 次 page fault
2.
a) %r10 与 %r11 **不相等**：第 6 条访存 0x8040382 页时该 TLB 表项有效位=0
   ⇒ TLB miss、查页表得 PTE[0x182] = **0x9C33** ⇒ 读物理 0x9C33C10；
   第 8 条再读时该 TLB 表项**仍然无效**，再查页表 —— 而**页表项已被第 7 条
   改成 0x4801** ⇒ 读物理 0x4801C10。两条读到的是**不同**物理单元的内容。
b) %r11 与 %r12 **相等**：第 9 条 `invlpg` 置无效之后，第 10 条重新查页表，
   得到的仍是第 7 条改写后的 PTE[0x182] = 0x4801 ⇒ 与第 8 条读到同一物理单元
   （0x4801C10，即第 7 条刚写入 %rax 的位置）。
c) 4 次 TLB miss
3. 发生变化的表项：

TLB：

| 有效位 | TLB 标记 | 页面号 |
| --- | --- | --- |
| 0 | 0x8040382 | （无效，无需填） |

页表页（基地址 0x4801000）：

| 索引号 | 页面号 | 存在位 |
| --- | --- | --- |
| 0x182 | 0x4801 | 1 |

解析：
**地址分解**（4KB 页 ⇒ 页内偏移 12 位；4 级页表 ⇒ 每级 9 位；页表项 8 字节）：
虚拟地址 = [VPN3:47-39][VPN2:38-30][VPN1:29-21][VPN0:20-12][offset:11-0]。
题给两个页表页分别是「VPN2 = 0x1」和「VPN2 = 0x2」两级中的**最末级**页表页：
- 0x4801000 一页负责 VPN = 0x80402xx（VPN2=0x1）；它的 PTE 0x1 → 0x4801 等。
- 0x4812000 一页负责 VPN = 0x80466xx（VPN2=0x2）；PTE 0x21 → 0x8845、
  0x140 → 0x4801、0x1CD → 0x6734 等。
每个 TLB 表项的「页面号」就是它指向的物理页号：0x8040201→0x4801、
0x8040233→0x4812、0x8040382→0x9C33（无效）、0x8046740→0x4801、
0x8046621→0x8845（无效）、0x80467CD→0x6734。TLB 与页表一致。

**第 1 组**
- 第 1 条 `movq $0x8040233000, %rbx`：rbx = 0x8040233000，页号 0x8040233、
  页内偏移 0x000。
- 第 2 条 `movq 0xA00(%rbx), %rcx`：取地址 0x8040233A00（页号 0x8040233、
  偏移 0xA00）。TLB 命中该页 ⇒ 该虚拟页映射到物理页 0x4812；偏移 0xA00
  ⇒ 读物理地址 0x4812A00 的 8 字节。
  （注意 0xA00 = 0x140 × 8：题给 0x4801000 那张页表页的第 0x140 项是
  「0x140 → 0x4801」——这一项正好是虚拟页 0x8046740 的映射，说明题目给的两张
  「页表页」就是 4 级页表的**最末级（PTE 级）**页，而 0x8040233 自己那一项
  （索引 0x33 → 0x4812）在 0x4801000 表里也列了出来。）
  按题给数据该项读出的值即 **0x4812 = 虚拟页 0x8040233 的物理页号**。
- 第 3 条 `addq 0x11000, %rcx`（原卷缺 `$`，是立即数加法）：
  0x4812 + 0x11000 = **0x15812**。
- 第 4 条 `movq %rcx, 0x108(rbx)`：把 0x15812 写到虚拟地址 0x8040233108
  （页号 0x8040233、偏移 0x108；即某张页表页的第 0x21 项）。
- 第 5 条 `movq 0x8046621108, %rax`：读虚拟地址 0x8046621108。页号 0x8046621
  （TLB 标记 0x8046621 的表项有效位是 0，故这里要查页表），偏移 0x108。
  题给第二张页表页在 0x4812000，其第 0x21 项正是 0x21 → 0x8845，
  说明物理页 0x8845 就是该虚拟页所在页（该页表页第 0x21 项即该页的映射入口）。
  于是这条读到的 8 字节就是第 4 条刚写进去的值 —— 只不过它落在
  「%rcx 所指向的物理位置」和「0x8046621108 翻译出的物理位置」的同一处。
  因此 **%rcx 是地址、%rax 是该地址处的内容（页表项）**，二者是
  「指针 / 指针所指的值」的关系，数值上 %rax = 0x4801（= 页表项里指向
  物理页 0x4801 的值），%rcx = 0x15812 ≠ %rax。
- d) 5 条指令里的访存只有第 2 条（页 0x8040233，TLB 命中）和第 5 条
  （页 0x8046621，**未命中 ⇒ 1 次 TLB miss**）。第 1、3、4 条是对寄存器的操作，
  第 4 条虽然是 store，目标页也是 TLB 命中的 0x8040233。
  （若把取指也算进去，取指页固定且命中，不影响计数。）⇒ **1 次**。
- e) 上述每一次查页表都在题给的存在位=1 的表项中命中 ⇒ **0 次 page fault**。

**第 2 组**（这里的关键是：TLB 里 0x8040382 的表项**本来就是无效的**，所以每次
访问都要查页表；而第 7 条改写了它的页表项，于是「第 8 条」和「第 10 条」看到的
映射不同。）
- 第 6 条 `movq 0x8040382C10, %r10`：页号 0x8040382（TLB 表项有效位=0）⇒ TLB
  miss，查页表：PTE[0x182] = 0x9C33 ⇒ 物理页 0x9C33、偏移 0xC10
  ⇒ 读物理 0x9C33C10，%r10 = 该处内容。
- 第 7 条 `movq %rax, 0x8046740C10`：页号 0x8046740（TLB 有效 ⇒ 物理页 0x4801），
  偏移 0xC10 ⇒ 写物理地址 **0x4801C10**。注意 0x4801000 正是题给的**页表页基址**，
  0xC10 / 8 = 0x182 ⇒ 这条指令改写的恰好是**页表项 PTE[0x182]**
  （原值 0x9C33，即虚拟页 0x8040382 的映射），新值 = %rax = 0x4801。
- 第 8 条再读 0x8040382C10：TLB 表项 0x8040382 仍是无效的（第 9 条才 invlpg），
  于是重新查页表 —— 但此时 PTE[0x182] 已被第 7 条改成 0x4801 ⇒ 物理页
  **0x4801**、偏移 0xC10 ⇒ 读物理地址 0x4801C10（与第 7 条写的是同一处）。
  所以 %r11 = %rax 的值（0x4801），**%r11 ≠ %r10**。
- 第 9 条 `invlpg 0x8040382C10`：把 0x8040382 的 TLB 表项置无效（它本来就无效）。
- 第 10 条再读 0x8040382C10：同样按被改过的 PTE 翻译 ⇒ 仍读 0x4801C10
  ⇒ %r12 = %r11。
⇒ a) %r10 ≠ %r11（第 6 条走的是物理页 0x9C33，第 8 条走的是改后页表项给出的 0x4801）；
   b) %r11 = %r12（两条都按改后的 PTE 翻译，读同一物理单元）；
   c) 10 条里的数据访存页号依次为：第 2 条 0x8040233（命中）、第 5 条 0x8046621
   （miss①）、第 6 条 0x8040382（miss②）、第 7 条 0x8046740（命中）、
   第 8 条 0x8040382（表项仍无效 ⇒ miss③）、第 10 条 0x8040382（第 9 条刚
   invalidate ⇒ miss④）⇒ **4 次 TLB miss**。

> 勘误说明：第 8 条**不会**用「旧的 TLB 值」，因为 TLB 里这一项本来就是无效的
> （有效位 0），它必须查页表 —— 而此刻页表项已被第 7 条改过，所以第 8 条就已经
> 看到新映射 0x4801 了。因此「%r11 = %r12」而「%r10 ≠ %r11」。
> 第 9 条的 invlpg 依然是必要的：若 0x8040382 的表项本来有效（例如本题若把它的
> 有效位改成 1），不 invlpg 就会一直命中 TLB 取到过期的 0x9C33。

**第 3 问**（变化的表项）
- 第 7 条经虚拟地址 0x8046740C10 改写了物理页 0x4801 上的 PTE[0x182]：
  原 0x9C33 → 新 **0x4801**（存在位 1）。这就是页表页中唯一变化的项。
- TLB：第 9 条 invlpg 把 **0x8040382** 的表项置为无效（有效位 0）。其余五项
  在本程序执行过程中未变（第 7 条只改了内存中的页表项，硬件不会替你失效
  TLB，这正是本题第一段话所说的「必须用 invlpg 保持一致」）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 16

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/195.md`
- 题干（节选）：

```
16. 一台处于校园网内的笔记本电脑访问一台处于公网上的服务器上的网页服务。
网页服务使用默认的80端口。以下答案有三项一定不正确，可能正确的那一
项是：
```

**答案与解析**

答案：B
解析：客户端一定使用临时端口而不是 80（A 必错）；公网服务器不可能是 192.168.x.x（D 必错）。剩下 B/C 中，C 是「一定正确」而不是「可能正确」，题面要求选「可能正确的那一项」，故取 B：校园网内的笔记本若在私有路由器之后，确实可能拿到 192.168.1.101。
（存疑：若按「校园网主机持公网 IP」理解，则 C 才是唯一正确项。）

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 17

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/202.md`
- 题干（节选）：

```
17. 下列关于计算机网络概念的说法中，正确的是：
```

**答案与解析**

答案：C
解析：以太网帧尾与 TCP 首部都有校验和，C 正确；A 错（HUB 只是泛洪，不按 MAC 转发），B 错（实时音视频正适合 UDP），D 错（HTML 是标记语言，HTTP 才是协议）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 18

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/208.md`
- 题干（节选）：

```
18. 下列关于计算机网络的说法中，错误的是：
```

**答案与解析**

答案：B
解析：套接字编程中只能用 IP 地址（不能用网卡 MAC 地址）作为地址，B 错；A、C、D 都正确。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第七题

- 题型：`multiple-choice`　模块：`network`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/596.md`
- 题干（节选）：

```
第七题（12分）
1. 请根据Echo server/client应用的标准程序填空。
2.(cid:9)Start(cid:9)client 1.(cid:9)Start(cid:9)server
Client Server
1 2 Sockets(cid:9)
Interface
```
socket socket
open_listenfd
open_clientfd 3
4
```
Connection
5 request 6
3.(cid:9)Exchange
Client(cid:9)/(cid:9) 7 8 data
Server
Session rio_readlineb rio_writen Arewqauiet(cid:9)scto(cid:9)fnrnoemction
next(cid:9)client
close EOF 9
5.(cid:9)Drop(cid:9)client
4.(cid:9)Disconnect(cid:9)client close
```
1. ______________  2. ______________  3. ______________
4. ______________  5. ______________  6. ______________
7. ______________  8. ______________  9. ______________
```
2. 不定项选择题（全对得分，有错得0分）
```

**答案与解析**

上述正确的有：_________________
答案：C
（1）Echo 框架填空：1 getaddrinfo；2 getaddrinfo；3 bind；4 listen；5 connect；6 accept；7 rio_writen；8 rio_readlineb；9 rio_readlineb。
（2）不定项选择：只有 C 正确。A 错（TCP 在内核实现，不是用户态）；B 错（IP 地址可由 DHCP 动态分配）；D 错（HTTP/1.0 是非持续连接，HTTP/1.1 才支持一个连接多个事务）；E 错（Web 代理缓存对用户是隐式的）；F 错（私有地址段应为 10.0.0.0/8、172.16.0.0/12、192.168.0.0/16）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 19

- 题型：`single-choice`　模块：`concurrent_programming`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/215.md`
- 题干（节选）：

```
19. 下列关于死锁的叙述中，不正确的是：
```

**答案与解析**

答案：D
解析：在信号处理程序中调用 printf() 可能死锁（printf 不可重入，若加锁后被打断），D 错；A、B、C 都正确（先 P(mutex) 再 P(slots) 与生产者/消费者的加锁顺序相反，可能死锁）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第一题 20

- 题型：`single-choice`　模块：`concurrent_programming`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/226.md`
- 题干（节选）：

```
20. 某进程的主线程和对等线程的代码如下所示：
```
sem_t sem;
int main()
{
int i;
pthread_t tids[3];
sem_init(&sem, 0, 1);
for (i=0; i<3; i++) {
pthread_create(&tids[i], NULL, thread, NULL);
}
for (i=0; i<3; i++) {
pthread_join(&tids[i], NULL);
}
return 0;
}
int y = 15;
void *thread (void *arg)
{
P(&sem);
y = y - 3;
V(&sem);
printf("%d\n", y);
}
```
  执行上述代码后，会产生多少种不同的输出？
```

**答案与解析**

答案：A

（本题四个选项全错：不同输出只有 3 种，即 12、9、6；见下方解析。为让网页判分
有可选项，此处填 A，但 A（11）同样是错的。）

解析：
**本题为错题（无正确选项）。** 三个对等线程共享一个初值为 1 的信号量 `sem`，
`y` 是共享全局变量。

代码的关键结构是：`P(&sem); y = y - 3; V(&sem); printf("%d\n", y);`
—— 注意 **`printf` 在临界区之外**，所以每个线程打印的是「自己刚更新完、
但可能已被别的线程继续更新」的 `y`。

三个线程都把 `y` 减 3，`y` 从 15 变成 12、9、6（每次减 3），一共只会出现
这 3 个数值：

- 打印 **12**：某线程执行完 `y = y - 3`（y 变 12）后立刻离开临界区并 printf，
  此时还没有别的线程改动 y。
- 打印 **9**：该线程打印之前，已经有 2 个线程完成了 `y -= 3`。
- 打印 **6**：该线程打印之前，3 个线程都完成了 `y -= 3`。

（由于 `y` 是全局变量、每个线程的 `printf` 都是读当前内存中的 `y`，
不可能出现 15 —— 每个线程自己至少减过一次；也不可能出现 12、9、6 之外的值，
因为 `y` 只会取 `15 - 3k`。）

所以要问「会产生多少种不同的输出」，答案是 **3 种**（12、9、6），
而不是 11/12/13/14 中的任何一个。本卷无官方答案；原卷四个选项显然是把
输出「行数」误当成了「不同输出值的个数」来设置的干扰项，本题应判为错题。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2017期末-无答案 · 第八题

- 题型：`short-answer`　模块：`concurrent_programming`
- 数据位置：`question-bank/_curated/期末/2017期末-无答案/638.md`
- 题干（节选）：

```
1.  基于进程的并发Echo服务器代码（简称P代码）和基于线程的并发Echo服
务器代码（简称T代码）如下所示：
P代码：
```
#include “csapp.h”
void echo(int cnnfd);
void sigchld_handler(int sig)
{
if (waitpid(-1, 0, WNOHANG) > 0)
;
return;  }
int main(int argc, char **argv)
{  int listenfd, connfd;
   socklen_t clientlen;
   struct sockaddr_storage clientaddr;
   listenfd = Open_listenfd(argv[1]);
   while (1) {
      clientlen = sizeof(struct sockaddr_storage);
      connfd = Accept(listenfd,(SA*)&clientaddr,&clientlen);
      if (Fork() == 0) {
 echo(connfd);
 Close(connfd);
 exit(0);
      }
      Close(connfd);
   }
}
```
19

<!-- ===== page 20 ===== -->

T代码：
```
#include “csapp.h”
void echo(int cnnfd);
void *thread(void *vargp);
int main(int argc, char **argv)
{  int listenfd, connfd1;
   socklen_t clientlen;
   struct sockaddr_storage clientaddr;
   pthread_t tid;
   listenfd = Open_listenfd(argv[1]);
   while (1) {
      clientlen = si
```

**答案与解析**

答案：P 代码缺少 Signal(SIGCHLD, sigchld_handler) 注册（子进程变僵尸）；T 代码把描述符按指针解引用（应为 int connfd2 = (int)vargp;）。信号量填 ①P(&s2)、②V(&s3)、③P(&s1)、④V(&s2)、⑤P(&s3)、⑥空。
1. 存在两处错误：
① P 代码虽然定义了 sigchld_handler，却从未调用 Signal(SIGCHLD, sigchld_handler) 注册它，子进程结束后不会被回收，会积累僵尸进程。修正：在 main 开头加 Signal(SIGCHLD, sigchld_handler);。
② T 代码把文件描述符按值当作指针传给线程（Pthread_create(&tid, NULL, thread, connfd1)），线程里却按指针解引用（int connfd2 = *((int *)vargp);），会把描述符值当地址访问。修正：线程里写成 int connfd2 = (int)vargp;。
2. 要求结果只能是 x = 10（1 → +3 → 4 → ×5 → 20 → ÷2 → 10），故执行顺序必须是线程 2 → 线程 1 → 线程 3：
① P(&s2)　② V(&s3)　③ P(&s1)　④ V(&s2)　⑤ P(&s3)　⑥ 空。
即 thread2 先执行（s1 初值 1 放行），做完 x+=3 后 V(&s2) 唤醒 thread1 做 x*=5，再 V(&s3) 唤醒 thread3 做 x/=2，最后得到 10。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

## 2025Lab测验-无答案

### 2025Lab测验-无答案 · Lab 任务 11

- 题型：`single-choice`　模块：`data_representation`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/126.md`
- 题干（节选）：

```
11. （2分）下面给出了satMul2函数的代码，其中变量overflow在结果溢出时会被设
置为 0xFFFFFFFF，否则为 0。下面哪一个选项正确给出了 overflow 的表达式(提
示：可根据x和2 * x的符号位来判断是否溢出)：
```
/*
 * satMul2 - multiplies by 2, saturating to Tmin or Tmax if overflow
 *   Examples: satMul2(0x30000000) = 0x60000000
 *             satMul2(0x40000000) = 0x7FFFFFFF (saturate to TMax)
 *             satMul2(0x90000000) = 0x80000000 (saturate to TMin)
*/
int satMul2(int x) {
int overflow, negative_x, raw_result, tmin, tmax;
    overflow = ____________________
    negative_x = x >> 31;
    raw_result = x << 1;
    tmin = 1 << 31;
tmax = tmin + ~0;
    return (overflow & negative_x & tmin) | (overflow & ~negative_x &
tmax) | (~overflow & raw_result);
}
```
```

**答案与解析**

答案：C

解析：溢出的判据是 x 与 2x 的符号位不同，而 (x << 1) 的最高位正是 2x 的符号位，所以 `x ^ (x << 1)` 的最高位为 1 时溢出，算术右移 31 位即得全 1（溢出）或全 0，故 C 对。A 用 x+1、B 用 x-1、D 用 x>>1 都取不到"2x 的符号位"。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 12

- 题型：`single-choice`　模块：`data_representation`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/155.md`
- 题干（节选）：

```
12. （2分）下面给出了bitParity函数的代码，该函数用于判断整数x的二进制表示中
0的个数是否为奇数。设整数x的二进制表示为x[31]x[30]...x[1]x[0]，则x1[15]
的值可表示为：
```
/*
 * bitParity - returns 1 if x contains an odd number of 0's
 *   Examples: bitParity(5) = 0, bitParity(7) = 1
*/
int bitParity(int x) {
    int x1, x2, x3, x4, x5;
    x1 = x ^ (x >> 16);
    x2 = x1 ^ (x1 >> 8);
    x3 = x2 ^ (x2 >> 4);
    x4 = x3 ^ (x3 >> 2);
    x5 = x4 ^ (x4 >> 1);
    return x5 & 1;
}
```
```

**答案与解析**

答案：A

解析：x1 = x ^ (x >> 16)，所以 x1 的第 i 位 = x[i] ^ x[i+16]；取 i = 15 得 x1[15] = x[15] ^ x[31]。故选 A。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 13

- 题型：`single-choice`　模块：`data_representation`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/177.md`
- 题干（节选）：

```
13. （2分）下面给出了float_half函数的代码，该函数给出单精度浮点数f的一半（即
0.5 * f）的位模式。下面哪一个选项正确给出了(1)和(2)处应当填写的值？
```
/*
 * float_half - Return bit-level equivalent of expression 0.5*f for
 *   floating point argument f.
 *   Both the argument and result are passed as unsigned int's, but
 *   they are to be interpreted as the bit-level representation of
 *   single-precision floating point values.
 *   When argument is NaN, return argument
*/
unsigned float_half(unsigned uf) {
  unsigned sign = uf >> 31;
  unsigned exp = (uf >> 23) & 0xFF;
  unsigned frac = uf & 0x7FFFFF;
  /* Only roundup case will be when rounding to even */
  unsigned roundup = (frac & 0x3) == 3;
  if (exp == 0) {
    /* Denormalized. Must halve fraction */
    frac = (frac >> 1) + roundup;
  } else if (exp < 0xFF) {
    /* Normalized. Decrease exponent */
    exp--;
    if (exp == 0) {
      /* Denormalize adding back leading one */
      fra
```

**答案与解析**

答案：D

解析：(2) 处要把 exp 放回第 23~30 位，移位量是 23；(1) 处是 exp 减到 0 变成非规格化数时，必须把隐含的前导 1 补进小数域最高位（第 22 位，即 0x400000），而 0x800000 是符号位的位置。故选 D。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 14

- 题型：`single-choice`　模块：`data_representation`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/219.md`
- 题干（节选）：

```
14. （2 分）下面给出了 byteSwap 函数的代码，该函数交换后两个参数所指定的两个字
节的数据。下面哪一个选项正确给出了(1)和(2)处应当填写的内容？
```
/*
 * byteSwap - swaps the nth byte and the mth byte
 *  Examples: byteSwap(0x12345678, 1, 3) = 0x56341278
 *              byteSwap(0xDEADBEEF, 0, 2) = 0xDEEFBEAD
 *  You may assume that 0 <= n <= 3, 0 <= m <= 3
*/
int byteSwap(int x, int n, int m) {
    int n8 = n << ___(1)___;
    int m8 = m << ___(1)___;
    int swap_byte = ((x >> m8) __(2)__ (x >> n8)) & 0xff;
    return x ^ (swap_byte << n8) __(2)__ (swap_byte << m8);
}
```
```

**答案与解析**

答案：A

解析：字节下标要变成比特下标必须乘 8，即 `n << 3`，故 (1) = 3；两个字节的差异用异或取出（swap_byte = byte_m ^ byte_n），再在 n、m 两个位置各异或一次就完成了交换，故 (2) = ^。若用 |，两处字节会被"或"成同一个值而不是互换。故选 A。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 15

- 题型：`single-choice`　模块：`data_representation`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/245.md`
- 题干（节选）：

```
15. （2分）下面给出了oddBits函数的代码，该函数将所有奇数位设置为1（设整数x
的二进制表示为x[31]x[30]...x[1]x[0]，奇数位是指j 为奇数的所有x[j]）。
下面哪个选项给出了byte的正确设置：
```
/*
 * oddBits - return word with all odd-numbered bits set to 1
*/
int oddBits(void) {
  int byte = ________;
  int word = byte | byte<<8;
  return word | word<<16;
}
```
```

**答案与解析**

答案：B

解析：目标是奇数位全 1、偶数位全 0 的 0xAAAAAAAA：byte | byte<<8 得 0xAAAA，再 word | word<<16 得 0xAAAAAAAA，所以 byte 应取 0xAA。0x55 会得到 0x55555555（偶数位全 1），0x11、0xff 也不符。故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 17

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/277.md`
- 题干（节选）：

```
17. （2分）GDB是一款功能强大的调试工具，下列关于 GDB 的用法错误的是？
```

**答案与解析**

答案：A

解析：`break explode_bomb` 只是让程序在 explode_bomb 入口停下来，要"跳过"必须自己改 %rip（例如 jump 或 return），故 A 是错误用法。info registers 会显示 16 个通用寄存器以及 rip、eflags 等（B 对）；ni 不进入被调用函数、si 进入（C 对）；p/x、p/d 分别按十六进制、十进制打印（D 对）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 18

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/286.md`
- 题干（节选）：

```
18. （2分）下面是phase_1函数的反汇编代码，下面描述正确的是：
```
0000000000002798 <phase_1>:
    2798:  f3 0f 1e fa            endbr64
    279c:  48 83 ec 08            sub    $0x8,%rsp
27a0:  48 8d 35 a1 1b 00 00  lea    0x1ba1(%rip),%rsi
      # 4348 <_IO_stdin_used+0x348>
    27a7:  e8 a6 05 00 00        call   2d52 <strings_not_equal>
    27ac:  85 c0                  test   %eax,%eax
    27ae:  75 05                  jne    27b5 <phase_1+0x1d>
    27b0:  48 83 c4 08            add    $0x8,%rsp
    27b4:  c3                     ret
    27b5:  e8 c7 06 00 00        call   2e81 <explode_bomb>
    27ba:  eb f4                  jmp    27b0 <phase_1+0x18>
```
```

**答案与解析**

答案：C

解析：`strings bomb` 能把程序里所有可打印字符串列出来（包括 phase_1 要比对的那句），是找内置字符串最快的办法，故 C 对。strings_not_equal 要求两串完全相等而不是前缀匹配（A 错）；它和 explode_bomb 一样是编译进 bomb 自身的函数，不是 libc 函数，换 libc 没有用（B 错）；反汇编里 27a0 处的 `lea 0x1ba1(%rip),%rsi` 已经给出了地址 0x4348（D 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 19

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/311.md`
- 题干（节选）：

```
19. （2分）下面是phase_2函数的反汇编代码。下列哪个输入使 bomb 爆炸？
```
00000000000027bc <phase_2>:
    27bc:  f3 0f 1e fa            endbr64
    27c0:  53                     push   %rbx
    27c1:  48 83 ec 20            sub    $0x20,%rsp
    27c5:  64 48 8b 04 25 28 00  mov    %fs:0x28,%rax
    27cc:  00 00
    27ce:  48 89 44 24 18        mov    %rax,0x18(%rsp)
    27d3:  31 c0                  xor    %eax,%eax
    27d5:  48 89 e6               mov    %rsp,%rsi
    27d8:  e8 d0 06 00 00        call   2ead <read_six_numbers>
    27dd:  83 3c 24 00            cmpl   $0x0,(%rsp)
    27e1:  78 07                  js     27ea <phase_2+0x2e>
    27e3:  bb 01 00 00 00        mov    $0x1,%ebx
    27e8:  eb 0a                  jmp    27f4 <phase_2+0x38>
    27ea:  e8 92 06 00 00        call   2e81 <explode_bomb>
    27ef:  eb f2                  jmp    27e3 <phase_2+0x27>
    27f1:  83 c3 01               add    $0x1
```

**答案与解析**

答案：D

解析：把循环翻成伪码：先要求 a[0] ≥ 0（`cmpl $0x0,(%rsp)` 之后 `js explode_bomb`），再对 i = 1..5 要求 a[i] = 2*a[i-1] - 1（`lea -0x1(%rdx,%rdx,1),%edx` 后与 (%rsp,%rax,4) 比较）。逐项代入：A(0 1 1 2 3 5) 要求 a[1] = -1，实际是 1 → 爆炸；B(0 1 1 3 5 11) 同样卡在 a[1] → 爆炸；C(2 3 5 8 12 17) 到 a[3] 应为 9、实际是 8 → 爆炸；只有 D(2 3 5 9 17 33) 满足 2→3→5→9→17→33 的全部递推，不会爆炸。⚠️ 题面印的是"哪个输入使 bomb 爆炸"，而 A、B、C 三个都会爆炸，因此按题面本题有多个正确答案，是道有缺陷的题；对照第 20 题"不会使 bomb 爆炸"的表述，此处应漏了"不"字，唯一确定的答案（也就是本题本意）是 D，故选 D。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 20

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/364.md`
- 题干（节选）：

```
20. （2分）某同学在使用 GDB 调试BombLab phase_3 时，在 *phase_3 + 0x84
处设置了断点。然后该同学在 phase_3 中输入了0 0，触发了断点，并在断点处输
入了 info registers，获得寄存器信息。下面是phase_3的反汇编信息和断点处
的寄存器信息。下列哪个 phase_3 的输入不会使 bomb 爆炸？
```
# objdump -d bomb
0000000000001829 <phase_3>:
    1829:  f3 0f 1e fa            endbr64
    182d:  48 83 ec 18            sub    $0x18,%rsp
    1831:  64 48 8b 04 25 28 00  mov    %fs:0x28,%rax
    1838:  00 00
    183a:  48 89 44 24 08        mov    %rax,0x8(%rsp)
    183f:  31 c0                  xor    %eax,%eax
    1841:  48 8d 4c 24 04        lea    0x4(%rsp),%rcx
    1846:  48 89 e2               mov    %rsp,%rdx
1849:  48 8d 35 50 2e 00 00  lea    0x2e50(%rip),%rsi
        # 46a0 <transition_table+0x340>
    1850:  e8 eb fa ff ff        call   1340 <__isoc99_sscanf@plt>
    1855:  83 f8 01               cmp    $0x1,%eax
    1858:  7e 1e                  jle    1878 <phase_3+0x4f>
    185a:  83 3c 
```

**答案与解析**

答案：B

解析：断点落在 *phase_3+0x84（0x18ad，即 `cmp %eax,0x4(%rsp)`）处，此时 %eax 就是该输入第一个数对应的期望值：输入 0 0 走到这里得到 %rax = 0xffffff3a = -198，可见 x = 0 需要第二个数为 -198（A 的 -197 会让炸弹爆炸）。x = 1 时走 187f→1884→…→18a2，eax = 0 - 0x31a + 0x299 - 0x304 = -901，且 1 ≤ 5 会真正执行比较，输入 1 -901 恰好匹配，不会爆炸。x = 6、7 分别从跳转表进入 18f0、18f7，最后在 18a7 处因 `cmpl $0x5,(%rsp)` 判断 x > 5 而跳到 explode_bomb（C、D 都爆炸）。故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 22

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/496.md`
- 题干（节选）：

```
22. （2分）下列关于AttackLab的描述中，哪个选项是正确的？
```

**答案与解析**

答案：A

解析：三个 target 的溢出点都在 getbuf / getbuf_withcanary 的栈帧里（Gets 不做边界检查），故 A 对。writeup 里并没有 nop sled 攻击（B 错）；rtarget、starget 既做了栈地址随机化又把栈设为不可执行（C 错）；金丝雀只出现在 starget 的 getbuf_withcanary 中，而必须用 ROP 的原因是栈不可执行，与金丝雀无关（D 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 23

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/504.md`
- 题干（节选）：

```
23. （2分）在AttackLab中，gdb调试器用于调试目标程序，分析程序的运行状态和内
存布局。假设现在需要调试一个名为ctarget的目标程序，下列哪个选项是正确的的？
```

**答案与解析**

答案：C

解析：`break getbuf` 与 `b getbuf` 都是在函数入口下断点，故 C 对。`gdb ctarget` 只是把程序加载进来，还要 `run` 才开始运行（A 错）；`x/x $rdi` 查看的是 $rdi 所指内存的内容，打印寄存器值要用 `p/x $rdi`（B 错）；`run > input.txt` 是把程序的标准输出重定向到文件，要把文件当输入得写 `run < input.txt`（D 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 24

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/515.md`
- 题干（节选）：

```
24. （2分）下面给出了AttackLab中ctarget目标程序的getbuf函数的汇编代码；
在call指令执行完成后，getbuf的栈帧大小为；
```
0000000000401cb2 <getbuf>:
  401cb2:  f3 0f 1e fa            endbr64
  401cb6:  48 83 ec 38            sub    $0x38,%rsp
  401cba:  48 89 e7               mov    %rsp,%rdi
  401cbd:  e8 57 03 00 00        call   402019 <Gets>
  401cc2:  b8 01 00 00 00        mov    $0x1,%eax
  401cc7:  48 83 c4 38            add    $0x38,%rsp
  401ccb:  c3                     ret
```
```

**答案与解析**

答案：C

解析：call 指令把 8 字节返回地址压栈，进入 getbuf 后 `sub $0x38,%rsp` 又分配 0x38 字节，所以此刻 getbuf 的栈帧是 0x38（局部空间）+ 8（返回地址）= 0x40 字节。0x38 只算了局部空间；0x3C、0x44 则是按 4 字节返回地址或重复计数得出的干扰项。故选 C。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 25

- 题型：`single-choice`　模块：`machine_prog`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/531.md`
- 题干（节选）：

```
25. （2 分）在 AttackLab 的 phase3 中，我们需要通过缓冲区溢出来执行特定的函数
touch3。下面给出了touch3以及其调用的hexmatch的函数原型，以及phase3的
一种题解。判断下面说法错误的是：
```
/* Compare string to hex represention of unsigned value */
int hexmatch(unsigned val, char *sval)
{
    char cbuf[110];
    /* Make position of check string unpredictable */
    char *s = cbuf + random() % 100;
    sprintf(s, "%.8x", val);
    return strncmp(sval, s, 9) == 0;
}
```

```
void touch3(char *sval)
{
    vlevel = 3; /* Part of validation protocol */
    if (hexmatch(cookie, sval)) {
        printf("Touch3!: You called touch3(\"%s\")\n", sval);
        validate(3);
    } else {
        printf("Misfire: You called touch3(\"%s\")\n", sval);
        fail(3);
    }
    exit(0);
}
```
// phase3的一种题解
```
/* padding with 56 bytes */
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00
```

**答案与解析**

答案：D

解析：题解里 7 行 × 8 字节 = 56 字节填充，正好是 getbuf 缓冲区 0x38 = 56 字节（A 对）；缓冲区占 0x5566bd48~0x5566bd7f，返回地址槽 0x5566bd80 被改写成 0x5566bd98，getbuf 的 ret 弹出后 %rsp = 0x5566bd88，正是执行 `movq $0x5566bda0,%rdi` 时的值（B 对），该指令执行完 %rdi = 0x5566bda0，也就是紧随其后的 cookie 字符串首地址（C 对）。hexmatch 用 `strncmp(sval, s, 9)` 比较，末尾的 \0 会被一起比较、也是两串相等的必要条件，绝不能被"忽略"，故 D 错。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 26

- 题型：`single-choice`　模块：`processor_arch`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/598.md`
- 题干（节选）：

```
26. （2分）在ArchLab Part B中，我们需要在SEQ架构的基础上实现iopq指令。该
指令的定义如下：iopq V, rB：计算rB op V，并将结果存入寄存器rB。下面是
SEQ架构中的部分HCL-rs定义，其中哪些位置需要添加IOPQ？
```
u8 srcA = [
    icode in { CMOVX, RMMOVQ, OPQ, PUSHQ  } : ialign.rA;  // (1)
    icode in { POPQ, RET } : RSP;
    true : RNONE;
];
u8 dstE = [
    icode in { CMOVX } && cnd : ialign.rB;
    icode in { IRMOVQ, OPQ } : ialign.rB;                   // (2)
    icode in { PUSHQ, POPQ, CALL, RET } : RSP;
    true : RNONE;
];
u64 aluA = [
    icode in { CMOVX, OPQ } : reg_read.valA;               // (3)
    icode in { IRMOVQ, RMMOVQ, MRMOVQ } : ialign.valC;   // (4)
    icode in { CALL, PUSHQ } : NEG_8;
    icode in { RET, POPQ } : 8;
];
u8 alufun = [
    icode == OPQ : ifun;                                        // (5)
    true : ADD;
];
```
```

**答案与解析**

答案：D

解析：iopq V, rB 是"立即数 V 与寄存器 rB 运算后写回 rB"，编码格式与 irmovq 相同（立即数走 valC）。因此 dstE 要取 rB，即 (2) 处加 IOPQ；ALU 的 A 端应取立即数 valC 而不是寄存器 valA，(4) 处加而 (3) 处不加；alufun 要用 ifun 区分 add/sub/and/xor，(5) 处加。srcA 用不到 rA，(1) 处不加。故选 D。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 27

- 题型：`single-choice`　模块：`processor_arch`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/632.md`
- 题干（节选）：

```
27. （2分）在ArchLab Part B中，我们将架构从SEQ一步步改进到pipe_std这个
标准的五级流水线架构。下列说法中错误的一项是？
```

**答案与解析**

答案：B

解析：数据冒险的解决办法是转发（forwarding）或在译码阶段暂停（stall），"增加寄存器"并不能消除冒险（它只是把各级状态隔开的流水线寄存器），故 B 是错误项。其余三项与逐步细分流水线的事实相符：级数变多、每级关键路径变短、时钟频率可以提高（A）；访存与 ALU 落到不同级后可以并行进行（C）；标准五级流水线默认用 valP 预测下一条 PC，遇到跳转会有预测错误（D）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 28

- 题型：`single-choice`　模块：`processor_arch`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/638.md`
- 题干（节选）：

```
28. （2分）ArchLab Part C 中，我们需要优化ncopy.ys代码。下面两个代码片段
截取自某两个同学的ncopy.ys，它们均使用标准的五级流水线架构。下列关于这两段
代码性能的说法，正确的一项是？
**代码 S**
```
Loop:
    mrmovq (%rdi), %r10
    rmmovq %r10, (%rsi)
    andq %r10, %r10
    jle Skip
    iaddq $1, %rax
Skip:
    iaddq $8, %rdi
    iaddq $8, %rsi
    iaddq $-1, %rdx
    jg Loop
```
**代码 T**
```
Loop:
    mrmovq (%rdi), %r10
    iaddq $8, %rdi
    rmmovq %r10, (%rsi)
    iaddq $8, %rsi
    andq %r10, %r10
    jle Skip
    iaddq $1, %rax
Skip:
    iaddq $-1, %rdx
    jg Loop
```
```

**答案与解析**

答案：D

解析：代码 S 中 `mrmovq (%rdi),%r10` 的下一条就是使用 %r10 的 `rmmovq`，构成加载/使用冒险，即使有转发也要在译码阶段停一个周期；代码 T 把不相关的 `iaddq $8,%rdi` 插在两者之间，破坏了这个"相邻依赖"，等 rmmovq 需要 %r10 时加载结果已可转发，每轮循环少一个气泡，cpe 更小，故 D 对。两段代码的指令条数相同（非跳过路径都是 9 条），C 的"平均指令数量变少"不成立；A、B 的"缓存命中率/便于流水线优化"没有依据。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 29

- 题型：`single-choice`　模块：`processor_arch`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/659.md`
- 题干（节选）：

```
29. （2分）在ArchLab Part C中，我们需要同时优化代码ncopy.ys和架构ncopy.rs，
评分标准基于c=cpe+2*ac。关于这一部分的优化策略，下列说法中正确的一项是？
```

**答案与解析**

答案：D

解析：评分 c = cpe + 2*ac 中 ac 的权重是 cpe 的两倍，而且 cpe 与架构设计直接相关（停顿、转发都由 HCL 决定），所以 A、B 都错；cpe 与 ac 也不互相独立——例如把流水线切得更细能缩短每级关键路径（降 ac），却会带来更多冒险与气泡（升 cpe），故 C 错、D 对。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 30

- 题型：`single-choice`　模块：`processor_arch`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/669.md`
- 题干（节选）：

```
30. （2分）在 ArchLab Part C中，某同学准备在标准的五级流水线架构pipe_std
的基础上进一步优化。该同学输入命令./target/debug/ysim --arch pipe_std
-I，得到了下面的结果。该同学进行下列哪一项优化，可以在降低ac的同时，不使cpe
显著增加？
```
propagate order:
lv.1: w_stall m_icode d_dstM m_dstM prog_stat mem_write d_srcB e_dstM
m_stall m_valE d_dstE w_dstM e_ifun e_stat e_icode d_stat f_pc aluB
mem_read e_valA m_dstE alufun w_bubble d_icode w_valE e_stall aluA
mem_data f_bubble d_srcA mem_addr d_valC d_ifun w_dstE w_valM prog_term
d_stall f_stall
lv.2: imem alu dmem reg_file f_align f_icode f_ifun e_valE m_valM
m_stat  d_rvalA  d_rvalB  instr_valid  need_regids  need_valC  m_bubble
set_cc f_stat
lv.3: ialign pc_inc reg_cc f_rA f_rB f_valC f_valP cc f_pred_pc
lv.4: cond e_cnd d_bubble e_bubble e_dstE d_valA d_valB
dependency  graph  visualization  is  generated  at:
pipe_std_dependency_graph.html
```
```

**答案与解析**

答案：B

解析：ysim -I 给出的 propagate order 中，lv.4 的 e_cnd、d_bubble 等信号处在传播层次的最深处，属于关键路径末端；直接缩短它们的路径长度就能降低 ac，而这类改动不改变指令条数与冒险情况，cpe 基本不变，故 B 对。增加 iopq 是 Part B 的指令扩展，对关键路径没有帮助（A 错）；新增"设置条件码"阶段、或把设置条件码推迟到访存阶段，都会引入新的冒险或让条件码更晚可用，cpe（甚至 ac）反而变差（C、D 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 31

- 题型：`single-choice`　模块：`memory_hierarchy`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/699.md`
- 题干（节选）：

```
31. （2分）在CacheLab实验中，valgrind 工具的主要用途是什么？
```

**答案与解析**

答案：C

解析：CacheLab 用 `valgrind --tool=lackey --trace-mem=yes` 把程序的内存访问记录成 trace 文件，csim.c 再回放它，故 C 对。csim-ref 是课程提供的参考模拟器，编译由 make/gcc 完成，成绩由 driver 与自动评测给出，都与 valgrind 无关。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 32

- 题型：`single-choice`　模块：`memory_hierarchy`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/704.md`
- 题干（节选）：

```
32. （2分）在CacheLab Part A (csim.c) 中，模拟器需要解析轨迹文件中的内存
访问操作。根据writeup，下列哪个操作类型应该被忽略？
```

**答案与解析**

答案：D

解析：writeup 明确说本实验只关心数据缓存，要求模拟器忽略所有以 I 开头的指令取指（instruction load）记录，故 D 对；L（数据加载）、S（数据存储）、M（数据修改）都必须处理。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 33

- 题型：`single-choice`　模块：`memory_hierarchy`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/710.md`
- 题干（节选）：

```
33. （2分）根据CacheLab Part A 的编程规则和提示，当缓存模拟器 (csim.c) 解
析到一行 M（数据修改）操作时，它应该如何处理？
```

**答案与解析**

答案：B

解析：trace 格式里 M 表示 data modify，即"一次数据加载 L 紧跟一次数据存储 S"，所以要按两次访问处理：两次都可能命中，也可能第一次未命中（伴随一次可能的淘汰）而第二次命中，故 B 对。A 把它当单次访问、C 直接忽略、D 只看成 S，都不符合 writeup。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 34

- 题型：`single-choice`　模块：`memory_hierarchy`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/722.md`
- 题干（节选）：

```
34. （2分）针对CacheLab Part B中朴素的逐行扫描转置 (for i... for j...
B[j][i] = A[i][j]) 性能不佳，因为它在写入矩阵 B 时具有很差的空间局部性。
Blocking (分块) 策略的核心思想是如何解决这个问题的？
```

**答案与解析**

答案：C

解析：分块（blocking）把矩阵切成能装进缓存的子矩阵，一次只转置一个块：刚从 A 读入的数据在块内被反复使用（时间局部性），B 的对应块也能整块写入（空间局部性），故 C 对。A 只是交换 i、j 循环顺序（牺牲 A 的局部性换 B 的局部性），B、D 分别是处理对角块的局部变量技巧与一次展开 12 个元素的具体手法，都不是分块的核心思想。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 7

- 题型：`single-choice`　模块：`compilation_linking`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/96.md`
- 题干（节选）：

```
7.  （2分）在Makefile模式规则中，%.o: %.c表示：
```

**答案与解析**

答案：B

解析：模式规则 %.o: %.c 里的 % 是词干通配符，表示"同一词干的 .o 依赖同名的 .c"，即每个 .o 依赖对应的同名 .c，故 B 对。它不表示任一 .c 改动就重编所有 .o（A 错），% 也不是字面文件名，所以 C、D 错。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 8

- 题型：`single-choice`　模块：`compilation_linking`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/101.md`
- 题干（节选）：

```
8.  （2分）关于make的执行过程，以下说法正确的是：
```

**答案与解析**

答案：B

解析：make 不指定目标时，把 Makefile 里第一条规则的目标当作默认目标，并且只执行达成该目标所必需的规则，故 B 对、A 错；执行顺序由依赖关系决定而不是书写顺序，所以 C、D 都错。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 9

- 题型：`single-choice`　模块：`compilation_linking`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/106.md`
- 题干（节选）：

```
9.  （2分）关于汇编和反汇编的说法。下列哪个选项是正确的？
```

**答案与解析**

答案：C

解析：汇编器把汇编代码逐条编码成机器指令，`gcc -c foo.s` 得到可重定位目标文件后再 `objdump -d` 反汇编即可，故 C 对。反汇编得到的就是原来那些指令（一一对应，A 错）；不需要也不可能先转回 C（B 错）；objdump 不能代替汇编器把汇编代码变成字节（D 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 10

- 题型：`single-choice`　模块：`compilation_linking`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/114.md`
- 题干（节选）：

```
10. （2分）在binutils中，哪个工具可以用于查看共享库的依赖关系？
```

**答案与解析**

答案：A

解析：ldd 专门打印可执行文件/共享库所依赖的动态库清单；readelf、objdump 侧重 ELF 结构与反汇编，nm 列符号表，都不直接给依赖关系。故选 A。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 1

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/52.md`
- 题干（节选）：

```
1.  （2分）以下哪个ls命令选项用于显示所有文件（包括隐藏文件，以.开头的文件）
```

**答案与解析**

答案：B

解析：`ls` 的 -a（--all）列出目录下所有条目，包括以 . 开头的隐藏文件；-l 是长格式、-h 是配合 -l 的人类可读大小、-t 是按修改时间排序，都与隐藏文件无关。故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 2

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/57.md`
- 题干（节选）：

```
2.  （2分）使用cd命令时，哪个参数表示“上一次所在目录”
```

**答案与解析**

答案：C

解析：`cd -` 会切换回上一次所在的目录（shell 用 $OLDPWD 记录）；~ 是家目录、.. 是上一级目录、/ 是根目录。故选 C。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 3

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/66.md`
- 题干（节选）：

```
3.  （2分）执行 chmod 755 file.py 后，文件 file.py 的权限是：
```

**答案与解析**

答案：A

解析：755 是三位八进制权限：7 = 4+2+1 = rwx 给所有者，5 = 4+1 = r-x 给组和其他，即 rwxr-xr-x；B 对应 644，C、D 的组/其他权限也与 5 不符。故选 A。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 4

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/71.md`
- 题干（节选）：

```
4.  （2分）下列关于 Linux 命令和命令行的使用，说法错误的一项是：
```

**答案与解析**

答案：C

解析：`rm -d 空目录`（或 `rm -r`）同样可以删除目录，"删除空目录只能用 rmdir" 不成立，故 C 是错误项。A 讲 Windows 解压 tar 的权限位/大小写问题、B 讲 gcc 的 -o 与 -O、D 讲 grep -i 忽略大小写，都正确。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 16

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/269.md`
- 题干（节选）：

```
16. （2分）GDB 中断点功能的一种实现方式是：GDB 修改目标程序断点处的机器代码，
让 CPU 执行到该位置时将控制权交给 GDB；之后 GDB 会恢复现场，包括将原指令
写回、调整 %rip 回到断点指令处等，以使程序可以继续执行。基于这一机制，下列
哪一项最符合实际情况？
```

**答案与解析**

答案：B

解析：GDB 把断点处指令的首字节替换成单字节的 INT3（0xCC），CPU 执行到该字节时执行 int 3 陷入内核，内核再把控制权交给调试器，这正是"陷阱"。NOP 不会中断（A 错）；sysenter 是快速系统调用入口、非法指令走 SIGILL 而不是可控断点（C、D 错）。故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 21

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/485.md`
- 题干（节选）：

```
21. （2分）在AttackLab中，hex2raw工具用于将表示十六进制的字符串转换为字节
序列，以便将攻击代码注入到目标程序中。假设现在有一个包含十六进制字符串的文件
hex.txt，下列哪个选项是错误的？
```

**答案与解析**

答案：D

解析：hex2raw 是运行时读取十六进制文本再转成字节的可执行文件，改了 hex.txt 的内容不需要重新编译它，故 D 是错误项。A 的 `cat … | hex2raw >`、B 的 `hex2raw < … >`、C 的 `./ctarget < raw.bin` 三种管道/重定向用法都成立。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 35

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/734.md`
- 题干（节选）：

```
35. （2分）在 CacheLab Part A 编写缓存模拟器 (csim.c) 时，推荐使用哪个 C
语言函数来解析命令行参数（如-s, -E, -b等）？
```

**答案与解析**

答案：B

解析：writeup 建议使用 getopt（配合 <getopt.h>）解析 -s -E -b -t 这类命令行选项，故 B 对。scanf 面向标准输入、fopen 面向文件、mmap 是内存映射，都不能解析命令行选项。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 36

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/747.md`
- 题干（节选）：

```
36. （2分）在ShellLab中，我们实现了一个简单的shell程序tsh。和真实的Linux
shell相比，下列哪一项说法是错误的？
```

**答案与解析**

答案：C

解析：tsh 之所以要捕获 SIGINT/SIGTSTP 再转发给前台进程组，是因为它没有终端控制权；真实 shell 用 tcsetpgrp 把前台进程组交给终端，内核直接把 ctrl-c/ctrl-z 送给该组，shell 自身并不需要"捕获再转发"（tshlab writeup 的脚注明确指出这是对真实 shell 的简化），故 C 的类比不成立。A（不支持变量与搜索路径、运行系统程序要写 /bin/cat）、B（不支持管道但必须支持 < 和 >，且同一条命令可同时重定向）、D（& 后台执行 + fg 内建命令）都与 writeup 一致。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 37

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/757.md`
- 题干（节选）：

```
37. （2分）在ShellLab中，为了避免出现竞争（race），需要在特定的操作前屏蔽一
些信号。下列关于屏蔽信号与解除屏蔽的时机，说法错误的一项是？
```

**答案与解析**

答案：D

解析：子进程会继承父进程屏蔽的信号，正确顺序是：子进程先 `setpgid(0,0)` 进入自己的进程组，再解除屏蔽，最后 execve。若在 setpgid 之前就解除屏蔽，这段窗口里子进程仍属于 shell 所在的前台进程组，用户此时按 Ctrl-C/Ctrl-Z 会直接打到它（而 shell 的转发又依赖它已经独立成组），故 D 是错误项。A 对（sigint_handler 只读 job_list 并发信号，不修改共享数据）；B、C 对（handler 和 eval 修改 job_list 时都必须先屏蔽信号，既保护数据结构，也避免子进程已被回收、父进程才 addjob 的竞争）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 38

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/771.md`
- 题干（节选）：

```
38. （2 分）在 ShellLab 中，我们需要实现一系列内建命令。下列关于内建命令的说法
正确的是？
```

**答案与解析**

答案：D

解析：writeup 规定 `nohup [command]` 要让后续命令阻塞/忽略 SIGHUP（参考实现先阻塞 SIGHUP 再执行命令，子进程继承该信号屏蔽），故 D 对。jobs 直接调用 listjobs 输出即可，不需要先屏蔽信号（A 错）；bg 是给已停止的后台任务发 SIGCONT 让它继续在后台运行，而不是把前台运行的任务转后台（B 错）；kill 内建命令按 writeup 发送的是 SIGTERM 而不是 SIGKILL（C 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 39

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/777.md`
- 题干（节选）：

```
39. （2分）下面是ShellLab中sigchld_handler的一个正确实现中的部分代码（省
略了部分检查与输出）。则代码中(1)和(2)应该分别为？
```
while  ((child_pid  =  waitpid(-1,  &status,  WNOHANG  |  WUNTRACED  |
WCONTINUED)) > 0) {
    if (_____(1)_____(status)) {
        struct job_t *j = getjobpid(job_list, child_pid);
        j->state = ST;
    }
    else if (_____(2)_____(status)) {
        struct job_t *j = getjobpid(job_list, child_pid);
        if(!(j->state == FG)) {
            j->state = BG;
        }
    }
    // ...
}
```
```

**答案与解析**

答案：A

解析：waitpid 带 WUNTRACED|WCONTINUED 时：WIFSTOPPED(status) 为真说明子进程刚被暂停（如 Ctrl-Z），应把 job 状态置为 ST；WIFCONTINUED(status) 为真说明子进程被 SIGCONT 唤醒，若它不是前台任务就置回 BG，正好对应 (1)(2)，故 A 对。WIFEXITED/WIFSIGNALED 属于"正常退出/被信号杀死"的分支，那里应当 deletejob，而不是把状态改成 ST/BG。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 40

- 题型：`single-choice`　模块：`ecf_and_system_io`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/803.md`
- 题干（节选）：

```
40. （2分）在ShellLab中，我们在sigchld_handler中使用waitpid来回收子进
程，同时我们定义了waitfg函数用来等待特定pid的前台任务结束。下面waitfg
函数的实现，正确的一项是？
```

**答案与解析**

答案：C

解析：writeup 明令禁止忙等（如 while(1);）和用 sleep 轮询，要求用 sigsuspend 把父进程挂起，让 sigchld_handler 去回收子进程并更新 job 状态，故 C（配合 while 反复判断前台任务是否还在）是正确写法；A 是纯忙等、B 用 sleep 轮询，都会被扣分。D 用 waitpid 会和 sigchld_handler 抢着回收同一个子进程，而且前台任务被暂停（尚未退出）时会永久阻塞。注：选项里 oldmask 未初始化，实际写法应先用 sigprocmask 取出原屏蔽字再传给 sigsuspend。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 41

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/844.md`
- 题干（节选）：

```
41. （2分）MallocLab实现的分配器需保证返回的指针满足什么样的对齐要求？
```

**答案与解析**

答案：B

解析：malloclab writeup 明确规定"malloc 的实现必须总是返回 8 字节对齐的指针"，驱动也会检查每个块的地址对齐，故 B 对；4 字节对齐或按请求大小动态对齐都不满足要求。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 42

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/849.md`
- 题干（节选）：

```
42. （2分）在MallocLab中关于系统调用和库函数的使用，以下说法正确的是？
```

**答案与解析**

答案：C

解析：MallocLab 只允许用 memlib 提供的 mem_sbrk 来扩展堆（它还负责维护 mem_heap_lo/hi 等），禁止调用 libc 的 malloc、free、realloc、sbrk、brk 以及 mmap 等内存管理函数，故 C 对，A、B、D 都违规。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 43

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/854.md`
- 题干（节选）：

```
43. （2分）以下关于各函数行为的描述中，哪一项是正确的？
```

**答案与解析**

答案：B

解析：writeup 说明：若 realloc 返回的地址与传入地址不同，说明数据已被搬到新块，旧块"已经被释放"，不能再使用、释放或再传给 realloc，故 B 对。free(NULL) 是无操作、并非非法（A 错）；calloc 会把内存清零，与 malloc 的区别不只是参数形式（C 错）；realloc(ptr,0) 等价于 free(ptr) 并返回 NULL，而不是保留一个大小为 0 的已分配块（D 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 44

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/866.md`
- 题干（节选）：

```
44. （2分）在设计分配器时，需要选择合适的策略来在空闲链表中查找空闲块。以下关于
查找策略以及空间利用率和吞吐量的描述，哪一项是正确的？
```

**答案与解析**

答案：A

解析：要在空闲链表里挑出"最合适"的块，往往得扫描更多候选（best fit 要遍历整个链表），扫描更彻底、更慢，换来更高的空间利用率，故 A 对。best fit 并不快，也不适合追求极致吞吐量（B 错）；空间利用率与吞吐量本质上互相牵制，不存在能同时最大化的算法（C 错）；内存充裕的机器上通常更应关注吞吐量（速度），D 说反了。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 45

- 题型：`single-choice`　模块：`virtual_memory_and_malloc`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/874.md`
- 题干（节选）：

```
45. （2分）虽然实验环境是64位的，但writeup指出了堆大小有一个特殊限制，并且
该限制为我们提供了一种优化思路，这个限制是？
```

**答案与解析**

答案：A

解析：writeup 特别指出：虽然跑在 64 位机器上，但"堆的大小永远不会大于或等于 2^32 字节"，这提示可以用 4 字节偏移量代替 8 字节指针之类的优化，故 A 对；B、C、D 都与这条说明无关。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 5

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/79.md`
- 题干（节选）：

```
5.  （2分）使用 ssh-keygen 命令可以生成用于 SSH 登录的密钥。该命令通常生成两
个文件：公钥 key.pub 和私钥 key。这两个文件应存放在：
```

**答案与解析**

答案：C

解析：私钥 key 必须只留在本地，公钥 key.pub 的内容要追加到服务器的 ~/.ssh/authorized_keys 供服务器验证身份；私钥上传等于把身份交出去。故选 C。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 6

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/85.md`
- 题干（节选）：

```
6.  （2分）远程主机 10.0.0.5的 SSH 服务端口为 2222（非默认 22 端口），若要
将本地文件 data.tar.gz 复制到该主机 ubuntu 用户的 ~/backup/目录，正确
的 scp命令是：
```

**答案与解析**

答案：B

解析：scp 用大写 -P 指定端口（小写 -p 表示保留时间戳，故 A 错），且参数顺序是"源 目的"；C 把端口塞进了远端路径、D 的 user:port@host 语法根本不存在。故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 46

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/887.md`
- 题干（节选）：

```
46. （2分）IPv4和IPv6的地址长度是多少位？
```

**答案与解析**

答案：B

解析：IPv4 地址是 32 位（4 字节，点分十进制写法），IPv6 地址是 128 位（8 组 16 位十六进制），故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 47

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/892.md`
- 题干（节选）：

```
47. （2分）关于TCP和UDP协议的区别，以下说法正确的是：
```

**答案与解析**

答案：A

解析：TCP 面向连接、提供可靠有序的字节流；UDP 无连接、尽力而为、不保证可靠，故 A 对，B 正好说反。TCP 有确认、重传、拥塞控制等开销，通常比 UDP 慢（C 错）；广播/多播靠 UDP（及 IP 层）支持，TCP 不支持（D 错）。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 48

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/897.md`
- 题干（节选）：

```
48. （2分）IP地址192.168.1.100/24所在的子网中，可用的主机地址数量是：
```

**答案与解析**

答案：B

解析：/24 表示前 24 位是网络号，剩下 8 位主机号共 2^8 = 256 个地址，其中网络地址（.0）和广播地址（.255）不能分配给主机，可用主机地址是 254 个，故选 B。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 49

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/902.md`
- 题干（节选）：

```
49. （2分）用个人笔记本连接北大无线网，可能获得的IP地址是10.7.74.125，这个
IP地址属于：
```

**答案与解析**

答案：D

解析：课件在讲 DHCP/NAT 时明确把 10.x.y.z 与 192.168.1.5 一起列为"家用路由器/校园网网关通过 DHCP 给终端临时分配的私有地址，只在本地网络中有效"；本题正是校园网 DHCP 拿到的地址，故取 D。（按旧的有类编址，10 开头确实也落在 A 类，但题目问的是该地址在校网中的性质，考点是私有地址，故选 D。）

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。

### 2025Lab测验-无答案 · Lab 任务 50

- 题型：`single-choice`　模块：`network`
- 数据位置：`question-bank/_curated/Lab测验/2025Lab测验-无答案/908.md`
- 题干（节选）：

```
50. （2分）以下说法正确的是：
```

**答案与解析**

答案：C

解析：课件"因特网域名"一页明确写着：一个域名可以解析到多个 IP 地址、一个 IP 地址可以对应多个域名、某些合法的域名没有映射到任何 IP 地址——C 与课件逐字对应，故 C 对。A 错：客户端和服务器可以在同一台主机上（例如回环地址），IP 完全可以相同；B 错：IP 提供的是"尽力而为"的不可靠数据报服务，可靠性由 TCP 等上层协议负责。⚠️ D 其实也是对的：教材要求 getaddrinfo 返回的 addrinfo 链表必须用 freeaddrinfo 整体释放（不能用 free 逐个释放），因此本题按题面有两个正确项，是道有缺陷的题；这里按课件原文取 C，D 亦应视为正确。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
