+++json
{"schemaVersion":"5","id":"q-cd0265acf56a6fab","revision":1,"paperId":"p-5d1091f10c242495","paperOrder":12,"number":{"display":"9.12","major":{"display":"第 9 章","value":"9"},"minor":{"display":"9.12","value":"12"},"parts":[]},"classification":{"primaryModuleId":"virtual_memory_and_malloc","moduleIds":["virtual_memory_and_malloc"],"tags":["csapp","homework","chapter-9"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"va","marker":"{{va}}","occurrence":0,"width":"long"},{"id":"vpn","marker":"{{vpn}}","occurrence":0,"width":"short"},{"id":"ti","marker":"{{ti}}","occurrence":0,"width":"short"},{"id":"tt","marker":"{{tt}}","occurrence":0,"width":"short"},{"id":"th","marker":"{{th}}","occurrence":0,"width":"short"},{"id":"pf","marker":"{{pf}}","occurrence":0,"width":"short"},{"id":"ppn","marker":"{{ppn}}","occurrence":0,"width":"short"},{"id":"pa","marker":"{{pa}}","occurrence":0,"width":"long"},{"id":"co","marker":"{{co}}","occurrence":0,"width":"short"},{"id":"ci","marker":"{{ci}}","occurrence":0,"width":"short"},{"id":"ct","marker":"{{ct}}","occurrence":0,"width":"short"},{"id":"ch","marker":"{{ch}}","occurrence":0,"width":"short"},{"id":"byte","marker":"{{byte}}","occurrence":0,"width":"short"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"va","method":"exact","acceptedAnswers":["00001110101001"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"vpn","method":"exact","acceptedAnswers":["0x0e","0xe","0e","e"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"ti","method":"exact","acceptedAnswers":["0x2","0x02","2","02"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"tt","method":"exact","acceptedAnswers":["0x3","0x03","3","03"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"th","method":"exact","acceptedAnswers":["否","no"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"pf","method":"exact","acceptedAnswers":["否","no"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"ppn","method":"exact","acceptedAnswers":["0x11","11"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"pa","method":"exact","acceptedAnswers":["010001101001"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"co","method":"exact","acceptedAnswers":["0x1","0x01","1","01"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"ci","method":"exact","acceptedAnswers":["0xa","0x0a","a","0a"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"ct","method":"exact","acceptedAnswers":["0x11","11"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"ch","method":"exact","acceptedAnswers":["否","no"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"byte","method":"exact","acceptedAnswers":["-","—"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI 整理推导，非 CSAPP 官方家庭作业解答"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第09章-虚拟内存/homework/9.11-9.13-address-translation.md#L42","provenance":"rewritten","editorNote":"CSAPP3e 家庭作业；独立补齐9.11系统上下文及原图9-20；非官方解析。"}]}
+++
%%% stem
对虚拟地址 `0x03a9`，完成地址翻译和缓存访问。系统按字节寻址，每次读 1 字节；VA 14 位、PA 12 位，页面 64 字节；TLB 共 16 项，四路组相联；L1 物理寻址、直接映射，共 16 组，每块 4 字节。下图给出独立访问前的快照，所有数值均为十六进制。

![TLB、页表和缓存快照](assets/csapp/ch9/fig-9-20-small-memory-system.png)

VA 位 13–6 是 VPN，位 5–0 是偏移；VPN 低 2 位是 TLB 索引。PA 位 11–6 是缓存标记，位 5–2 是缓存索引，位 1–0 是字节偏移。位串连续从高到低写、不加空格；其他数值用十六进制；命中/缺页填是/否；缓存不命中返回字节填 `-`。缺页则 PPN 填 `-`，C、D 留空。

| 部分 | 参数 | 值 |
| --- | --- | --- |
| A | VA 位 13–0（14 位） | {{va}} |
| B | VPN | {{vpn}} |
| B | TLB 索引 | {{ti}} |
| B | TLB 标记 | {{tt}} |
| B | TLB 命中？ | {{th}} |
| B | 缺页？ | {{pf}} |
| B | PPN | {{ppn}} |
| C | PA 位 11–0（12 位） | {{pa}} |
| D | 字节偏移 | {{co}} |
| D | 缓存索引 | {{ci}} |
| D | 缓存标记 | {{ct}} |
| D | 缓存命中？ | {{ch}} |
| D | 返回字节 | {{byte}} |
%%% reference
VA 位串 `00001110101001`；VPN=`0e`，TLBI=`2`，TLBT=`03`。TLB 组 2 不存在有效的标记 03 项；页表 VPN 0e 有效，PPN=`11`，所以无缺页。PA=`(0x11<<6)|0x29=0x469`，位串 `010001101001`。CO=`1`，CI=`a`，CT=`11`；组 a 的有效标记是 2d，不匹配，缓存不命中，返回字节填 `-`。
