# ─────────────────────────────────────────────────────────────────────────────
# OENEXA Frontend Dockerfile (Decoupled Web Dashboard)
# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build React 18 + Vite application
FROM node:20-alpine AS builder

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

# Configure Nginx for SPA routing and reverse proxy
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        index index.html index.htm;' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
