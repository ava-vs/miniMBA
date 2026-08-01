const assert = require("node:assert/strict");

process.env.PORT = "4174";
delete process.env.OPENROUTER_API_KEY;

const server = require("../server.js");

async function run() {
  try {
    const healthResponse = await fetch("http://127.0.0.1:4174/api/health");
    assert.equal(healthResponse.status, 200);
    const health = await healthResponse.json();
    assert.equal(health.status, "ok");
    assert.equal(health.ai, "demo");
    assert.equal(health.maxUploadMb, 15);
    assert.equal(health.region, "UAE");

    const pageResponse = await fetch("http://127.0.0.1:4174/");
    assert.equal(pageResponse.status, 200);
    const html = await pageResponse.text();
    assert.match(html, /Ateira MiniMBA/);
    assert.match(html, /public\/app\.js|\/app\.js/);
    assert.match(html, /src="\.\/app\.js"/);
    assert.match(html, /href="\.\/styles\.css"/);

    const appResponse = await fetch("http://127.0.0.1:4174/app.js");
    assert.equal(appResponse.status, 200);
    const app = await appResponse.text();
    assert.match(app, /Интерактивный разбор/);
    assert.match(app, /Кассовый разрыв/);
    assert.match(app, /Проверка понимания · 3 вопроса/);
    assert.match(app, /Учебные материалы/);
    assert.match(app, /class="video-library card"/);
    assert.match(app, /id="lesson-video"/);
    assert.match(app, /Плеер запомнит позицию/);
    assert.doesNotMatch(app, /data-action="play-video"/);
    assert.match(app, /class="learning-primer card"/);
    assert.match(app, /Маржинальный доход/);
    assert.match(app, /Вклад в покрытие/);
    assert.match(app, /Валовая маржа/);
    assert.match(app, /Операционная маржа/);
    assert.match(app, /Переменные расходы/);
    assert.match(app, /Постоянные расходы/);
    assert.match(app, /Право на победу/);
    assert.match(app, /Защитная метрика/);
    assert.match(app, /Обучение и развитие сотрудников \(L&D\)/);
    assert.match(app, /Продажи компаниям \(B2B\)/);
    assert.match(app, /class="term-hint"/);
    assert.doesNotMatch(app, />Scope</);
    assert.doesNotMatch(app, /Прибыль и cash flow/);
    assert.match(app, /отчёт о прибылях и убытках \(P&amp;L\)/);
    assert.match(app, /case "intro": return introTemplate\(\)/);
    assert.match(app, /Глава 0 · Введение в управление/);
    assert.match(app, /Зачем нужны MBA, бизнес и управление/);
    assert.match(app, /Магистр делового администрирования/);
    assert.match(app, /Почему одни страны богатые, а другие бедные/);
    assert.match(app, /class="intro-route-card card/);
    assert.match(app, /data-action="open-intro"/);
    assert.doesNotMatch(app, /primer-badge">Нулевая глава/);
    assert.match(app, /name: "Гость"/);
    assert.match(app, /nameCustomized: false/);
    assert.match(app, /function avatarTemplate/);
    assert.match(app, /id="profile-form"/);
    assert.match(app, /id="profile-name"/);
    assert.match(app, /data-avatar-choice/);
    assert.match(app, /id="avatar-upload"/);
    assert.match(app, /function handleAvatarUpload/);
    assert.match(app, /IS_STATIC_PAGES/);
    assert.match(app, /function staticTutorReply/);
    assert.match(app, /Путь мастера/);
    assert.match(app, /<em>управления<\/em>/);
    assert.doesNotMatch(app, /Из дизайнера/);

    const cssResponse = await fetch("http://127.0.0.1:4174/styles.css");
    assert.equal(cssResponse.status, 200);
    const css = await cssResponse.text();
    assert.match(css, /\.intro-layout/);
    assert.match(css, /\.intro-stage/);
    assert.match(css, /\.intro-route-card/);
    assert.match(css, /\.institution-compare/);
    assert.match(css, /\.profile-editor/);
    assert.match(css, /\.avatar-choice/);
    assert.match(css, /\.avatar-custom img/);
    assert.match(css, /@media \(max-width: 980px\)/);
    assert.match(css, /@media \(max-height: 680px\)/);

    const dataResponse = await fetch("http://127.0.0.1:4174/data.js");
    assert.equal(dataResponse.status, 200);
    const data = await dataResponse.text();
    assert.match(data, /Контракт_35_000_AED\.mp4/);
    assert.match(data, /Бизнес_как_система\.mp4/);
    assert.match(data, /Выбор_1_сегмента\.mp4/);

    const videoUrl = encodeURI("http://127.0.0.1:4174/materials/first_lessons/Контракт_35_000_AED.mp4");
    assert.match(data, /Деловой английский/);
    assert.doesNotMatch(data, /Business English/);
    assert.match(data, /src: "\.\/materials\/first_lessons/);
    assert.doesNotMatch(data, /src: "\/materials\/first_lessons/);

    const videoResponse = await fetch(videoUrl, { headers: { Range: "bytes=0-1023" } });
    assert.equal(videoResponse.status, 206);
    assert.equal(videoResponse.headers.get("content-type"), "video/mp4");
    assert.equal(videoResponse.headers.get("accept-ranges"), "bytes");
    assert.match(videoResponse.headers.get("content-range") || "", /^bytes 0-1023\/\d+$/);
    assert.equal(Number(videoResponse.headers.get("content-length")), 1024);
    assert.equal((await videoResponse.arrayBuffer()).byteLength, 1024);

    const resourceResponse = await fetch("http://127.0.0.1:4174/materials/first_lessons/MiniMBA_%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B0%D1%8F_%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C_%D1%83%D1%80%D0%BE%D0%BA%D0%B8_1-2_FINAL.docx");
    assert.equal(resourceResponse.status, 200);
    assert.equal(resourceResponse.headers.get("content-type"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    assert.ok(Number(resourceResponse.headers.get("content-length") || 0) > 10_000);

    const aiResponse = await fetch("http://127.0.0.1:4174/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Чем выручка отличается от прибыли?", context: "Урок 1" })
    });
    assert.equal(aiResponse.status, 200);
    const ai = await aiResponse.json();
    assert.equal(ai.mode, "demo");
    assert.match(ai.reply, /Выручка/);

    console.log("Smoke test passed: page, video library and seeking, interactive lesson, health API and demo AI are working.");
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

run().catch(error => {
  console.error(error);
  server.close(() => process.exit(1));
});
