FROM node:24-alpine AS base

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4173

COPY package.json ./
COPY server.js ./
COPY public ./public


FROM base AS runtime

USER node

EXPOSE 4173

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:4173/api/health >/dev/null || exit 1

CMD ["node", "server.js"]


FROM base AS test

COPY tests ./tests

USER node

CMD ["sh", "-c", "node --check server.js && node --check public/data.js && node --check public/app.js && node tests/smoke.js"]
