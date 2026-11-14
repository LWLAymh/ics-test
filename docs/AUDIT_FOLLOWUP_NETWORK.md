# 网络遗留题闭环候选（2026-11-14）

本文件记录两题的候选题库修订与技术依据。仓库 authored 文件未在本轮直接修改；候选及原版备份位于 `tmp/followup-network/`，由主代理在已授权仓库范围内集成。两题均为 revision 加 1。原题内容备份保留，修订候选在充分澄清后可发布，清空对应具体 review issue。

## 2017 期末第七题第 2 问

文件：`question-bank/authored/p-382bf3b10bc8d35a/q-99e5e4f1f599db68.md`。

原键 C 改为 D、F。D 按 HTTP/1.0 Keep-Alive 扩展理解；在选项和题干中明确这是非默认扩展。F 的三个 CIDR 前缀是 RFC 1918 私有地址块的严格子网，因此这些前缀所覆盖的地址仍属于私有范围。C 说帧头和 IP 包头共同决定网际路由；IPv4 路由决定以 IP 目的地址和路由信息为依据，帧头用于逐链路交付及封装，故 C 错。该区分保留网络层路由与链路层转发之间的原考点。

- RFC 1918 §3：私有块为 `10/8`、`172.16/12`、`192.168/16`。https://www.rfc-editor.org/rfc/rfc1918.html#section-3
- RFC 2068 §19.7.1：HTTP/1.0 可与服务器协商 Keep-Alive 持久连接，但不是默认行为。https://www.rfc-editor.org/rfc/rfc2068.html#section-19.7.1
- RFC 1812 §§5.2.1、5.2.4：路由器检查 IP 目的地址并查找下一跳；链路层下一跳地址及帧封装发生在路由决定之后。https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.1

## 2014 期末第一题第 17 题

文件：`question-bank/authored/p-089627b27e9b5e79/q-a7e7d2984076c296.md`。

保留原 A-D 和原卷备份，题库新增 E“协议转换网关”，把题干明确为异构协议栈两端的应用互通；答案设为 E。此举保留了原题围绕异构 TCP/IP 与 SPX/IPX 网络互连的知识目标，同时避免把多协议路由误判成协议栈转换。清除 `source-question-missing-protocol-conversion-gateway` 后可发布。

- RFC 1683 §4.2 将转换网关描述为在一种协议与另一种协议之间直接转换网络流量。https://www.rfc-editor.org/rfc/rfc1683.html#section-4.2
- RFC 1983 解释 gateway 在一般术语中可指协议转换设备，而在某些网络文献中也指路由器；故题面使用“协议转换网关”消除歧义。https://www.rfc-editor.org/rfc/rfc1983.html

## 修改与验收约束

候选元数据 revision 分别由 2→3、4→5；两题 `publication.state` 设为 `published`，并清空各自具体 `publication.issues`。2017 correctOptionIds 为 `[D, F]`；2014 correctOptionIds 为 `[E]`。未编译、未运行测试、未提交或推送。候选手工编写，原版备份完整保存；主代理集成后可按总体验收流程验证题库 schema/渲染。

