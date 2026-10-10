(function () {
  'use strict';

  const app = document.getElementById('ics-app');
  if (!app) return;

  const $ = (id) => document.getElementById(id);
  const ui = {
    setup: $('ics-setup'), modules: $('ics-modules'), bankSummary: $('ics-bank-summary'),
    sourcePicker: $('ics-source-picker'),
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
    issueForm: $('ics-issue-form'), issueMessage: $('ics-issue-message'),
    issueSend: $('ics-issue-send'), issueCancel: $('ics-issue-cancel'),
    mastery: $('ics-mastery'), masteryStatus: $('ics-mastery-status'), masteryNote: $('ics-mastery-note'),
    localAttempts: $('ics-local-attempts'), localAttemptNote: $('ics-local-attempt-note'),
    siteAttempts: $('ics-site-attempts'), siteAttemptNote: $('ics-site-attempt-note'),
    feedback: $('ics-feedback'), verdict: $('ics-verdict'), reference: $('ics-reference'),
    liveStats: $('ics-live-stats'), statsSummary: $('ics-stats-summary'), statsOptions: $('ics-stats-options'), statsNote: $('ics-stats-note'), liveDot: $('ics-live-dot'),
    selfGrade: $('ics-self-grade'), next: $('ics-next'), result: $('ics-result'),
    finalScore: $('ics-final-score'), finalSummary: $('ics-final-summary'), retry: $('ics-retry'),
    reviewToggle: $('ics-review-toggle'), reviewList: $('ics-review-list'),
    previous: $('ics-previous'), finish: $('ics-finish'), resume: $('ics-resume'),
    questionGrid: $('ics-question-grid'), completionSummary: $('ics-completion-summary'),
    navigationStatus: $('ics-navigation-status'), questionHistory: $('ics-question-history'),
    minAttempts: $('ics-min-attempts'), minAttemptsField: $('ics-min-attempts-field'),
    practiceNote: $('ics-practice-note'),
    issueBoard: $('ics-issue-board'), issueCount: $('ics-issue-count'),
    issueBoardStatus: $('ics-issue-board-status'), issueList: $('ics-issue-list'),
    issueMessageStatus: $('ics-issue-message-status'),
  };

  const state = {
    catalog: null, papers: [], questions: [], index: 0, score: 0, records: [], drafts: [], currentMode: '',
    bankPromise: null,
    supabase: null, statsChannel: null, currentStats: null, statsQuestionId: '', statsRevealed: false,
    issueChannel: null, reportedIssues: [], issueQuestionIndex: new Map(), issueIndexLoaded: false,
    reportedThisSession: new Set(), issueReloadTimer: null, pendingCompositeGrade: null,
    reportingQuestions: new Set(), issueDrafts: new Map(), issueFormQuestionId: '',
    mastered: new Set(), masteryPersistent: true,
    siteStats: new Map(), siteStatsLoaded: false, siteStatsChannel: null,
    siteStatsLoad: null, siteStatsChanges: [],
    issueMessages: [], issueMessageLoad: 0,
  };
  const contract = window.ICSQuestionV5;
  const MASTERY_KEY = 'ics-question-mastery-v1';
  const attemptCounts = window.ICSAttemptCounts.create(function () { return localStorage; });
  function renderLocalAttempts() {
    const value = attemptCounts.snapshot();
    ui.localAttempts.textContent = value.count.toLocaleString('zh-CN');
    ui.localAttemptNote.textContent = value.persistent
      ? '重复练习计次，跳过不计入；仅保存在本浏览器。'
      : '浏览器存储不可用，部分次数仅在当前页面临时保留。';
  }

  function applySiteStatsChange(rows, payload) {
    if (payload.eventType === 'DELETE') rows.delete(payload.old.question_id);
    else if (payload.new && payload.new.question_id) rows.set(payload.new.question_id, payload.new);
  }

  function renderSiteAttempts() {
    if (!state.siteStatsLoaded) return;
    const total = Array.from(state.siteStats.values()).reduce(function (sum, row) {
      return sum + Number(row.total_answers || 0);
    }, 0);
    ui.siteAttempts.textContent = total.toLocaleString('zh-CN');
  }

  function loadSiteAttempts() {
    if (state.siteStatsLoad) return state.siteStatsLoad;
    if (!state.supabase) {
      ui.siteAttemptNote.textContent = '统计服务暂不可用；同一浏览器、同一道题只计一次。';
      return Promise.resolve();
    }
    state.siteStatsChanges = [];
    state.siteStatsLoad = Promise.resolve().then(async function () {
      try {
        const rows = new Map();
        const pageSize = 500;
        // PostgREST limits rows per response: sum every page, including questions
        // since withdrawn from publication, rather than just the current pool.
        for (let start = 0; ; start += pageSize) {
          const result = await state.supabase.from('ics_question_stats')
            .select('question_id,total_answers').order('question_id').range(start, start + pageSize - 1);
          if (result.error) throw result.error;
          (result.data || []).forEach(function (row) { rows.set(row.question_id, row); });
          if (!result.data || result.data.length < pageSize) break;
        }
        state.siteStatsChanges.forEach(function (payload) { applySiteStatsChange(rows, payload); });
        state.siteStats = rows;
        state.siteStatsLoaded = true;
        renderSiteAttempts();
        ui.siteAttemptNote.textContent = '同一浏览器、同一道题只计一次；数据来自 Supabase。';
      } catch (_) {
        ui.siteAttemptNote.textContent = state.siteStatsLoaded
          ? '更新暂时失败，显示上次读到的累计数据。'
          : '全站统计暂不可用，请联网后重试。';
      } finally {
        state.siteStatsLoad = null;
        state.siteStatsChanges = [];
      }
    });
    return state.siteStatsLoad;
  }

  function startSiteStatsSubscription() {
    if (!state.supabase) { loadSiteAttempts(); return; }
    state.siteStatsChannel = state.supabase.channel('ics-site-attempts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ics_question_stats' }, function (payload) {
        if (state.siteStatsLoad) state.siteStatsChanges.push(payload);
        applySiteStatsChange(state.siteStats, payload);
        renderSiteAttempts();
      }).subscribe(function (status) {
        if (status === 'SUBSCRIBED') loadSiteAttempts();
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          ui.siteAttemptNote.textContent = '实时连接中断；返回页面时会重新读取统计。';
        }
      });
    loadSiteAttempts();
  }
  function loadMastery() {
    try {
      const saved = JSON.parse(localStorage.getItem(MASTERY_KEY) || 'null');
      state.mastered = new Set(saved && saved.version === 1 && Array.isArray(saved.questionIds)
        ? saved.questionIds.filter(function (id) { return typeof id === 'string' && /^q-[a-f0-9]{8,64}$/.test(id); }) : []);
    } catch (_) {
      state.mastered = new Set();
      state.masteryPersistent = false;
    }
  }

  function renderMastery() {
    const question = state.questions[state.index];
    const mastered = question && state.mastered.has(question.id);
    ui.mastery.textContent = mastered ? '已熟知 · 取消标记' : '标记熟知';
    ui.mastery.setAttribute('aria-pressed', mastered ? 'true' : 'false');
    ui.masteryStatus.textContent = !state.masteryPersistent
      ? '浏览器存储不可用，本次标记可能无法在刷新后保留。'
      : mastered ? '已保存，后续模块随机不再抽到本题。' : '';
    ui.masteryNote.textContent = state.masteryPersistent
      ? '熟知进度仅保存在当前浏览器；模块随机会跳过已熟知的题，整卷、模块全练和高错题练习仍保留。'
      : '浏览器存储不可用或数据损坏；当前熟知进度仅临时保留，建议检查浏览器存储设置。';
    if (!state.catalog) return;
    const sources = selectedSourceCollections();
    const publishedIds = new Set(state.papers.filter(function (paper) {
      return sources.includes(contract.paperCollection(paper));
    }).flatMap(function (paper) { return paper.questionIds; }));
    ui.modules.querySelectorAll('[data-module-progress]').forEach(function (container) {
      const module = state.catalog.modules.find(function (item) { return item.id === container.dataset.moduleProgress; });
      const ids = module.questionIds.filter(function (id) { return publishedIds.has(id); });
      const count = ids.filter(function (id) { return state.mastered.has(id); }).length;
      container.querySelector('small').textContent = ids.length + ' 道题 · 已熟知 ' + count + ' / ' + ids.length;
      const progress = container.querySelector('progress');
      progress.max = Math.max(1, ids.length); progress.value = count;
      progress.setAttribute('aria-label', module.title + '：已熟知 ' + count + ' / ' + ids.length + ' 道');
    });
  }

  function toggleMastery() {
    const question = state.questions[state.index];
    if (!question) return;
    if (state.mastered.has(question.id)) state.mastered.delete(question.id);
    else state.mastered.add(question.id);
    try {
      localStorage.setItem(MASTERY_KEY, JSON.stringify({ version: 1, questionIds: Array.from(state.mastered).sort() }));
      state.masteryPersistent = true;
    } catch (_) { state.masteryPersistent = false; }
    renderMastery();
  }
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
      const asset = source.replace(/^(?:\.\.\/)+(?=assets\/)/, '');
      if (asset.startsWith('assets/')) token.attrSet('src', './web-data/' + asset);
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

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isPublishedQuestion(question) {
    return question.schemaVersion === contract.VERSION && question.publication.state === 'published' &&
      PUBLISHED_QUESTION_KINDS.has(question.type);
  }

  // Only authored Markdown is rendered. No content rewriting, type guessing or answer extraction.
  function renderContent(content) {
    return md ? md.render(content.text) : '<pre>' + escapeHtml(content.text) + '</pre>';
  }

  function paperFor(question) { return state.papers.find(function (paper) { return paper.id === question.paperId; }); }
  function moduleTitle(question) {
    return state.catalog.modules.filter(function (module) {
      return question.classification.moduleIds.includes(module.id);
    }).map(function (module) { return module.title; }).join(' / ');
  }

  function loadQuestionBank() {
    if (!state.bankPromise) state.bankPromise = fetchJson('./web-data/' + state.catalog.questionsFile).then(function (payload) {
      contract.assertVersion(payload);
      payload.questions.forEach(contract.assertVersion);
      return payload.questions;
    }).catch(function (error) { state.bankPromise = null; throw error; });
    return state.bankPromise;
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
      const messages = state.issueMessages.filter(function (message) { return message.question_id === row.question_id; });
      const messageHtml = messages.map(function (message) {
        return '<blockquote class="ics-public-issue-message"><small>问题说明 · ' + escapeHtml(formatIssueTime(message.reported_at)) +
          '</small><p>' + escapeHtml(message.message) + '</p></blockquote>';
      }).join('');
      return '<article class="ics-issue-item">' +
        '<div class="ics-issue-item-main"><div class="ics-issue-item-head">' +
        '<code>' + escapeHtml(row.question_id) + '</code>' +
        '<button class="ics-issue-copy" type="button" data-copy-question-id="' + escapeHtml(row.question_id) + '">复制 ID</button>' +
        '</div><p class="ics-issue-item-meta">' + meta + (latest ? '<br>最近报告：' + escapeHtml(latest) : '') + '</p>' + messageHtml + '</div>' +
        '<span class="ics-issue-item-stats">' + Number(row.report_count || 0) + ' 人报告</span></article>';
    }).join('');
  }

  async function ensureIssueQuestionIndex() {
    if (state.issueIndexLoaded || !state.catalog) return;
    ui.issueBoardStatus.textContent = '正在读取题目定位信息…';
    const questions = await loadQuestionBank();
    questions.forEach(function (question) {
      const paper = paperFor(question);
      const meta = { kind: question.type, moduleTitle: moduleTitle(question),
        exam: paper ? paper.displayName : '', questionNo: question.number.display };
      state.issueQuestionIndex.set(question.id, meta);
      (question.sources || []).forEach(function (source) {
        if (source.legacyId) state.issueQuestionIndex.set(source.legacyId, meta);
      });
      (question.parts || []).forEach(function (part) {
        const partMeta = Object.assign({}, meta, { kind: part.type, questionNo: part.number.display });
        state.issueQuestionIndex.set(part.id, partMeta);
        part.sources.forEach(function (source) {
          if (source.legacyId) state.issueQuestionIndex.set(source.legacyId, partMeta);
        });
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
    if (ui.issueBoard.open) await Promise.all([ensureIssueQuestionIndex(), loadIssueMessages()]);
  }

  async function loadIssueMessages() {
    if (!state.supabase || !ui.issueBoard.open) return;
    const load = ++state.issueMessageLoad;
    const messages = [];
    try {
      for (let start = 0; ; start += 500) {
        const result = await state.supabase.from('ics_question_issue_messages')
          .select('id,question_id,message,reported_at')
          .order('reported_at', { ascending: false }).order('id', { ascending: true }).range(start, start + 499);
        if (result.error) throw new Error('无法读取问题说明');
        messages.push.apply(messages, result.data || []);
        if (!result.data || result.data.length < 500) break;
      }
      if (load !== state.issueMessageLoad) return;
      state.issueMessages = messages;
      ui.issueMessageStatus.textContent = '';
      renderIssueBoard();
    } catch (_) {
      if (load !== state.issueMessageLoad) return;
      state.issueMessages = [];
      ui.issueMessageStatus.textContent = '问题说明暂时无法读取；报告列表仍可查看。';
      renderIssueBoard();
    }
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

  function closeIssueForm() {
    if (state.issueFormQuestionId) state.issueDrafts.set(state.issueFormQuestionId, ui.issueMessage.value);
    state.issueFormQuestionId = '';
    ui.issueForm.hidden = true;
    ui.reportIssue.setAttribute('aria-expanded', 'false');
  }

  function openIssueForm() {
    const question = state.questions[state.index];
    if (!question || state.reportedThisSession.has(question.id) || state.reportingQuestions.has(question.id)) return;
    if (!ui.issueForm.hidden) { closeIssueForm(); return; }
    state.issueFormQuestionId = question.id;
    ui.issueMessage.value = state.issueDrafts.get(question.id) || '';
    ui.issueMessage.disabled = false;
    ui.issueCancel.disabled = false;
    ui.issueForm.hidden = false;
    ui.reportIssue.setAttribute('aria-expanded', 'true');
    ui.issueMessage.focus();
  }

  async function reportCurrentIssue(event) {
    event.preventDefault();
    const question = state.questions[state.index];
    if (!question || state.issueFormQuestionId !== question.id || state.reportedThisSession.has(question.id) || state.reportingQuestions.has(question.id)) return;
    const message = ui.issueMessage.value.trim();
    if (message.length > 1000) { ui.reportStatus.textContent = '问题说明不能超过 1000 字。'; return; }
    state.issueDrafts.set(question.id, ui.issueMessage.value);
    state.reportingQuestions.add(question.id);
    ui.reportIssue.disabled = true;
    ui.reportIssue.textContent = '正在提交…';
    ui.issueSend.disabled = true;
    ui.issueMessage.disabled = true;
    ui.issueCancel.disabled = true;
    ui.reportStatus.textContent = '';
    try {
      if (!state.supabase) throw new Error('问题上报服务尚未连接。');
      const args = { p_question_id: question.id, p_visitor_id: visitorId() };
      let result = await state.supabase.rpc('report_ics_question_issue_with_message', Object.assign({ p_message: message }, args));
      const missingRpc = result.error && ['PGRST202', '42883'].includes(result.error.code);
      if (missingRpc && !message) result = await state.supabase.rpc('report_ics_question_issue', args);
      else if (missingRpc) throw new Error('带说明的上报尚未启用，请等待维护者执行数据库升级；说明已在本次页面内保留。');
      if (result.error) throw new Error(result.error.message);
      state.reportedThisSession.add(question.id);
      state.issueDrafts.delete(question.id);
      if (state.questions[state.index] && state.questions[state.index].id === question.id) {
        closeIssueForm();
        state.issueDrafts.delete(question.id);
        ui.reportIssue.textContent = '已报告，感谢反馈';
        ui.reportStatus.textContent = message ? '报告已提交，问题说明将公开展示在待复核列表。' : '题目 ID：' + question.id;
      }
      await loadReportedIssues().catch(function () {});
    } catch (error) {
      if (state.questions[state.index] && state.questions[state.index].id === question.id) {
        ui.reportIssue.disabled = false;
        ui.reportIssue.textContent = '您认为此题有误';
        ui.reportStatus.textContent = '提交失败：' + error.message;
      }
    } finally {
      state.reportingQuestions.delete(question.id);
      ui.issueSend.disabled = false;
      if (state.issueFormQuestionId === question.id || !state.issueFormQuestionId) {
        ui.issueMessage.disabled = false;
        ui.issueCancel.disabled = false;
      }
    }
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
      : '本题暂无选项分布；正确率包含自动核对与自评结果。';
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
    renderLiveStats();

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
    if (!result.error) {
      const saved = Array.isArray(result.data) ? result.data[0] : result.data;
      if (saved) {
        const change = { eventType: 'UPDATE', new: saved };
        if (state.siteStatsLoad) state.siteStatsChanges.push(change);
        applySiteStatsChange(state.siteStats, change);
        renderSiteAttempts();
      }
    }
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

  function renderFillQuestion(content, partIndex) {
    const spans = contract.blankSpans(content);
    if (!spans.length) return renderContent(content) +
      '<p class="ics-composite-note">本题声明为填空题，但空位尚待人工标注；暂时查看参考答案后自评。</p>';
    let prefix = 'ICSBLANKTOKEN';
    while (content.text.includes(prefix)) prefix += 'X';
    let cursor = 0, markdown = '';
    spans.forEach(function (span, index) {
      markdown += content.text.slice(cursor, span.start) + prefix + index + 'END';
      cursor = span.end;
    });
    markdown += content.text.slice(cursor);
    let html = renderContent({ text: markdown });
    spans.forEach(function (span, index) {
      const blank = span.blank;
      const label = blank.label || ('第 ' + (index + 1) + ' 空');
      const attributes = 'class="ics-blank-input" name="blank-' + (partIndex == null ? 'root' : partIndex) + '-' + index + '" ' +
        'data-blank-id="' + escapeHtml(blank.id) + '" data-blank-scope="' + (partIndex == null ? 'root' : partIndex) + '" ' +
        'data-width="' + blank.width + '" form="ics-answer-form" aria-label="' + escapeHtml(label) +
        '" autocomplete="off"';
      let control;
      if (!blank.input) {
        control = '<input ' + attributes + ' required>';
      } else if (!blank.input.multiple) {
        control = '<select ' + attributes + ' required><option value="">请选择…</option>' +
          blank.input.options.map(function (option) {
            return '<option value="' + escapeHtml(option.value) + '">' + escapeHtml(option.label) + '</option>';
          }).join('') + '</select>';
      } else {
        const menuId = 'blank-menu-' + (partIndex == null ? 'root' : partIndex) + '-' + index;
        control = '<input type="hidden" ' + attributes + ' data-multiple="true">' +
          '<button type="button" class="ics-blank-toggle" data-blank-toggle aria-haspopup="dialog" aria-expanded="false" ' +
          'aria-controls="' + menuId + '" aria-label="' + escapeHtml(label) + '，可多选">请选择… ▾</button>' +
          '<span class="ics-blank-menu" id="' + menuId + '" role="dialog" aria-label="' + escapeHtml(label) + '，可多选" hidden>' +
          '<span class="ics-blank-menu-hint">可多选</span>' + blank.input.options.map(function (option) {
            return '<label><input type="checkbox" data-blank-option value="' + escapeHtml(option.value) + '"' +
              ((blank.input.exclusiveValues || []).includes(option.value) ? ' data-exclusive="true"' : '') + '> ' +
              '<span>' + escapeHtml(option.label) + '</span></label>';
          }).join('') + '<button type="button" data-blank-close>完成</button></span>';
      }
      const input = '<span class="ics-inline-blank tex2jax_ignore"><span class="ics-blank-number">' + (index + 1) + '</span>' + control + '</span>';
      html = html.replace(prefix + index + 'END', function () { return input; });
    });
    return html;
  }

  function readBlankValue(input) {
    if (input.dataset.multiple === 'true') {
      try {
        const value = JSON.parse(input.value || '[]');
        return Array.isArray(value) ? value : [];
      } catch (_) { return []; }
    }
    return input.value;
  }

  function syncBlank(input) {
    if (input.dataset.multiple !== 'true') return;
    const root = input.closest('.ics-inline-blank');
    const selected = readBlankValue(input);
    const labels = [];
    root.querySelectorAll('[data-blank-option]').forEach(function (option) {
      option.checked = selected.includes(option.value);
      option.disabled = input.disabled;
      if (option.checked) labels.push(option.nextElementSibling.textContent);
    });
    const toggle = root.querySelector('[data-blank-toggle]');
    toggle.textContent = (labels.length ? labels.join('、') : '请选择…') + ' ▾';
    toggle.setAttribute('aria-label', input.getAttribute('aria-label') + '，可多选，' + (labels.join('、') || '未选择'));
    toggle.disabled = input.disabled;
    toggle.classList.toggle('missing', input.classList.contains('missing'));
  }

  function blankAnswerText(input) {
    if (input.tagName === 'SELECT') return input.selectedOptions[0].textContent;
    if (input.dataset.multiple !== 'true') return input.value.trim();
    return Array.from(input.closest('.ics-inline-blank').querySelectorAll('[data-blank-option]:checked'))
      .map(function (option) { return option.nextElementSibling.textContent; }).join('、');
  }

  function focusBlank(input) {
    syncBlank(input);
    (input.dataset.multiple === 'true' ? input.closest('.ics-inline-blank').querySelector('[data-blank-toggle]') : input).focus();
  }

  function closeBlankMenus() {
    ui.questionContent.querySelectorAll('[data-blank-toggle][aria-expanded="true"]').forEach(function (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = true;
    });
  }

  function disableQuestionControls(root) {
    closeBlankMenus();
    root.querySelectorAll('button, input, select').forEach(function (control) { control.disabled = true; });
  }

  function gradeFillInputs(inputs, solution) {
    const values = {};
    inputs.forEach(function (input) { values[input.dataset.blankId] = readBlankValue(input); });
    return contract.gradeBlanks(values, solution);
  }

  function renderOptions(options, attribute) {
    return options.map(function (option) {
      return '<button class="ics-choice" type="button" ' + attribute + '="' + escapeHtml(option.id) +
        '" aria-pressed="false"><span class="ics-choice-key">' + escapeHtml(option.id) + '</span>' +
        '<span class="ics-choice-content post-content">' + renderContent(option.content) + '</span></button>';
    }).join('');
  }

  function renderCompositeQuestion(question) {
    const context = renderContent(question.stem);
    return (context.trim() ? '<div class="ics-composite-context">' + context + '</div>' : '') + question.parts.map(function (part, index) {
      let body = part.type === 'fill' ? renderFillQuestion(part.stem, index) : renderContent(part.stem);
      if (part.type === 'single-choice' || part.type === 'multiple-choice') {
        body += '<div class="ics-composite-choices" data-part-index="' + index + '" data-multiple="' +
          (part.type === 'multiple-choice') + '">' + renderOptions(part.options, 'data-composite-choice') + '</div>';
      } else if (part.type === 'short-answer') {
        body += '<p class="ics-composite-note">本小问思考完成后，在整题提交时查看参考答案并自评。</p>';
      }
      if (part.solution.state !== 'available') body += '<p class="ics-composite-note">本小问答案待复核，不计分。</p>';
      return '<section class="ics-composite-part" data-composite-part="' + index + '"><header><h3>' +
        escapeHtml(part.number.display || ('第 ' + (index + 1) + ' 小问')) + '</h3><span>' +
        issueTypeLabel(part.type) + '</span></header><div class="ics-composite-body">' + body + '</div></section>';
    }).join('');
  }

  function renderSolution(question) {
    const solution = question.solution;
    if (question.type === 'composite') {
      const reference = renderContent(solution.reference);
      return question.parts.map(function (part, index) {
        return '<section class="ics-solution-part"><h4>' +
          escapeHtml(part.number.display || ('第 ' + (index + 1) + ' 小问')) + '</h4>' + renderSolution(part) + '</section>';
      }).join('') + (reference.trim() ? '<div class="ics-solution-context">' + reference + '</div>' : '');
    }
    if (solution.state !== 'available') return '<p>' + escapeHtml(solution.reason || '本题答案待复核，未计分。') + '</p>';
    const key = solution.grading === 'choice'
      ? '<p><strong>正确选项：' + solution.correctOptionIds.map(escapeHtml).join('、') + '</strong></p>' : '';
    const notice = solution.provenance.origin === 'ai-derived'
      ? '<p class="ics-composite-note">此参考答案含 AI 推导，请核对原卷。</p>' : '';
    return key + notice + renderContent(solution.reference);
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
    return Array.from(ui.modules.querySelectorAll('input:checked:not(:disabled)')).map(function (input) { return input.value; });
  }

  function selectedSourceCollections() {
    return Array.from(ui.sourcePicker.querySelectorAll('input:checked')).map(function (input) { return input.value; });
  }

  function renderSourceFilters() {
    const sources = selectedSourceCollections();
    const papers = state.papers.filter(function (paper) { return sources.includes(contract.paperCollection(paper)); });
    const questionIds = new Set(papers.flatMap(function (paper) { return paper.questionIds; }));
    const oldBoxes = Array.from(ui.modules.querySelectorAll('input:not(:disabled)'));
    const oldModules = new Set(selectedModuleIds());
    const keepAll = !oldBoxes.length || oldBoxes.every(function (box) { return box.checked; });
    ui.modules.innerHTML = state.catalog.modules.map(function (module) {
      const count = module.questionIds.filter(function (id) { return questionIds.has(id); }).length;
      return '<label class="ics-module-card"><input type="checkbox" value="' + escapeHtml(module.id) + '"' +
        (count && (keepAll || oldModules.has(module.id)) ? ' checked' : '') + (count ? '' : ' disabled') + '>' +
        '<span data-module-progress="' + escapeHtml(module.id) + '"><strong>' + module.number + '. ' + escapeHtml(module.title) + '</strong>' +
        '<small>' + count + ' 道题</small><progress max="1" value="0"></progress></span></label>';
    }).join('');
    const examType = ui.examType.value;
    ui.examType.innerHTML = '<option value="">全部类型</option>';
    Array.from(new Set(papers.map(function (paper) { return contract.EXAM_LABELS[paper.examKind]; }))).forEach(function (type) {
      const option = document.createElement('option'); option.value = type; option.textContent = type; ui.examType.appendChild(option);
    });
    if (Array.from(ui.examType.options).some(function (option) { return option.value === examType; })) ui.examType.value = examType;
    const previousPaper = ui.paper.value;
    ui.paper.innerHTML = '<option value="">请选择试卷或章节</option>';
    [['pku-exam', 'PKU 真题'], ['csapp-textbook', 'CSAPP 章节习题']].forEach(function (group) {
      const items = papers.filter(function (paper) { return contract.paperCollection(paper) === group[0]; });
      if (!items.length) return;
      const optgroup = document.createElement('optgroup'); optgroup.label = group[1];
      items.forEach(function (paper) {
        const option = document.createElement('option'); option.value = paper.id;
        option.textContent = paper.displayName + '（' + paper.stats.quizQuestionCount + ' 题）'; optgroup.appendChild(option);
      });
      ui.paper.appendChild(optgroup);
    });
    if (papers.some(function (paper) { return paper.id === previousPaper; })) ui.paper.value = previousPaper;
    const pkuCount = papers.filter(function (paper) { return contract.paperCollection(paper) === 'pku-exam'; }).length;
    const chapterCount = papers.length - pkuCount;
    ui.bankSummary.textContent = questionIds.size + ' 道练习题 · ' + pkuCount + ' 份真题 · ' + chapterCount + ' 章课本习题';
    updateModeUi();
    updatePaperStatus();
    renderMastery();
    if (!sources.length) showSetupError('请至少选择一个题目来源。');
  }

  function updateSelectToggle() {
    const boxes = Array.from(ui.modules.querySelectorAll('input:not(:disabled)'));
    ui.selectToggle.textContent = boxes.length && boxes.every(function (box) { return box.checked; }) ? '取消全选' : '全选';
  }

  function updateModeUi() {
    const mode = quizMode();
    const isExam = mode === 'exam';
    const isAll = mode === 'module-all';
    ui.moduleFieldset.hidden = isExam;
    ui.selectToggle.hidden = isExam || isAll;
    ui.countField.hidden = mode !== 'random' && mode !== 'mistakes';
    ui.examTypeField.hidden = isAll || isExam;
    ui.paperField.hidden = !isExam;
    ui.minAttemptsField.hidden = mode !== 'mistakes';
    ui.practiceNote.textContent = mode === 'mistakes'
      ? '按历史错误率降序排列；错误率相同时优先展示作答人数更多的题。没有达到最低人数的题不会入选，统计包含自评。'
      : '选择题与已配置答案的填空题自动核对，简答题查看参考答案后自评。';
    ui.moduleLegend.textContent = isAll ? '选择一个知识模块' : '知识模块（可多选）';

    if (isAll) {
      const boxes = Array.from(ui.modules.querySelectorAll('input:not(:disabled)'));
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
    const stats = paper.stats;
    ui.paperStatus.textContent = stats.quizQuestionCount + ' 道独立题目 · 单选 ' + stats.singleChoiceCount +
      ' · 多选 ' + stats.multipleChoiceCount + ' · 填空 ' + stats.fillCount +
      ' · 简答 ' + stats.shortAnswerCount + ' · 综合 ' + stats.compositeCount +
      (contract.paperCollection(paper) === 'csapp-textbook' ? '。' + paper.coverage.note : '');
  }

  async function init() {
    loadMastery();
    attemptCounts.refresh();
    renderLocalAttempts();
    initSupabase();
    startSiteStatsSubscription();
    try {
      state.catalog = await fetchJson(app.dataset.catalog);
      contract.assertVersion(state.catalog);
      const paperPayload = await fetchJson('./web-data/' + state.catalog.papersFile);
      contract.assertVersion(paperPayload);
      state.papers = (paperPayload.papers || []).filter(function (paper) {
        return Number(paper.stats.publishedQuestionCount || 0) > 0;
      });
      renderSourceFilters();
      await loadReportedIssues();
      startIssueSubscription();
      ui.start.disabled = false;
      updateModeUi();
    } catch (error) {
      ui.bankSummary.textContent = '题库暂时无法读取';
      showSetupError(error.message + '。请确认站点已通过本地服务器访问，并且 web-data/catalog.json 存在。');
    }
  }

  async function rankByErrorRate(pool) {
    if (!state.supabase) throw new Error('答题统计暂时无法连接，请稍后重试。');
    const stats = new Map();
    // 先按当前题池 ID 分批查询，避免全表分页或超过 URL 长度限制。
    for (let start = 0; start < pool.length; start += 100) {
      const ids = pool.slice(start, start + 100).map(function (question) { return question.id; });
      const result = await state.supabase.from('ics_question_stats')
        .select('question_id,total_answers,correct_answers').in('question_id', ids);
      if (result.error) throw new Error('无法读取历史错误率，请稍后重试。');
      (result.data || []).forEach(function (row) { stats.set(row.question_id, row); });
    }
    const minimum = Number(ui.minAttempts.value);
    const ranked = pool.filter(function (question) {
      const row = stats.get(question.id);
      const total = row && Number(row.total_answers);
      if (!row || !Number.isFinite(total) || total < minimum) return false;
      const correct = Number(row.correct_answers);
      if (!Number.isFinite(correct) || correct < 0 || correct > total) return false;
      question.practiceStats = { total: total, errorRate: (total - correct) / total };
      return true;
    });
    if (!ranked.length) throw new Error('当前范围内没有达到最低作答人数的题目，可降低人数门槛或扩大练习范围。');
    return ranked.sort(function (a, b) {
      return b.practiceStats.errorRate - a.practiceStats.errorRate ||
        b.practiceStats.total - a.practiceStats.total || a.id.localeCompare(b.id);
    });
  }

  async function startQuiz() {
    const mode = quizMode();
    const sources = selectedSourceCollections();
    if (!sources.length) { showSetupError('请至少选择一个题目来源。'); return; }
    const ids = mode === 'exam' ? state.catalog.modules.map(function (module) { return module.id; }) : selectedModuleIds();
    if (!ids.length) { showSetupError('请至少选择一个知识模块。'); return; }
    if (mode === 'module-all' && ids.length !== 1) { showSetupError('模块全练一次只能选择一个知识模块。'); return; }
    if (mode === 'exam' && !ui.paper.value) {
      showSetupError('请选择一份具体试卷或一个 CSAPP 章节。'); return;
    }
    showSetupError('');
    ui.start.disabled = true; ui.start.textContent = mode === 'mistakes' ? '正在读取错误率…' : '正在准备…';
    try {
      const bank = await loadQuestionBank();
      const examType = mode === 'module-all' || mode === 'exam' ? '' : ui.examType.value;
      let pool = bank.filter(function (question) {
        const paper = paperFor(question);
        return isPublishedQuestion(question) && paper && sources.includes(contract.paperCollection(paper)) &&
          question.classification.moduleIds.some(function (id) { return ids.includes(id); }) &&
          (!examType || (paper && contract.EXAM_LABELS[paper.examKind] === examType)) &&
          (mode !== 'exam' || question.paperId === ui.paper.value);
      }).map(function (question) { return Object.assign({}, question); });

      if (!pool.length) throw new Error('当前筛选条件下没有可用题目');
      if (mode === 'random') {
        pool = pool.filter(function (question) { return !state.mastered.has(question.id); });
        if (!pool.length) throw new Error('当前范围内的题目都已标记熟知。可扩大范围，或在模块全练 / 按卷练习中取消标记。');
      }
      if (mode === 'mistakes') pool = await rankByErrorRate(pool);

      const count = mode === 'random' || mode === 'mistakes' ? Math.min(Number(ui.count.value), pool.length) : pool.length;
      state.questions = mode === 'exam'
        ? pool.sort(function (a, b) { return Number(a.paperOrder || 0) - Number(b.paperOrder || 0); })
        : mode === 'mistakes' ? pool.slice(0, count) : secureShuffle(pool).slice(0, count);
      state.index = 0; state.score = 0; state.records = []; state.drafts = [];
      $('ics-question-map').open = !window.matchMedia('(max-width: 720px)').matches;

      ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false;
      renderQuestion();
    } catch (error) {
      showSetupError(error.message);
    } finally {
      ui.start.disabled = false; ui.start.textContent = '开始练习 →';
    }
  }

  function saveQuestionDraft() {
    if (!state.questions[state.index] || ui.quiz.hidden) return;
    state.drafts[state.index] = {
      answer: ui.answer.value,
      blanks: Array.from(ui.questionContent.querySelectorAll('.ics-blank-input')).map(function (input) {
        return { name: input.name, value: input.value };
      }),
      compositeChoices: Array.from(ui.questionContent.querySelectorAll('[data-composite-choice].selected')).map(function (button) {
        return { part: button.closest('[data-part-index]').dataset.partIndex, choice: button.dataset.compositeChoice };
      }),
      submitted: !ui.feedback.hidden,
      needsSelfGrade: !ui.selfGrade.hidden,
      pendingCompositeGrade: state.pendingCompositeGrade,
      verdict: ui.verdict.textContent,
      verdictClass: ui.verdict.className,
    };
  }

  function draftHasContent(draft) {
    return draft && (draft.answer || draft.submitted || draft.blanks.some(function (blank) { return blank.value; }) || draft.compositeChoices.length);
  }

  function updateNavigation() {
    const answered = state.records.filter(function (record) { return record && typeof record.points === 'number'; }).length;
    const visited = state.records.filter(Boolean).length;
    const draft = state.drafts[state.index];
    const record = state.records[state.index];
    ui.scoreText.textContent = '已答 ' + answered + ' / ' + state.questions.length + ' · ' + state.score + ' 分';
    ui.completionSummary.textContent = answered + ' / ' + state.questions.length;
    ui.progressBar.style.width = (visited / state.questions.length * 100) + '%';
    ui.previous.disabled = state.index === 0;
    ui.next.hidden = false;
    ui.next.textContent = state.index === state.questions.length - 1 ? '查看结果 →' : '下一题 →';
    ui.navigationStatus.textContent = record && typeof record.points === 'number' ? '已作答 · ' + record.points + ' 分'
      : draft && draft.needsSelfGrade ? '请完成自评'
        : record && record.mode === 'skipped' ? '已跳过，可继续作答'
          : record && record.mode === 'unavailable' ? '答案待校对，未计分'
            : draftHasContent(draft) ? '草稿已保存' : '尚未作答';
    ui.questionGrid.innerHTML = state.questions.map(function (question, index) {
      const item = state.records[index];
      const saved = state.drafts[index];
      const status = item && typeof item.points === 'number' ? 'answered'
        : saved && saved.needsSelfGrade ? 'draft'
          : item && item.mode === 'skipped' ? 'skipped' : draftHasContent(saved) ? 'draft' : '';
      const label = status === 'answered' ? '已作答' : status === 'skipped' ? '已跳过' : status === 'draft' ? '有草稿' : '未作答';
      return '<button type="button" data-question-index="' + index + '" class="' + status + '"' +
        (index === state.index ? ' aria-current="step"' : '') +
        ' aria-label="第 ' + (index + 1) + ' 题，' + label + '">' + (index + 1) + '</button>';
    }).join('');
  }

  function highlightChoiceResults(question) {
    const correct = question.solution.grading === 'choice' ? question.solution.correctOptionIds : [];
    ui.choiceList.querySelectorAll('[data-choice]').forEach(function (button) {
      button.classList.toggle('is-correct', correct.includes(button.dataset.choice));
      button.classList.toggle('is-incorrect', correct.length > 0 && button.classList.contains('selected') && !correct.includes(button.dataset.choice));
    });
  }

  function restoreQuestionDraft(question) {
    const draft = state.drafts[state.index];
    if (!draft) return;
    ui.answer.value = draft.answer;
    ui.choiceList.querySelectorAll('[data-choice]').forEach(function (button) {
      const selected = draft.answer.includes(button.dataset.choice);
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    ui.questionContent.querySelectorAll('.ics-blank-input').forEach(function (input) {
      const saved = draft.blanks.find(function (blank) { return blank.name === input.name; });
      if (saved) input.value = saved.value;
      syncBlank(input);
    });
    ui.questionContent.querySelectorAll('[data-composite-choice]').forEach(function (button) {
      const part = button.closest('[data-part-index]').dataset.partIndex;
      const selected = draft.compositeChoices.some(function (saved) { return saved.part === part && saved.choice === button.dataset.compositeChoice; });
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (!draft.submitted) return;
    ui.answer.disabled = true; ui.submit.disabled = true; ui.submit.hidden = true; ui.skip.hidden = true;
    ui.feedback.hidden = false; ui.selfGrade.hidden = !draft.needsSelfGrade;
    state.pendingCompositeGrade = draft.pendingCompositeGrade;
    ui.verdict.textContent = draft.verdict; ui.verdict.className = draft.verdictClass;
    ui.reference.innerHTML = renderSolution(question);

    ui.choiceList.querySelectorAll('button').forEach(function (button) { button.disabled = true; });
    disableQuestionControls(ui.questionContent);
    if (!draft.needsSelfGrade) highlightChoiceResults(question);
    typeset(ui.reference);
  }

  function renderQuestion() {
    closeIssueForm();
    const q = state.questions[state.index];
    state.pendingCompositeGrade = null;
    const number = state.index + 1;
    const choiceQuestion = q.type === 'single-choice' || q.type === 'multiple-choice';
    const compositeQuestion = q.type === 'composite';
    state.currentMode = q.solution.state !== 'available' ? 'unavailable' : choiceQuestion ? 'choice'
      : q.type === 'fill' ? 'fill' : compositeQuestion ? 'composite' : 'short';
    const modeLabel = issueTypeLabel(q.type);

    ui.progressText.textContent = '第 ' + number + ' / ' + state.questions.length + ' 题';
    ui.questionMeta.innerHTML = '<span class="ics-mode-badge">' + modeLabel + '</span>' +
      [paperFor(q) && paperFor(q).displayName, q.number.display, moduleTitle(q)]
        .filter(Boolean).map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('');
    ui.questionHistory.hidden = !q.practiceStats;
    ui.questionHistory.textContent = q.practiceStats
      ? '历史错误率 ' + Math.round(q.practiceStats.errorRate * 100) + '% · ' + q.practiceStats.total + ' 人作答 · 按错误率降序练习' : '';
    ui.questionContent.innerHTML = q.type === 'fill' ? renderFillQuestion(q.stem)
      : compositeQuestion ? renderCompositeQuestion(q) : renderContent(q.stem);

    ui.answer.value = ''; ui.answer.disabled = false; ui.submit.disabled = false; ui.skip.disabled = false;
    ui.submit.hidden = false; ui.skip.hidden = false;
    const alreadyReported = state.reportedThisSession.has(q.id);
    const reporting = state.reportingQuestions.has(q.id);
    ui.reportIssue.disabled = alreadyReported || reporting;
    ui.reportIssue.textContent = alreadyReported ? '已报告，感谢反馈' : reporting ? '正在提交…' : '您认为此题有误';
    ui.reportStatus.textContent = alreadyReported ? '题目 ID：' + q.id : '';
    ui.issueSend.disabled = false;
    ui.issueMessage.disabled = false;
    ui.issueCancel.disabled = false;
    renderMastery();
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
      ? (q.type === 'multiple-choice' ? '可选择多个选项' : '点击一个选项')
      : state.currentMode === 'fill' ? '逐空填写或展开选择；标注“可多选”的空位可勾选多项'
        : state.currentMode === 'composite' ? '选择与填空自动核对；简答显示答案后自评'
          : '本题查看答案后自评';
    ui.submit.textContent = state.currentMode === 'unavailable' ? '跳过并继续'
      : (state.currentMode === 'short' || state.currentMode === 'composite')
        ? (state.currentMode === 'composite' ? '提交整题' : '显示参考答案')
        : '提交答案';
    if (choiceQuestion) {
      ui.choiceList.dataset.multiple = q.type === 'multiple-choice' ? 'true' : 'false';
      ui.choiceList.innerHTML = renderOptions(q.options, 'data-choice');
    }
    if (q.solution.state !== 'available') {
      disableQuestionControls(ui.questionContent);
      ui.choiceList.querySelectorAll('button').forEach(function (control) { control.disabled = true; });
    } else if (compositeQuestion) {
      q.parts.forEach(function (part, index) {
        if (part.solution.state === 'available') return;
        disableQuestionControls(ui.questionContent.querySelector('[data-composite-part="' + index + '"]'));
      });
    }

    ui.answerForm.hidden = false; ui.feedback.hidden = true; ui.selfGrade.hidden = true;
    ui.choiceList.classList.remove('needs-choice');
    ui.feedback.querySelector('details').open = true;
    ui.verdict.className = 'ics-verdict'; ui.reference.innerHTML = '';
    restoreQuestionDraft(q);
    updateNavigation();
    typeset(ui.questionContent);
    typeset(ui.choiceList);
    loadQuestionStats(q.id).catch(function () {});
    if (state.drafts[state.index] && state.drafts[state.index].submitted) {
      state.statsRevealed = true;
      renderLiveStats();
    }
    window.scrollTo({ top: Math.max(0, ui.quiz.offsetTop - 16), behavior: 'auto' });
  }



  function recordGrade(points, mode) {
    const q = state.questions[state.index];
    const previous = state.records[state.index];
    if (previous && typeof previous.points === 'number') return;
    state.records[state.index] = { question: q, answer: ui.answer.value.trim(), points: points, mode: mode };
    state.score = Math.round(state.records.reduce(function (total, record) {
      return total + (record && typeof record.points === 'number' ? record.points : 0);
    }, 0) * 100) / 100;
    if (typeof points === 'number') {
      // This hook runs only after grading. Skips, revealing an answer and
      // revisiting a graded record never create a completed attempt.
      attemptCounts.add(crypto.randomUUID());
      renderLocalAttempts();
      recordRemoteStats(q, points === 1).catch(function () {});
    }
    ui.selfGrade.hidden = true;
    ui.submit.hidden = true; ui.skip.hidden = true;
    highlightChoiceResults(q);
    saveQuestionDraft();
    updateNavigation();
  }

  function evaluateComposite(question) {
    const answers = [];
    let objectiveCorrect = 0;
    let objectiveCount = 0;
    let subjectiveCount = 0;
    let firstMissing = null;
    question.parts.forEach(function (part, index) {
      const root = ui.questionContent.querySelector('[data-composite-part="' + index + '"]');
      if (!root || part.solution.state !== 'available') return;
      if (part.type === 'single-choice' || part.type === 'multiple-choice') {
        const list = root.querySelector('.ics-composite-choices');
        const selected = Array.from(list.querySelectorAll('.selected'))
          .map(function (button) { return button.dataset.compositeChoice; }).sort();
        if (!selected.length) {
          list.classList.add('needs-choice');
          if (!firstMissing) firstMissing = list;
          return;
        }
        const result = contract.gradeChoice(selected, part.solution);
        answers.push(part.number.display + '：' + selected.join(''));
        if (result !== null) {
          objectiveCount += 1;
          if (result) objectiveCorrect += 1;
        } else {
          subjectiveCount += 1;
        }
      } else if (part.type === 'fill') {
        const inputs = Array.from(root.querySelectorAll('.ics-blank-input'));
        const missing = inputs.find(function (input) { return !input.value.trim(); });
        if (missing) {
          missing.classList.add('missing');
          if (!firstMissing) firstMissing = missing;
          return;
        }
        answers.push(part.number.display + '：' + inputs.map(function (input) {
          return input.dataset.blankId + '=' + blankAnswerText(input);
        }).join('；'));
        const fillResult = gradeFillInputs(inputs, part.solution);
        if (fillResult === null) subjectiveCount += 1;
        else {
          objectiveCount += 1;
          if (fillResult) objectiveCorrect += 1;
        }
      } else {
        subjectiveCount += 1;
        answers.push(part.number.display + '：查看答案后自评');
      }
    });
    if (firstMissing) {
      if (firstMissing.matches('.ics-blank-input')) focusBlank(firstMissing);
      else if (firstMissing.focus) firstMissing.focus();
      return null;
    }
    disableQuestionControls(ui.questionContent);
    return {
      answers: answers,
      objectiveCorrect: objectiveCorrect,
      objectiveCount: objectiveCount,
      subjectiveCount: subjectiveCount,
    };
  }

  function submitAnswer(event) {
    event.preventDefault();
    if (ui.submit.disabled) return;
    if (state.currentMode === 'unavailable') {
      ui.answer.value = '答案待校对，本题未计分';
      ui.submit.disabled = true; ui.skip.disabled = true;
      ui.feedback.hidden = false;
      ui.reference.innerHTML = renderSolution(state.questions[state.index]);
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
      if (missing) { missing.classList.add('missing'); focusBlank(missing); return; }
      ui.answer.value = inputs.map(function (input, index) {
        input.disabled = true;
        return '第 ' + (index + 1) + ' 空：' + blankAnswerText(input);
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
    const fillInputs = state.currentMode === 'fill'
      ? Array.from(ui.questionContent.querySelectorAll('.ics-blank-input')) : [];
    const selected = Array.from(ui.choiceList.querySelectorAll('.selected')).map(function (button) { return button.dataset.choice; });
    const result = state.currentMode === 'choice' ? contract.gradeChoice(selected, q.solution)
      : state.currentMode === 'fill' ? gradeFillInputs(fillInputs, q.solution)
        : state.currentMode === 'composite' && compositeResult.subjectiveCount === 0 && compositeResult.objectiveCount
          ? compositeResult.objectiveCorrect === compositeResult.objectiveCount : null;

    ui.answer.disabled = true; ui.submit.disabled = true; ui.feedback.hidden = false;
    ui.submit.hidden = true; ui.skip.hidden = true;
    ui.choiceList.querySelectorAll('button').forEach(function (button) { button.disabled = true; });
    disableQuestionControls(ui.questionContent);
    ui.reference.innerHTML = renderSolution(q);

    typeset(ui.reference);

    if (state.currentMode === 'composite' && compositeResult.subjectiveCount === 0 && compositeResult.objectiveCount) {
      const points = Math.round(compositeResult.objectiveCorrect / compositeResult.objectiveCount * 100) / 100;
      ui.verdict.className = 'ics-verdict ' + (points === 1 ? 'correct' : points === 0 ? 'incorrect' : '');
      ui.verdict.textContent = '客观小问自动核对：' + compositeResult.objectiveCorrect + ' / ' + compositeResult.objectiveCount +
        '，本题得 ' + points + ' 分。';
      recordGrade(points, 'auto');
    } else if (result === true) {
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
    saveQuestionDraft();
    updateNavigation();
  }

  function navigateQuestion(index) {
    if (index < 0 || index >= state.questions.length || index === state.index) return;
    saveQuestionDraft();
    state.index = index;
    renderQuestion();
  }

  function advanceQuestion() {
    if (state.index >= state.questions.length - 1) finishQuiz();
    else navigateQuestion(state.index + 1);
  }

  function skipCurrentQuestion() {
    const q = state.questions[state.index];
    if (!q || (state.records[state.index] && typeof state.records[state.index].points === 'number')) return;
    saveQuestionDraft();
    state.records[state.index] = { question: q, answer: '已跳过', points: null, mode: 'skipped' };
    advanceQuestion();
  }

  function finishQuiz() {
    saveQuestionDraft();
    stopStatsSubscription();
    ui.quiz.hidden = true; ui.result.hidden = false;
    const total = state.questions.length;
    const graded = state.records.filter(function (record) { return typeof record.points === 'number'; }).length;
    const skipped = state.records.filter(function (record) { return record.mode === 'skipped'; }).length;
    const unavailable = state.records.filter(function (record) { return record.mode === 'unavailable'; }).length;
    const ungraded = total - graded - skipped - unavailable;
    const percent = graded ? Math.round((state.score / graded) * 100) : 0;
    ui.finalScore.textContent = graded ? percent + '%' : '—';
    ui.finalSummary.textContent = '本次共 ' + total + ' 题 · 已计分 ' + graded + ' 题 · 跳过 ' + skipped +
      ' 题 · 待完成 ' + ungraded + ' 题' + (unavailable ? ' · 答案待校对 ' + unavailable + ' 题' : '') +
      (graded ? '。得分 ' + state.score + ' / ' + graded + '。' : '。');
    ui.resume.textContent = ungraded || skipped ? '继续未完成的题' : '返回题目';
    ui.reviewList.hidden = true; ui.reviewToggle.textContent = '查看答题记录';
    ui.reviewList.innerHTML = state.questions.map(function (question, index) {
      const record = state.records[index];
      const draft = state.drafts[index];
      const score = record && record.mode === 'skipped' ? '已跳过'
        : record && typeof record.points === 'number' ? record.points + ' 分' : draft && draft.needsSelfGrade ? '待自评' : '未计分';
      const originalNumber = question.number.display ? ' · ' + escapeHtml(question.number.display) : '';
      return '<button type="button" class="ics-review-item" data-review-index="' + index + '"><span class="ics-review-score">' + score + '</span>' +
        '<strong>第 ' + (index + 1) + ' 题' + originalNumber + '</strong>' +
        '<p>' + (record && record.mode !== 'skipped' ? '你的回答：' + escapeHtml(record.answer)
          : draftHasContent(draft) ? '已保留草稿，点击返回题目' : '尚未作答，点击返回题目') + '</p></button>';
    }).join('');
    window.scrollTo({ top: ui.result.offsetTop - 90, behavior: 'smooth' });
  }

  function resumeQuiz(index) {
    if (!state.questions.length) return;
    if (typeof index !== 'number') {
      index = state.questions.findIndex(function (question, position) {
        const record = state.records[position];
        return !record || (typeof record.points !== 'number' && record.mode !== 'unavailable');
      });
      if (index < 0) index = state.index;
    }
    ui.result.hidden = true; ui.quiz.hidden = false;
    state.index = index;
    renderQuestion();
  }

  function resetToSetup() {
    stopStatsSubscription();
    ui.quiz.hidden = true; ui.result.hidden = true; ui.setup.hidden = false;
    showSetupError('');
    window.scrollTo({ top: ui.setup.offsetTop - 90, behavior: 'smooth' });
  }

  ui.modePicker.addEventListener('change', updateModeUi);
  ui.sourcePicker.addEventListener('change', function () { if (state.catalog) renderSourceFilters(); });
  ui.paper.addEventListener('change', updatePaperStatus);
  ui.modules.addEventListener('change', function (event) {
    if (quizMode() === 'module-all' && event.target.matches('input')) {
      ui.modules.querySelectorAll('input').forEach(function (box) { box.checked = box === event.target; });
    }
    updateSelectToggle();
  });
  ui.selectToggle.addEventListener('click', function () {
    const boxes = Array.from(ui.modules.querySelectorAll('input:not(:disabled)'));
    const allSelected = boxes.length && boxes.every(function (box) { return box.checked; });
    boxes.forEach(function (box) { box.checked = !allSelected; }); updateSelectToggle();
  });
  ui.start.addEventListener('click', startQuiz);
  ui.reportIssue.addEventListener('click', openIssueForm);
  ui.issueForm.addEventListener('submit', reportCurrentIssue);
  ui.issueCancel.addEventListener('click', function () { closeIssueForm(); ui.reportIssue.focus(); });
  ui.mastery.addEventListener('click', toggleMastery);
  window.addEventListener('storage', function (event) {
    if (event.key === MASTERY_KEY || event.key === null) { loadMastery(); renderMastery(); }
    if (event.key === null || event.key.startsWith(window.ICSAttemptCounts.PREFIX)) {
      attemptCounts.refresh(); renderLocalAttempts();
    }
  });
  window.addEventListener('online', loadSiteAttempts);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      attemptCounts.refresh(); renderLocalAttempts(); loadSiteAttempts();
    }
  });
  ui.issueBoard.addEventListener('toggle', function () {
    if (ui.issueBoard.open) Promise.all([ensureIssueQuestionIndex(), loadIssueMessages()]).catch(function (error) {
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
    if (!button || button.disabled) return;
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
    const input = event.target;
    if (!input.matches('.ics-blank-input')) return;
    ui.questionContent.querySelectorAll('.ics-blank-input').forEach(function (other) {
      if (other.dataset.blankId === input.dataset.blankId && other.dataset.blankScope === input.dataset.blankScope) {
        other.value = input.value; other.classList.remove('missing');
        syncBlank(other);
      }
    });
  });
  ui.questionContent.addEventListener('change', function (event) {
    const option = event.target.closest('[data-blank-option]');
    if (!option) return;
    const root = option.closest('.ics-inline-blank');
    if (option.checked) root.querySelectorAll('[data-blank-option]').forEach(function (other) {
      if (other !== option && (option.dataset.exclusive === 'true' || other.dataset.exclusive === 'true')) other.checked = false;
    });
    const input = root.querySelector('.ics-blank-input');
    const selected = Array.from(root.querySelectorAll('[data-blank-option]:checked')).map(function (item) { return item.value; });
    input.value = selected.length ? JSON.stringify(selected) : '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  ui.questionContent.addEventListener('click', function (event) {
    const close = event.target.closest('[data-blank-close]');
    if (close) {
      const toggle = close.closest('.ics-inline-blank').querySelector('[data-blank-toggle]');
      closeBlankMenus(); toggle.focus(); return;
    }
    const toggle = event.target.closest('[data-blank-toggle]');
    if (!toggle || toggle.disabled) return;
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    closeBlankMenus();
    if (wasOpen) return;
    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
    toggle.setAttribute('aria-expanded', 'true'); menu.hidden = false;
    const rect = toggle.getBoundingClientRect();
    const width = Math.min(260, window.innerWidth - 24);
    menu.style.width = width + 'px';
    menu.style.left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + 'px';
    menu.style.top = (rect.bottom + menu.offsetHeight + 8 <= window.innerHeight
      ? rect.bottom + 4 : Math.max(8, rect.top - menu.offsetHeight - 4)) + 'px';
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.ics-inline-blank')) closeBlankMenus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    const toggle = ui.questionContent.querySelector('[data-blank-toggle][aria-expanded="true"]');
    closeBlankMenus(); if (toggle) toggle.focus();
  });
  window.addEventListener('resize', closeBlankMenus);
  window.addEventListener('scroll', function (event) {
    if (!event.target.closest || !event.target.closest('.ics-blank-menu')) closeBlankMenus();
  }, true);
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
  ui.previous.addEventListener('click', function () { navigateQuestion(state.index - 1); });
  ui.finish.addEventListener('click', finishQuiz);
  ui.resume.addEventListener('click', function () { resumeQuiz(); });
  ui.questionGrid.addEventListener('click', function (event) {
    const button = event.target.closest('[data-question-index]');
    if (button) navigateQuestion(Number(button.dataset.questionIndex));
  });
  ui.reviewList.addEventListener('click', function (event) {
    const button = event.target.closest('[data-review-index]');
    if (button) resumeQuiz(Number(button.dataset.reviewIndex));
  });
  function saveEditedDraft() { saveQuestionDraft(); updateNavigation(); }
  ui.choiceList.addEventListener('click', function () { if (!ui.submit.disabled) saveEditedDraft(); });
  ui.questionContent.addEventListener('input', saveEditedDraft);
  ui.questionContent.addEventListener('click', function (event) {
    if (event.target.closest('[data-composite-choice]') && !ui.submit.disabled) saveEditedDraft();
  });
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
