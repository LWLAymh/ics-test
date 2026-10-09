(function () {
  'use strict';

  const app = document.getElementById('ics-app');
  if (!app) return;

  const $ = (id) => document.getElementById(id);
  const ui = {
    setup: $('ics-setup'), modules: $('ics-modules'), bankSummary: $('ics-bank-summary'),
    modePicker: $('ics-mode-picker'), moduleFieldset: $('ics-module-fieldset'), moduleLegend: $('ics-module-legend'),
    selectToggle: $('ics-select-toggle'), count: $('ics-count'), countField: $('ics-count-field'),
    examType: $('ics-exam-type'), examTypeField: $('ics-exam-type-field'),
    paper: $('ics-paper'), paperField: $('ics-paper-field'), paperStatus: $('ics-paper-status'),
    start: $('ics-start'), setupError: $('ics-setup-error'), quiz: $('ics-quiz'),
    abandon: $('ics-abandon'), progressText: $('ics-progress-text'), scoreText: $('ics-score-text'),
    progressBar: $('ics-progress-bar'), questionMeta: $('ics-question-meta'),
    questionContent: $('ics-question-content'),
    answerForm: $('ics-answer-form'), answerLabel: $('ics-answer-label'), answerHint: $('ics-answer-hint'),
    choiceList: $('ics-choice-list'), answer: $('ics-answer'), submit: $('ics-submit'), skip: $('ics-skip'),
    reportIssue: $('ics-report-issue'), reportStatus: $('ics-report-status'),
    feedback: $('ics-feedback'), verdict: $('ics-verdict'), reference: $('ics-reference'),
    liveStats: $('ics-live-stats'), statsSummary: $('ics-stats-summary'), statsOptions: $('ics-stats-options'), statsNote: $('ics-stats-note'), liveDot: $('ics-live-dot'),
    selfGrade: $('ics-self-grade'), next: $('ics-next'), result: $('ics-result'),
    finalScore: $('ics-final-score'), finalSummary: $('ics-final-summary'), retry: $('ics-retry'),
    reviewToggle: $('ics-review-toggle'), reviewList: $('ics-review-list'),
    issueBoard: $('ics-issue-board'), issueCount: $('ics-issue-count'),
    issueBoardStatus: $('ics-issue-board-status'), issueList: $('ics-issue-list'),
  };

  const state = {
    catalog: null, papers: [], questions: [], index: 0, score: 0, records: [], currentMode: '',
    groups: new Map(), moduleCache: new Map(),
    supabase: null, statsChannel: null, currentStats: null, statsQuestionId: '', statsRevealed: false,
    issueChannel: null, reportedIssues: [], issueQuestionIndex: new Map(), issueIndexLoaded: false,
    reportedThisSession: new Set(), issueReloadTimer: null, pendingCompositeGrade: null,
  };
  const PUBLISHED_QUESTION_KINDS = new Set([
    'single-choice', 'multiple-choice', 'fill', 'short-answer', 'composite',
  ]);
  function createMarkdownRenderer(breaks) {
    if (!window.markdownit) return null;
    const rendererInstance = window.markdownit({ html: false, linkify: true, breaks: breaks });
    const defaultImage = rendererInstance.renderer.rules.image || function (tokens, index, options, env, renderer) {
      return renderer.renderToken(tokens, index, options);
    };
    rendererInstance.renderer.rules.image = function (tokens, index, options, env, renderer) {
      const token = tokens[index];
      const source = String(token.attrGet('src') || '').replace(/\\/g, '/');
      const assetIndex = source.indexOf('assets/');
      if (assetIndex >= 0) token.attrSet('src', './web-data/assets/' + source.slice(assetIndex + 7));
      // 页面同时只展示一道题，题面图片应立即加载；lazy + content-visibility 会让
      // 部分浏览器长时间保留空白占位。
      token.attrSet('loading', 'eager');
      token.attrSet('decoding', 'async');
      token.attrSet('fetchpriority', 'high');
      token.attrSet('data-ics-question-image', '');
      return defaultImage(tokens, index, options, env, renderer);
    };
    return rendererInstance;
  }
  const md = createMarkdownRenderer(false);
  // `_curated/*.md` 使用标准 Markdown 换行语义：普通单换行只是源码折行，
  // 空行才分段；需要保留的换行应写成代码围栏或 Markdown 硬换行。
  // 不能启用 breaks=true，否则 PDF/人工录入留下的行尾会在宽屏上提前断句。
  const formattedMd = createMarkdownRenderer(false);

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isPublishedQuestion(question) {
    return PUBLISHED_QUESTION_KINDS.has(question && question.interaction && question.interaction.kind) &&
      question.presentation && question.presentation.status === 'ready';
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

  // Markdown 的 softbreak 在 HTML 中会折叠成一个空格。英文需要这个空格，
  // 中文 PDF 折行则不应凭空插入空格；围栏代码与显式硬换行保持原样。
  function normalizeLayoutMarkdown(source) {
    return String(source || '').replace(/\r\n?/g, '\n')
      .split(/(```+[\s\S]*?```+|~~~+[\s\S]*?~~~+)/g)
      .map(function (part, index) {
        if (index % 2 === 1) return part;
        return part.replace(/([\u3000-\u303f\u3400-\u9fff\uff00-\uff65])\n(?=[\u3000-\u303f\u3400-\u9fff\uff00-\uff65])/g, '$1');
      }).join('');
  }

  // 新路径（formatted）：题库已经给出结构化 layout，前端**一点不猜**。
  // 该是代码就写反引号、该是公式就写 $…$、都不写就是普通文本 —— 同一题内不可能
  // 再出现「一个选项等宽、兄弟选项普通文本」的观感割裂。
  // 注意：这两个函数必须留在 ics-check.js 抽取的片段内（escapeHtml..secureShuffle），
  // 否则体检脚本里的 Function 构造会报 not defined。
  function renderLayoutStem(text) {
    const clean = normalizeLayoutMarkdown(text);
    return formattedMd ? formattedMd.render(clean) : '<pre>' + escapeHtml(clean) + '</pre>';
  }

  function renderLayoutChoice(text) {
    const clean = normalizeLayoutMarkdown(text).trim();
    // 选项本身也允许是完整的人工 Markdown（表格、围栏代码、图片等），
    // 不能用 renderInline 把块级结构当成普通字符显示。
    return formattedMd ? formattedMd.render(clean) : '<pre>' + escapeHtml(clean) + '</pre>';
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

  function issueTypeLabel(kind) {
    return {
      'single-choice': '单选题', 'multiple-choice': '多选题', fill: '填空题',
      'short-answer': '简答题', composite: '复合题', choice: '选择题', legacy: '题型待确认',
    }[kind] || '题型待确认';
  }

  function formatIssueTime(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).format(date);
  }

  function renderIssueBoard() {
    const rows = state.reportedIssues;
    ui.issueCount.textContent = rows.length ? rows.length + ' 道待复核' : '暂无报告';
    if (!rows.length) {
      ui.issueList.innerHTML = '';
      if (!ui.issueBoardStatus.textContent) ui.issueBoardStatus.textContent = '目前没有同学报告题目问题。';
      return;
    }
    ui.issueBoardStatus.textContent = state.issueIndexLoaded ? '' : '展开后将加载题目定位信息。';
    ui.issueList.innerHTML = rows.map(function (row) {
      const question = state.issueQuestionIndex.get(row.question_id);
      const meta = question
        ? [issueTypeLabel(question.kind), question.moduleTitle, question.exam, question.questionNo]
          .filter(Boolean).map(escapeHtml).join(' · ')
        : '题目定位信息尚未加载';
      const latest = formatIssueTime(row.last_reported_at);
      return '<article class="ics-issue-item">' +
        '<div class="ics-issue-item-main"><div class="ics-issue-item-head">' +
        '<code>' + escapeHtml(row.question_id) + '</code>' +
        '<button class="ics-issue-copy" type="button" data-copy-question-id="' + escapeHtml(row.question_id) + '">复制 ID</button>' +
        '</div><p class="ics-issue-item-meta">' + meta + (latest ? '<br>最近报告：' + escapeHtml(latest) : '') + '</p></div>' +
        '<span class="ics-issue-item-stats">' + Number(row.report_count || 0) + ' 人报告</span></article>';
    }).join('');
  }

  async function ensureIssueQuestionIndex() {
    if (state.issueIndexLoaded || !state.catalog) return;
    ui.issueBoardStatus.textContent = '正在读取题目定位信息…';
    const payloads = await Promise.all(state.catalog.modules.map(function (module) {
      return fetchJson('./web-data/' + module.questionFile).then(function (payload) {
        return { module: module, questions: payload.questions || [] };
      });
    }));
    payloads.forEach(function (payload) {
      payload.questions.forEach(function (question) {
        const meta = {
          kind: question.interaction && question.interaction.kind,
          moduleTitle: payload.module.title,
          exam: question.exam,
          questionNo: question.questionNo,
        };
        state.issueQuestionIndex.set(question.id, meta);
        if (question.group && question.group.questionId) {
          state.issueQuestionIndex.set(question.group.questionId, {
            kind: 'composite', moduleTitle: payload.module.title,
            exam: question.exam, questionNo: question.group.title,
          });
        }
      });
    });
    state.issueIndexLoaded = true;
    renderIssueBoard();
  }

  async function loadReportedIssues() {
    if (!state.supabase) {
      ui.issueCount.textContent = '尚未连接';
      ui.issueBoardStatus.textContent = '问题上报数据库尚未连接。';
      return;
    }
    const result = await state.supabase.from('ics_question_issue_reports')
      .select('question_id,report_count,first_reported_at,last_reported_at')
      .order('last_reported_at', { ascending: false });
    if (result.error) {
      ui.issueCount.textContent = '尚未初始化';
      ui.issueBoardStatus.textContent = '问题上报功能尚未完成数据库初始化。';
      return;
    }
    state.reportedIssues = result.data || [];
    renderIssueBoard();
    if (ui.issueBoard.open) await ensureIssueQuestionIndex();
  }

  function startIssueSubscription() {
    if (!state.supabase) return;
    if (state.issueChannel) state.supabase.removeChannel(state.issueChannel);
    state.issueChannel = state.supabase.channel('ics-question-issue-board')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'ics_question_issue_reports',
      }, function () {
        clearTimeout(state.issueReloadTimer);
        state.issueReloadTimer = setTimeout(function () { loadReportedIssues().catch(function () {}); }, 120);
      })
      .subscribe();
  }

  async function reportCurrentIssue() {
    const question = state.questions[state.index];
    if (!question || state.reportedThisSession.has(question.id)) return;
    ui.reportIssue.disabled = true;
    ui.reportIssue.textContent = '正在提交…';
    ui.reportStatus.textContent = '';
    if (!state.supabase) {
      ui.reportIssue.disabled = false;
      ui.reportIssue.textContent = '您认为此题有误';
      ui.reportStatus.textContent = '问题上报服务尚未连接。';
      return;
    }
    const result = await state.supabase.rpc('report_ics_question_issue', {
      p_question_id: question.id,
      p_visitor_id: visitorId(),
    });
    if (result.error) {
      if (state.questions[state.index] && state.questions[state.index].id === question.id) {
        ui.reportIssue.disabled = false;
        ui.reportIssue.textContent = '您认为此题有误';
        ui.reportStatus.textContent = '提交失败：' + result.error.message;
      }
      return;
    }
    state.reportedThisSession.add(question.id);
    if (state.questions[state.index] && state.questions[state.index].id === question.id) {
      ui.reportIssue.textContent = '已报告，感谢反馈';
      ui.reportStatus.textContent = '题目 ID：' + question.id;
    }
    await loadReportedIssues();
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

    prompt = prompt.replace(/\*\*(?:参考答案|答案|答)\s*[:：]\s*([^*\n]+?)\*\*/gi, function (_, answer) {
      answers.push('答案：' + answer.trim());
      return '';
    });

    const marker = /(?:^|\n)\s*(?:\*\*)?(?:参考答案|答案|答)\s*[:：]\s*/im.exec(prompt);
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

  function prepareQuestion(raw, module, companion, options) {
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

    const answerStatus = raw.answer && raw.answer.status
      ? raw.answer.status : (raw.answer && raw.answer.inline ? 'verified' : 'missing');
    const answerAvailable = answerStatus === 'verified' && Boolean(directAnswer);
    if (!answerAvailable && !(options && options.allowIncomplete)) return null;
    if (!answerAvailable) directAnswer = '';
    if (/(?:参考)?答案\s*[:：]/.test(prompt)) return null;
    const expected = simpleExpected(directAnswer);
    // 答案是选项字母、题面却没有完整选项时，通常是 PDF/题库切分丢失。
    // curated 题面（layout.stem）已经把选项拆出去了，所以优先信 layout.choices；
    // 没有结构化选项时退回原来的正文解析，保证与旧路径同一套 gating。
    //
    // 这道门禁只对「选择题」成立：填空题、简答题和组合片段的答案本来就可能以 A、B、
    // C 甚至 `E_icode` 这种字母开头，simpleExpected 会把它误读成选项字母。若不按声明
    // 的题型限定，这些题会被静默移出练习池（实测 15 道，其中 6 道是组合片段，会让整道
    // 组合题凭空少掉小问）。没有结构化 layout 的旧路径仍沿用原来的判断。
    const declaredKind = raw.interaction && raw.interaction.kind;
    const isChoiceKind = declaredKind === 'single-choice' || declaredKind === 'multiple-choice';
    if (expected && expected.kind === 'choice' && !layoutChoices && (!layout || isChoiceKind)) {
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
      answerStatus: answerStatus,
      answerAvailable: answerAvailable,
      formatted: !!layout,
      layoutChoices: layoutChoices,
    });
  }

  function combineQuestionGroup(members) {
    const ordered = members.slice().sort(function (a, b) {
      return Number(a.group.order || 0) - Number(b.group.order || 0);
    });
    const first = ordered[0];
    const group = first.group;
    const prompt = ordered.map(function (question) {
      let part = String(question.prompt || '').trim();
      const explicitChoices = question.layout && Array.isArray(question.layout.choices)
        ? question.layout.choices : [];
      if (explicitChoices.length) {
        part += '\n\n' + explicitChoices.map(function (choice) {
          return '**' + choice.key + '.**\n\n' + String(choice.content || '').trim();
        }).join('\n\n');
      }
      return part;
    }).filter(Boolean).join('\n\n---\n\n');
    const directAnswer = ordered.map(function (question) {
      const heading = String(question.questionNo || '').trim();
      const answer = String(question.directAnswer || '').trim() || '本部分答案尚未完成校对。';
      return (heading ? '### ' + heading + '\n\n' : '') + answer;
    }).join('\n\n---\n\n');
    const answerAvailable = ordered.every(function (question) { return question.answerAvailable; });
    const compositeParts = ordered.map(function (question, index) {
      const partInteraction = question.partInteraction || question.interaction || {};
      return {
        id: question.id,
        label: String(question.questionNo || '').trim() || ('第 ' + (index + 1) + ' 小问'),
        kind: partInteraction.kind || 'short-answer',
        stem: String(question.prompt || '').trim(),
        choices: Array.isArray(question.layoutChoices) ? question.layoutChoices : [],
        correctChoiceIds: Array.isArray(partInteraction.correctChoiceIds)
          ? partInteraction.correctChoiceIds : [],
        blankAnswers: Array.isArray(partInteraction.blankAnswers)
          ? partInteraction.blankAnswers : [],
        answer: String(question.directAnswer || '').trim(),
        answerAvailable: question.answerAvailable,
      };
    });
    const assets = [];
    ordered.forEach(function (question) {
      (question.assets || []).forEach(function (asset) {
        if (!assets.includes(asset)) assets.push(asset);
      });
    });
    return Object.assign({}, first, {
      id: group.questionId,
      questionNo: group.title,
      paperOrder: Math.min.apply(null, ordered.map(function (question) {
        return Number(question.paperOrder || 0);
      })),
      prompt: prompt,
      directAnswer: directAnswer,
      answerStatus: answerAvailable ? 'verified' : 'needs-review',
      answerAvailable: answerAvailable,
      formatted: true,
      layout: { mode: 'composite', selection: null, stem: prompt, choices: [], answer: directAnswer },
      interaction: { kind: 'composite', declared: true },
      layoutChoices: null,
      compositeParts: compositeParts,
      assets: assets,
      groupMembers: ordered.map(function (question) { return question.id; }),
    });
  }

  function collapseQuestionGroups(pool) {
    const groups = new Map();
    pool.forEach(function (question) {
      if (!question.group || !question.group.questionId) return;
      if (!groups.has(question.group.questionId)) groups.set(question.group.questionId, []);
      groups.get(question.group.questionId).push(question);
    });
    const emitted = new Set();
    const collapsed = [];
    pool.forEach(function (question) {
      if (!question.group || !question.group.questionId) {
        collapsed.push(question);
        return;
      }
      const groupId = question.group.questionId;
      if (emitted.has(groupId)) return;
      emitted.add(groupId);
      collapsed.push(combineQuestionGroup(groups.get(groupId)));
    });
    return collapsed;
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
    const gaps = [];
    const gapPattern = /\{\{blank:([A-Za-z][A-Za-z0-9_-]*)\}\}|_+\s*(?:\(\d{1,2}\)|[①②③④⑤⑥⑦⑧⑨⑩])\s*_+|_{2,}|＿{2,}|（[\s　]{2,}）|\([\s　]{2,}\)/g;
    // 空位必须由人工 Markdown 显式写出；不猜测题意。代码补全题的空位通常
    // 正在 fenced code block 内，因此也要替换成占位 token，等 Markdown 渲染
    // 完成后再把 token 换成逐空输入框。
    const markdown = String(source || '').replace(gapPattern, function (_, explicitId) {
      const token = 'ICSGAP' + gapCount + 'X';
      gaps.push({ id: explicitId || ('legacy-gap-' + gapCount), explicit: Boolean(explicitId) });
      gapCount += 1;
      return token;
    });
    return gapCount ? { markdown: markdown, count: gapCount, gaps: gaps } : null;
  }

  function renderFillQuestion(fillQuestion, formatted, partIndex) {
    let html = formatted ? renderLayoutStem(fillQuestion.markdown) : renderMarkdown(fillQuestion.markdown);
    for (let i = 0; i < fillQuestion.count; i += 1) {
      const gap = fillQuestion.gaps[i];
      const input = '<span class="ics-inline-blank"><span class="ics-blank-number">' + (i + 1) + '</span>' +
        '<input class="ics-blank-input" name="blank-' + (partIndex == null ? 'root' : partIndex) + '-' + i + '" ' +
        'data-gap="' + i + '" data-blank-id="' + escapeHtml(gap.id) + '" ' +
        (partIndex == null ? '' : 'data-part-index="' + partIndex + '" ') +
        'form="ics-answer-form" aria-label="第 ' + (i + 1) + ' 空" autocomplete="off" required></span>';
      html = html.replace('ICSGAP' + i + 'X', input);
    }
    return html;
  }

  function gradeFillInputs(inputs, blankAnswers) {
    const configs = new Map((blankAnswers || []).map(function (item) { return [item.id, item]; }));
    if (!inputs.length || inputs.some(function (input) { return !configs.has(input.dataset.blankId); })) return null;
    return inputs.every(function (input) {
      const config = configs.get(input.dataset.blankId);
      let actual = input.value;
      if (config.trimWhitespace !== false) actual = actual.trim();
      if (!config.caseSensitive) actual = actual.toLocaleLowerCase();
      return (config.acceptedAnswers || []).some(function (candidate) {
        let expected = String(candidate);
        if (config.trimWhitespace !== false) expected = expected.trim();
        if (!config.caseSensitive) expected = expected.toLocaleLowerCase();
        return actual === expected;
      });
    });
  }

  function renderCompositeQuestion(question) {
    return (question.compositeParts || []).map(function (part, index) {
      const kind = part.kind;
      const kindLabel = kind === 'single-choice' ? '单选' : kind === 'multiple-choice' ? '多选'
        : kind === 'fill' ? '填空' : '简答';
      let body = '';
      if (kind === 'fill') {
        const fill = parseFillQuestion(part.stem);
        body = fill ? renderFillQuestion(fill, true, index) : renderLayoutStem(part.stem);
      } else {
        body = renderLayoutStem(part.stem);
      }
      if (kind === 'single-choice' || kind === 'multiple-choice') {
        body += '<div class="ics-composite-choices" data-part-index="' + index + '" data-multiple="' +
          (kind === 'multiple-choice' ? 'true' : 'false') + '">' + (part.choices || []).map(function (choice) {
            return '<button class="ics-choice" type="button" data-composite-choice="' + escapeHtml(choice.key) +
              '" aria-pressed="false"><span class="ics-choice-key">' + escapeHtml(choice.key) + '</span>' +
              '<span class="ics-choice-content post-content">' + renderLayoutChoice(choice.content) + '</span></button>';
          }).join('') + '</div>';
      } else if (kind === 'short-answer') {
        body += '<p class="ics-composite-note">本小问思考完成后，在整题提交时查看参考答案并自评。</p>';
      }
      return '<section class="ics-composite-part" data-composite-part="' + index + '">' +
        '<header><strong>' + escapeHtml(part.label || ('第 ' + (index + 1) + ' 小问')) + '</strong>' +
        '<span>' + kindLabel + '</span></header><div class="ics-composite-body">' + body + '</div></section>';
    }).join('');
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
    ui.examTypeField.hidden = isAll || isExam;
    ui.paperField.hidden = !isExam;
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

  function updatePaperStatus() {
    const paper = state.papers.find(function (item) { return item.id === ui.paper.value; });
    if (!paper) { ui.paperStatus.textContent = ''; return; }
    const quizCount = Number(paper.quizQuestionCount || paper.publishedQuestionCount || 0);
    ui.paperStatus.textContent = quizCount + ' 道测试题（' + paper.publishedQuestionCount + ' 个题目片段） · 单选 ' +
      paper.singleChoiceCount + ' · 多选 ' + paper.multipleChoiceCount +
      ' · 填空 ' + Number(paper.fillCount || 0) +
      ' · 简答 ' + Number(paper.shortAnswerCount || 0) +
      ' · 组合片段 ' + Number(paper.compositeCount || 0);
  }

  // 组合题索引由构建期写出（web-data/groups.json）。前端只读它来定位同组片段，
  // 不解析文件名、也不从题面文字猜关联关系。
  async function loadQuestionGroups() {
    if (!state.catalog.groupsFile) return;
    const payload = await fetchJson('./web-data/' + state.catalog.groupsFile);
    state.groups = new Map();
    (payload.groups || []).forEach(function (group) {
      if (group && group.questionId) state.groups.set(group.questionId, group);
    });
  }

  function companionIndex(questions) {
    const companions = new Map();
    questions.forEach(function (candidate) {
      if (!candidate || !candidate.content) return;
      const hasInlineAnswer = candidate.answer && candidate.answer.inline;
      if (hasInlineAnswer || /(?:参考)?答案\s*[:：]/.test(candidate.content)) return;
      const key = questionIdentity(candidate);
      const previous = companions.get(key);
      if (!previous || candidate.content.length > previous.content.length) companions.set(key, candidate);
    });
    return companions;
  }

  function loadModulePayload(module) {
    if (!state.moduleCache.has(module.id)) {
      state.moduleCache.set(module.id, fetchJson('./web-data/' + module.questionFile).then(function (data) {
        const questions = data.questions || [];
        return { module: module, questions: questions, companions: companionIndex(questions) };
      }));
    }
    return state.moduleCache.get(module.id);
  }

  // 一个组合题的各小问可能被分到不同模块。只要练习池里出现了它的任一片段，
  // 就必须把其余片段从各自模块补齐，否则「一大题」会被渲染成只剩几个小问的残缺题面。
  // 补齐只看构建期索引，与用户选中了哪些模块无关；组合题本身不可拆分作答。
  async function completeQuestionGroups(pool, prepareOptions) {
    if (!state.groups.size) return pool;
    const present = new Set();
    pool.forEach(function (question) { present.add(question.id); });
    const missingIds = new Set();
    const moduleFiles = new Set();
    pool.forEach(function (question) {
      const groupId = question.group && question.group.questionId;
      if (!groupId) return;
      const group = state.groups.get(groupId);
      if (!group) return;
      (group.members || []).forEach(function (member) {
        if (present.has(member.id)) return;
        missingIds.add(member.id);
        moduleFiles.add(member.questionFile);
      });
    });
    if (!missingIds.size) return pool;
    const moduleByFile = new Map(state.catalog.modules.map(function (module) {
      return [module.questionFile, module];
    }));
    const payloads = await Promise.all(Array.from(moduleFiles).map(function (file) {
      const module = moduleByFile.get(file);
      return module ? loadModulePayload(module) : null;
    }));
    payloads.forEach(function (payload) {
      if (!payload) return;
      payload.questions.forEach(function (raw) {
        if (!missingIds.has(raw.id)) return;
        const prepared = prepareQuestion(raw, payload.module, payload.companions.get(questionIdentity(raw)), prepareOptions);
        if (prepared) pool.push(prepared);
      });
    });
    return pool;
  }

  // 片段仍然拼不齐时宁可整题移出本次练习，也不显示被截断的题面。
  function dropIncompleteGroups(pool) {
    if (!state.groups.size) return pool;
    return pool.filter(function (question) {
      const groupId = question.group && question.group.questionId;
      if (!groupId) return true;
      const group = state.groups.get(groupId);
      if (!group) return true;
      const found = Array.isArray(question.groupMembers) ? question.groupMembers.length : 0;
      const expected = (group.members || []).length;
      if (found === expected) return true;
      console.warn('[ics-test] 组合题片段不完整，整题移出本次练习：' + groupId +
        '（' + found + '/' + expected + '）');
      return false;
    });
  }

  async function init() {
    try {
      state.catalog = await fetchJson(app.dataset.catalog);
      const paperPayload = await fetchJson('./web-data/' + state.catalog.papersFile);
      await loadQuestionGroups();
      state.papers = (paperPayload.papers || []).filter(function (paper) {
        return Number(paper.publishedQuestionCount || 0) > 0;
      });
      ui.bankSummary.textContent = Number(state.catalog.stats.quizQuestions || state.catalog.stats.publishedQuestions) +
        ' 道题已上线（含选择、填空、简答与综合题） · ' + state.catalog.stats.withheldQuestions +
        ' 道排版待复核题暂缓开放';
      ui.modules.innerHTML = state.catalog.modules.filter(function (module) {
        return Number(module.publishedQuestionCount || 0) > 0;
      }).map(function (module) {
        return '<label class="ics-module-card"><input type="checkbox" value="' + escapeHtml(module.id) + '" checked>' +
          '<span><strong>' + module.number + '. ' + escapeHtml(module.title) + '</strong>' +
          '<small>' + escapeHtml(module.name) + ' · ' + Number(module.quizQuestionCount || module.publishedQuestionCount) + ' 道题</small></span></label>';
      }).join('');
      (state.catalog.filters.examTypes || []).forEach(function (type) {
        const option = document.createElement('option'); option.value = type; option.textContent = type; ui.examType.appendChild(option);
      });
      state.papers.forEach(function (paper) {
        const option = document.createElement('option');
        option.value = paper.id;
        option.textContent = [paper.year, paper.examType, paper.title].filter(Boolean).join(' · ') +
          '（' + Number(paper.quizQuestionCount || paper.publishedQuestionCount) + ' 题）';
        ui.paper.appendChild(option);
      });
      initSupabase();
      await loadReportedIssues();
      startIssueSubscription();
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
    if (mode === 'exam' && !ui.paper.value) {
      showSetupError('整卷练习需要选择一份具体试卷。'); return;
    }
    showSetupError('');
    ui.start.disabled = true; ui.start.textContent = '正在抽题…';
    try {
      const modules = state.catalog.modules.filter(function (module) { return ids.includes(module.id); });
      const payloads = await Promise.all(modules.map(loadModulePayload));
      const examType = mode === 'module-all' || mode === 'exam' ? '' : ui.examType.value;
      const selectedPaper = mode === 'exam'
        ? state.papers.find(function (paper) { return paper.id === ui.paper.value; }) : null;
      const prepareOptions = { allowIncomplete: mode === 'exam' };
      let pool = [];
      payloads.forEach(function (payload) {
        payload.questions.forEach(function (raw) {
          if (!isPublishedQuestion(raw)) return;
          if (examType && raw.examType !== examType) return;
          if (selectedPaper && raw.paperId !== selectedPaper.id) return;
          const prepared = prepareQuestion(raw, payload.module, payload.companions.get(questionIdentity(raw)), prepareOptions);
          if (prepared) pool.push(prepared);
        });
      });
      // 组合题可能横跨多个模块：先补齐同组片段，再合并；仍然拼不齐的整题移出。
      await completeQuestionGroups(pool, prepareOptions);
      pool = dropIncompleteGroups(collapseQuestionGroups(pool));
      if (!pool.length) throw new Error('当前筛选条件下没有可用题目');

      const count = mode === 'random' ? Math.min(Number(ui.count.value), pool.length) : pool.length;
      state.questions = mode === 'exam'
        ? pool.sort(function (a, b) { return Number(a.paperOrder || 0) - Number(b.paperOrder || 0); })
        : secureShuffle(pool).slice(0, count);
      state.index = 0; state.score = 0; state.records = [];

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
    state.pendingCompositeGrade = null;
    const number = state.index + 1;
    const expected = simpleExpected(q.directAnswer);
    let choiceQuestion = null;
    let fillQuestion = null;
    if (!q.answerAvailable) {
      choiceQuestion = null;
      fillQuestion = null;
    } else if (q.formatted) {
      // 结构化数据只按显式 interaction.kind 分流，不从题面猜题型。
      const declaredKind = q.interaction && q.interaction.kind;
      if ((declaredKind === 'single-choice' || declaredKind === 'multiple-choice') &&
          q.layoutChoices && q.layoutChoices.length >= 2) {
        choiceQuestion = {
          stem: q.prompt,
          choices: q.layoutChoices,
          multiple: declaredKind === 'multiple-choice',
        };
      } else if (declaredKind === 'fill') {
        fillQuestion = parseFillQuestion(q.prompt);
      }
    } else {
      choiceQuestion = parseChoiceQuestion(q.prompt, expected);
      fillQuestion = choiceQuestion ? null : parseFillQuestion(q.prompt);
    }
    const compositeQuestion = q.interaction && q.interaction.kind === 'composite';
    state.currentMode = !q.answerAvailable ? 'unavailable' : choiceQuestion ? 'choice'
      : fillQuestion ? 'fill' : compositeQuestion ? 'composite' : 'short';
    const modeLabel = state.currentMode === 'unavailable' ? '待校对'
      : state.currentMode === 'choice'
      ? (choiceQuestion.multiple ? '多选题' : '单选题')
      : state.currentMode === 'fill' ? '填空题'
        : state.currentMode === 'composite' ? '综合题' : '简答题';
    ui.progressText.textContent = '第 ' + number + ' / ' + state.questions.length + ' 题';
    ui.scoreText.textContent = '当前 ' + state.score + ' 分';
    ui.progressBar.style.width = ((state.index / state.questions.length) * 100) + '%';
    ui.questionMeta.innerHTML = '<span class="ics-mode-badge">' + modeLabel + '</span>' +
      [q.moduleTitle, q.year, q.examType, q.questionNo, q.exam]
        .filter(Boolean).map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('');
    ui.questionContent.innerHTML = choiceQuestion
      ? (q.formatted ? renderLayoutStem(choiceQuestion.stem) : renderMarkdown(choiceQuestion.stem))
      : fillQuestion ? renderFillQuestion(fillQuestion, q.formatted)
        : compositeQuestion && Array.isArray(q.compositeParts) ? renderCompositeQuestion(q)
        : (q.formatted ? renderLayoutStem(q.prompt) : renderMarkdown(q.prompt));
    ui.answer.value = ''; ui.answer.disabled = false; ui.submit.disabled = false; ui.skip.disabled = false;
    const alreadyReported = state.reportedThisSession.has(q.id);
    ui.reportIssue.disabled = alreadyReported;
    ui.reportIssue.textContent = alreadyReported ? '已报告，感谢反馈' : '您认为此题有误';
    ui.reportStatus.textContent = alreadyReported ? '题目 ID：' + q.id : '';
    ui.answerForm.dataset.mode = state.currentMode;
    ui.choiceList.innerHTML = '';
    ui.choiceList.hidden = !choiceQuestion;
    ui.answerLabel.textContent = state.currentMode === 'unavailable'
      ? '本题答案尚未完成结构化校对'
      : state.currentMode === 'choice'
      ? '选择答案'
      : state.currentMode === 'fill' ? '填写答案'
        : state.currentMode === 'composite' ? '按小问完成作答'
          : '思考完成后查看参考答案';
    ui.answerHint.textContent = state.currentMode === 'unavailable'
      ? '题目仍按原卷顺序展示，本题不会计入成绩'
      : state.currentMode === 'choice'
      ? (choiceQuestion.multiple ? '可选择多个选项' : '点击一个选项')
      : state.currentMode === 'fill' ? '每个空格单独填写'
        : state.currentMode === 'composite' ? '选择与填空自动核对；简答显示答案后自评'
          : '本题查看答案后自评';
    ui.submit.textContent = state.currentMode === 'unavailable' ? '跳过并继续'
      : (state.currentMode === 'short' || state.currentMode === 'composite')
        ? (state.currentMode === 'composite' ? '提交整题' : '显示参考答案')
        : '提交答案';
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

  // 参考答案只取 layout.answer（人工录入的那一份）。题目的 relatedBlockIds 指向的
  // 往往是整份试卷的答案块，与单题并不精确对应，展示它会泄题，因此不参与渲染——
  // 这也是不再发布 answer-blocks.json 的原因。
  function referenceFor(q) {
    return q.directAnswer || '这道题暂无可展示的参考答案。';
  }

  function recordGrade(points, mode) {
    const q = state.questions[state.index];
    if (typeof points === 'number') state.score += points;
    state.records.push({ question: q, answer: ui.answer.value.trim(), points: points, mode: mode });
    if (typeof points === 'number') recordRemoteStats(q, points === 1).catch(function () {});
    ui.scoreText.textContent = '当前 ' + state.score + ' 分';
    ui.selfGrade.hidden = true;
    ui.next.hidden = false;
    ui.next.textContent = state.index === state.questions.length - 1 ? '查看成绩' : '下一题';
  }

  function evaluateComposite(question) {
    const answers = [];
    let objectiveCorrect = 0;
    let objectiveCount = 0;
    let subjectiveCount = 0;
    let firstMissing = null;
    (question.compositeParts || []).forEach(function (part, index) {
      const root = ui.questionContent.querySelector('[data-composite-part="' + index + '"]');
      if (!root) return;
      if (part.kind === 'single-choice' || part.kind === 'multiple-choice') {
        const list = root.querySelector('.ics-composite-choices');
        const selected = Array.from(list.querySelectorAll('.selected'))
          .map(function (button) { return button.dataset.compositeChoice; }).sort();
        if (!selected.length) {
          list.classList.add('needs-choice');
          if (!firstMissing) firstMissing = list;
          return;
        }
        const expected = (part.correctChoiceIds || []).slice().sort();
        answers.push(part.label + '：' + selected.join(''));
        if (expected.length) {
          objectiveCount += 1;
          if (selected.join('|') === expected.join('|')) objectiveCorrect += 1;
        } else {
          subjectiveCount += 1;
        }
      } else if (part.kind === 'fill') {
        const inputs = Array.from(root.querySelectorAll('.ics-blank-input'));
        const missing = inputs.find(function (input) { return !input.value.trim(); });
        if (missing) {
          missing.classList.add('missing');
          if (!firstMissing) firstMissing = missing;
          return;
        }
        answers.push(part.label + '：' + inputs.map(function (input) {
          return input.dataset.blankId + '=' + input.value.trim();
        }).join('；'));
        const fillResult = gradeFillInputs(inputs, part.blankAnswers);
        if (fillResult === null) subjectiveCount += 1;
        else {
          objectiveCount += 1;
          if (fillResult) objectiveCorrect += 1;
        }
      } else {
        subjectiveCount += 1;
        answers.push(part.label + '：查看答案后自评');
      }
    });
    if (firstMissing) {
      if (firstMissing.focus) firstMissing.focus();
      return null;
    }
    ui.questionContent.querySelectorAll('button, input').forEach(function (control) {
      control.disabled = true;
    });
    return {
      answers: answers,
      objectiveCorrect: objectiveCorrect,
      objectiveCount: objectiveCount,
      subjectiveCount: subjectiveCount,
    };
  }

  function submitAnswer(event) {
    event.preventDefault();
    if (state.currentMode === 'unavailable') {
      ui.answer.value = '答案待校对，本题未计分';
      ui.submit.disabled = true; ui.skip.disabled = true;
      ui.feedback.hidden = false;
      ui.reference.innerHTML = '<p>这道题尚未建立可靠的题目—答案映射。为避免展示错位答案，系统没有自动猜测。</p>';
      ui.verdict.className = 'ics-verdict';
      ui.verdict.textContent = '本题已跳过，不计入本次成绩。';
      recordGrade(null, 'unavailable');
      return;
    }
    if (state.currentMode === 'choice' && !ui.answer.value.trim()) {
      ui.choiceList.classList.add('needs-choice');
      return;
    }
    let compositeResult = null;
    if (state.currentMode === 'fill') {
      const inputs = Array.from(ui.questionContent.querySelectorAll('.ics-blank-input'));
      const missing = inputs.find(function (input) { return !input.value.trim(); });
      if (missing) { missing.classList.add('missing'); missing.focus(); return; }
      ui.answer.value = inputs.map(function (input, index) {
        input.disabled = true;
        return '第 ' + (index + 1) + ' 空：' + input.value.trim();
      }).join('；');
    } else if (state.currentMode === 'composite') {
      const q = state.questions[state.index];
      compositeResult = evaluateComposite(q);
      if (!compositeResult) return;
      ui.answer.value = compositeResult.answers.join('；');
    } else if (state.currentMode === 'short') {
      ui.answer.value = '查看参考答案后自评';
    }
    ui.skip.disabled = true;
    const q = state.questions[state.index];
    const expected = simpleExpected(q.directAnswer);
    const fillInputs = state.currentMode === 'fill'
      ? Array.from(ui.questionContent.querySelectorAll('.ics-blank-input')) : [];
    const result = state.currentMode === 'choice' ? autoGrade(ui.answer.value, expected)
      : state.currentMode === 'fill' ? gradeFillInputs(fillInputs,
        (q.interaction && q.interaction.blankAnswers) || [])
        : state.currentMode === 'composite' && compositeResult.subjectiveCount === 0 && compositeResult.objectiveCount
          ? compositeResult.objectiveCorrect === compositeResult.objectiveCount : null;
    ui.answer.disabled = true; ui.submit.disabled = true; ui.feedback.hidden = false;
    ui.choiceList.querySelectorAll('button').forEach(function (button) { button.disabled = true; });
    ui.reference.innerHTML = q.formatted
      ? renderLayoutStem(referenceFor(q))
      : renderMarkdown(referenceFor(q));
    typeset(ui.reference);

    if (result === true) {
      ui.verdict.className = 'ics-verdict correct'; ui.verdict.textContent = '回答正确，得 1 分。';
      recordGrade(1, 'auto');
    } else if (result === false) {
      ui.verdict.className = 'ics-verdict incorrect'; ui.verdict.textContent = '答案不一致，本题暂得 0 分。';
      recordGrade(0, 'auto');
    } else {
      ui.verdict.textContent = state.currentMode === 'fill'
        ? '本题尚未配置可安全自动核对的逐空答案，已显示参考内容，请核对后自评。'
        : state.currentMode === 'composite'
          ? '客观小问自动核对：' + compositeResult.objectiveCorrect + ' / ' + compositeResult.objectiveCount +
            '；其余 ' + compositeResult.subjectiveCount + ' 个小问请对照答案自评。'
          : '已显示参考答案 / 解析，请根据关键点完成自评。';
      if (state.currentMode === 'composite') {
        state.pendingCompositeGrade = compositeResult;
      }
      ui.selfGrade.hidden = false;
    }
  }

  function advanceQuestion() {
    if (state.index >= state.questions.length - 1) finishQuiz();
    else { state.index += 1; renderQuestion(); }
  }

  function skipCurrentQuestion() {
    const q = state.questions[state.index];
    if (!q) return;
    state.records.push({ question: q, answer: '已跳过', points: null, mode: 'skipped' });
    advanceQuestion();
  }

  function finishQuiz() {
    stopStatsSubscription();
    ui.quiz.hidden = true; ui.result.hidden = false;
    const total = state.questions.length;
    const graded = state.records.filter(function (record) { return typeof record.points === 'number'; }).length;
    const skipped = state.records.filter(function (record) { return record.mode === 'skipped'; }).length;
    const percent = graded ? Math.round((state.score / graded) * 100) : 0;
    ui.finalScore.textContent = graded ? percent + '%' : '—';
    ui.finalSummary.textContent = graded
      ? '共浏览 ' + total + ' 题，其中 ' + graded + ' 题计分、' + skipped + ' 题跳过，得到 ' + state.score + ' / ' + graded + ' 分。'
      : '共浏览 ' + total + ' 题，其中 ' + skipped + ' 题跳过；本次没有计分题。';
    ui.reviewList.hidden = true; ui.reviewToggle.textContent = '查看答题记录';
    ui.reviewList.innerHTML = state.records.map(function (record, index) {
      const score = record.mode === 'skipped' ? '已跳过'
        : typeof record.points === 'number' ? record.points + ' 分' : '未计分';
      const originalNumber = record.question.questionNo
        ? ' · 原题号 ' + escapeHtml(record.question.questionNo) : '';
      return '<div class="ics-review-item"><span class="ics-review-score">' + score + '</span>' +
        '<strong>第 ' + (index + 1) + ' 题' + originalNumber + '</strong>' +
        '<p>' + (record.mode === 'skipped' ? '本题未作答' : '你的回答：' + escapeHtml(record.answer)) + '</p></div>';
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
  ui.paper.addEventListener('change', updatePaperStatus);
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
  ui.reportIssue.addEventListener('click', reportCurrentIssue);
  ui.issueBoard.addEventListener('toggle', function () {
    if (ui.issueBoard.open) ensureIssueQuestionIndex().catch(function (error) {
      ui.issueBoardStatus.textContent = '题目定位信息加载失败：' + error.message;
    });
  });
  ui.issueList.addEventListener('click', async function (event) {
    const button = event.target.closest('[data-copy-question-id]');
    if (!button) return;
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copyQuestionId);
      button.textContent = '已复制';
    } catch (_) {
      button.textContent = button.dataset.copyQuestionId;
    }
    setTimeout(function () { button.textContent = original; }, 1600);
  });
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
  ui.questionContent.addEventListener('click', function (event) {
    const button = event.target.closest('[data-composite-choice]');
    if (!button || button.disabled) return;
    const list = button.closest('.ics-composite-choices');
    const multiple = list.dataset.multiple === 'true';
    if (!multiple) {
      list.querySelectorAll('[data-composite-choice]').forEach(function (item) {
        const selected = item === button;
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    } else {
      const selected = !button.classList.contains('selected');
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    }
    list.classList.remove('needs-choice');
  });
  ui.questionContent.addEventListener('input', function (event) {
    if (event.target.matches('.ics-blank-input')) event.target.classList.remove('missing');
  });
  ui.selfGrade.addEventListener('click', function (event) {
    const button = event.target.closest('[data-grade]');
    if (!button) return;
    const points = Number(button.dataset.grade);
    let finalPoints = points;
    if (state.currentMode === 'composite' && state.pendingCompositeGrade) {
      const pending = state.pendingCompositeGrade;
      const denominator = pending.objectiveCount + pending.subjectiveCount;
      finalPoints = denominator
        ? (pending.objectiveCorrect + points * pending.subjectiveCount) / denominator : points;
      finalPoints = Math.round(finalPoints * 100) / 100;
      state.pendingCompositeGrade = null;
      ui.verdict.textContent = '已完成简答自评；合并客观小问后，本题得 ' + finalPoints + ' 分。';
    } else {
      ui.verdict.textContent = '已自评：本题 ' + points + ' 分。';
    }
    ui.verdict.className = 'ics-verdict ' + (finalPoints === 1 ? 'correct' : finalPoints === 0 ? 'incorrect' : '');
    recordGrade(finalPoints, state.currentMode === 'composite' ? 'mixed' : 'self');
  });
  ui.next.addEventListener('click', advanceQuestion);
  ui.skip.addEventListener('click', skipCurrentQuestion);
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
