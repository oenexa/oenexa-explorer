# ─────────────────────────────────────────────────────────────────────────────
# OENEXA Frontend Dockerfile (Decoupled Web Dashboard)
# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build React 18 + Vite application
FROM node:24.21.0-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Lightweight Nginx runtime
FROM nginx:alpine

# Copy built distribution files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration with RPC proxy and 405 fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
