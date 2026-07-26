# =============================================
# Frontend Dockerfile — Smart Grid Dashboard
# Multi-stage build: build -> nginx production
# =============================================

# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build-time environment variables (provide defaults)
ARG VITE_API_URL=http://localhost:8000
ARG VITE_SOCKET_URL=ws://localhost:8000/ws
ARG VITE_REQUEST_TIMEOUT=10000

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_REQUEST_TIMEOUT=$VITE_REQUEST_TIMEOUT

# Build the production bundle
RUN npm run build

# ---- Production Stage ----
FROM nginx:1.27-alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for nginx
RUN addgroup -S appuser && \
    adduser -S -G appuser appuser && \
    chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

USER appuser

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
