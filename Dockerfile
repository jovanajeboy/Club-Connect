
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend

RUN npm install --omit=dev

COPY backend/ ./

RUN addgroup -S appgroup \
    && adduser -S appuser -G appgroup \
    && mkdir -p /app/uploads \
    && chown -R appuser:appgroup /app/uploads

USER appuser

EXPOSE 5000

CMD ["node", "server.js"]
