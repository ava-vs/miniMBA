const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DIR = path.join(__dirname, "public");
const MAX_BODY = 64 * 1024;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt; charset=utf-8"
};

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY) {
        reject(new Error("PAYLOAD_TOO_LARGE"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function offlineTutor(message, context) {
  const text = String(message || "").toLowerCase();
  if (text.includes("выруч") && text.includes("прибыл")) {
    return "Выручка — все деньги от продаж за период, а прибыль — то, что остаётся после вычета расходов. Попробуйте на своём примере: укажите цену проекта, прямые затраты и часы команды — я помогу проверить расчёт, но сначала покажите вашу попытку.";
  }
  if (text.includes("безубыточ")) {
    return "Точка безубыточности отвечает на вопрос: сколько проектов нужно продать, чтобы покрыть постоянные расходы. Формула: постоянные расходы ÷ вклад в покрытие одного проекта. Какие значения вы бы подставили для своей студии?";
  }
  if (text.includes("марж")) {
    return "Проверьте три шага: 1) выручка и прямые затраты относятся к одному периоду; 2) валовая прибыль = выручка − прямые затраты; 3) маржа = валовая прибыль ÷ выручка. Пришлите ваши числа — разберём логику.";
  }
  return `Давайте разберём это как бизнес-задачу. Сначала сформулируйте вашу гипотезу или покажите расчёт. Затем проверим исходные данные, единицы измерения и вывод. Контекст: ${context || "текущий урок"}.`;
}

async function handleAi(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch (error) {
    return json(res, error.message === "PAYLOAD_TOO_LARGE" ? 413 : 400, { error: "Некорректный запрос" });
  }

  const message = String(payload.message || "").trim().slice(0, 4000);
  const context = String(payload.context || "").trim().slice(0, 2000);
  if (!message) return json(res, 400, { error: "Введите вопрос" });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return json(res, 200, { reply: offlineTutor(message, context), mode: "demo" });
  }

  const system = [
    "Ты — учебный наставник Ateira MiniMBA для дизайнеров, изучающих бизнес.",
    "Отвечай по-русски, ясно и кратко. Не выполняй проект вместо ученика.",
    "Работай в режиме «Сначала моя попытка»: проси показать ход мысли и давай наводящие вопросы.",
    "Проверяй период, валюту, единицы измерения, источники и допущения.",
    "Не выдумывай интервью, данные, источники и достижения. Не ставь итоговую оценку.",
    "Если не уверен, скажи об этом прямо. Контекст урока:",
    context || "Бизнес-математика и экономика дизайн-проекта"
  ].join("\n");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_ORIGIN || `http://localhost:${PORT}`,
        "X-OpenRouter-Title": "Ateira MiniMBA"
      },
      body: JSON.stringify({
        ...(process.env.OPENROUTER_MODEL ? { model: process.env.OPENROUTER_MODEL } : {}),
        messages: [
          { role: "system", content: system },
          { role: "user", content: message }
        ],
        temperature: 0.35,
        max_tokens: 600
      }),
      signal: AbortSignal.timeout(30000)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("OpenRouter error", response.status, result?.error?.message || "Unknown error");
      return json(res, 502, { error: "Наставник временно недоступен. Попробуйте ещё раз." });
    }

    const reply = result?.choices?.[0]?.message?.content;
    if (!reply) return json(res, 502, { error: "Пустой ответ модели" });
    return json(res, 200, { reply, mode: "openrouter", model: result.model });
  } catch (error) {
    console.error("AI proxy error", error.message);
    return json(res, 502, { error: "Не удалось связаться с наставником" });
  }
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(PUBLIC_DIR, normalized);

  if (!filePath.startsWith(PUBLIC_DIR)) return json(res, 403, { error: "Forbidden" });
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const stat = fs.statSync(filePath);
  const headers = {
    "Content-Type": contentTypes[ext] || "application/octet-stream",
    "Content-Length": stat.size,
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  };

  if (ext === ".mp4") headers["Accept-Ranges"] = "bytes";

  if (ext === ".mp4" && req.headers.range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range.trim());
    if (!match || (!match[1] && !match[2])) {
      res.writeHead(416, { ...headers, "Content-Range": `bytes */${stat.size}`, "Content-Length": 0 });
      return res.end();
    }

    let start;
    let end;
    if (!match[1]) {
      const suffixLength = Number(match[2]);
      start = Math.max(0, stat.size - suffixLength);
      end = stat.size - 1;
    } else {
      start = Number(match[1]);
      end = match[2] ? Number(match[2]) : stat.size - 1;
    }

    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= stat.size || end < start) {
      res.writeHead(416, { ...headers, "Content-Range": `bytes */${stat.size}`, "Content-Length": 0 });
      return res.end();
    }

    end = Math.min(end, stat.size - 1);
    const chunkSize = end - start + 1;
    res.writeHead(206, {
      ...headers,
      "Content-Length": chunkSize,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`
    });
    if (req.method === "HEAD") return res.end();
    return fs.createReadStream(filePath, { start, end }).pipe(res);
  }

  res.writeHead(200, headers);
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    return json(res, 200, {
      status: "ok",
      ai: process.env.OPENROUTER_API_KEY ? "openrouter" : "demo",
      maxUploadMb: 15,
      region: "UAE"
    });
  }
  if (req.method === "POST" && req.url === "/api/ai") return handleAi(req, res);
  if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "Method not allowed" });
  return serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`Ateira MiniMBA: http://${HOST}:${PORT}`);
  console.log(`AI mode: ${process.env.OPENROUTER_API_KEY ? "OpenRouter" : "demo"}`);
});

module.exports = server;
