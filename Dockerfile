# ════════════════════════════════════════════════════════
# Smart Grid Load Balancing API - Multi-stage Docker Build
# ════════════════════════════════════════════════════════
#
# Stage 1: Build dependencies
# Stage 2: Production runtime with minimal footprint
#
# Build:
#   docker build -t smart-grid-api .
#
# Run:
#   docker run -d -p 8000:8000 smart-grid-api
# ════════════════════════════════════════════════════════

# ── Stage 1: Builder ──────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies to user directory
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ── Stage 2: Production Runtime ───────────────
FROM python:3.12-slim AS production

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq5 \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from builder stage
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY . .

# Ensure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Create non-root user for security
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8000

# Health check - verifies the application is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; import json; resp = urllib.request.urlopen('http://localhost:8000/health/live'); assert json.loads(resp.read())['status'] == 'alive'"

# Run with uvicorn using production settings
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--limit-concurrency", "1000", "--backlog", "2048", "--no-access-log"]
