# 2017期末第三题流水线后续闭环（2026-11-14）

目标：`p-382bf3b10bc8d35a/q-78daa36a28b35c57`，原题号第三题。仅修这道手写题稿；保留原图、ID、来源和AI署名。revision由3升4；闭环后恢复published并移除两条流水线遗留issue。没有官方答案，不标人工认证。本记录接续`docs/AUDIT_2016_2017_2026-11-14.md`中第三题未闭环记录，不应把该历史审计当成最新状态。

## 源证据与明确模型

阅读原卷`Introduction-to-Computer-System-2026Fall-PKU/往年题/期末/2017期末-无答案.pdf`第10页的提取文字，完整视觉查看现有`question-bank/assets/期末/2017期末-无答案/page-10.png`及题面裁图`p10-block-prompt.png`。原图是两排四模块，输出D、H后各有10ps REG；斜向箭头为A→F、C→H。原卷确实有二级两个位置、三级开放位置，未提供官方答案。没有根据旧解析或渲染器猜测依赖。

- 模块权重：A60、B30、C30、D40、E20、F60、G40、H30ps。
- 完整依赖边：AB、BC、CD、EF、FG、GH、AF、CH。
- 完整输入到输出路径：ABCD=160、ABCH=150、AFGH=190、EFGH=150ps；未流水化加输出寄存器后最长200ps。
- 补入题面的同步教学模型：组合模块不可拆分，A/E同组输入在第一级，D/H在最终级同时输出；每条依赖只能向同级或后级，跨几个边界加几个寄存器。同一汇合节点的全部操作数必须来自同一组输入。周期为最大级内组合路径+10ps，寄存器统一开销每周期计一次；充满后每周期一组输出。原题未展开这些约定，修订题面明示为补充而不是声称原卷逐字给出。

## 独立推导与最优性

AFGH延迟60、60、40、30ps。分为二级时，三个内部切点的最大段延迟分别是130、120、160ps，不切是190ps，所以最大级内组合延迟至少120ps，周期至少130ps。达到该下界的全部分级如下：

| 第一级 | 第二级 | 全部新增寄存器边 | 各级最大组合延迟 |
| --- | --- | --- | --- |
| A、B、C、E、F | D、G、H | CD、CH、FG | 120、70ps |
| A、B、E、F | C、D、G、H | BC、FG | 120、70ps |
| A、E、F | B、C、D、G、H | AB、FG | 120、100ps |

原卷两个位置的形式对应后两种，均须接受。旧BC/FG方案的切分可行且最优，错误在漏算同级AF=120ps，不能只拿AB=90ps加10得到100ps。最长路径答案改AF，周期改130ps，吞吐改`1/130 组/ps = 10^11/13 组/s`。

三级把AFGH四模块放入至多三级，至少两个相邻模块在同一级。相邻和120、100、70ps，故最大级内组合延迟至少70ps，周期至少80ps。以下两种分级达到下界，并满足所有跨链同步：

| 第一级 | 第二级 | 第三级 | 全部新增寄存器边 | 各级最大组合延迟 |
| --- | --- | --- | --- | --- |
| A、E | B、F | C、D、G、H | AB、AF、BC、EF、FG | 60、60、70ps |
| A、E | B、C、F | D、G、H | AB、AF、CD、CH、EF、FG | 60、60、70ps |

每条列出的边均新增1个寄存器；末端仍用原图REG，不重复新增。稳态吞吐`1/80 组/ps = 1.25×10^10 组/s`。二/三级操作总流水线延迟分别260/240ps，不能把它们的倒数误作吞吐。旧三级AB/BC/EF/FG漏AF，E到F有1个寄存器而A到F没有，F会混用批次；“80ps数值正确”不代表旧完整方案正确。

## 题面与判分调整

保留8个blank ID。二级1a明确“恰好在两条边各加一个寄存器”，上排空接受AB或BC，下排空FG；这样两个独立自动空不会拼出不一致的方案。三条边的同优解在解析完整列出并说明不属于此两位置格式，不能把CD/FG漏CH当正确方案。

二级路径空接受AF、A→F、A -> F及附末端REG的写法。周期空可只填130/80或带ps。吞吐空外置组/ps单位，明确只填约分后分数1/130、1/80，避免把无括号`1/130ps`当作无歧义表达。来源署名保留，crossChecked=true仅指这次源图+独立计算交叉验证，note明示不代表官方答案或人工认证。

三级方案空改self，参考给整体判据：全部模块恰属一级、源汇级号正确、无逆向依赖、跨级寄存器数等于级差、各级最长组合路径≤70ps。接受两种表列方案及同义表述和任意列举顺序。只写周期、漏AF或第二方案漏CH不能通过方案自评；其余七空自动通过不表示整题自动判对。

## 验证结果

1. 用`format_v5`只解析候选单题并运行`validate_question`，schema、round-trip、8处blank anchor、原图资产路径均通过。
2. 调用实际`site/question-v5.js`的`gradeBlank`：全部24种accepted写法通过，24种负例被拒；三级方案self返回null，整题`gradeBlanks`返回null，不冒充自动验收完整方案。
3. 数值负例包括旧100、漏寄存器的120/70、旧未分级200、二/三级延迟260/240、错误吞吐1/100、1/200、1/260、1/240、混填1/80与1/130；边名CD/AF误填二级上排、GH/CH/EF误填下排、旧最长路径AB及跨全图路径AFGH均拒绝。
4. 独立穷举全部级号分配：二级9个合法分配，最优130ps且恰有3种；三级36个合法分配，最优80ps且恰有2种，与上表一致。递推同级最长路径，不只比较上下两排。
5. 对所有源到节点路径累计寄存器数作独立同步检查：表中5种最优方案均通过；旧三级AB/BC/EF/FG、第二三级漏CH、二级CD/FG漏CH三种负例均失败。

核心模型复现（标准Python；不依赖生成题库、不写仓库）：

```python
from itertools import product
N = 'ABCDEFGH'
W = dict(zip(N, (60, 30, 30, 40, 20, 60, 40, 30)))
E = ('AB', 'BC', 'CD', 'EF', 'FG', 'GH', 'AF', 'CH')

def legal(k):
    for p in product(range(k), repeat=8):
        s = dict(zip(N, p))
        if s['A'] or s['E'] or s['D'] != k-1 or s['H'] != k-1:
            continue
        if any(s[u] > s[v] for u, v in E):
            continue
        d = {}
        for v in N:
            d[v] = W[v] + max([d[u] for u, x in E
                               if x == v and s[u] == s[v]] or [0])
        yield s, max(d.values()) + 10

for k, expected, count in ((2, 130, 3), (3, 80, 2)):
    rows = list(legal(k))
    optimum = min(c for s, c in rows)
    best = [s for s, c in rows if c == optimum]
    assert (optimum, len(best)) == (expected, count)
    print(k, len(rows), optimum, len(best))

def sync(k, cuts):
    arrivals = {}
    for v in N:
        arrivals[v] = {0} if v in 'AE' else {
            t + cuts.get(u+v, 0) for u, x in E if x == v
            for t in arrivals[u]}
        if len(arrivals[v]) != 1:
            return False
    return arrivals['D'] == arrivals['H'] == {k-1}

positive = [(2, ['AB', 'FG']), (2, ['BC', 'FG']),
            (2, ['CD', 'CH', 'FG']),
            (3, ['AB', 'AF', 'BC', 'EF', 'FG']),
            (3, ['AB', 'AF', 'CD', 'CH', 'EF', 'FG'])]
negative = [(3, ['AB', 'BC', 'EF', 'FG']),
            (3, ['AB', 'AF', 'CD', 'EF', 'FG']),
            (2, ['CD', 'FG'])]
for k, cuts in positive:
    assert sync(k, dict.fromkeys(cuts, 1))
for k, cuts in negative:
    assert not sync(k, dict.fromkeys(cuts, 1))
```

本子任务没有改papers、生成数据、渲染器或共享tests，没有compile/build、commit/push；恢复发布须由主代理统一落地及验收。原始revision3单题备份供落地时保存到`question-bank/backups/2017-final-pipeline-original-revision-3.md`。
