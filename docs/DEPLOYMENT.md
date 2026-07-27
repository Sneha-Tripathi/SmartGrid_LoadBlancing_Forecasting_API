# Deployment Guide

## Prerequisites

- Docker & Docker Compose (recommended)
- Python 3.12+ (alternative)
- PostgreSQL (production database)

## Option 1: Docker Deployment (Recommended)

### 1. Clone and Configure

```bash
git clone <repo-url>
cd smart-grid-api

# Create environment file
cp .env.example .env

# Generate a secure secret key
python -c "import secrets; print(secrets.token_hex(32))"
```

Edit `.env` and set a strong `SECRET_KEY`.

### 2. Build and Run

```bash
docker-compose up --build -d
```

### 3. Run Database Migrations

```bash
docker exec smart-grid-api alembic upgrade head
```

### 4. Verify Deployment

```bash
curl http://localhost:8000/health
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
```

## Option 2: Manual Deployment

### 1. Setup Python Environment

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run Migrations

```bash
alembic upgrade head
```

### 4. Start Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Production Considerations

### Database

- Use PostgreSQL in production
- Set `DATABASE_URL=postgresql://user:password@host:5432/smartgrid`
- Enable connection pooling

### Security

- Generate a strong `SECRET_KEY` (32+ bytes random)
- Enable all password policy requirements
- Configure CORS origins for your domain
- Use HTTPS behind a reverse proxy

### Reverse Proxy (Nginx Example)

```nginx
server {
    listen 443 ssl;
    server_name api.smartgrid.io;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Monitoring

- Prometheus metrics available at `/metrics/prometheus`
- Liveness probe: `/health/live`
- Readiness probe: `/health/ready`
- Application metrics: `/metrics`
