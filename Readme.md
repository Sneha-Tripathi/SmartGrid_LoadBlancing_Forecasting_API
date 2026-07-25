# ⚡ Smart Grid Load Balancing & Forecasting API

[![CI/CD Pipeline](https://github.com/your-org/smart-grid-api/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/smart-grid-api/actions/workflows/ci.yml)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/release/python-3120/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **production-grade** FastAPI backend for modern energy utilities. Collects smart meter telemetry, provides CRUD operations with pagination/filtering/sorting, role-based access control (RBAC), JWT authentication, **rate limiting**, **brute force protection**, **Prometheus metrics**, **Alembic migrations**, **structured logging**, enterprise middleware, and Docker deployment.

---

## ✨ Features

| Category | Features |
|----------|----------|
| **API** | FastAPI REST APIs, Swagger, ReDoc, OpenAPI |
| **Auth** | JWT Authentication, RBAC (Admin/Operator/Viewer) |
| **Meters** | CRUD, Pagination, Filtering, Sorting, Global Search |
| **Security** | Rate Limiting, Brute Force Protection, Account Lockout, Password Policy, Secure Headers |
| **Monitoring** | Prometheus Metrics, Request Counters, Error Tracking, Response Time Metrics |
| **Observability** | Structured Logging, Rotating Log Files, Audit Logs, Request ID Tracing |
| **Database** | SQLAlchemy ORM, Alembic Migrations, SQLite/PostgreSQL |
| **Middleware** | CORS, Security Headers (CSP, HSTS), Request Timing, Request ID |
| **DevOps** | Multi-stage Docker, Docker Compose, Healthchecks, CI/CD |
| **Testing** | 91+ Pytest Tests, Coverage Reports |
| **Validation** | Pydantic Validators, Input Sanitization |
| **Docs** | Architecture Guide, API Guide, Deployment Guide |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- pip
- (Optional) Docker & Docker Compose

### 1. Clone and Setup

```bash
git clone <repo-url>
cd smart-grid-api

python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings (see Configuration section)
```

### 3. Run Database Migrations

```bash
alembic upgrade head
```

### 4. Start Server

```bash
uvicorn app.main:app --reload
```

The API is now available at **http://localhost:8000**.

### 5. Explore Docs

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON:** [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 🐳 Docker

```bash
# Build and start
docker-compose up --build -d

# Run migrations
docker exec smart-grid-api alembic upgrade head

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

---

## 📊 Monitoring

| Endpoint | Format | Description |
|----------|--------|-------------|
| `/metrics` | JSON | Application metrics (requests, errors, performance) |
| `/metrics/prometheus` | PlainText | Prometheus metrics format |
| `/health` | JSON | Health check |
| `/health/live` | JSON | Kubernetes liveness probe |
| `/health/ready` | JSON | Kubernetes readiness probe |

---

## 🔒 Security Features

- **Rate Limiting:** 100 requests/min general, 5 login attempts/15min
- **Brute Force Protection:** Account lockout after failed attempts
- **Password Policy:** Configurable (length, uppercase, lowercase, digit, special)
- **JWT Authentication:** Token-based auth with configurable expiration
- **RBAC:** Admin (3), Operator (2), Viewer (1) role hierarchy
- **Security Headers:** CSP, HSTS, XSS Protection, Clickjacking Prevention
- **Input Sanitization:** HTML tag removal, object ID validation
- **Request ID:** Unique ID per request for tracing
- **Audit Logging:** All security events logged

---

## 📁 Project Structure

```
smart-grid-api/
├── app/
│   ├── api/           # API route handlers
│   ├── auth/          # Authentication & authorization
│   ├── core/          # Core configuration & infrastructure
│   ├── db/            # Database setup
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   └── main.py        # Application entry point
├── alembic/           # Database migrations
├── docs/              # Documentation
├── tests/             # Test suite (91+ tests)
├── logs/              # Log output
├── Dockerfile         # Multi-stage build
├── docker-compose.yml # Container orchestration
└── .github/workflows/ # CI/CD pipeline
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

---

## 🧪 Running Tests

```bash
# Run all tests
pytest

# With coverage
pytest --cov=app --cov-report=term-missing

# Run specific test file
pytest tests/test_auth.py -v

# Run specific test class
pytest tests/test_meters.py::TestCreateMeter -v
```

---

## 🔧 Configuration

All configuration is managed via environment variables (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./smartgrid.db` | Database connection string |
| `SECRET_KEY` | (required) | JWT signing key |
| `ENVIRONMENT` | `development` | Runtime environment |
| `PASSWORD_MIN_LENGTH` | `8` | Minimum password length |
| `RATE_LIMIT_REQUESTS` | `100` | General rate limit |
| `LOGIN_RATE_LIMIT_REQUESTS` | `5` | Login attempts per window |
| `ACCOUNT_LOCKOUT_MINUTES` | `15` | Lockout duration |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed origins |

---

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Guide](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Swagger UI](http://localhost:8000/docs)
- [ReDoc](http://localhost:8000/redoc)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guide
- Write tests for new functionality
- Ensure all existing tests pass (`pytest`)
- Use type hints for all function signatures
- Document public APIs with docstrings

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
