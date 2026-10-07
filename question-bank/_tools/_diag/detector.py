# -*- coding: utf-8 -*-
"""改进版交错判据（is_bad v2）。

原判据（find_interleave.is_bad）在「长十六进制地址/字节列」上误报：
`0x00000000004004fb <f+27>:  jle  0x400521 <f+65>` 会被判成交错，
因为 `0x0000...` 里全是相邻重复的 0。全库 380 条命中里 174 条属于这种误报。

v2 在算相邻重复率之前先剥掉两类「天然含重复数字」的片段：
  1. `0x` 十六进制字面量；
  2. 连续 >=3 个以空白分隔的短十六进制字节（objdump/机器码列）。
其余判据（>=6 个字母、长度 >=8、相邻重复率 >=0.28）保持不变，
因此真正的交错（`pmuosvh %%rbrspp`、`555111555159:::`）仍会被命中。
"""
import re

TRIPLE = re.compile(r"(.)\1{2,}")
ALNUM = re.compile(r"[0-9A-Za-z]")
ALPHA = re.compile(r"[A-Za-z]")

HEX_LITERAL = re.compile(r"\b0[xX][0-9a-fA-F]+\b")
# 至少 3 个空格分隔的 1-2 位十六进制字节，例如 `b8 00 00 00 00` / `48 8b 05 00`
HEX_BYTES = re.compile(r"\b[0-9a-fA-F]{1,2}(?:[ \t]+[0-9a-fA-F]{1,2}){2,}\b")


def scrub(s):
    return HEX_BYTES.sub(" H ", HEX_LITERAL.sub(" H ", s))


def dup_ratio(s):
    t = "".join(ALNUM.findall(s))
    if len(t) < 10:
        return 0.0
    same = sum(1 for a, b in zip(t, t[1:]) if a == b)
    return same / (len(t) - 1)


def is_bad(s):
    core = s.strip()
    if len(core) < 8:
        return False
    if core.startswith("```") or core.startswith("<!--"):
        return False
    if set(core) <= set("-=_*# "):
        return False
    if len(ALPHA.findall(core)) < 6:
        return False
    return dup_ratio(scrub(core)) >= 0.28


if __name__ == "__main__":
    MUST_FLAG = [
        "pmuosvh %%rbrspp ,%rbp",
        "555111555159:::    444888   888399   e77cd5   2ee080",
        "555551111177777158bd:::::      4847483848     8e8?8b05?b",
    ]
    MUST_PASS = [
        "0x00000000004004fb <f+27>:      jle    0x400521 <f+65>",
        "*   Examples: satMul2(0x30000000) = 0x60000000",
        "| 0x7ffffffe38c | X |",
        "b8 00 00 00 00      mov    $0x0,%eax fec:  b8 00 00 00 00      mov    $0x0,%eax",
        "C. 1000, 1111, 1110, 1111, 1100, 0000, 0000, 0000 表示唯一的整数是 0x8FEFC000",
        "00400000 r-xp 00000000  fc:02   20   20  20         0 echoserveri",
    ]
    bad = 0
    for s in MUST_FLAG:
        if not is_bad(s):
            print("MISS (should flag): %s" % s)
            bad += 1
    for s in MUST_PASS:
        if is_bad(s):
            print("FALSE POSITIVE: %s" % s)
            bad += 1
    print("detector self-test: %s" % ("OK" if not bad else "%d problems" % bad))
