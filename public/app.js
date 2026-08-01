(() => {
  "use strict";

  const D = window.MINIMBA_DATA;
  const STORAGE_KEY = "ateira-minimba-state-v1";

  const iconPaths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M9.5 20v-6h5v6"/>',
    route: '<path d="M5 5h7a4 4 0 0 1 4 4v10"/><path d="m13 16 3 3 3-3"/><circle cx="5" cy="5" r="2"/>',
    project: '<path d="M4 6.5h16v13H4z"/><path d="M8 6.5V4h8v2.5M4 11h16"/><path d="M10 11v2h4v-2"/>',
    portfolio: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    play: '<path d="m9 7 8 5-8 5z"/>',
    calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 18h1M12 18h5"/>',
    cards: '<path d="m6 3 12 2-2 16-12-2z"/><path d="m9 8 5 .8M8.5 12l5 .8"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9 0 3-2 4-3 4 0-3-1-5-3-7 0 4-3 6-3 10 0 5 3 9 7 9z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
    back: '<path d="M19 12H5M10 17l-5-5 5-5"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    spark: '<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
    chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
    shield: '<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>'
  };

  const defaultState = {
    started: false,
    onboarding: false,
    onboardingStep: 0,
    onboarded: false,
    currentView: "today",
    sidebarOpen: false,
    aiOpen: false,
    access: "guest",
    accessCode: "",
    profile: {
      name: "Гость",
      nameCustomized: false,
      email: "guest@example.com",
      avatar: "initial",
      avatarImage: "",
      goal: "product",
      education: "bachelor",
      experience: "1-2",
      hours: "6-8",
      english: "b1",
      country: "ОАЭ",
      consent: false
    },
    completedTasks: [],
    introCompleted: false,
    introSlide: 0,
    videoDone: false,
    activeVideoId: "contract-35000",
    videoPositions: {},
    lessonChapter: 0,
    quizAnswers: {},
    quizSelected: "",
    quizPassed: false,
    lessonCompleted: false,
    project: {
      name: "Studio North",
      price: 35000,
      projects: 4,
      durationWeeks: 3,
      variable: 12000,
      fixed: 62000,
      hours: 92,
      hourlyCost: 120,
      assumptions: "Средняя команда: дизайнер и арт-директор. Один проект длится 3 недели. Оплата клиента: 50% аванс, 50% после приёмки.",
      attachment: ""
    },
    projectSaved: false,
    projectSubmitted: false,
    portfolioPublic: false,
    settings: { reminders: true, aiData: true, marketing: false },
    messages: [
      { role: "assistant", text: "Привет! Я помогу проверить логику, но не буду решать за вас. Покажите первую попытку или задайте вопрос по текущему уроку." }
    ]
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return structuredClone(defaultState);
      const merged = deepMerge(structuredClone(defaultState), saved);
      if (saved.profile?.name === "Алина" && !saved.profile?.nameCustomized) {
        merged.profile.name = "Гость";
        if (saved.profile?.email === "alina@example.com") merged.profile.email = "guest@example.com";
      }
      if (!Object.prototype.hasOwnProperty.call(saved, "lessonChapter")) {
        merged.videoDone = false;
        merged.completedTasks = merged.completedTasks.filter(task => task !== "video");
      }
      if (!Object.prototype.hasOwnProperty.call(saved, "quizAnswers")) {
        merged.quizAnswers = {};
        merged.quizPassed = false;
        merged.completedTasks = merged.completedTasks.filter(task => task !== "quiz");
      }
      return merged;
    } catch {
      return structuredClone(defaultState);
    }
  }

  function deepMerge(target, source) {
    Object.keys(source || {}).forEach(key => {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else target[key] = source[key];
    });
    return target;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function setState(patch, rerender = true) {
    state = deepMerge(state, patch);
    saveState();
    if (rerender) render();
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function icon(name, className = "") {
    return `<span class="icon ${className}" aria-hidden="true"><svg viewBox="0 0 24 24">${iconPaths[name] || iconPaths.spark}</svg></span>`;
  }

  function avatarTemplate(className = "") {
    const avatar = state.profile.avatar || "initial";
    if (state.profile.avatarImage) return `<div class="avatar avatar-custom ${className}"><img src="${esc(state.profile.avatarImage)}" alt=""></div>`;
    const content = avatar === "initial" ? esc(state.profile.name.trim().slice(0,1).toUpperCase() || "Г") : icon(avatar);
    return `<div class="avatar avatar-${esc(avatar)} ${className}" aria-hidden="true">${content}</div>`;
  }

  function hasAccess() { return state.access === "code" || state.access === "subscription"; }
  function profileRoute() {
    if (state.profile.goal === "mba" && state.profile.education === "bachelor" && state.profile.experience === "3+") return "Опыт → программа MBA для подготовки руководителей";
    if (state.profile.education !== "bachelor") return "Образование → опыт → MBA";
    if (state.profile.goal === "mba") return "Бакалавриат → опыт → программа MBA или магистратура менеджмента";
    return "Дизайн → продукт и управление";
  }

  function weeklyProgress() {
    let progress = state.introCompleted ? 8 : 0;
    if (state.videoDone) progress += 28;
    if (state.quizPassed) progress += 24;
    if (state.projectSaved) progress += 25;
    if (state.lessonCompleted) progress = 100;
    return Math.min(progress, 100);
  }

  function render() {
    const root = document.getElementById("app");
    if (!state.started) root.innerHTML = welcomeTemplate();
    else if (state.onboarding || !state.onboarded) root.innerHTML = onboardingTemplate();
    else root.innerHTML = shellTemplate();
    renderModal("");
    bindStaticEvents();
  }

  function welcomeTemplate() {
    return `
      <main class="welcome" id="main-content">
        <section class="welcome-copy">
          <div class="welcome-brand"><span class="brand-mark">A</span><span>Ateira <span class="muted">· MiniMBA</span></span></div>
          <span class="eyebrow">Бизнес начинается с решения</span>
          <h1 class="display">Из дизайнера —<br><em>в того,</em><br>который решает.</h1>
          <p class="welcome-lead">Практический бизнес-тренажёр: финансы, данные и стратегия через ваш собственный проект.</p>
          <div class="welcome-actions">
            <button class="btn coral" data-action="start-onboarding">Начать бесплатно ${icon("arrow")}</button>
            <button class="btn secondary" data-action="open-demo">Посмотреть демо</button>
          </div>
          <div class="trust-row"><span><i></i> Персональный маршрут</span><span><i></i> 60% практики</span><span><i></i> Первый урок бесплатно</span></div>
        </section>
        <aside class="welcome-visual" aria-label="Пример учебного результата">
          <div class="hero-stack">
            <div class="float-note">12 недель до<br>первого проекта</div>
            <div class="hero-card">
              <span class="eyebrow">Экономика студии</span>
              <h3>Доход ≠ результат</h3>
              <p class="muted">Сравните выручку, затраты и маржу четырёх проектов.</p>
              <div class="mini-chart" aria-label="График маржи по проектам">
                <div class="bar" style="height:46%"><span>18%</span></div><div class="bar active" style="height:82%"><span>34%</span></div><div class="bar" style="height:62%"><span>25%</span></div><div class="bar" style="height:72%"><span>29%</span></div>
              </div>
            </div>
            <div class="float-score"><span><strong>3×</strong>сценария</span></div>
          </div>
        </aside>
      </main>`;
  }

  function onboardingTemplate() {
    const step = state.onboardingStep;
    const progress = [0,1,2,3].map(i => `<i class="${i <= step ? "active" : ""}"></i>`).join("");
    return `
      <main class="onboarding" id="main-content">
        <section class="onboard-side">
          <div class="sidebar-brand"><span class="brand-mark">A</span><span>Ateira<small>MiniMBA</small></span></div>
          <h2>${["Начнём с вашей цели.","Где вы сейчас?","Соберём удобный ритм.","Ваш маршрут готов."][step]}</h2>
          <p>${["Маршрут подстроится под опыт и следующий карьерный шаг.","Мы не будем отправлять вас изучать то, что вы уже умеете.","Персональный календарь можно изменить в любой момент.","Это рекомендация, а не ограничение: маршрут всегда можно пересобрать."][step]}</p>
          <div class="onboard-foot">ОАЭ · данные используются для персонализации обучения</div>
        </section>
        <section class="onboard-main">
          <div class="onboard-step">
            <div class="onboard-progress" aria-label="Шаг ${step + 1} из 4">${progress}</div>
            ${onboardingStepTemplate(step)}
          </div>
          <div class="onboard-actions">
            <button class="btn ghost" data-action="onboard-back" ${step === 0 ? "disabled" : ""}>${icon("back")} Назад</button>
            <button class="btn coral" data-action="onboard-next" ${step === 3 && !state.profile.consent ? "disabled" : ""}>${step === 3 ? "Открыть мой маршрут" : "Продолжить"} ${icon("arrow")}</button>
          </div>
        </section>
      </main>`;
  }

  function choice(name, value, title, subtitle) {
    const selected = state.profile[name] === value;
    return `<button class="choice ${selected ? "selected" : ""}" data-choice="${name}" data-value="${value}" aria-pressed="${selected}"><strong>${title}</strong><span>${subtitle}</span></button>`;
  }

  function onboardingStepTemplate(step) {
    if (step === 0) return `
      <span class="eyebrow">Шаг 1 из 4</span><h1>Какой следующий шаг важнее?</h1><p>Выберите главную цель на ближайшие 12–24 месяца.</p>
      <div class="choice-grid">
        ${choice("goal","product","Перейти в продукт","Продуктовая работа, управление дизайном или новая ответственность")}
        ${choice("goal","business","Управлять бизнесом","Экономика студии, команда и рост")}
        ${choice("goal","mba","Подготовиться к программе MBA","Управленческие навыки, проекты и история кандидата")}
        ${choice("goal","grow","Стать сильнее в текущей роли","Влиять на решения и говорить на языке бизнеса")}
      </div>`;
    if (step === 1) return `
      <span class="eyebrow">Шаг 2 из 4</span><h1>Ваш текущий контекст</h1><p>Эти ответы определяют карьерные рекомендации и глубину вводных тем.</p>
      <div class="field-grid">
        <div class="field"><label for="education">Образование</label><select id="education" data-profile="education"><option value="college" ${state.profile.education === "college" ? "selected" : ""}>Колледж / СПО</option><option value="bachelor" ${state.profile.education === "bachelor" ? "selected" : ""}>Бакалавриат или выше</option><option value="other" ${state.profile.education === "other" ? "selected" : ""}>Другое</option></select></div>
        <div class="field"><label for="experience">Профессиональный опыт</label><select id="experience" data-profile="experience"><option value="0-1">Менее года</option><option value="1-2" ${state.profile.experience === "1-2" ? "selected" : ""}>1–2 года</option><option value="3+" ${state.profile.experience === "3+" ? "selected" : ""}>3 года и более</option></select></div>
        <div class="field"><label for="english">Английский</label><select id="english" data-profile="english"><option value="a2">A2 и ниже</option><option value="b1" ${state.profile.english === "b1" ? "selected" : ""}>B1</option><option value="b2">B2</option><option value="c1">C1+</option></select></div>
        <div class="field"><label for="country">Страна запуска</label><input id="country" data-profile="country" value="${esc(state.profile.country)}" readonly></div>
      </div>`;
    if (step === 2) return `
      <span class="eyebrow">Шаг 3 из 4</span><h1>Сколько времени реально есть?</h1><p>Мы построим персональный календарь без фиксированной когорты.</p>
      <div class="choice-grid">
        ${choice("hours","3-5","3–5 часов в неделю","Спокойный маршрут с короткими сессиями")}
        ${choice("hours","6-8","6–8 часов в неделю","Рекомендуемый темп для работающего специалиста")}
        ${choice("hours","8-10","8–10 часов в неделю","Полный темп основной программы")}
        ${choice("hours","10+","Более 10 часов","Интенсивный маршрут")}
      </div>`;
    return `
      <span class="eyebrow">Шаг 4 из 4</span><h1>${profileRoute()}</h1><p>Начинаем с экономики проекта. Первый урок доступен бесплатно; затем можно активировать код доступа.</p>
      <div class="result-route"><div class="route-icon">${icon("route")}</div><div><h3>12 недель · персональный календарь</h3><p>Экономика проекта → финансовый учёт → финансовая модель. После квартального проекта откроется следующий этап.</p></div></div>
      <label class="consent"><input type="checkbox" data-profile="consent" ${state.profile.consent ? "checked" : ""}><span>Я согласен(на) на обработку данных профиля для персонализации обучения и ознакомился(ась) с возможностью выгрузить или удалить данные. Согласие на маркетинговые сообщения запрашивается отдельно.</span></label>`;
  }

  function shellTemplate() {
    return `<div class="app-shell">
      ${sidebarTemplate()}
      <main class="main" id="main-content">
        ${topbarTemplate()}
        ${viewTemplate()}
      </main>
      <button class="ai-fab" data-action="toggle-ai" aria-label="Открыть ИИ-наставника">${icon("spark")}</button>
      ${state.aiOpen ? aiDrawerTemplate() : ""}
    </div>`;
  }

  function sidebarTemplate() {
    const items = [
      ["today","home","Сегодня"], ["route","route","Маршрут"], ["project","project","Проект"], ["portfolio","portfolio","Портфолио"], ["profile","user","Профиль"]
    ];
    return `<aside class="sidebar ${state.sidebarOpen ? "open" : ""}" aria-label="Основная навигация">
      <div class="sidebar-brand"><span class="brand-mark">A</span><span>Ateira<small>MiniMBA</small></span></div>
      <nav class="nav">${items.map(([id,ic,label]) => `<button class="nav-button ${state.currentView === id ? "active" : ""}" data-view="${id}">${icon(ic)}<span>${label}</span>${id === "project" && state.projectSaved ? '<span class="badge">1</span>' : ""}</button>`).join("")}</nav>
      <div class="sidebar-bottom">
        <div class="access-mini"><strong style="font-size:11px">${hasAccess() ? "Полный доступ" : "Гостевой доступ"}</strong><div class="tiny-progress"><i style="width:${hasAccess() ? 100 : 50}%"></i></div><span style="font-size:9px;color:rgba(255,255,255,.5)">${hasAccess() ? "Код активирован" : "1 из 1 уроков доступен"}</span></div>
        <div class="user-mini">${avatarTemplate("avatar-small")}<div><strong>${esc(state.profile.name)}</strong><span>${esc(profileRoute())}</span></div></div>
      </div>
    </aside>`;
  }

  function topbarTemplate() {
    const names = {today:"Сегодня",route:"Маршрут",project:"Квартальный проект",portfolio:"Портфолио",profile:"Профиль",intro:"Глава 0",lesson:"Урок 1"};
    return `<header class="topbar">
      <div style="display:flex;align-items:center;gap:12px"><button class="btn secondary icon-only mobile-menu" data-action="toggle-sidebar" aria-label="Открыть меню">${icon("menu")}</button><div class="breadcrumbs">MiniMBA &nbsp;/&nbsp; <strong>${names[state.currentView] || "Сегодня"}</strong></div></div>
      <div class="top-actions"><span class="status-chip hide-mobile">${icon("flame")} <b>${state.lessonCompleted ? 4 : 3}</b> дня подряд</span><span class="status-chip"><i class="pulse"></i>${hasAccess() ? "Доступ открыт" : "Гость"}</span><button class="btn secondary icon-only" aria-label="Уведомления">${icon("bell")}</button></div>
    </header>`;
  }

  function viewTemplate() {
    switch (state.currentView) {
      case "route": return routeTemplate();
      case "project": return projectTemplate();
      case "portfolio": return portfolioTemplate();
      case "profile": return profileTemplate();
      case "intro": return introTemplate();
      case "lesson": return lessonTemplate();
      default: return todayTemplate();
    }
  }

  function todayTemplate() {
    const p = weeklyProgress();
    const introTask = `<button class="task task-button ${state.introCompleted ? "done" : ""}" data-action="open-intro"><div class="task-icon">${state.introCompleted ? icon("check") : icon("route")}</div><div><span class="task-label">Глава 0 · Введение</span><strong>Зачем нужны бизнес и управление</strong></div><span class="task-time">${state.introCompleted ? "Готово" : "12 мин"}</span></button>`;
    const tasks = introTask + D.todayTasks.map((task, i) => {
      const done = (i === 0 && state.videoDone) || (i === 1 && state.projectSaved) || (i === 2 && state.quizPassed);
      return `<div class="task ${done ? "done" : ""}"><div class="task-icon">${done ? icon("check") : icon(task.icon)}</div><div><span class="task-label">${task.label}</span><strong>${task.title}</strong></div><span class="task-time">${done ? "Готово" : task.time}</span></div>`;
    }).join("");
    const finishedCount = [state.introCompleted, state.videoDone, state.projectSaved, state.quizPassed, state.lessonCompleted].filter(Boolean).length;
    const hero = state.introCompleted
      ? `<article class="hero-lesson card"><span class="kicker">Следующий шаг · 32 минуты</span><h2>Выручка — это ещё не прибыль</h2><p>Разберите экономику проекта, найдите скрытые затраты и примите первое бизнес-решение.</p><button class="btn" data-action="open-lesson">${state.lessonCompleted ? "Повторить урок" : "Продолжить урок"} ${icon("arrow")}</button><div class="hero-stat"><span><strong>${p}%</strong>неделя</span></div></article>`
      : `<article class="hero-lesson intro-hero card"><span class="kicker">Начните здесь · Глава 0 · 12 минут</span><h2>Зачем нужны бизнес и управление</h2><p>Разберитесь, что даёт программа MBA, как бизнес создаёт ценность и почему качество управления определяет, превращаются ли ресурсы общества в устойчивый результат.</p><button class="btn" data-action="open-intro">Открыть вводную главу ${icon("arrow")}</button><div class="hero-stat"><span><strong>00</strong>старт</span></div></article>`;
    return `
      <section class="page-head"><div><span class="eyebrow">Глава 0 → Неделя 1</span><h1 class="display">Добрый день, ${esc(state.profile.name)}.</h1><p>Начните со смысла программы подготовки руководителей (MBA), бизнеса и управления, а затем переходите к экономике первого проекта.</p></div><button class="btn secondary" data-view="route">Весь маршрут ${icon("arrow")}</button></section>
      ${!hasAccess() ? `<section class="access-card card"><div><h3>Ваш первый урок — бесплатно</h3><p>После него активируйте код, чтобы открыть следующие 11 недель и квартальный проект.</p></div><button class="btn coral" data-action="show-code">Ввести код доступа</button></section>` : ""}
      <section class="grid dashboard-grid">
        <div class="grid">
          ${hero}
          <article class="card card-pad"><div class="card-title-row"><h2>План на сегодня</h2><span class="caption">≈ 38 минут</span></div><div class="task-list">${tasks}</div></article>
          <article class="card card-pad"><div class="card-title-row"><h2>Компетенции</h2><button class="btn ghost small" data-view="profile">Диагностика</button></div><div class="competency-row">${skillsTemplate()}</div></article>
        </div>
        <aside class="grid">
          <article class="card week-progress"><div class="card-title-row"><h3>Эта неделя</h3><span class="caption">до воскресенья</span></div>${progressRing(p)}<div class="week-stats"><div><strong>${state.introCompleted ? (state.videoDone ? "1:24" : "0:46") : "0:34"}</strong><span>из 6 часов</span></div><div><strong>${finishedCount}/5</strong><span>шагов</span></div></div></article>
          <article class="card quote-card"><span class="eyebrow">Мысль недели</span><blockquote>«Хорошая модель не угадывает будущее. Она показывает, от чего оно зависит».</blockquote><footer>— Ateira · редакция курса</footer></article>
          <article class="card card-pad"><div class="card-title-row"><h3>Проект</h3><span class="caption">модуль 1/3</span></div><p style="font-size:12px;line-height:1.5;color:var(--muted)">${esc(state.project.name || "Экономика дизайн-студии")}</p><button class="btn secondary" data-view="project">Открыть расчёт ${icon("arrow")}</button></article>
        </aside>
      </section>`;
  }

  function progressRing(value) {
    const circumference = 2 * Math.PI * 52;
    const offset = circumference * (1 - value / 100);
    return `<div class="progress-ring"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="52"/><circle class="value" cx="60" cy="60" r="52" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/></svg><div><strong>${value}%</strong><span>готово</span></div></div>`;
  }

  function skillsTemplate() {
    return D.competencies.map(skill => `<div class="skill-line"><span>${skill.label}</span><div class="skill-track"><i style="width:${skill.score}%;background:${skill.color}"></i></div><strong>${skill.score}</strong></div>`).join("");
  }

  function introTemplate() {
    const slides = [
      {
        kicker: "Смысл программы",
        title: "MBA — это способ видеть организацию целиком",
        body: `<div class="intro-definition"><span>Расшифровка</span><strong>«Магистр делового администрирования» — управленческая программа, которую международно обозначают сокращением MBA.</strong><p>Она учит связывать клиента, деньги, процессы, людей и стратегию в одну систему решений. MiniMBA даёт компактную практическую версию этой логики, но не является академической степенью и не заменяет дипломную программу.</p></div><div class="intro-thesis"><strong>Цель — не выучить больше терминов.</strong><span>Цель — раньше замечать причинно-следственные связи и принимать решения, за которые можно отвечать цифрами и результатом.</span></div>`
      },
      {
        kicker: "Бизнес как система",
        title: "Бизнес превращает полезное решение в повторяемый результат",
        body: `<p class="intro-lead">Бизнес существует, когда организация снова и снова решает значимую задачу клиента, получает за это доход и сохраняет способность выполнить обещание завтра.</p><div class="business-system-grid"><div><span>01</span><strong>Клиент</strong><p>Для кого существует решение и какую задачу оно закрывает?</p></div><div><span>02</span><strong>Ценность</strong><p>Почему клиент выбирает это решение и готов за него платить?</p></div><div><span>03</span><strong>Способ работы</strong><p>Как люди, процессы и партнёры создают результат нужного качества?</p></div><div><span>04</span><strong>Экономика</strong><p>Остаётся ли достаточно денег для устойчивой работы и развития?</p></div></div>`
      },
      {
        kicker: "Управление",
        title: "Управление превращает намерение в воспроизводимый результат",
        body: `<div class="management-loop"><div><span>1</span><strong>Поставить цель</strong></div><i>→</i><div><span>2</span><strong>Сделать выбор</strong></div><i>→</i><div><span>3</span><strong>Организовать работу</strong></div><i>→</i><div><span>4</span><strong>Измерить и скорректировать</strong></div></div><div class="management-claim"><strong>Качественное управление — главный фактор успеха, который организация способна системно воспроизводить.</strong><p>Рынок, удачу и внешнюю среду нельзя контролировать. Но можно улучшать правила выбора, распределение ответственности, качество обратной связи и способность учиться. Именно так знания, технологии и ресурсы превращаются в общественно полезный результат.</p></div><p class="intro-caveat">На уровне общества управление не является единственной причиной процветания: важны право, образование, технологии, доверие и политико-экономические институты. Однако все они проявляются через качество конкретных правил, организаций и решений.</p>`
      },
      {
        kicker: "Аналогия из книги",
        title: "Хорошие правила расширяют участие; плохие — извлекают результат",
        body: `<p class="intro-lead">Дарон Аджемоглу и Джеймс Робинсон в книге «Почему одни страны богатые, а другие бедные» связывают долгосрочное процветание с институтами — устойчивыми правилами, которые формируют стимулы и распределяют возможности.</p><div class="institution-compare"><div class="inclusive"><span>Инклюзивная логика</span><strong>Больше людей могут создавать ценность</strong><ul><li>правила понятны и применяются последовательно;</li><li>инициатива и нововведения вознаграждаются;</li><li>есть доступ к возможностям и обратной связи;</li><li>результат поддерживает дальнейшее развитие.</li></ul></div><div class="extractive"><span>Извлекающая логика</span><strong>Узкая группа забирает ценность</strong><ul><li>решения зависят от близости к власти;</li><li>ошибки скрываются, а инициатива опасна;</li><li>информация и возможности закрыты;</li><li>краткосрочная выгода разрушает развитие.</li></ul></div></div><div class="analogy-note"><strong>Перенос в организацию — это аналогия, а не буквальное равенство.</strong><span>Зрелый руководитель строит прозрачные правила, распределяет право принимать решения и не позволяет локальной выгоде разрушать способность всей системы создавать ценность.</span></div>`
      },
      {
        kicker: "Карта обучения",
        title: "Пять вопросов, которые держит в голове руководитель",
        body: `<div class="manager-questions"><div><span>Клиент</span><strong>Какую ценность и для кого мы создаём?</strong></div><div><span>Деньги</span><strong>Как решение влияет на доход, расходы и денежный поток?</strong></div><div><span>Система</span><strong>Как воспроизвести результат без постоянного ручного спасения?</strong></div><div><span>Люди</span><strong>Кто принимает решение и у кого есть необходимые условия?</strong></div><div><span>Будущее</span><strong>Какие допущения нужно проверить до крупной ставки?</strong></div></div><div class="intro-final"><span>Рабочая формула курса</span><strong>Ценность → выбор → действие → измерение → обучение</strong><p>Дальше вы сначала разберёте язык финансовых показателей, затем увидите видеоматериалы и примените логику к своему проекту.</p></div>`
      }
    ];
    const current = Math.min(state.introSlide, slides.length - 1);
    const slide = slides[current];
    return `<button class="back-link" data-view="today">${icon("back")} Вернуться на сегодня</button>
      <section class="intro-layout">
        <article class="intro-deck card">
          <div class="intro-deck-head"><div><span class="eyebrow">Глава 0 · Введение в управление</span><h1>Зачем нужны MBA, бизнес и управление</h1></div><span class="intro-duration">12 минут · 5 экранов</span></div>
          <div class="intro-slide-tabs" aria-label="Навигация по вводной главе">${slides.map((item,index) => `<button class="${index === current ? "active" : index < current ? "visited" : ""}" data-intro-slide="${index}" aria-label="Экран ${index + 1}: ${esc(item.kicker)}"><span>${String(index + 1).padStart(2,"0")}</span>${item.kicker}</button>`).join("")}</div>
          <div class="intro-stage"><span class="intro-kicker">${String(current + 1).padStart(2,"0")} · ${slide.kicker}</span><h2>${slide.title}</h2><div class="intro-slide-body">${slide.body}</div></div>
          <div class="intro-actions"><button class="btn secondary" data-action="intro-prev" ${current === 0 ? "disabled" : ""}>${icon("back")} Назад</button><span>${current + 1} из ${slides.length}</span>${current < slides.length - 1 ? `<button class="btn coral" data-action="intro-next">Дальше ${icon("arrow")}</button>` : `<button class="btn coral" data-action="finish-intro">Перейти к терминам ${icon("arrow")}</button>`}</div>
        </article>
        <aside class="intro-aside">
          <article class="card intro-summary"><span class="eyebrow">Главная мысль</span><blockquote>Благополучие создают не ресурсы сами по себе, а правила и управление, которые помогают людям превращать ресурсы в ценность.</blockquote><p>Внутри организации качество управления — главный рычаг, который находится в руках руководителя.</p></article>
          <article class="card intro-next-card"><span>Следующий шаг</span><strong>Понятия перед финансовым кейсом</strong><p>Операционная и валовая маржа, маржинальный доход, вклад в покрытие, переменные и постоянные расходы.</p></article>
          <article class="card intro-sources"><span>Основание аналогии</span><a href="https://www.nobelprize.org/prizes/economic-sciences/2024/popular-information/" target="_blank" rel="noreferrer">Как институты влияют на процветание</a><a href="https://news.mit.edu/2012/why-nations-fail-0323" target="_blank" rel="noreferrer">Обзор идей книги об успехе государств</a></article>
        </aside>
      </section>`;
  }

  function routeTemplate() {
    return `<section class="page-head"><div><span class="eyebrow">Персональная траектория</span><h1 class="display">От дизайна — к решению.</h1><p>${profileRoute()}. Теорию можно сократить после диагностики, но практические проекты остаются обязательными.</p></div></section>
      <section class="route-summary"><article class="route-banner card"><span class="eyebrow">Ваша цель</span><h2>${profileRoute()}</h2><p>Сначала язык денег и данных, затем рынок, стратегия и управление. Темп: ${esc(state.profile.hours)} часов в неделю.</p></article><article class="route-total card"><div>${progressRing(Math.round(weeklyProgress()/12))}</div><div><strong>12</strong><p class="muted" style="font-size:11px">недель в первой версии<br>до первого проекта</p></div></article></section>
      <article class="intro-route-card card ${state.introCompleted ? "done" : ""}"><div class="module-num">00</div><div><span class="eyebrow">Обязательное введение · 12 минут</span><h2>Зачем нужна программа подготовки руководителей (MBA)</h2><p>Сначала соберите общую картину курса: бизнес, управление, ценность, институты и роль руководителя. Затем переходите к языку денег.</p></div><div class="intro-route-action"><span>${state.introCompleted ? `${icon("check")} Завершено` : "Начните здесь"}</span><button class="btn ${state.introCompleted ? "secondary" : "coral"}" data-action="open-intro">${state.introCompleted ? "Повторить" : "Открыть главу"}</button></div></article>
      <section class="module-list">${D.modules.map((m, index) => moduleTemplate(m,index)).join("")}</section>`;
  }

  function moduleTemplate(module, index) {
    const open = index === 0;
    const lockedModule = index > 0 && !hasAccess();
    const meta = module.comingSoon ? "Скоро" : lockedModule ? "Нужен доступ" : index === 0 ? `${weeklyProgress()}% пройдено` : "4 недели";
    return `<article class="module-card card ${module.color}">
      <div class="module-head" data-action="toggle-module"><div class="module-num">${module.number}</div><div><h3>${module.title}</h3><p>${module.subtitle}</p></div><div class="module-meta"><strong>${meta}</strong>${module.comingSoon ? "Релиз 2" : "Практический модуль"}</div></div>
      ${open ? `<div class="week-list">${module.weeks.map((w,i) => weekTemplate(w,i)).join("")}</div>` : ""}
    </article>`;
  }

  function weekTemplate(week,index) {
    const locked = index > 0 && !hasAccess();
    const done = index === 0 && state.lessonCompleted;
    return `<div class="week-row ${index === 0 ? "active" : ""} ${locked ? "locked" : ""}"><div class="week-dot">${done ? icon("check") : week.number}</div><div><strong>${week.title}</strong><span style="display:block;margin-top:4px">${week.type} · ${week.duration}</span></div>${locked ? `<span class="lock-label">${icon("lock")} закрыто</span>` : `<span>${done ? "Завершено" : index === 0 ? "Текущая" : "Доступно"}</span>`}<button class="btn small ${index === 0 ? "coral" : "secondary"}" data-action="${locked ? "show-code" : index === 0 ? "open-lesson" : "locked-preview"}">${locked ? "Открыть" : index === 0 ? "Перейти" : "Смотреть"}</button></div>`;
  }

  function projectValues() {
    const p = state.project;
    const price = Number(p.price) || 0;
    const projects = Number(p.projects) || 0;
    const durationWeeks = Math.max(0.1, Number(p.durationWeeks) || 0.1);
    const hours = Number(p.hours) || 0;
    const hourlyCost = Number(p.hourlyCost) || 0;
    const fixed = Number(p.fixed) || 0;
    const teamCostPerProject = hours * hourlyCost;
    const directCostPerProject = Number(p.variable) + teamCostPerProject;
    const contribution = price - directCostPerProject;
    const revenue = price * projects;
    const totalVariable = directCostPerProject * projects;
    const profit = revenue - totalVariable - fixed;
    const margin = revenue ? (profit / revenue) * 100 : 0;
    const breakEven = contribution > 0 ? Math.ceil(fixed / contribution) : 0;
    const fixedPerProject = projects > 0 ? fixed / projects : 0;
    const profitPerProject = contribution - fixedPerProject;
    const activeProjects = projects * durationWeeks / 4.33;
    const monthlyHours = hours * projects;
    const revenuePerHour = hours > 0 ? price / hours : 0;
    const singleSlotMonthlyRevenue = price * 4.33 / durationWeeks;
    const delayedSlotMonthlyRevenue = price * 4.33 / (durationWeeks + 1);
    const delayImpact = singleSlotMonthlyRevenue ? (1 - delayedSlotMonthlyRevenue / singleSlotMonthlyRevenue) * 100 : 0;
    return { revenue, totalVariable, contribution, profit, margin, breakEven, teamCostPerProject, directCostPerProject, fixedPerProject, profitPerProject, activeProjects, monthlyHours, revenuePerHour, singleSlotMonthlyRevenue, delayedSlotMonthlyRevenue, delayImpact };
  }

  function money(value) { return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value || 0) + " AED"; }

  function projectTemplate() {
    const v = projectValues();
    const unlocked = hasAccess();
    return `<section class="page-head"><div><span class="eyebrow">Квартальный проект</span><h1 class="display">Экономика дизайн-студии</h1><p>Соберите модель на собственных или учебных данных. Все допущения должны быть объяснимы.</p></div><span class="status-chip"><i class="pulse"></i>${state.projectSaved ? "Черновик сохранён" : "Автосохранение"}</span></section>
      <section class="grid project-grid">
        <div class="grid">
          <article class="project-intro card"><span class="eyebrow">Модуль 1 из 3</span><h2>${esc(state.project.name || "Мой проект")}</h2><p>Исходные данные → экономика → отчёты → сценарии → рекомендация</p><div class="stepper"><i class="done"></i><i class="${state.projectSaved ? "done" : ""}"></i><i></i><i></i><i></i></div></article>
          <article class="form-card card ${!unlocked ? "locked" : ""}">
            <div class="card-title-row"><h2>Исходные данные</h2><span class="caption">Модель за месяц · AED</span></div>
            ${!unlocked ? `<div class="review-note">${icon("lock")} Гостевой доступ включает один урок. Активируйте код, чтобы начать квартальный проект.</div><div style="margin-top:16px"><button class="btn coral" data-action="show-code">Ввести код доступа</button></div>` : `
            <div class="cost-guide"><div><span>Меняются с проектом</span><strong>Прямые затраты</strong><p>Подрядчики, материалы, платные исследования, поездки и другие расходы, которых не было бы без проекта.</p></div><div><span>Стоимость производства</span><strong>Время команды</strong><p>Часы специалистов × внутренняя стоимость часа. Это показывает реальную себестоимость работы, а не цену часа клиенту.</p></div><div><span>Существуют каждый месяц</span><strong>Постоянные расходы</strong><p>Аренда, административные оклады, бухгалтерия, страховка, базовые подписки и инфраструктура — даже если продаж нет.</p></div></div>
            <div class="double-count-warning">${icon("shield")} <div><strong>Не считайте одну затрату дважды.</strong><span>Если зарплата проектной команды уже переведена в стоимость её часов, не включайте ту же зарплату в постоянные расходы. В постоянных оставьте администрацию и общую инфраструктуру.</span></div></div>
            <div class="form-section"><div class="field-grid">
              <div class="field full"><label for="project-name">Название проекта</label><input id="project-name" data-project="name" value="${esc(state.project.name)}"><small>Помогает сохранить отдельную версию расчёта и допущений.</small></div>
              <div class="field"><label for="price">Цена одного проекта</label><div class="input-wrap"><input id="price" type="number" min="0" data-project="price" value="${esc(state.project.price)}"><span>AED</span></div><small>Сумма без НДС и возмещаемых расходов клиента.</small></div>
              <div class="field"><label for="projects">Завершённых проектов в месяц</label><div class="input-wrap"><input id="projects" type="number" min="0" step="0.1" data-project="projects" value="${esc(state.project.projects)}"><span>шт.</span></div><small>Фактическая или реалистичная пропускная способность студии.</small></div>
              <div class="field"><label for="duration-weeks">Длительность одного проекта</label><div class="input-wrap"><input id="duration-weeks" type="number" min="0.1" step="0.5" data-project="durationWeeks" value="${esc(state.project.durationWeeks)}"><span>нед.</span></div><small>Влияет на число одновременных проектов, скорость оборота и риск задержки оплаты.</small></div>
              <div class="field"><label for="variable">Внешние прямые затраты / проект</label><div class="input-wrap"><input id="variable" type="number" min="0" data-project="variable" value="${esc(state.project.variable)}"><span>AED</span></div><small>Подрядчики, материалы и закупки; без стоимости штатной команды.</small></div>
              <div class="field"><label for="hours">Часы команды / проект</label><div class="input-wrap"><input id="hours" type="number" min="0" data-project="hours" value="${esc(state.project.hours)}"><span>ч</span></div><small>Сумма часов всех участников от брифа до сдачи.</small></div>
              <div class="field"><label for="hourly-cost">Внутренняя стоимость часа</label><div class="input-wrap"><input id="hourly-cost" type="number" min="0" data-project="hourlyCost" value="${esc(state.project.hourlyCost)}"><span>AED</span></div><small>Зарплата и обязательные начисления ÷ продуктивные часы; не клиентская ставка.</small></div>
              <div class="field full"><label for="fixed">Постоянные расходы студии / месяц</label><div class="input-wrap"><input id="fixed" type="number" min="0" data-project="fixed" value="${esc(state.project.fixed)}"><span>AED</span></div><small>Например: аренда 18 000 + администрация 28 000 + сервисы 6 000 + бухгалтерия, страховка и базовый маркетинг 10 000 = 62 000 AED.</small></div>
            </div></div>
            <div class="form-section"><h3>Результат модели</h3><div class="result-grid"><div class="result-box"><span>Выручка / месяц</span><strong data-result="revenue">${money(v.revenue)}</strong></div><div class="result-box ${v.profit >= 0 ? "positive" : "warning"}">${metricLabel("Операционная прибыль / месяц", "Результат основной деятельности за месяц: выручка минус переменные и постоянные операционные расходы.")}<strong data-result="profit">${money(v.profit)}</strong></div><div class="result-box">${metricLabel("Операционная маржа", "Доля выручки, оставшаяся после всех операционных расходов. Формула: операционная прибыль ÷ выручка × 100%.")}<strong data-result="margin">${v.margin.toFixed(1)}%</strong></div><div class="result-box">${metricLabel("Вклад в покрытие / проект", "Цена проекта минус его переменные расходы. Сначала этот вклад покрывает постоянные расходы, затем формирует прибыль.")}<strong data-result="contribution">${money(v.contribution)}</strong></div><div class="result-box"><span>Постоянные / проект</span><strong data-result="fixedPerProject">${money(v.fixedPerProject)}</strong></div><div class="result-box">${metricLabel("Точка безубыточности", "Минимальное число проектов в месяц, при котором суммарный вклад в покрытие равен постоянным расходам.")}<strong data-result="breakEven">${v.breakEven} проекта / мес.</strong></div><div class="result-box">${metricLabel("Производственная себестоимость / проект", "Внешние прямые расходы плюс стоимость рабочего времени проектной команды. Административные постоянные расходы здесь не включены.")}<strong data-result="directCost">${money(v.directCostPerProject)}</strong></div><div class="result-box"><span>Выручка / час</span><strong data-result="revenuePerHour">${money(v.revenuePerHour)}</strong></div><div class="result-box"><span>Прибыль / проект</span><strong data-result="profitPerProject">${money(v.profitPerProject)}</strong></div></div><div class="formula-note">Операционная прибыль = цена × проекты − (внешние прямые затраты + часы × стоимость часа) × проекты − постоянные расходы месяца.</div></div>
            <div class="form-section"><div class="duration-head"><div><span class="eyebrow">Влияние длительности</span><h3>Срок меняет пропускную способность</h3></div><span class="duration-chip" data-result="durationLabel">${esc(state.project.durationWeeks)} недели</span></div><p class="section-lead">Сам по себе лишний день не создаёт расход. Экономика ухудшается, когда растут часы команды, дольше занята производственная ячейка или позже приходит оплата.</p><div class="duration-grid"><div><span>Нужно вести одновременно</span><strong data-result="activeProjects">${v.activeProjects.toFixed(1)} проекта</strong><p>${esc(state.project.projects)} завершения в месяц × ${esc(state.project.durationWeeks)} недели ÷ 4,33.</p></div><div><span>Выручка одного рабочего слота</span><strong data-result="slotRevenue">${money(v.singleSlotMonthlyRevenue)} / мес.</strong><p>Если одна команда ведёт только один проект одновременно.</p></div><div class="impact"><span>Если срок вырастет на неделю</span><strong data-result="delayImpact">−${v.delayImpact.toFixed(1)}% мощности</strong><p data-result="delayText">Один слот принесёт около ${money(v.delayedSlotMonthlyRevenue)} в месяц вместо ${money(v.singleSlotMonthlyRevenue)}.</p></div></div><details class="project-explainer"><summary>Почему длительность не вычитается из прибыли напрямую?</summary><p>Срок — не денежная статья. В этой модели он действует через часы команды, число проектов, которые можно завершить за месяц, и график оплаты. Если проект длится дольше, но не требует дополнительных часов, идёт параллельно с другими и оплачен авансом, его прибыль может не измениться. Поэтому меняйте именно те входные данные, которые действительно изменились.</p></details></div>
            <div class="form-section"><h3>Допущения и источники</h3><div class="field"><label for="assumptions">Что подтверждено, а что является гипотезой?</label><textarea id="assumptions" data-project="assumptions">${esc(state.project.assumptions)}</textarea></div><label class="attachment" for="attachment">${icon("upload")}<br><strong>${state.project.attachment ? esc(state.project.attachment) : "Добавить расчёт или источник"}</strong><br>PDF, DOCX, XLSX, CSV, PNG, JPG, MP4 · до 15 МБ<input id="attachment" type="file" hidden data-action="attachment" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.mp4"></label></div>
            <div style="display:flex;justify-content:flex-end;gap:9px;margin-top:20px"><button class="btn secondary" data-action="save-project">Сохранить черновик</button><button class="btn coral" data-action="submit-project" ${!state.projectSaved ? "disabled" : ""}>Отправить на проверку</button></div>`}
          </article>
        </div>
        <aside class="grid"><article class="rubric-card card"><div class="card-title-row"><h3>Рубрика</h3><strong>100</strong></div><div class="rubric-list">${D.project.rubric.map(([name,weight]) => `<div class="rubric-item"><span>${name}</span><strong>${weight}</strong><i></i></div>`).join("")}</div><div class="review-note"><strong>${icon("spark")} Двойная проверка</strong><br>ИИ проверит логику сразу. Рецензент Ateira подтверждает результат для подписчиков.</div></article>
        <article class="card card-pad"><div class="card-title-row"><h3>Статус</h3><span class="caption">${state.projectSubmitted ? "На проверке" : "Черновик"}</span></div><p style="font-size:11px;line-height:1.55;color:var(--muted)">${state.projectSubmitted ? "Предварительная проверка с помощью ИИ создана. Экспертная проверка доступна на подписке." : "Сохраните расчёт и объясните ключевые допущения перед отправкой."}</p></article></aside>
      </section>`;
  }

  function portfolioTemplate() {
    return `<section class="page-head"><div><span class="eyebrow">Доказательства навыков</span><h1 class="display">Портфолио решений.</h1><p>Здесь важен не красивый экран, а понятная задача, логика и измеримый результат.</p></div></section>
      <section class="grid portfolio-grid">
        <article class="portfolio-card card"><div class="portfolio-cover"><span class="tag">Финансы · проект 01</span><h3>${esc(state.project.name || "Экономика дизайн-студии")}</h3></div><div class="portfolio-body"><p>${state.projectSaved ? `Модель выручки, прямых и постоянных затрат. Расчёт точки безубыточности: ${projectValues().breakEven} проекта в месяц.` : "Карточка заполнится после сохранения первого расчёта."}</p><div class="portfolio-actions"><span class="visibility">${icon(state.portfolioPublic ? "eye" : "lock")} ${state.portfolioPublic ? "Публичная ссылка" : "Только вы"}</span><button class="btn small ${state.projectSaved ? "secondary" : "ghost"}" data-action="toggle-public" ${!state.projectSaved ? "disabled" : ""}>${state.portfolioPublic ? "Скрыть" : "Опубликовать"}</button></div></div></article>
        <article class="empty-card card"><div><div class="big-plus">+</div><h3 style="font-family:Georgia,serif;font-weight:500;font-size:23px">Следующий артефакт</h3><p class="muted" style="font-size:11px;max-width:260px">Упрощённый отчёт о прибылях и убытках (P&amp;L), баланс и денежный поток появятся после второго модуля.</p><button class="btn secondary small" data-view="route">Посмотреть маршрут</button></div></article>
      </section>`;
  }

  function profileTemplate() {
    const avatarChoices = [
      ["initial", "Буква имени", "user"],
      ["spark", "Идея", "spark"],
      ["route", "Маршрут", "route"],
      ["chart", "Рост", "chart"],
      ["shield", "Надёжность", "shield"]
    ];
    return `<section class="page-head"><div><span class="eyebrow">Профиль и настройки</span><h1 class="display">Ваш путь в MiniMBA.</h1><p>Цели и доступный темп можно менять. Маршрут пересчитается, но результаты останутся.</p></div></section>
      <section class="grid profile-grid">
        <aside class="grid"><article class="profile-card card">${avatarTemplate("profile-avatar-large")}<h2>${esc(state.profile.name)}</h2><p>${state.profile.nameCustomized ? "Персональный профиль" : "Гостевой профиль"}</p><div class="profile-meta"><div><strong>${profileRoute().split(" → ")[0]}</strong><span>траектория</span></div><div><strong>${esc(state.profile.hours)}</strong><span>часов / неделю</span></div><div><strong>${state.lessonCompleted ? 1 : 0}</strong><span>уроков</span></div><div><strong>${state.projectSaved ? 1 : 0}</strong><span>артефактов</span></div></div></article><article class="card card-pad"><div class="card-title-row"><h3>Компетенции</h3><span class="caption">стартовая оценка</span></div><div class="competency-row">${skillsTemplate()}</div></article></aside>
        <div class="grid"><article class="profile-editor card"><div class="card-title-row"><div><span class="eyebrow">Личные данные</span><h2>Имя и аватар</h2></div><span class="caption">Сохраняются в этом браузере</span></div><form id="profile-form" class="profile-form"><div class="field"><label for="profile-name">Как к вам обращаться</label><input id="profile-name" maxlength="40" value="${esc(state.profile.name)}" placeholder="Гость" autocomplete="name"><small>Имя появится на главном экране и в боковом меню.</small></div><fieldset class="avatar-editor"><legend>Выберите аватар</legend><div class="avatar-options">${avatarChoices.map(([value,label,iconName]) => `<button type="button" class="avatar-choice ${!state.profile.avatarImage && state.profile.avatar === value ? "selected" : ""}" data-avatar-choice="${value}" aria-pressed="${!state.profile.avatarImage && state.profile.avatar === value}" aria-label="${label}"><span class="avatar avatar-${value}">${value === "initial" ? esc(state.profile.name.trim().slice(0,1).toUpperCase() || "Г") : icon(iconName)}</span><small>${label}</small></button>`).join("")}</div><div class="avatar-upload-row"><label class="btn secondary small" for="avatar-upload">${icon("upload")} Загрузить фотографию<input id="avatar-upload" type="file" hidden accept="image/png,image/jpeg,image/webp"></label>${state.profile.avatarImage ? `<button type="button" class="btn ghost small" data-action="reset-avatar">Удалить фотографию</button>` : ""}<span>PNG, JPG или WEBP · до 1 МБ</span></div></fieldset><div class="profile-save-row"><span>Пустое имя будет сохранено как «Гость».</span><button class="btn coral" type="submit">Сохранить профиль</button></div></form></article><article class="access-card card"><div><h3>${hasAccess() ? "Полный доступ активирован" : "Гостевой доступ"}</h3><p>${hasAccess() ? "Код бесплатного доступа · без срока в демонстрационной версии" : "Один урок после знакомства с программой. Оплата в первой версии не подключена."}</p></div>${!hasAccess() ? `<button class="btn coral" data-action="show-code">Ввести код</button>` : `<span class="status-chip"><i class="pulse"></i> Активно</span>`}</article>
        <article class="settings-card card"><div class="card-title-row"><h2>Настройки</h2></div>
          <div class="settings-row"><div><strong>Учебные напоминания</strong><p>По персональному расписанию, не более одного в день</p></div><button class="toggle ${state.settings.reminders ? "on" : ""}" data-setting="reminders" aria-label="Учебные напоминания"></button></div>
          <div class="settings-row"><div><strong>Передача контекста ИИ</strong><p>Только текущий материал и выбранный фрагмент проекта</p></div><button class="toggle ${state.settings.aiData ? "on" : ""}" data-setting="aiData" aria-label="Передача контекста ИИ"></button></div>
          <div class="settings-row"><div><strong>Новости Ateira</strong><p>Отдельное необязательное маркетинговое согласие</p></div><button class="toggle ${state.settings.marketing ? "on" : ""}" data-setting="marketing" aria-label="Маркетинговые сообщения"></button></div>
          <div class="settings-row"><div><strong>Выгрузить мои данные</strong><p>Профиль, прогресс, ответы и проект в файле данных формата JSON</p></div><button class="btn secondary small" data-action="export-data">${icon("download")} Скачать</button></div>
          <div class="settings-row"><div><strong>Удалить профиль</strong><p>Демо-данные будут безвозвратно удалены из этого браузера</p></div><button class="btn ghost small" data-action="confirm-delete">${icon("trash")} Удалить</button></div>
        </article></div>
      </section>`;
  }

  function lessonPrimerTemplate() {
    const financeTerms = [
      {
        title: "Маржинальный доход",
        unit: "сумма за период",
        formula: "Выручка − переменные расходы",
        text: "Показывает, сколько денег осталось после расходов, которые меняются вместе с объёмом продаж. Эта сумма покрывает постоянные расходы, а затем создаёт прибыль."
      },
      {
        title: "Вклад в покрытие",
        unit: "сумма на единицу",
        formula: "Цена единицы − переменные расходы на единицу",
        text: "Показывает, сколько одна продажа, заказ или проект добавляет для покрытия постоянных расходов и формирования прибыли."
      },
      {
        title: "Валовая маржа",
        unit: "доля выручки, %",
        formula: "Валовая прибыль ÷ выручка × 100%",
        text: "Показывает долю выручки после вычета себестоимости проданного продукта или услуги, но до административных и коммерческих расходов."
      },
      {
        title: "Операционная маржа",
        unit: "доля выручки, %",
        formula: "Операционная прибыль ÷ выручка × 100%",
        text: "Показывает долю выручки, оставшуюся после переменных и постоянных операционных расходов. В модели этого курса показатель «маржа» означает именно операционную маржу."
      }
    ];
    const strategyTerms = [
      ["Сегмент", "Группа клиентов с похожими потребностями, ситуацией покупки и критериями выбора."],
      ["Право на победу", "Обоснованная причина, почему компания способна выигрывать в выбранном сегменте: доступ, опыт, данные, процесс или экономика, которые трудно повторить."],
      ["Допущение", "Значение или утверждение, которое временно принимают для расчёта, пока оно не подтверждено данными."],
      ["Защитная метрика", "Показатель, который не должен ухудшиться во время эксперимента, даже если основная метрика растёт."],
      ["Порог решения", "Заранее согласованное значение, после которого эксперимент масштабируют, изменяют или останавливают."],
      ["Обучение и развитие сотрудников (L&D)", "Функция внутри компании, которая отвечает за обучение, развитие навыков и корпоративные образовательные программы."],
      ["Продажи компаниям (B2B)", "Модель, в которой клиентом и покупателем выступает другая организация, а не частное лицо."]
    ];

    return `<article class="learning-primer card" id="glossary">
      <div class="primer-head"><div><span class="eyebrow">Шаг 2 · Перед просмотром · 7 минут</span><h2>Сначала договоримся о терминах</h2><p>Эти понятия звучат похоже, но отвечают на разные вопросы. Смотрите прежде всего на единицу измерения: деньги за период, деньги на одну продажу или процент от выручки.</p></div><span class="primer-badge">Словарь перед видео</span></div>
      <section class="primer-section"><div class="primer-section-head"><span>01</span><div><h3>Четыре показателя, которые нельзя смешивать</h3><p>Маржинальный доход и вклад измеряются деньгами, валовая и операционная маржа — процентами.</p></div></div><div class="finance-term-grid">${financeTerms.map(term => `<div class="finance-term-card"><div><strong>${term.title}</strong><span>${term.unit}</span></div><code>${term.formula}</code><p>${term.text}</p></div>`).join("")}</div></section>
      <section class="primer-section cost-primer"><div class="primer-section-head"><span>02</span><div><h3>Переменные и постоянные расходы — на одном примере</h3><p>Представим кофейню, которая продаёт чашку кофе за 300 ₽.</p></div></div><div class="unit-economics"><div class="unit-equation"><div><small>Цена чашки</small><strong>300 ₽</strong></div><b>−</b><div><small>Переменные расходы</small><strong>120 ₽</strong></div><b>=</b><div class="unit-result"><small>Вклад в покрытие</small><strong>180 ₽</strong></div></div><div class="cost-definition-grid"><div><span>Меняются с количеством продаж</span><strong>Переменные расходы</strong><p>Возникают из-за каждой дополнительной единицы. Для одной чашки: кофе 65 ₽ + молоко 35 ₽ + стакан и крышка 20 ₽ = 120 ₽.</p></div><div><span>Не меняются сразу при изменении объёма</span><strong>Постоянные расходы</strong><p>Существуют за период даже без продаж. За месяц: аренда 100 000 ₽ + администратор 60 000 ₽ + базовые сервисы 20 000 ₽ = 180 000 ₽.</p></div></div><div class="break-even-example"><strong>Точка безубыточности: 1 000 чашек в месяц</strong><span>180 000 ₽ постоянных расходов ÷ 180 ₽ вклада с одной чашки. После тысячной чашки следующий вклад начинает формировать операционную прибыль.</span></div></div></section>
      <section class="primer-section"><div class="primer-section-head"><span>03</span><div><h3>Словарь стратегического выбора</h3><p>Используйте эти определения при разборе второго вводного урока.</p></div></div><dl class="strategy-glossary">${strategyTerms.map(([term,definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl><div class="assumption-note"><strong>Допущение и гипотеза — не одно и то же.</strong><span>Допущение становится гипотезой, когда вы формулируете ожидаемую причинно-следственную связь и способ её проверить.</span></div></section>
    </article>`;
  }

  function metricLabel(label, explanation) {
    return `<span class="metric-label">${label}<button type="button" class="term-hint" data-tip="${esc(explanation)}" aria-label="${esc(`${label}. ${explanation}`)}">?</button></span>`;
  }

  function lessonTemplate() {
    const w = D.modules[0].weeks[0];
    const lessonVideos = D.videos || [];
    const activeVideo = lessonVideos.find(video => video.id === state.activeVideoId) || lessonVideos[0];
    const chapters = [
      ["Задача", "Научитесь видеть за крупной суммой реальный результат проекта."],
      ["Выручка", "Зафиксируйте, что именно продано и за какой период."],
      ["Затраты", "Соберите прямые и распределённые расходы без двойного счёта."],
      ["Прибыль", "Посчитайте остаток и маржу, затем проверьте допущения."],
      ["Деньги", "Отделите экономический результат от дат поступлений и выплат."],
      ["Решение", "Превратите расчёт в конкретное управленческое действие."]
    ];
    const chapter = Math.min(state.lessonChapter, chapters.length - 1);
    const materialProgress = state.videoDone ? 100 : Math.round(((chapter + 1) / chapters.length) * 100);
    return `<button class="back-link" data-view="today">${icon("back")} Вернуться на сегодня</button>
      <section class="page-head" style="margin-top:18px"><div><span class="eyebrow">Неделя 1 · урок 1</span><h1 class="display">${w.title}</h1><p>${w.description}</p></div><span class="status-chip">${icon("clock")} 32 минуты</span></section>
      <section class="lesson-layout"><div class="lesson-content">
        ${lessonPrimerTemplate()}
        ${activeVideo ? `<article class="video-library card" id="videos">
          <div class="video-library-head"><div><span class="eyebrow">Видеоматериалы первых уроков</span><h2>Смотрите в удобном темпе</h2><p>Выберите тему в плейлисте. Плеер запомнит позицию, поддерживает перемотку, полноэкранный режим и регулировку скорости.</p></div><span class="video-count">${lessonVideos.length} видео</span></div>
          <div class="video-library-layout">
            <div class="video-stage-wrap">
              <video id="lesson-video" class="lesson-video" controls preload="metadata" playsinline src="${esc(activeVideo.src)}" data-current-video="${esc(activeVideo.id)}" aria-label="${esc(activeVideo.title)}">
                Ваш браузер не поддерживает встроенное видео. <a href="${esc(activeVideo.src)}">Открыть файл</a>.
              </video>
              <div class="video-caption"><span>${esc(activeVideo.lesson)}</span><strong>${esc(activeVideo.title)}</strong><p>${esc(activeVideo.description)}</p></div>
            </div>
            <div class="video-playlist" role="list" aria-label="Видеоматериалы уроков">${lessonVideos.map((video,index) => `<button type="button" role="listitem" class="video-playlist-item ${video.id === activeVideo.id ? "active" : ""}" data-video-id="${esc(video.id)}" aria-pressed="${video.id === activeVideo.id}"><span class="video-play-icon">${video.id === activeVideo.id ? icon("play") : String(index + 1).padStart(2,"0")}</span><span><small>${esc(video.lesson)}</small><strong>${esc(video.title)}</strong><span>${esc(video.description)}</span></span></button>`).join("")}</div>
          </div>
        </article>` : ""}
        <article class="lesson-briefing card" id="briefing">
          <div class="briefing-head"><div><span class="eyebrow">Интерактивный разбор · 8 минут</span><h2>Куда исчезает прибыль?</h2></div><span class="completion-badge ${state.videoDone ? "done" : ""}">${state.videoDone ? icon("check") + " Изучено" : `${chapter + 1} / ${chapters.length}`}</span></div>
          <div class="chapter-progress" aria-label="Пройдено ${materialProgress}%"><i style="width:${materialProgress}%"></i></div>
          <div class="chapter-tabs" role="tablist">${chapters.map((item,index) => `<button role="tab" aria-selected="${index === chapter}" class="chapter-tab ${index === chapter ? "active" : ""} ${index < chapter || state.videoDone ? "visited" : ""}" data-chapter="${index}"><span>${index + 1}</span>${item[0]}</button>`).join("")}</div>
          <div class="chapter-stage" role="tabpanel"><div class="chapter-copy"><span class="chapter-kicker">Экран ${chapter + 1} · ${chapters[chapter][0]}</span><h3>${chapters[chapter][1]}</h3>${lessonChapterVisual(chapter)}</div></div>
          <div class="chapter-actions"><button class="btn secondary" data-action="lesson-prev" ${chapter === 0 ? "disabled" : ""}>${icon("back")} Назад</button><span>Можно вернуться к любому экрану</span><button class="btn coral" data-action="${chapter === chapters.length - 1 ? "finish-material" : "lesson-next"}">${chapter === chapters.length - 1 ? (state.videoDone ? "Разбор завершён" : "Завершить разбор") : "Далее"} ${icon(chapter === chapters.length - 1 ? "check" : "arrow")}</button></div>
        </article>
        <article class="content-block card" id="concept"><span class="eyebrow">Опорная модель</span><h2>Три показателя — три разных вопроса</h2><div class="concept-grid"><div><span>01 · Объём</span><strong>Выручка</strong><p>Сколько студия заработала продажами за выбранный период?</p></div><div><span>02 · Результат</span><strong>Прибыль</strong><p>Что осталось после всех относящихся к периоду расходов?</p></div><div>${metricLabel("03 · Ликвидность", "Способность компании вовремя оплачивать обязательства доступными деньгами.")}<strong>Денежный поток</strong><p>Когда деньги фактически пришли на счёт или ушли с него?</p></div></div><div class="equation">Прибыль = выручка − прямые затраты − доля общих расходов</div><div class="callout"><div class="route-icon compact">${icon("spark")}</div><div><strong>Правило сопоставимости</strong><p>Одна валюта, один период и одинаковая граница расчёта. Иначе красивый итог не отвечает ни на один управленческий вопрос.</p></div></div><h3>Кейс: редизайн сервиса за 35 000 AED</h3><div class="case-ledger"><div><span>Выручка</span><strong>35 000</strong><small>согласованная цена проекта</small></div><div class="cost"><span>Фрилансер</span><strong>−8 000</strong><small>прямые затраты</small></div><div class="cost"><span>Время команды</span><strong>−11 000</strong><small>внутренняя себестоимость</small></div><div class="cost"><span>Офис и сервисы</span><strong>−4 000</strong><small>доля общих расходов</small></div><div class="profit"><span>Прибыль</span><strong>12 000</strong><small>операционная маржа 34,3%</small></div></div>
          <details class="lesson-details"><summary>Почему время команды — это затраты?</summary><p>Даже если зарплата уже выплачена, часы команды имеют стоимость: они не могут одновременно работать над другим проектом. Для управленческого расчёта используйте обоснованную часовую ставку и не включайте одну зарплату второй раз в общие расходы.</p></details>
          <details class="lesson-details"><summary>Может ли прибыль быть положительной, а денег не хватать?</summary><p>Да. Если 23 000 AED расходов оплачены сейчас, а клиент перечислит 35 000 AED через 60 дней, проект прибыльный по модели, но до оплаты создаёт кассовый разрыв. Нужны аванс, этапные платежи или резерв.</p></details>
        </article>
        <article class="content-block card" id="quiz"><span class="eyebrow">Проверка понимания · 3 вопроса</span><h2>Не угадайте — объясните решение</h2><p>Ответ можно изменить. После каждого выбора вы получите объяснение, а не только отметку.</p><div class="knowledge-check">
          ${quizQuestion("result", "Студия получила 100 000 AED выручки и отнесла к периоду 72 000 AED расходов. Что известно точно?", [["a","На счёте прибавилось 28 000 AED"],["b","Прибыль до прочих корректировок — 28 000 AED"],["c","Владелец может вывести 100 000 AED"]], "b", "100 000 − 72 000 = 28 000 AED прибыли. Дат платежей недостаточно, чтобы определить денежный поток.")}
          ${quizQuestion("timing", "Проект даёт 12 000 AED прибыли, но клиент платит через 60 дней. Какое решение снижает риск?", [["a","Считать всю выручку свободными деньгами"],["b","Не учитывать сроки, ведь проект прибыльный"],["c","Запросить аванс или разбить оплату по этапам"]], "c", "Аванс или этапные платежи сближают даты расходов и поступлений и уменьшают кассовый разрыв.")}
          ${quizQuestion("allocation", "Общие расходы студии — 12 000 AED в месяц, одновременно выполняются 4 сопоставимых проекта. Какую долю можно взять для первого приближения?", [["a","3 000 AED на проект"],["b","12 000 AED на каждый проект"],["c","0 AED, это не прямые затраты"]], "a", "12 000 ÷ 4 = 3 000 AED. Это упрощённое распределение; позже его можно уточнить по часам или загрузке.")}
        </div><div class="quiz-summary ${state.quizPassed ? "passed" : ""}">${state.quizPassed ? `${icon("check")} <strong>Проверка пройдена.</strong> Вы различаете результат и движение денег.` : `<strong>${Object.keys(state.quizAnswers).length} из 3 отвечено.</strong> Для завершения нужны три верных ответа.`}</div></article>
        <article class="content-block card" id="apply"><span class="eyebrow">Перенос в работу</span><h2>Пять вопросов перед решением</h2><ol class="decision-checklist"><li><strong>Период:</strong> за какую неделю, месяц или проект считаем?</li><li><strong>Выручка:</strong> что продано и какая сумма относится к этому периоду?</li><li><strong>Затраты:</strong> какие прямые расходы и какая доля общих расходов относятся к работе?</li><li><strong>Деньги:</strong> в какие даты придут платежи и когда нужно платить команде и подрядчикам?</li><li><strong>Действие:</strong> изменить цену, объём работ, способ производства или график оплаты?</li></ol><div class="apply-actions"><button class="btn secondary" data-action="download-notes">${icon("download")} Скачать конспект</button><button class="btn coral" data-action="complete-lesson" ${!state.videoDone || !state.quizPassed ? "disabled" : ""}>${state.lessonCompleted ? "Урок завершён" : "Завершить и открыть проект"} ${icon("arrow")}</button></div>${!state.videoDone || !state.quizPassed ? `<p class="caption">Завершите интерактивный разбор и дайте три верных ответа.</p>` : ""}</article>
        <article class="content-block card" id="materials"><span class="eyebrow">Учебные материалы</span><h2>Шаблоны для продолжения работы</h2><p>Скачайте рабочую тетрадь и презентации первых уроков. Материалы дополняют интерактивный урок и подходят для самостоятельной работы или занятия с преподавателем.</p><div class="resource-grid">${D.resources.map(resource => `<a class="resource-card" href="${esc(resource.href)}" download><span class="resource-icon">${icon("download")}</span><span class="resource-copy"><small>${esc(resource.format)}</small><strong>${esc(resource.title)}</strong><span>${esc(resource.description)}</span></span><span class="resource-arrow">${icon("arrow")}</span></a>`).join("")}</div></article>
      </div><aside class="lesson-nav card"><h3>В этом уроке</h3><div class="lesson-outline"><button class="outline-item active" data-scroll="glossary"><span class="outline-dot">1</span>Понятия и пример</button><button class="outline-item" data-scroll="videos"><span class="outline-dot">${icon("play")}</span>Видеоматериалы</button><button class="outline-item ${state.videoDone ? "done" : ""}" data-scroll="briefing"><span class="outline-dot">${state.videoDone ? icon("check") : "3"}</span>Разбор · 8 минут</button><button class="outline-item" data-scroll="concept"><span class="outline-dot">4</span>Модель и кейс</button><button class="outline-item ${state.quizPassed ? "done" : ""}" data-scroll="quiz"><span class="outline-dot">${state.quizPassed ? icon("check") : "5"}</span>3 вопроса</button><button class="outline-item ${state.lessonCompleted ? "done" : ""}" data-scroll="apply"><span class="outline-dot">${state.lessonCompleted ? icon("check") : "6"}</span>Чек-лист</button><button class="outline-item" data-scroll="materials"><span class="outline-dot">7</span>Материалы</button></div><div class="lesson-gate"><strong>Результат урока</strong><br>Вы сможете проверить экономику проекта и увидеть риск кассового разрыва.</div><button class="btn secondary" style="width:100%;margin-top:12px" data-action="toggle-ai">${icon("spark")} Спросить наставника</button></aside></section>`;
  }

  function lessonChapterVisual(chapter) {
    if (chapter === 0) return `<div class="learning-goals"><div><strong>Различать</strong><span>выручку, прибыль и денежный поток</span></div><div><strong>Рассчитывать</strong><span>прибыль проекта и маржу</span></div><div><strong>Решать</strong><span>что изменить в цене, затратах или оплате</span></div></div><p class="chapter-note">Сквозной кейс: Studio North продаёт редизайн сервиса за 35 000 AED.</p>`;
    if (chapter === 1) return `<div class="metric-focus"><span>Цена проекта</span><strong>35 000 <small>AED</small></strong><p>Это выручка проекта, если работа относится к выбранному периоду. Это ещё не прибыль и не обязательно деньги на счёте.</p></div><div class="micro-rule"><strong>Сначала спросите:</strong> что продано, за какой период и не включён ли налог в сумму?</div>`;
    if (chapter === 2) return `<div class="cost-map"><div><span>Прямые</span><strong>8 000 + 11 000</strong><small>фрилансер и время команды</small></div><div><span>Общие</span><strong>4 000</strong><small>доля офиса и сервисов</small></div><div class="total"><span>Всего</span><strong>23 000 AED</strong><small>затраты проекта</small></div></div><div class="micro-rule"><strong>Проверка:</strong> каждая статья учтена один раз и относится именно к этому проекту.</div>`;
    if (chapter === 3) return `<div class="profit-bridge"><div><span>35 000</span><small>выручка</small></div><b>−</b><div><span>23 000</span><small>затраты</small></div><b>=</b><div class="result"><span>12 000</span><small>прибыль</small></div></div><div class="metric-pair"><div><span>Прибыль</span><strong>12 000 AED</strong></div><div><span>Операционная маржа</span><strong>34,3%</strong></div></div><p class="chapter-note">Операционная маржа = 12 000 ÷ 35 000 × 100%. Она показывает, какая доля выручки осталась после операционных расходов.</p>`;
    if (chapter === 4) return `<div class="cash-timeline"><div><span>Сегодня</span><strong>−23 000 AED</strong><small>команда, подрядчик, сервисы</small></div><i></i><div><span>Через 60 дней</span><strong>+35 000 AED</strong><small>оплата клиента</small></div></div><div class="risk-banner"><strong>Кассовый разрыв: 23 000 AED</strong><span>До оплаты прибыль существует в модели, но расходы нужно чем-то профинансировать.</span></div>`;
    return `<div class="decision-board"><div><span>Цена</span><strong>Не снижать вслепую</strong><small>Скидка уменьшит прибыль и запас прочности.</small></div><div><span>Границы работ</span><strong>Зафиксировать объём</strong><small>Дополнительные работы должны менять цену или сроки.</small></div><div><span>Оплата</span><strong>50% аванс</strong><small>17 500 AED сократят кассовый разрыв.</small></div></div><p class="chapter-note">Хороший расчёт заканчивается действием. Для этого кейса разумный первый шаг — согласовать аванс и этапную приёмку.</p>`;
  }

  function quizQuestion(id, prompt, options, correct, explanation) {
    const selected = state.quizAnswers[id];
    const isCorrect = selected === correct;
    return `<section class="quiz-question"><div class="question-head"><span>${Object.keys(state.quizAnswers).includes(id) ? (isCorrect ? icon("check") : icon("close")) : "?"}</span><h3>${prompt}</h3></div><div class="quiz-options">${options.map(([value,text]) => `<button class="quiz-option ${selected === value ? (isCorrect ? "correct" : "wrong") : ""}" data-quiz-question="${id}" data-quiz-answer="${value}"><span class="week-dot">${value.toUpperCase()}</span><span>${text}</span></button>`).join("")}</div>${selected ? `<div class="answer-feedback ${isCorrect ? "correct" : "wrong"}"><strong>${isCorrect ? "Верно" : "Пока нет"}</strong><p>${isCorrect ? explanation : "Проверьте, какой показатель можно вывести из данных, а для какого не хватает периода или дат платежей."}</p></div>` : ""}</section>`;
  }

  function aiDrawerTemplate() {
    return `<aside class="ai-drawer" aria-label="ИИ-наставник"><div class="ai-head"><div class="ai-person"><div class="ai-orb">${icon("spark")}</div><div><h3>Наставник Ateira</h3><span>Сначала ваша попытка</span></div></div><button class="close-btn" data-action="toggle-ai" aria-label="Закрыть">${icon("close")}</button></div><div class="ai-context">Контекст: неделя 1 · выручка, прибыль и экономика проекта</div><div class="ai-messages" id="ai-messages">${state.messages.map(m => `<div class="message ${m.role}">${esc(m.text)}</div>`).join("")}</div><div class="ai-suggestions"><button class="suggestion" data-suggestion="Проверь мою логику расчёта операционной маржи">Проверить маржу</button><button class="suggestion" data-suggestion="Объясни разницу между прибылью и денежным потоком">Прибыль и денежный поток</button></div><form class="ai-form" id="ai-form"><textarea id="ai-input" aria-label="Вопрос наставнику" placeholder="Покажите расчёт или задайте вопрос…"></textarea><button class="btn icon-only coral" aria-label="Отправить">${icon("send")}</button><span class="ai-disclaimer">ИИ может ошибаться. Итоговую оценку проекта он не выставляет.</span></form></aside>`;
  }

  function bindStaticEvents() {
    document.querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", handleAction));
    document.querySelectorAll("[data-view]").forEach(el => el.addEventListener("click", () => navigate(el.dataset.view)));
    document.querySelectorAll("[data-choice]").forEach(el => el.addEventListener("click", () => {
      state.profile[el.dataset.choice] = el.dataset.value; saveState(); render();
    }));
    document.querySelectorAll("[data-profile]").forEach(el => el.addEventListener("change", () => {
      state.profile[el.dataset.profile] = el.type === "checkbox" ? el.checked : el.value; saveState(); render();
    }));
    document.querySelectorAll("[data-avatar-choice]").forEach(el => el.addEventListener("click", () => {
      captureProfileName();
      state.profile.avatar = el.dataset.avatarChoice;
      state.profile.avatarImage = "";
      saveState(); render();
    }));
    document.querySelectorAll("[data-project]").forEach(el => el.addEventListener("input", () => {
      state.project[el.dataset.project] = el.type === "number" ? Number(el.value) : el.value; state.projectSaved = false; saveState();
      if (el.type === "number") renderProjectResultsLive();
    }));
    document.querySelectorAll("[data-setting]").forEach(el => el.addEventListener("click", () => {
      const key = el.dataset.setting; state.settings[key] = !state.settings[key]; saveState(); render(); showToast("Настройка сохранена");
    }));
    document.querySelectorAll("[data-chapter]").forEach(el => el.addEventListener("click", () => {
      state.lessonChapter = Number(el.dataset.chapter); saveState(); render();
    }));
    document.querySelectorAll("[data-intro-slide]").forEach(el => el.addEventListener("click", () => {
      state.introSlide = Number(el.dataset.introSlide); saveState(); render(); window.scrollTo(0,0);
    }));
    document.querySelectorAll("[data-scroll]").forEach(el => el.addEventListener("click", () => {
      document.getElementById(el.dataset.scroll)?.scrollIntoView({ behavior:"smooth", block:"start" });
    }));
    document.querySelectorAll("[data-video-id]").forEach(el => el.addEventListener("click", () => {
      if (el.dataset.videoId === state.activeVideoId) {
        document.getElementById("lesson-video")?.focus();
        return;
      }
      state.activeVideoId = el.dataset.videoId;
      saveState();
      render();
      requestAnimationFrame(() => {
        document.getElementById("videos")?.scrollIntoView({ behavior:"smooth", block:"start" });
        document.getElementById("lesson-video")?.focus();
      });
    }));
    bindLessonVideo();
    document.querySelectorAll("[data-quiz-question]").forEach(el => el.addEventListener("click", () => {
      state.quizAnswers[el.dataset.quizQuestion] = el.dataset.quizAnswer;
      state.quizPassed = state.quizAnswers.result === "b" && state.quizAnswers.timing === "c" && state.quizAnswers.allocation === "a";
      if (state.quizPassed && !state.completedTasks.includes("quiz")) state.completedTasks.push("quiz");
      saveState(); render();
      requestAnimationFrame(() => document.getElementById("quiz")?.scrollIntoView({ block:"start" }));
    }));
    document.querySelectorAll("[data-suggestion]").forEach(el => el.addEventListener("click", () => {
      const input = document.getElementById("ai-input"); if (input) { input.value = el.dataset.suggestion; input.focus(); }
    }));
    const aiForm = document.getElementById("ai-form");
    if (aiForm) aiForm.addEventListener("submit", sendAiMessage);
    const file = document.getElementById("attachment");
    if (file) file.addEventListener("change", handleAttachment);
    const profileForm = document.getElementById("profile-form");
    if (profileForm) profileForm.addEventListener("submit", saveProfile);
    const avatarUpload = document.getElementById("avatar-upload");
    if (avatarUpload) avatarUpload.addEventListener("change", handleAvatarUpload);
    requestAnimationFrame(() => document.getElementById("ai-messages")?.scrollTo({ top: 99999 }));
  }

  function bindLessonVideo() {
    const player = document.getElementById("lesson-video");
    if (!player) return;
    const videoId = player.dataset.currentVideo;
    const savedPosition = Number(state.videoPositions?.[videoId]) || 0;
    let lastSavedSecond = Math.floor(savedPosition);

    player.addEventListener("loadedmetadata", () => {
      if (savedPosition > 0 && savedPosition < player.duration - 2) player.currentTime = savedPosition;
    }, { once:true });

    const rememberPosition = () => {
      if (!Number.isFinite(player.currentTime)) return;
      state.videoPositions ||= {};
      state.videoPositions[videoId] = player.ended ? 0 : Math.floor(player.currentTime);
      lastSavedSecond = Math.floor(player.currentTime);
      saveState();
    };

    player.addEventListener("timeupdate", () => {
      if (Math.abs(Math.floor(player.currentTime) - lastSavedSecond) >= 5) rememberPosition();
    });
    player.addEventListener("pause", rememberPosition);
    player.addEventListener("ended", rememberPosition);
  }

  function navigate(view) {
    state.currentView = view; state.sidebarOpen = false; saveState(); render(); window.scrollTo(0,0);
  }

  function handleAction(event) {
    const action = event.currentTarget.dataset.action;
    if (action === "start-onboarding") setState({ started:true, onboarding:true, onboardingStep:0 });
    if (action === "open-demo") setState({ started:true, onboarding:false, onboarded:true });
    if (action === "onboard-back") { state.onboardingStep = Math.max(0,state.onboardingStep-1); saveState(); render(); }
    if (action === "onboard-next") {
      if (state.onboardingStep < 3) { state.onboardingStep += 1; saveState(); render(); }
      else if (state.profile.consent) { setState({ onboarding:false, onboarded:true, currentView:"today" }); showToast("Персональный маршрут готов", "success"); }
    }
    if (action === "toggle-sidebar") { state.sidebarOpen = !state.sidebarOpen; saveState(); render(); }
    if (action === "open-intro") navigate("intro");
    if (action === "intro-prev") { state.introSlide = Math.max(0, state.introSlide - 1); saveState(); render(); window.scrollTo(0,0); }
    if (action === "intro-next") { state.introSlide = Math.min(4, state.introSlide + 1); saveState(); render(); window.scrollTo(0,0); }
    if (action === "finish-intro") { state.introCompleted = true; state.introSlide = 0; saveState(); navigate("lesson"); showToast("Вводная глава завершена — дальше понятия перед видео", "success"); }
    if (action === "open-lesson") navigate("lesson");
    if (action === "show-code") showCodeModal();
    if (action === "locked-preview") showToast("Этот урок откроется после текущей недели");
    if (action === "lesson-prev") { state.lessonChapter = Math.max(0, state.lessonChapter - 1); saveState(); render(); }
    if (action === "lesson-next") { state.lessonChapter = Math.min(5, state.lessonChapter + 1); saveState(); render(); }
    if (action === "finish-material") finishMaterial();
    if (action === "download-notes") downloadLessonNotes();
    if (action === "complete-lesson") completeLesson();
    if (action === "save-project") { state.projectSaved = true; saveState(); render(); showToast("Черновик и новая версия сохранены", "success"); }
    if (action === "submit-project") submitProject();
    if (action === "toggle-public") togglePublic();
    if (action === "reset-avatar") { captureProfileName(); state.profile.avatarImage = ""; state.profile.avatar = "initial"; saveState(); render(); showToast("Фотография удалена"); }
    if (action === "toggle-ai") { state.aiOpen = !state.aiOpen; saveState(); render(); }
    if (action === "export-data") exportData();
    if (action === "confirm-delete") showDeleteModal();
    if (action === "toggle-module") showToast("Модули раскрываются по мере прохождения");
  }

  function renderProjectResultsLive() {
    const fields = document.querySelectorAll(".result-box strong");
    if (!fields.length) return;
    const v = projectValues();
    const values = [money(v.revenue), money(v.profit), `${v.margin.toFixed(1)}%`, money(v.contribution), money(v.fixedPerProject), `${v.breakEven} проекта / мес.`, money(v.directCostPerProject), money(v.revenuePerHour), money(v.profitPerProject)];
    fields.forEach((field,index) => field.textContent = values[index]);
  }

  function finishMaterial() {
    state.videoDone = true;
    if (!state.completedTasks.includes("video")) state.completedTasks.push("video");
    saveState();
    render();
    showToast("Интерактивный разбор завершён", "success");
  }

  function downloadLessonNotes() {
    const notes = [
      "ATEIRA MINIMBA — УРОК 1: ВЫРУЧКА ≠ ПРИБЫЛЬ",
      "",
      "Выручка отвечает на вопрос: сколько продано за выбранный период.",
      "Прибыль = выручка − прямые затраты − доля общих расходов.",
      "Операционная маржа = операционная прибыль ÷ выручка × 100%.",
      "Денежный поток показывает даты фактических поступлений и выплат.",
      "",
      "КЕЙС",
      "Выручка: 35 000 AED",
      "Фрилансер: 8 000 AED",
      "Время команды: 11 000 AED",
      "Офис и сервисы: 4 000 AED",
      "Прибыль: 12 000 AED; операционная маржа: 34,3%.",
      "При оплате через 60 дней возможен кассовый разрыв 23 000 AED.",
      "",
      "ЧЕК-ЛИСТ РЕШЕНИЯ",
      "1. За какой период считаем?",
      "2. Что именно формирует выручку?",
      "3. Какие прямые и общие затраты относятся к работе?",
      "4. Когда приходят и уходят деньги?",
      "5. Что изменить: цену, объём, производство или график оплаты?"
    ].join("\n");
    const blob = new Blob([notes], { type:"text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ateira-lesson-1-notes.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Конспект скачан", "success");
  }

  function completeLesson() {
    if (!state.videoDone || !state.quizPassed) return;
    state.lessonCompleted = true;
    if (!state.completedTasks.includes("lesson")) state.completedTasks.push("lesson");
    saveState();
    if (hasAccess()) {
      navigate("project");
      showToast("Урок завершён — проект открыт", "success");
    } else {
      navigate("today");
      showToast("Гостевой урок завершён", "success");
      setTimeout(showCodeModal, 250);
    }
  }

  function captureProfileName() {
    const input = document.getElementById("profile-name");
    if (!input) return;
    const name = String(input?.value || "").trim().replace(/\s+/g, " ").slice(0, 40) || "Гость";
    state.profile.name = name;
    state.profile.nameCustomized = name !== "Гость";
  }

  function saveProfile(event) {
    event.preventDefault();
    captureProfileName();
    saveState(); render();
    showToast("Профиль сохранён", "success");
  }

  function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
      showToast("Выберите изображение PNG, JPG или WEBP", "error");
      event.target.value = "";
      return;
    }
    if (file.size > 1024 * 1024) {
      showToast("Фотография превышает 1 МБ", "error");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string" || !reader.result.startsWith("data:image/")) return;
      captureProfileName();
      state.profile.avatarImage = reader.result;
      state.profile.avatar = "custom";
      saveState(); render();
      showToast("Фотография установлена", "success");
    });
    reader.readAsDataURL(file);
  }

  function handleAttachment(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = /\.(pdf|doc|docx|xls|xlsx|csv|png|jpg|jpeg|mp4)$/i;
    if (!allowed.test(file.name)) { showToast("Формат файла не поддерживается", "error"); event.target.value = ""; return; }
    if (file.size > 15 * 1024 * 1024) { showToast("Файл превышает лимит 15 МБ", "error"); event.target.value = ""; return; }
    state.project.attachment = file.name; state.projectSaved = false; saveState(); render(); showToast("Файл добавлен в черновик", "success");
  }

  function submitProject() {
    if (!state.projectSaved) return;
    const v = projectValues();
    if (v.contribution <= 0) { showToast("Критическая ошибка: вклад в покрытие неположительный", "error"); return; }
    if (!state.project.assumptions.trim()) { showToast("Добавьте допущения и источники", "error"); return; }
    state.projectSubmitted = true; saveState(); render();
    showReviewModal(v);
  }

  function togglePublic() {
    if (!state.projectSaved) return;
    if (!state.portfolioPublic) showPrivacyModal();
    else { state.portfolioPublic = false; saveState(); render(); showToast("Публичная ссылка отключена"); }
  }

  function renderModal(content) { document.getElementById("modal-root").innerHTML = content; }

  function showCodeModal() {
    renderModal(`<div class="modal-backdrop" data-modal-close><section class="modal" role="dialog" aria-modal="true" aria-labelledby="code-title"><span class="eyebrow">Доступ к первой версии</span><h2 id="code-title">Введите код</h2><p>Платежи пока не подключены. Для пилота используются коды бесплатного доступа.</p><input class="code-input" id="access-code" placeholder="КОД ДОСТУПА" autocomplete="off"><p class="caption">Демонстрационный код: ATEIRA-DEMO</p><div class="modal-actions"><button class="btn secondary" data-modal-cancel>Отмена</button><button class="btn coral" id="activate-code">Активировать</button></div></section></div>`);
    bindModalClose();
    document.getElementById("activate-code").addEventListener("click", () => {
      const code = document.getElementById("access-code").value.trim().toUpperCase();
      if (code !== D.accessCode) { showToast("Код не найден", "error"); return; }
      state.access = "code"; state.accessCode = code; saveState(); render(); showToast("Полный доступ активирован", "success");
    });
    document.getElementById("access-code").focus();
  }

  function showReviewModal(v) {
    const health = v.profit >= 0 ? "Модель операционно прибыльна" : "Модель убыточна в базовом сценарии";
    renderModal(`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><span class="eyebrow">Предварительная проверка с помощью ИИ</span><h2>${health}</h2><p>Вклад в покрытие: <strong>${money(v.contribution)}</strong>. Точка безубыточности: <strong>${v.breakEven} проекта</strong>. Проверьте, что цена и затраты относятся к одному периоду, а источники исходных данных зафиксированы.</p><div class="review-note"><strong>Что дальше</strong><br>Автоматическая проверка создана сразу. Рецензент Ateira подтверждает итоговую оценку для пользователей на подписке; монетизация в пилоте ещё не подключена.</div><div class="modal-actions"><button class="btn coral" id="review-close">Понятно</button></div></section></div>`);
    document.getElementById("review-close").addEventListener("click", () => renderModal(""));
  }

  function showPrivacyModal() {
    renderModal(`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><span class="eyebrow">Перед публикацией</span><h2>Проверьте данные проекта</h2><p>Публичная ссылка может открываться без входа. Убедитесь, что в карточке нет данных клиента, персональных данных и информации, защищённой соглашением о конфиденциальности.</p><ul class="privacy-list"><li>В прототипе публикуется только сводная карточка.</li><li>Приложенный файл остаётся приватным.</li><li>Ссылку можно отключить в любой момент.</li></ul><div class="modal-actions"><button class="btn secondary" id="privacy-cancel">Отмена</button><button class="btn coral" id="privacy-publish">Опубликовать</button></div></section></div>`);
    document.getElementById("privacy-cancel").addEventListener("click", () => renderModal(""));
    document.getElementById("privacy-publish").addEventListener("click", () => { state.portfolioPublic = true; saveState(); render(); showToast("Публичная ссылка создана", "success"); });
  }

  function showDeleteModal() {
    renderModal(`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><span class="eyebrow">Необратимое действие</span><h2>Удалить профиль?</h2><p>Профиль, прогресс, проект и настройки будут удалены из этого браузера. Восстановить их будет нельзя.</p><div class="modal-actions"><button class="btn secondary" id="delete-cancel">Отмена</button><button class="btn coral" id="delete-confirm">Удалить данные</button></div></section></div>`);
    document.getElementById("delete-cancel").addEventListener("click", () => renderModal(""));
    document.getElementById("delete-confirm").addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); state = structuredClone(defaultState); render(); showToast("Данные удалены", "success"); });
  }

  function bindModalClose() {
    document.querySelector("[data-modal-cancel]")?.addEventListener("click", () => renderModal(""));
    document.querySelector("[data-modal-close]")?.addEventListener("click", event => { if (event.target === event.currentTarget) renderModal(""); });
  }

  async function sendAiMessage(event) {
    event.preventDefault();
    const input = document.getElementById("ai-input");
    const message = input.value.trim();
    if (!message) return;
    state.messages.push({ role:"user", text:message }); saveState();
    input.value = "";
    const messagesEl = document.getElementById("ai-messages");
    messagesEl.insertAdjacentHTML("beforeend", `<div class="message user">${esc(message)}</div><div class="message assistant loading" id="ai-loading">Проверяю логику…</div>`);
    messagesEl.scrollTo({ top:99999, behavior:"smooth" });
    try {
      const response = await fetch("/api/ai", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ message, context:"Неделя 1: выручка, прибыль, денежный поток и экономика дизайн-проекта" }) });
      const result = await response.json();
      const reply = response.ok ? result.reply : result.error;
      state.messages.push({ role:"assistant", text:reply }); saveState();
      const loading = document.getElementById("ai-loading"); if (loading) { loading.classList.remove("loading"); loading.textContent = reply; loading.removeAttribute("id"); }
    } catch {
      const reply = "Связь с наставником прервалась. Ваш вопрос сохранён — попробуйте ещё раз.";
      state.messages.push({ role:"assistant", text:reply }); saveState();
      const loading = document.getElementById("ai-loading"); if (loading) loading.textContent = reply;
    }
  }

  function exportData() {
    const payload = { exportedAt:new Date().toISOString(), product:"Ateira MiniMBA", region:"UAE", data:state };
    const blob = new Blob([JSON.stringify(payload,null,2)], { type:"application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "ateira-minimba-data.json"; a.click(); URL.revokeObjectURL(url); showToast("Выгрузка готова", "success");
  }

  function showToast(text, type = "") {
    const root = document.getElementById("toast-root");
    const toast = document.createElement("div"); toast.className = `toast ${type}`; toast.textContent = text; root.appendChild(toast); setTimeout(() => toast.remove(), 3200);
  }

  render();
})();
