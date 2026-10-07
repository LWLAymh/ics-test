(function () {
  'use strict';

  const app = document.getElementById('ics-app');
  if (!app) return;

  const $ = (id) => document.getElementById(id);
  const ui = {
    setup: $('ics-setup'), modules: $('ics-modules'), bankSummary: $('ics-bank-summary'),
    modePicker: $('ics-mode-picker'), moduleFieldset: $('ics-module-fieldset'), moduleLegend: $('ics-module-legend'),
    selectToggle: $('ics-select-toggle'), count: $('ics-count'), countField: $('ics-count-field'),
    year: $('ics-year'), yearField: $('ics-year-field'), examType: $('ics-exam-type'), examTypeField: $('ics-exam-type-field'),
    start: $('ics-start'), setupError: $('ics-setup-error'), quiz: $('ics-quiz'),
    abandon: $('ics-abandon'), progressText: $('ics-progress-text'), scoreText: $('ics-score-text'),
    progressBar: $('ics-progress-bar'), questionMeta: $('ics-question-meta'),
    questionTitle: $('ics-question-title'), questionContent: $('ics-question-content'),
    answerForm: $('ics-answer-form'), answerLabel: $('ics-answer-label'), answerHint: $('ics-answer-hint'),
    choiceList: $('ics-choice-list'), answer: $('ics-answer'), submit: $('ics-submit'),
    feedback: $('ics-feedback'), verdict: $('ics-verdict'), reference: $('ics-reference'),
    liveStats: $('ics-live-stats'), statsSummary: $('ics-stats-summary'), statsOptions: $('ics-stats-options'), statsNote: $('ics-stats-note'), liveDot: $('ics-live-dot'),
    selfGrade: $('ics-self-grade'), next: $('ics-next'), result: $('ics-result'),
    finalScore: $('ics-final-score'), finalSummary: $('ics-final-summary'), retry: $('ics-retry'),
    reviewToggle: $('ics-review-toggle'), reviewList: $('ics-review-list'),
  };

  const state = {
    catalog: null, questions: [], index: 0, score: 0, records: [], answerBlocks: new Map(), currentMode: '',
    supabase: null, statsChannel: null, currentStats: null, statsQuestionId: '', statsRevealed: false,
  };
  const md = window.markdownit ? window.markdownit({ html: false, linkify: true, breaks: false }) : null;
  if (md) {
    const defaultImage = md.renderer.rules.image || function (tokens, index, options, env, renderer) {
      return renderer.renderToken(tokens, index, options);
    };
    md.renderer.rules.image = function (tokens, index, options, env, renderer) {
      const token = tokens[index];
      const source = String(token.attrGet('src') || '').replace(/\\/g, '/');
      const assetIndex = source.indexOf('assets/');
      if (assetIndex >= 0) token.attrSet('src', './web-data/assets/' + source.slice(assetIndex + 7));
      token.attrSet('loading', 'lazy');
      token.attrSet('decoding', 'async');
      return defaultImage(tokens, index, options, env, renderer);
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function withoutPrintedLineNumber(line) {
    return String(line || '').replace(/^\s*\d{1,3}[.．]\s+/, '').trim();
  }

  /* ------------------------------------------------------------------
   * 结构猜测代码已于 L4 全部删除。
   *
   * 这里原本有 isAssemblyLine / isStrongCodeLine / isCodeContinuation /
   * looksLikeDisplayMath / structureMarkdown —— 它们靠正则猜「哪些行是代码、
   * 哪些行是公式」，正是 A 类（把正文误包成 $$）与 C 类（同题选项样式割裂）
   * 缺陷的来源。
   *
   * 现在题库 1009 道全部带 `formatted && layout`，结构由 `_curated/*.md` 显式给出，
   * 前端不再需要任何猜测。删除前的对照证据：
   *   node tools/_ics_pool_diff.js  -> total 1009 poolOld 314 poolNew 314 lost 0 gained 0
   *   node tools/ics-check.js       -> 问题条目 0（删前旧路径 58 条）
   * 回滚备份：D:\blog\_ics_backup\blog_static\ics-test.js.before_heuristic_delete
   * ------------------------------------------------------------------ */

  // 无损清洗：只做「不改变语义」的修正，新旧两条路径都要用。
  // 页码注释、全角字形、PDF 折行、OCR 把代码和题干粘在一行 —— 这些都与结构无关。
  function normalizeText(source) {
    return String(source || '')
      .replace(/^\s*\d+\s*\n+(?=\s*<!--\s*=+\s*page\s+\d+\s*=+\s*-->)/gim, '')
      .replace(/<!--\s*=+\s*page\s+\d+\s*=+\s*-->/gi, '')
      .replace(/\uF02D/g, '−').replace(/\uF03D/g, '=').replace(/\uF02B/g, '+')
      // OCR 偶尔会把代码末尾和下一句题干粘在同一行。
      .replace(/([);}])\s*(?=(?:请问|问[：:]|下列|上述|则[，,]))/g, '$1\n')
      // PDF 转文本常把一个中文词从中间换行；Markdown 会额外补一个空格。
      .replace(/([\u3400-\u9fff])\n(?=[\u3400-\u9fff])/g, '$1');
  }

  // 只把 A./B./… 选项前的换行变成显式换行，既保证选项逐行显示，
  // 又不把 PDF 的正文折行全部保留下来。
  function hardBreakOptions(source) {
    return String(source || '').split(/(```+[\s\S]*?```+|~~~+[\s\S]*?~~~+)/g).map(function (part, index) {
      if (index % 2 === 1) return part;
      const withChoices = part.replace(/\n(?=\s*[A-Ha-h][.．、)]\s*)/g, '  \n');
      return withChoices.split('\n').map(function (line) {
        // PDF 文本里的汇编通常没有围栏；保留这些指令行的换行，避免整段挤成一行。
        return /^\s*(?:mov|push|pop|call|ret|leave|add|sub|cmp|test|lea|xor|and|or|sal|sar|shr|jmp|j[a-z]+|set[a-z]+|cmov[a-z]+)[a-z]*q?\b/i.test(line)
          ? line.replace(/\s*$/, '') + '  '
          : line;
      }).join('\n');
    }).join('');
  }

  // 兜底路径（题库数据没有 formatted 字段时才会走到）：只做无损清洗，
  // **不再补代码围栏、也不再合成 $$** —— 那些猜测已随 structureMarkdown 一起删除。
  function cleanMarkdown(source) {
    return hardBreakOptions(normalizeText(source));
  }

  function renderMarkdown(source) {
    const clean = cleanMarkdown(source);
    return md ? md.render(clean) : '<pre>' + escapeHtml(clean) + '</pre>';
  }

  // 兜底路径的选项渲染：与 renderMarkdown 完全相同。
  // 原来这里有一条「命中 unsigned|int|~|0x… 就把整个选项套 <code>」的启发式，
  // 正是 C 类缺陷（同一题里一个选项等宽、兄弟选项普通文本）的根源，已删除。
  function renderChoiceMarkdown(source) {
    return renderMarkdown(String(source || '').trim());
  }

  // 新路径（formatted）：题库已经给出结构化 layout，前端**一点不猜**。
  // 该是代码就写反引号、该是公式就写 $…$、都不写就是普通文本 —— 同一题内不可能
  // 再出现「一个选项等宽、兄弟选项普通文本」的观感割裂。
  // 注意：这两个函数必须留在 ics-check.js 抽取的片段内（escapeHtml..secureShuffle），
  // 否则体检脚本里的 Function 构造会报 not defined。
  function renderLayoutStem(text) {
    const clean = normalizeText(text);
    return md ? md.render(clean) : '<pre>' + escapeHtml(clean) + '</pre>';
  }

  function renderLayoutChoice(text) {
    const clean = normalizeText(text).trim();
    return md ? md.renderInline(clean) : escapeHtml(clean);
  }

  function typeset(element) {
    if (!window.MathJax || !window.MathJax.typesetPromise) return;
    if (window.MathJax.typesetClear) window.MathJax.typesetClear([element]);
    window.MathJax.typesetPromise([element]).catch(function () {});
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error('读取失败（HTTP ' + response.status + '）');
    return response.json();
  }

  function quizMode() {
    const selected = ui.modePicker.querySelector('input:checked');
    return selected ? selected.value : 'random';
  }

  function visitorId() {
    const key = 'ics-quiz-visitor-id';
    try {
      let value = localStorage.getItem(key);
      if (!value) {
        value = crypto.randomUUID();
        localStorage.setItem(key, value);
      }
      return value;
    } catch (_) {
      if (!state.fallbackVisitorId) state.fallbackVisitorId = crypto.randomUUID();
      return state.fallbackVisitorId;
    }
  }

  function initSupabase() {
    const url = app.dataset.supabaseUrl;
    const key = app.dataset.supabaseKey;
    if (!url || !key || !window.supabase || !window.supabase.createClient) return;
    state.supabase = window.supabase.createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  function emptyStats(questionId) {
    return { question_id: questionId, total_answers: 0, correct_answers: 0, option_counts: {} };
  }

  function stopStatsSubscription() {
    if (state.supabase && state.statsChannel) state.supabase.removeChannel(state.statsChannel);
    state.statsChannel = null;
  }

  function renderLiveStats() {
    if (!state.statsRevealed) return;
    const stats = state.currentStats || emptyStats(state.statsQuestionId);
    const total = Number(stats.total_answers || 0);
    const correct = Number(stats.correct_answers || 0);
    const rate = total ? Math.round((correct / total) * 100) : 0;
    const counts = stats.option_counts || {};
    ui.liveStats.hidden = false;
    ui.statsSummary.textContent = total
      ? total + ' 人作答 · 正确率 ' + rate + '%'
      : '还没有作答记录，你是第一个';

    const choices = Array.from(ui.choiceList.querySelectorAll('[data-choice]'));
    ui.statsOptions.innerHTML = choices.map(function (button) {
      const option = button.dataset.choice;
      const count = Number(counts[option] || 0);
      const percent = total ? Math.round((count / total) * 100) : 0;
      return '<div class="ics-stats-row"><span class="ics-stats-key">' + option + '</span>' +
        '<span class="ics-stats-bar"><i style="width:' + percent + '%"></i></span>' +
        '<span class="ics-stats-value">' + count + ' 人 · ' + percent + '%</span></div>';
    }).join('');
    ui.statsNote.textContent = choices.length
      ? '多选题各选项比例之和可能超过 100%。统计会在其他同学提交后自动更新。'
      : '本题暂无选项分布；正确率根据查看答案后的自评结果计算。';
  }

  async function loadQuestionStats(questionId) {
    stopStatsSubscription();
    state.statsQuestionId = questionId;
    state.currentStats = emptyStats(questionId);
    state.statsRevealed = false;
    ui.liveStats.hidden = true;
    ui.statsOptions.innerHTML = '';
    if (!state.supabase) return;

    const result = await state.supabase.from('ics_question_stats')
      .select('question_id,total_answers,correct_answers,option_counts,updated_at')
      .eq('question_id', questionId).maybeSingle();
    if (state.statsQuestionId !== questionId) return;
    if (!result.error && result.data) state.currentStats = result.data;

    state.statsChannel = state.supabase.channel('ics-question-' + questionId)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'ics_question_stats', filter: 'question_id=eq.' + questionId,
      }, function (payload) {
        if (state.statsQuestionId !== questionId || !payload.new) return;
        state.currentStats = payload.new;
        renderLiveStats();
      })
      .subscribe();
  }

  async function recordRemoteStats(question, isCorrect) {
    state.statsRevealed = true;
    renderLiveStats();
    if (!state.supabase) {
      ui.statsSummary.textContent = '统计服务尚未配置';
      ui.statsOptions.innerHTML = '';
      ui.liveDot.classList.add('offline');
      ui.statsNote.textContent = '统计数据库尚未完成初始化；运行项目中的 Supabase SQL 后即可启用。';
      return;
    }
    const selected = state.currentMode === 'choice'
      ? String(ui.answer.value || '').match(/[A-H]/g) || []
      : [];
    const result = await state.supabase.rpc('record_ics_answer', {
      p_question_id: question.id,
      p_visitor_id: visitorId(),
      p_selected_options: selected,
      p_is_correct: Boolean(isCorrect),
    });
    if (state.statsQuestionId !== question.id) return;
    if (result.error) {
      ui.statsSummary.textContent = '统计服务尚未初始化';
      ui.statsOptions.innerHTML = '';
      ui.liveDot.classList.add('offline');
      ui.statsNote.textContent = '统计暂时无法提交：' + result.error.message;
      return;
    }
    const row = Array.isArray(result.data) ? result.data[0] : result.data;
    if (row) state.currentStats = row;
    ui.liveDot.classList.remove('offline');
    renderLiveStats();
  }

  function splitAnswer(content) {
    let prompt = String(content || '');
    const answers = [];

    prompt = prompt.replace(/\*\*(?:参考)?答案\s*[:：]\s*([^*\n]+?)\*\*/gi, function (_, answer) {
      answers.push('答案：' + answer.trim());
      return '';
    });

    const marker = /(?:^|\n)\s*(?:\*\*)?(?:参考)?答案\s*[:：]\s*/im.exec(prompt);
    if (marker) {
      const start = marker.index + (prompt[marker.index] === '\n' ? 1 : 0);
      answers.push(prompt.slice(start).trim());
      prompt = prompt.slice(0, marker.index).trim();
    }

    return { prompt: prompt.trim(), answer: answers.join('\n\n').trim() };
  }

  function questionIdentity(raw) {
    return [raw.moduleId, raw.year, raw.examType, raw.questionNo, raw.summary]
      .map(function (value) { return String(value || '').trim(); }).join('|');
  }

  function prepareQuestion(raw, module, companion) {
    // 版本门控：只有题库明确给出 formatted && layout 时才走零猜测新路径，
    // 其余一律旧路径。这样题库只同步了一半也不会白屏，支持分批上线。
    const layout = (raw.formatted && raw.layout) ? raw.layout : null;
    let prompt;
    let directAnswer;
    let layoutChoices = null;

    if (layout) {
      prompt = String(layout.stem || '');
      directAnswer = String(layout.answer || '');
      if (!directAnswer) {
        // 兜底：实测有 6 条题目的答案标记紧贴前文（`2、答案：4f`），切进 %%% answer 段
        // 会改变投影，因此仍留在题干里。这里退回按正文拆答案，否则这 6 道会被静默
        // 移出题库（自测池会从 314 掉下来）。
        const fallback = splitAnswer(raw.content);
        directAnswer = fallback.answer;
        if (directAnswer) prompt = fallback.prompt;
      }
      if (layout.mode === 'choice' && Array.isArray(layout.choices)
          && layout.choices.length >= 2) {
        layoutChoices = layout.choices.map(function (choice) {
          return { key: choice.key, content: choice.content };
        });
      }
      // 有无答案版的同题时用它补齐选项。旧路径一直这么做，**不能省**：
      // 实测 2025期末 有 17 道「答案是多选字母、但本题切片里根本没有选项」的题
      // 完全依赖它进池；漏掉就会静默少 17 道（自测池 314 -> 299）。
      if (!layoutChoices && companion) {
        const compLayout = (companion.formatted && companion.layout)
          ? companion.layout : null;
        if (compLayout && Array.isArray(compLayout.choices)
            && compLayout.choices.length >= 2) {
          layoutChoices = compLayout.choices.map(function (choice) {
            return { key: choice.key, content: choice.content };
          });
          if (String(compLayout.stem || '').length > prompt.length) {
            prompt = String(compLayout.stem);
          }
        } else if (String(companion.content || '').trim().length > prompt.length) {
          prompt = String(companion.content).trim();
        }
      }
    } else {
      const split = splitAnswer(raw.content);
      // 只纳入能够从正文可靠拆出答案的题。relatedBlockIds 指向的往往是整份试卷
      // 的答案块，不保证与单题精确对应；使用它自动组卷会造成泄题或误判。
      if (!split.answer) return null;
      prompt = split.prompt;
      directAnswer = split.answer;
      if (companion && String(companion.content || '').trim().length > prompt.length) {
        prompt = String(companion.content).trim();
      }
    }

    if (!raw.answer || !raw.answer.inline || !directAnswer) return null;
    if (/(?:参考)?答案\s*[:：]/.test(prompt)) return null;
    const expected = simpleExpected(directAnswer);
    // 答案是选项字母、题面却没有完整选项时，通常是 PDF/题库切分丢失。
    // curated 题面（layout.stem）已经把选项拆出去了，所以优先信 layout.choices；
    // 没有结构化选项时退回原来的正文解析，保证与旧路径同一套 gating。
    if (expected && expected.kind === 'choice' && !layoutChoices) {
      // 结构化选项优先；没有时退回正文解析。这里必须用 `prompt`
      // （与旧路径同一个变量，含 companion 补齐的结果），否则「靠同题无答案版
      // 补齐选项」的那批题会被判掉。
      if (!parseChoiceQuestion(prompt, expected)) return null;
    }
    if (prompt.length < 140 && /(?:如下|下列|如图|所示|代码序列)\s*[：:]?\s*$/.test(prompt)) return null;
    return Object.assign({}, raw, {
      moduleTitle: module.title,
      prompt: prompt,
      directAnswer: directAnswer,
      formatted: !!layout,
      layoutChoices: layoutChoices,
      relatedBlockIds: [],
    });
  }

  function simpleExpected(answer) {
    const text = String(answer || '').replace(/\*+/g, '').trim();
    const upperText = text.toUpperCase();
    let match = upperText.match(/(?:答案|答)\s*[:：]\s*(?:选|为)?\s*((?:[A-H](?![A-Z0-9])(?:\s*(?:[、,，/&+]|和|及)\s*[A-H](?![A-Z0-9]))+)|(?:[A-H]+(?![A-Z0-9])))/);
    if (!match) match = upperText.match(/^\s*(?:选)?\s*((?:[A-H](?![A-Z0-9])(?:\s*(?:[、,，/&+]|和|及)\s*[A-H](?![A-Z0-9]))+)|(?:[A-H]+(?![A-Z0-9])))\s*[。.!！]?\s*$/);
    if (match) {
      const letters = match[1].match(/[A-H]/g);
      const hasSeparator = /[、,，/&+]|和|及/.test(match[1]);
      // 连写多选答案通常是按字母顺序且无重复的 ABC/ABDE；避免把 FFFA/FBAC
      // 这类十六进制填空误判成选择题答案。
      if (!hasSeparator && letters.length > 1 && letters.join('') !== Array.from(new Set(letters)).sort().join('')) return null;
      return { kind: 'choice', value: letters.sort().join('') };
    }
    match = text.match(/(?:答案|答)\s*[:：]\s*(正确|错误|对|错|是|否|√|×)/);
    if (match) return { kind: 'boolean', value: normalizeBoolean(match[1]) };
    return null;
  }

  function normalizeBoolean(value) {
    const s = String(value).trim();
    if (/^(正确|对|是|√)$/.test(s)) return 'true';
    if (/^(错误|错|否|×)$/.test(s)) return 'false';
    return '';
  }

  function autoGrade(userAnswer, expected) {
    if (!expected) return null;
    if (expected.kind === 'boolean') return normalizeBoolean(userAnswer) === expected.value;
    const compact = String(userAnswer).toUpperCase()
      .replace(/^\s*(?:答案)?\s*[:：]?\s*(?:选)?\s*/i, '')
      .replace(/[、,，/&+\s]|和|及/g, '')
      .replace(/[。.!！]+$/g, '');
    if (!/^[A-H]+$/.test(compact)) return false;
    return compact.split('').sort().join('') === expected.value;
  }

  function parseChoiceQuestion(source, expected) {
    if (!expected || expected.kind !== 'choice') return null;
    // PDF 表格经常把 A/B/C/D 四项压在同一行，用两个以上空格分栏。
    // 在明确知道答案是选项字母时，先恢复 B..H 的逻辑换行再解析。
    const normalizedSource = String(source || '').replace(
      /[ \t]{2,}(?=[B-H](?:[.．、)]\s*|[ \t]{2,}))/g,
      '\n'
    );
    const lines = normalizedSource.split('\n');
    let first = -1;
    const optionMatch = function (line) {
      return line.match(/^\s*([A-H])(?:[.．、)]\s*|\s{2,})(.*)$/i);
    };
    for (let i = 0; i < lines.length; i += 1) {
      const match = optionMatch(lines[i]);
      if (match && match[1].toUpperCase() === 'A') { first = i; break; }
    }
    if (first < 0) return null;

    const choices = [];
    let current = null;
    for (let i = first; i < lines.length; i += 1) {
      const match = optionMatch(lines[i]);
      if (match) {
        if (current) choices.push(current);
        current = { key: match[1].toUpperCase(), lines: [match[2]] };
      } else if (current) {
        current.lines.push(lines[i]);
      }
    }
    if (current) choices.push(current);

    const keys = choices.map(function (choice) { return choice.key; });
    if (choices.length < 2 || new Set(keys).size !== choices.length) return null;
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] !== String.fromCharCode(65 + i)) return null;
    }
    return {
      stem: lines.slice(0, first).join('\n').trim(),
      choices: choices.map(function (choice) {
        return { key: choice.key, content: choice.lines.join('\n').trim() };
      }),
      multiple: expected.value.length > 1,
    };
  }

  function parseFillQuestion(source) {
    let gapCount = 0;
    const gapPattern = /_{2,}|＿{2,}|（[\s　]{2,}）|\([\s　]{2,}\)|_+\s*(?:\(\d{1,2}\)|[①②③④⑤⑥⑦⑧⑨⑩])\s*_+/g;
    const parts = String(source || '').split(/(```+[\s\S]*?```+|~~~+[\s\S]*?~~~+)/g);
    const markdown = parts.map(function (part, index) {
      if (index % 2 === 1) return part;
      return part.replace(gapPattern, function () {
        const token = 'ICSGAP' + gapCount + 'X';
        gapCount += 1;
        return token;
      });
    }).join('');
    return gapCount ? { markdown: markdown, count: gapCount } : null;
  }

  function renderFillQuestion(fillQuestion) {
    let html = renderMarkdown(fillQuestion.markdown);
    for (let i = 0; i < fillQuestion.count; i += 1) {
      const input = '<span class="ics-inline-blank"><span class="ics-blank-number">' + (i + 1) + '</span>' +
        '<input class="ics-blank-input" name="blank-' + i + '" data-gap="' + i + '" ' +
        'form="ics-answer-form" aria-label="第 ' + (i + 1) + ' 空" autocomplete="off" required></span>';
      html = html.replace('ICSGAP' + i + 'X', input);
    }
    return html;
  }

  function secureShuffle(items) {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const random = new Uint32Array(1);
      crypto.getRandomValues(random);
      const j = random[0] % (i + 1);
      const temp = out[i]; out[i] = out[j]; out[j] = temp;
    }
    return out;
  }

  function selectedModuleIds() {
    return Array.from(ui.modules.querySelectorAll('input:checked')).map(function (input) { return input.value; });
  }

  function updateSelectToggle() {
    const boxes = Array.from(ui.modules.querySelectorAll('input'));
    ui.selectToggle.textContent = boxes.length && boxes.every(function (box) { return box.checked; }) ? '取消全选' : '全选';
  }

  function updateModeUi() {
    const mode = quizMode();
    const isExam = mode === 'exam';
    const isAll = mode === 'module-all';
    ui.moduleFieldset.hidden = isExam;
    ui.selectToggle.hidden = isExam || isAll;
    ui.countField.hidden = mode !== 'random';
    ui.yearField.hidden = !isExam;
    ui.examTypeField.hidden = isAll;
    ui.moduleLegend.textContent = isAll ? '选择一个知识模块' : '知识模块（可多选）';

    if (isAll) {
      const boxes = Array.from(ui.modules.querySelectorAll('input'));
      const selected = boxes.filter(function (box) { return box.checked; });
      const keep = selected[0] || boxes[0];
      boxes.forEach(function (box) { box.checked = box === keep; });
    }
    showSetupError('');
    updateSelectToggle();
  }

  function showSetupError(message) {
    ui.setupError.textContent = message;
    ui.setupError.hidden = !message;
  }

  async function init() {
    try {
      state.catalog = await fetchJson(app.dataset.catalog);
      ui.bankSummary.textContent = state.catalog.stats.questions + ' 道历年题 · ' + state.catalog.modules.length + ' 个知识模块';
      ui.modules.innerHTML = state.catalog.modules.map(function (module) {
        return '<label class="ics-module-card"><input type="checkbox" value="' + escapeHtml(module.id) + '" checked>' +
          '<span><strong>' + module.number + '. ' + escapeHtml(module.title) + '</strong>' +
          '<small>' + escapeHtml(module.name) + ' · ' + module.questionCount + ' 题</small></span></label>';
      }).join('');
      (state.catalog.filters.examTypes || []).forEach(function (type) {
        const option = document.createElement('option'); option.value = type; option.textContent = type; ui.examType.appendChild(option);
      });
      (state.catalog.filters.years || []).slice().sort(function (a, b) { return b - a; }).forEach(function (year) {
        const option = document.createElement('option'); option.value = String(year); option.textContent = year + ' 年'; ui.year.appendChild(option);
      });
      initSupabase();
      ui.start.disabled = false;
      updateModeUi();
    } catch (error) {
      ui.bankSummary.textContent = '题库暂时无法读取';
      showSetupError(error.message + '。请确认站点已通过本地服务器访问，并且 web-data/catalog.json 存在。');
    }
  }

  async function startQuiz() {
    const mode = quizMode();
    const ids = mode === 'exam' ? state.catalog.modules.map(function (module) { return module.id; }) : selectedModuleIds();
    if (!ids.length) { showSetupError('请至少选择一个知识模块。'); return; }
    if (mode === 'module-all' && ids.length !== 1) { showSetupError('模块全练一次只能选择一个知识模块。'); return; }
    if (mode === 'exam' && (!ui.year.value || !ui.examType.value)) {
      showSetupError('整卷练习需要同时选择年份和考试类型。'); return;
    }
    showSetupError('');
    ui.start.disabled = true; ui.start.textContent = '正在抽题…';
    try {
      const modules = state.catalog.modules.filter(function (module) { return ids.includes(module.id); });
      const payloads = await Promise.all(modules.map(function (module) {
        return fetchJson('./web-data/' + module.questionFile).then(function (data) { return { module: module, questions: data.questions || [] }; });
      }));
      const examType = mode === 'module-all' ? '' : ui.examType.value;
      const year = mode === 'exam' ? Number(ui.year.value) : null;
      let pool = [];
      payloads.forEach(function (payload) {
        const companions = new Map();
        payload.questions.forEach(function (candidate) {
          if (!candidate || !candidate.content) return;
          const hasInlineAnswer = candidate.answer && candidate.answer.inline;
          if (hasInlineAnswer || /(?:参考)?答案\s*[:：]/.test(candidate.content)) return;
          const key = questionIdentity(candidate);
          const previous = companions.get(key);
          if (!previous || candidate.content.length > previous.content.length) companions.set(key, candidate);
        });
        payload.questions.forEach(function (raw) {
          if (examType && raw.examType !== examType) return;
          if (year && Number(raw.year) !== year) return;
          const prepared = prepareQuestion(raw, payload.module, companions.get(questionIdentity(raw)));
          if (prepared) pool.push(prepared);
        });
      });
      if (!pool.length) throw new Error('当前筛选条件下没有带答案或解析的题目');

      const count = mode === 'random' ? Math.min(Number(ui.count.value), pool.length) : pool.length;
      state.questions = mode === 'exam' ? pool : secureShuffle(pool).slice(0, count);
      state.index = 0; state.score = 0; state.records = []; state.answerBlocks = new Map();

      ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false;
      renderQuestion();
    } catch (error) {
      showSetupError(error.message);
    } finally {
      ui.start.disabled = false; ui.start.textContent = '开始测试';
    }
  }

  function renderQuestion() {
    const q = state.questions[state.index];
    const number = state.index + 1;
    const expected = simpleExpected(q.directAnswer);
    let choiceQuestion = null;
    let fillQuestion = null;
    if (q.formatted) {
      // 结构化选项直接用，不再做任何启发式判断
      if (q.layoutChoices && q.layoutChoices.length >= 2) {
        choiceQuestion = {
          stem: q.prompt,
          choices: q.layoutChoices,
          multiple: !!(expected && expected.value && expected.value.length > 1),
        };
      } else {
        fillQuestion = parseFillQuestion(q.prompt);
      }
    } else {
      choiceQuestion = parseChoiceQuestion(q.prompt, expected);
      fillQuestion = choiceQuestion ? null : parseFillQuestion(q.prompt);
    }
    state.currentMode = choiceQuestion ? 'choice'
      : fillQuestion ? 'fill' : 'short';
    const modeLabel = state.currentMode === 'choice'
      ? (choiceQuestion.multiple ? '多选题' : '单选题')
      : state.currentMode === 'fill' ? '填空题' : '简答题';
    ui.progressText.textContent = '第 ' + number + ' / ' + state.questions.length + ' 题';
    ui.scoreText.textContent = '当前 ' + state.score + ' 分';
    ui.progressBar.style.width = ((state.index / state.questions.length) * 100) + '%';
    ui.questionMeta.innerHTML = '<span class="ics-mode-badge">' + modeLabel + '</span>' +
      [q.moduleTitle, q.year, q.examType, q.questionNo, q.exam]
        .filter(Boolean).map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('');
    ui.questionTitle.textContent = q.summary || q.questionNo || '题目 ' + number;
    ui.questionContent.innerHTML = choiceQuestion
      ? (q.formatted ? renderLayoutStem(choiceQuestion.stem) : renderMarkdown(choiceQuestion.stem))
      : fillQuestion ? renderFillQuestion(fillQuestion)
        : (q.formatted ? renderLayoutStem(q.prompt) : renderMarkdown(q.prompt));
    ui.answer.value = ''; ui.answer.disabled = false; ui.submit.disabled = false;
    ui.answerForm.dataset.mode = state.currentMode;
    ui.choiceList.innerHTML = '';
    ui.choiceList.hidden = !choiceQuestion;
    ui.answerLabel.textContent = state.currentMode === 'choice'
      ? '选择答案'
      : state.currentMode === 'fill' ? '填写答案' : '思考完成后查看参考答案';
    ui.answerHint.textContent = state.currentMode === 'choice'
      ? (choiceQuestion.multiple ? '可选择多个选项' : '点击一个选项')
      : state.currentMode === 'fill' ? '每个空格单独填写' : '本题查看答案后自评';
    ui.submit.textContent = state.currentMode === 'short' ? '显示参考答案' : '提交答案';
    if (choiceQuestion) {
      ui.choiceList.dataset.multiple = choiceQuestion.multiple ? 'true' : 'false';
      ui.choiceList.innerHTML = choiceQuestion.choices.map(function (choice) {
        return '<button class="ics-choice" type="button" data-choice="' + choice.key + '" aria-pressed="false">' +
          '<span class="ics-choice-key">' + choice.key + '</span>' +
          '<span class="ics-choice-content post-content">' + (q.formatted ? renderLayoutChoice(choice.content) : renderChoiceMarkdown(choice.content)) + '</span></button>';
      }).join('');
    }
    ui.answerForm.hidden = false; ui.feedback.hidden = true; ui.selfGrade.hidden = true; ui.next.hidden = true;
    ui.verdict.className = 'ics-verdict'; ui.reference.innerHTML = '';
    typeset(ui.questionContent);
    typeset(ui.choiceList);
    loadQuestionStats(q.id).catch(function () {});
    window.scrollTo({ top: ui.quiz.offsetTop - 90, behavior: 'smooth' });
  }

  function referenceFor(q) {
    const chunks = [];
    if (q.directAnswer) chunks.push(q.directAnswer);
    q.relatedBlockIds.forEach(function (id) {
      const block = state.answerBlocks.get(id);
      if (block) chunks.push((block.label ? '### ' + block.label + '\n\n' : '') + block.content);
    });
    return chunks.join('\n\n---\n\n') || '这道题暂无可展示的参考答案。';
  }

  function recordGrade(points, mode) {
    const q = state.questions[state.index];
    state.score += points;
    state.records.push({ question: q, answer: ui.answer.value.trim(), points: points, mode: mode });
    recordRemoteStats(q, points === 1).catch(function () {});
    ui.scoreText.textContent = '当前 ' + state.score + ' 分';
    ui.selfGrade.hidden = true;
    ui.next.hidden = false;
    ui.next.textContent = state.index === state.questions.length - 1 ? '查看成绩' : '下一题';
  }

  function submitAnswer(event) {
    event.preventDefault();
    if (state.currentMode === 'choice' && !ui.answer.value.trim()) {
      ui.choiceList.classList.add('needs-choice');
      return;
    }
    if (state.currentMode === 'fill') {
      const inputs = Array.from(ui.questionContent.querySelectorAll('.ics-blank-input'));
      const missing = inputs.find(function (input) { return !input.value.trim(); });
      if (missing) { missing.classList.add('missing'); missing.focus(); return; }
      ui.answer.value = inputs.map(function (input, index) {
        input.disabled = true;
        return '第 ' + (index + 1) + ' 空：' + input.value.trim();
      }).join('；');
    } else if (state.currentMode === 'short') {
      ui.answer.value = '查看参考答案后自评';
    }
    const q = state.questions[state.index];
    const expected = simpleExpected(q.directAnswer);
    const result = state.currentMode === 'choice' ? autoGrade(ui.answer.value, expected) : null;
    ui.answer.disabled = true; ui.submit.disabled = true; ui.feedback.hidden = false;
    ui.choiceList.querySelectorAll('button').forEach(function (button) { button.disabled = true; });
    ui.reference.innerHTML = renderMarkdown(referenceFor(q));
    typeset(ui.reference);

    if (result === true) {
      ui.verdict.className = 'ics-verdict correct'; ui.verdict.textContent = '回答正确，得 1 分。';
      recordGrade(1, 'auto');
    } else if (result === false) {
      ui.verdict.className = 'ics-verdict incorrect'; ui.verdict.textContent = '答案不一致，本题暂得 0 分。';
      recordGrade(0, 'auto');
    } else {
      ui.verdict.textContent = state.currentMode === 'fill'
        ? '已显示各空的参考内容，请核对后完成自评。'
        : '已显示参考答案 / 解析，请根据关键点完成自评。';
      ui.selfGrade.hidden = false;
    }
  }

  function finishQuiz() {
    ui.quiz.hidden = true; ui.result.hidden = false;
    const total = state.questions.length;
    const percent = Math.round((state.score / total) * 100);
    ui.finalScore.textContent = percent + '%';
    ui.finalSummary.textContent = '共 ' + total + ' 题，得到 ' + state.score + ' / ' + total + ' 分。';
    ui.reviewList.hidden = true; ui.reviewToggle.textContent = '查看答题记录';
    ui.reviewList.innerHTML = state.records.map(function (record, index) {
      return '<div class="ics-review-item"><span class="ics-review-score">' + record.points + ' 分</span>' +
        '<strong>' + (index + 1) + '. ' + escapeHtml(record.question.summary || record.question.questionNo) + '</strong>' +
        '<p>你的回答：' + escapeHtml(record.answer) + '</p></div>';
    }).join('');
    window.scrollTo({ top: ui.result.offsetTop - 90, behavior: 'smooth' });
  }

  function resetToSetup() {
    stopStatsSubscription();
    ui.quiz.hidden = true; ui.result.hidden = true; ui.setup.hidden = false;
    showSetupError('');
    window.scrollTo({ top: ui.setup.offsetTop - 90, behavior: 'smooth' });
  }

  ui.modePicker.addEventListener('change', updateModeUi);
  ui.modules.addEventListener('change', function (event) {
    if (quizMode() === 'module-all' && event.target.matches('input')) {
      ui.modules.querySelectorAll('input').forEach(function (box) { box.checked = box === event.target; });
    }
    updateSelectToggle();
  });
  ui.selectToggle.addEventListener('click', function () {
    const boxes = Array.from(ui.modules.querySelectorAll('input'));
    const allSelected = boxes.length && boxes.every(function (box) { return box.checked; });
    boxes.forEach(function (box) { box.checked = !allSelected; }); updateSelectToggle();
  });
  ui.start.addEventListener('click', startQuiz);
  ui.answerForm.addEventListener('submit', submitAnswer);
  ui.choiceList.addEventListener('click', function (event) {
    const button = event.target.closest('[data-choice]');
    if (!button) return;
    const multiple = ui.choiceList.dataset.multiple === 'true';
    if (!multiple) {
      ui.choiceList.querySelectorAll('[data-choice]').forEach(function (item) {
        const selected = item === button;
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    } else {
      const selected = !button.classList.contains('selected');
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    }
    ui.choiceList.classList.remove('needs-choice');
    ui.answer.value = Array.from(ui.choiceList.querySelectorAll('.selected'))
      .map(function (item) { return item.dataset.choice; }).sort().join('');
  });
  ui.selfGrade.addEventListener('click', function (event) {
    const button = event.target.closest('[data-grade]');
    if (!button) return;
    const points = Number(button.dataset.grade);
    ui.verdict.className = 'ics-verdict ' + (points === 1 ? 'correct' : points === 0 ? 'incorrect' : '');
    ui.verdict.textContent = '已自评：本题 ' + points + ' 分。';
    recordGrade(points, 'self');
  });
  ui.next.addEventListener('click', function () {
    if (state.index >= state.questions.length - 1) finishQuiz();
    else { state.index += 1; renderQuestion(); }
  });
  ui.abandon.addEventListener('click', resetToSetup);
  ui.retry.addEventListener('click', resetToSetup);
  ui.reviewToggle.addEventListener('click', function () {
    ui.reviewList.hidden = !ui.reviewList.hidden;
    ui.reviewToggle.textContent = ui.reviewList.hidden ? '查看答题记录' : '收起答题记录';
  });
  const wechatCopy = document.querySelector('[data-copy-wechat]');
  if (wechatCopy) {
    wechatCopy.addEventListener('click', async function () {
      const hint = wechatCopy.querySelector('small');
      try {
        await navigator.clipboard.writeText(wechatCopy.dataset.copyWechat);
        hint.textContent = '已复制微信号';
        setTimeout(function () { hint.textContent = '点击复制'; }, 1800);
      } catch (_) {
        hint.textContent = '微信号：' + wechatCopy.dataset.copyWechat;
      }
    });
  }

  init();
}());
