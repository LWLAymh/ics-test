+++json
{"schemaVersion":"5","id":"q-5806de49ca1af9ce","revision":1,"paperId":"p-c039f10f0dbe7e3e","paperOrder":28,"number":{"display":"6.28","major":{"display":"第 6 章","value":"6"},"minor":{"display":"6.28","value":"28"},"parts":[]},"classification":{"primaryModuleId":"memory_hierarchy","moduleIds":["memory_hierarchy"],"tags":["csapp","homework","chapter-6"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"a","marker":"{{blank:a}}","occurrence":0,"width":"long","label":"组2全部地址"},{"id":"b","marker":"{{blank:b}}","occurrence":0,"width":"long","label":"组4全部地址"},{"id":"c","marker":"{{blank:c}}","occurrence":0,"width":"long","label":"组5全部地址"},{"id":"d","marker":"{{blank:d}}","occurrence":0,"width":"long","label":"组7全部地址"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"a","method":"exact","acceptedAnswers":["无","none"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"b","method":"exact","acceptedAnswers":["0x00B0,0x00B1,0x00B2,0x00B3,0x18F0,0x18F1,0x18F2,0x18F3"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"c","method":"exact","acceptedAnswers":["0x0E34,0x0E35,0x0E36,0x0E37"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},{"blankId":"d","method":"exact","acceptedAnswers":["0x1BDC,0x1BDD,0x1BDE,0x1BDF"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI推导，非官方解析"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/homework/6.22-6.30-disks-and-cache-basics.md#L55","provenance":"rewritten","editorNote":"CSAPP3e家庭作业；补齐练习6.12完整状态；非官方解析。"},{"provenance":"rewritten","editorNote":"家庭作业引用的练习6.12缓存状态，作为题面上下文补入；非官方家庭作业解析。","document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/6.4/6.4.4-fully-associative-caches.md#L27"}]}
+++
%%% stem
内存按字节寻址，每次访问1字节，地址13位；缓存2路组相联、每块4字节、8组。练习6.12中的完整缓存状态如下，数字均为十六进制，V为有效位。

| 组 | 行0标记 | V | 行0字节0–3 | 行1标记 | V | 行1字节0–3 |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 09 | 1 | 86 30 3F 10 | 00 | 0 | — |
| 1 | 45 | 1 | 60 4F E0 23 | 38 | 1 | 00 BC 0B 37 |
| 2 | EB | 0 | — | 0B | 0 | — |
| 3 | 06 | 0 | — | 32 | 1 | 12 08 7B AD |
| 4 | C7 | 1 | 06 78 07 C5 | 05 | 1 | 40 67 C2 3B |
| 5 | 71 | 1 | 0B DE 18 4B | 6E | 0 | — |
| 6 | 91 | 1 | A0 B7 26 2D | F0 | 0 | — |
| 7 | 46 | 0 | — | DE | 1 | 12 C0 88 37 |

列出所有会在下列组命中的内存地址。地址用 `0x` 加4位十六进制，按数值递增排列，英文逗号连接、不加空格；没有地址填“无”。

A. 组2：{{blank:a}}

B. 组4：{{blank:b}}

C. 组5：{{blank:c}}

D. 组7：{{blank:d}}
%%% reference
地址为 `(tag << 5) | (set << 2) | offset`，offset可取0–3。

A 无（两行都无效）。

B `0x00B0,0x00B1,0x00B2,0x00B3,0x18F0,0x18F1,0x18F2,0x18F3`。

C `0x0E34,0x0E35,0x0E36,0x0E37`。

D `0x1BDC,0x1BDD,0x1BDE,0x1BDF`。
