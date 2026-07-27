# Smart Grid API - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│  (Web App, Mobile App, Smart Meters, Monitoring Tools)      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Load Balancer                │
│                    (Nginx, Traefik, Cloud LB)                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Middleware   │  │  Auth       │  │  Router     │         │
│  │ Stack        │──▶  Module     │──▶  Layer      │         │
│  │ - Request ID │  │ - JWT Auth  │  │ - /auth     │         │
│  │ - Security   │  │ - RBAC      │  │ - /meters   │         │
│  │ - Timing     │  │ - Rate Lim  │  │ - /health   │         │
│  │ - Metrics    │  │ - Lockout   │  │ - /metrics  │         │
│  │ - Logging    │  └─────────────┘  └──────┬──────┘         │
│  └─────────────┘                           │                │
│                                            ▼                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               Service Layer                           │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │    │
│  │  │ Meters     │  │ Users      │  │ Security   │    │    │
│  │  │ CRUD/Query │  │ Auth/Prof  │  │ Rate Lim   │    │    │
│  │  └────────────┘  └────────────┘  └────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                               │                              │
│                               ▼                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               Database Layer                          │    │
│  │  - SQLAlchemy ORM                                    │    │
│  │  - Alembic Migrations                                │    │
│  │  - Connection Pooling                                │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database                                  │
│         (SQLite Dev / PostgreSQL Production)                  │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │  smart_meters  │  │    users       │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

## Request Lifecycle

```
1. Client sends HTTP request
       │
2. CORS Middleware (handle preflight, add CORS headers)
       │
3. RequestID Middleware (assign/generate request ID)
       │
4. SecurityHeaders Middleware (add CSP, HSTS, XSS headers)
       │
5. RequestTiming Middleware (record start time)
       │
6. MetricsMiddleware (track request count)
       │
7. RequestLoggingMiddleware (log incoming request)
       │
8. Exception Handler (catch any unhandled errors)
       │
9. Auth Dependencies (JWT validation, RBAC check)
       │
10. Route Handler (execute business logic)
       │
11. Response returned with security headers & timing
```

## Authentication Flow

```
┌─────────┐       ┌──────────┐       ┌──────────┐
│ Client  │       │  FastAPI │       │ Database │
└────┬────┘       └────┬─────┘       └────┬─────┘
     │                 │                  │
     │  POST /auth/register               │
     │  {username, email, password}       │
     ├────────────────▶│                  │
     │                 │  Validate input  │
     │                 │  Check password policy
     │                 │  Hash password   │
     │                 │─────────────────▶│
     │                 │  Insert user     │
     │                 │◀─────────────────│
     │  201 Created    │                  │
     │◀────────────────┤                  │
     │                 │                  │
     │  POST /auth/login                  │
     │  {username, password}              │
     ├────────────────▶│                  │
     │                 │  Rate limit check│
     │                 │  Query user      │
     │                 │─────────────────▶│
     │                 │◀─────────────────│
     │                 │  Verify password │
     │                 │  Brute force check
     │                 │  Create JWT      │
     │  200 OK         │                  │
     │  {access_token} │                  │
     │◀────────────────┤                  │
     │                 │                  │
     │  GET /meters/ (with Bearer token)  │
     ├────────────────▶│                  │
     │                 │  Validate JWT    │
     │                 │  Check RBAC      │
     │                 │  Query meters    │
     │                 │─────────────────▶│
     │                 │◀─────────────────│
     │  200 OK         │                  │
     │  {paginated}    │                  │
     │◀────────────────┤                  │
└────┴────┘       └────┴─────┘       └────┴─────┘
```

## Database ER Diagram

```
┌─────────────────────────┐
│        users            │
├─────────────────────────┤
│ id            (PK, INT) │
│ username      (UNIQUE)  │
│ email         (UNIQUE)  │
│ hashed_password         │
│ is_active     (BOOL)    │
│ role          (STR)     │
│ full_name     (NULLABLE)│
│ phone         (NULLABLE)│
│ created_at    (DATETIME)│
│ updated_at    (DATETIME)│
│ last_login    (NULLABLE)│
└─────────────────────────┘

┌─────────────────────────┐
│     smart_meters        │
├─────────────────────────┤
│ id            (PK, INT) │
│ meter_number  (UNIQUE)  │
│ zone          (INDEXED) │
│ consumer_name           │
│ current_load  (FLOAT)   │
└─────────────────────────┘
```

## Project Structure

```
smart-grid-api/
├── app/
│   ├── api/              # API route handlers
│   │   ├── health.py     # Health & root endpoints
│   │   ├── meter.py      # Smart meter CRUD endpoints
│   │   └── router.py     # Route aggregation
│   ├── auth/             # Authentication & authorization
│   │   ├── auth.py       # Register, login, profile endpoints
│   │   ├── dependencies.py   # JWT validation, RBAC deps
│   │   └── security.py   # Password hashing, JWT tokens
│   ├── core/             # Core configuration & infrastructure
│   │   ├── config.py     # Pydantic settings
│   │   ├── exceptions.py # Global exception handlers
│   │   ├── logging.py    # Structured logging
│   │   ├── middleware.py # Request ID, timing, security
│   │   ├── monitoring.py # Prometheus metrics
│   │   ├── security.py   # Rate limiting, brute force protection
│   │   └── validation.py # Custom validators
│   ├── db/               # Database setup & session management
│   │   ├── base.py       # Declarative base
│   │   ├── database.py   # Engine configuration
│   │   └── session.py    # Session factory & dependency
│   ├── models/           # SQLAlchemy models
│   │   ├── smart_meter.py
│   │   └── user.py
│   ├── schemas/          # Pydantic schemas (validation/serialization)
│   │   ├── smart_meter.py
│   │   └── user.py
│   └── main.py           # Application entry point
├── alembic/              # Database migrations
│   ├── versions/         # Migration scripts
│   ├── env.py            # Alembic environment
│   └── script.py.mako    # Migration template
├── tests/                # Test suite (91+ tests)
├── logs/                 # Log output directory
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Container orchestration
└── .github/workflows/    # CI/CD pipeline
```
