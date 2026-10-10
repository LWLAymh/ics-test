+++json
{"schemaVersion":"5","id":"q-9e8e0f44bbf0df0e","revision":1,"paperId":"p-c039f10f0dbe7e3e","paperOrder":22,"number":{"display":"6.22","major":{"display":"第 6 章","value":"6"},"minor":{"display":"6.22","value":"22"},"parts":[]},"classification":{"primaryModuleId":"memory_hierarchy","moduleIds":["memory_hierarchy"],"tags":["csapp","homework","chapter-6"]},"type":"fill","stem":{"format":"markdown","blanks":[{"id":"x","marker":"{{blank:x}}","occurrence":0,"width":"short","label":"最优x"}]},"solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"x","method":"exact","acceptedAnswers":["0.5","1/2","0.50"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}],"reference":{"format":"markdown"},"provenance":{"origin":"ai-derived","crossChecked":false,"attribution":"AI推导，非官方解析"}},"publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第06章-存储器层次结构/homework/6.22-6.30-disks-and-cache-basics.md#L3","provenance":"rewritten","editorNote":"CSAPP3e家庭作业；非官方解析。"}]}
+++
%%% stem
设计一个每条磁道位数固定的旋转磁盘。每条磁道的位数由最里层磁道的周长决定，可近似为中间圆洞的周长。扩大圆洞能增加每磁道位数，但会减少磁道总数。盘面半径为 r，圆洞半径为 xr，磁道密度和线性位密度固定。使容量最大的 x = {{blank:x}}。
%%% reference
每磁道位数正比于 xr，磁道数正比于 r−xr，所以容量正比于 $r^2x(1-x)$。$x(1-x)=1/4-(x-1/2)^2$ 在 x=1/2 时最大。
