# HIPAA Security Tool — static Vite SPA served by nginx.
# nginx also reverse-proxies /api/* to the shared OpsAssist backend so the
# browser stays same-origin (no CORS) — matching the dev Vite proxy.

# ── Stage 1: build the SPA ──────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build          # → /app/dist

# ── Stage 2: serve with nginx ───────────────────────────────────────
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
