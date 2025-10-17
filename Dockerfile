# ---------- Stage 1: Build the Vue 3 App ----------
FROM node:22-slim AS builder

WORKDIR /app

# Cache deps
COPY package*.json ./
RUN npm ci --omit=dev=false

# Copy app and build
COPY . .
RUN npm run build && \
    npm cache clean --force && rm -rf ~/.npm

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:stable-alpine-slim

# Clean default Nginx HTML
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
