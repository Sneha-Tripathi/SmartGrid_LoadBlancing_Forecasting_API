# API Guide

## Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://your-domain.com`

## Authentication

All protected endpoints require a Bearer JWT token in the `Authorization` header:

```http
Authorization: Bearer <your_access_token>
```

### Get a Token

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=securepass123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

## Endpoints

### Health & Monitoring

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check with timestamp |
| GET | `/health/live` | No | Kubernetes liveness probe |
| GET | `/health/ready` | No | Kubernetes readiness probe |
| GET | `/metrics` | No | Application metrics |
| GET | `/metrics/prometheus` | No | Prometheus format metrics |

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, get JWT token |
| GET | `/auth/me` | Yes | Get current user profile |
| PUT | `/auth/me` | Yes | Update profile |
| PUT | `/auth/change-password` | Yes | Change password |
| POST | `/auth/deactivate` | Yes | Deactivate account |

### Smart Meters

| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/meters/` | Operator+ | Create a meter |
| GET | `/meters/` | Any auth | List meters (paginated) |
| GET | `/meters/{id}` | Any auth | Get meter by ID |
| PUT | `/meters/{id}` | Operator+ | Update a meter |
| DELETE | `/meters/{id}` | Admin only | Delete a meter |
| POST | `/metrics/reset` | Admin | Reset metrics counters |

## Query Parameters for GET /meters/

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 1) |
| `page_size` | int | Items per page (default: 10, max: 100) |
| `zone` | str | Filter by zone (partial match) |
| `consumer_name` | str | Filter by consumer name (partial match) |
| `meter_number` | str | Filter by meter number (partial match) |
| `min_load` | float | Minimum current load |
| `max_load` | float | Maximum current load |
| `search` | str | Global search across multiple fields |
| `sort_by` | str | Sort field (id, meter_number, zone, consumer_name, current_load) |
| `sort_order` | str | Sort direction (asc, desc) |
