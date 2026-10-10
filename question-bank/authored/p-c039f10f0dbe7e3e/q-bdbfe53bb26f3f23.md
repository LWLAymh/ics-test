+++json
{"schemaVersion":"5","id":"q-bdbfe53bb26f3f23","revision":1,"paperId":"p-c039f10f0dbe7e3e","paperOrder":30,"number":{"display":"6.30","major":{"display":"第 6 章","value":"6"},"minor":{"display":"6.30","value":"30"},"parts":[]},"classification":{"primaryModuleId":"memory_hierarchy","moduleIds":["memory_hierarchy"],"tags":["csapp","homework","chapter-6"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"size","marker":"{{blank:size}}","occurrence":0,"width":"short","label":"缓存数据字节数"},{"id":"co","marker":"{{blank:co}}","occurrence":0,"width":"short","label":"CO位范围"},{"id":"ci","marker":"{{blank:ci}}","occurrence":0,"width":"short","label":"CI位范围"},{"id":"ct","marker":"{{blank:ct}}","occurrence":0,"width":"short","label":"CT位范围"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"size","method":"exact","acceptedAnswers":["128"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"co","method":"exact","acceptedAnswers":["1:0","1-0"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"ci","method":"exact","acceptedAnswers":["4:2","4-2"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"ct","method":"exact","acceptedAnswers":["12:5","12-5"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI推导，非官方解析"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/homework/6.22-6.30-disks-and-cache-basics.md#L103","provenance":"rewritten","editorNote":"CSAPP3e家庭作业；地址字段改为等价范围填表；非官方解析。"}]}
+++
%%% stem
内存按字节寻址，每次访问1字节；地址13位。缓存4路组相联（E=4），块4字节（B=4），8组（S=8）。状态如下，数值为十六进制，V为有效位，字节从0到3按左至右排列。

| 组 | 行0：标记/V/字节0–3 | 行1：标记/V/字节0–3 | 行2：标记/V/字节0–3 | 行3：标记/V/字节0–3 |
| --- | --- | --- | --- | --- |
| 0 | F0 / 1 / ED 32 0A A2 | 8A / 1 / BF 80 1D FC | 14 / 1 / EF 09 86 2A | BC / 0 / 25 44 6F 1A |
| 1 | BC / 0 / 03 3E CD 38 | A0 / 0 / 16 7B ED 5A | BC / 1 / 8E 4C DF 18 | E4 / 1 / FB B7 12 02 |
| 2 | BC / 1 / 54 9E 1E FA | B6 / 1 / DC 81 B2 14 | 00 / 0 / B6 1F 7B 44 | 74 / 0 / 10 F5 B8 2E |
| 3 | BE / 0 / 2F 7E 3D AB | C0 / 1 / 27 95 A4 74 | C4 / 0 / 07 11 6B D8 | BC / 0 / C7 B7 AF C2 |
| 4 | 7E / 1 / 32 21 1C 2C | 8A / 1 / 22 C2 DC 34 | BC / 1 / BA DD 37 D8 | DC / 0 / E7 A2 39 BA |
| 5 | 98 / 0 / A9 76 2B EE | 54 / 0 / BC 91 D5 92 | 98 / 1 / 80 BA 9B F6 | BC / 1 / 48 16 81 0A |
| 6 | 38 / 0 / 5D 4D F7 DA | BC / 1 / 69 C2 8C 74 | 8A / 1 / A8 CE 7F DA | 38 / 1 / FA 93 EB 48 |
| 7 | 8A / 1 / 04 2A 32 6A | 9E / 0 / B1 86 56 08 | CC / 1 / 96 3D 47 F2 | BC / 1 / FB 1D 42 30 |

A. 缓存数据容量C = {{blank:size}} 字节。

B. 地址位编号12至0。填写各字段的位范围（如 `5:3`）：CO块偏移 {{blank:co}}，CI组索引 {{blank:ci}}，CT标记 {{blank:ct}}。
%%% reference
$C=S\times E\times B=8\times4\times4=128$ 字节。块偏移b=2位，组索引s=3位，标记t=13−2−3=8位，分别对应1:0、4:2、12:5。
