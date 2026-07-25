"""
Monitoring Module

Provides Prometheus metrics for application monitoring:
- Request counters (total, by method, by endpoint, by status)
- Response time histograms
- Error counters
- Active user/meter gauges
- Health and readiness endpoints
"""

import time

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import get_logger

logger = get_logger(__name__)


# ──────────────────────────────────────────────
#  In-Memory Metrics (lightweight alternative
#  to prometheus_client library dependency)
# ──────────────────────────────────────────────


class MetricsCollector:
    """
    Lightweight in-memory metrics collector.

    Tracks request counts, error counts, and response times.
    Can be exported to Prometheus format or via /metrics endpoint.
    """

    def __init__(self):
        # Request counts by path and method
        self._request_counts: dict = {}
        # Error counts by path and status code
        self._error_counts: dict = {}
        # Response time accumulators by path
        self._response_times: dict = {}
        # Total counts
        self._total_requests: int = 0
        self._total_errors: int = 0
        self._total_response_time: float = 0.0

    def record_request(self, method: str, path: str, status_code: int, duration_ms: float) -> None:
        """Record a completed request."""
        self._total_requests += 1
        self._total_response_time += duration_ms

        key = f"{method}:{path}"
        self._request_counts[key] = self._request_counts.get(key, 0) + 1
        self._response_times[key] = self._response_times.get(key, 0) + duration_ms

        if status_code >= 400:
            self._total_errors += 1
            error_key = f"{status_code}:{path}"
            self._error_counts[error_key] = self._error_counts.get(error_key, 0) + 1

    def get_metrics(self) -> dict:
        """
        Get current metrics snapshot.

        Returns a dictionary suitable for /metrics endpoint.
        """
        total_time = self._total_response_time
        avg_response_time = (
            round(total_time / self._total_requests, 2) if self._total_requests > 0 else 0.0
        )

        return {
            "requests": {
                "total": self._total_requests,
                "by_endpoint": dict(
                    sorted(
                        self._request_counts.items(),
                        key=lambda x: x[1],
                        reverse=True,
                    )[:20]
                ),
            },
            "errors": {
                "total": self._total_errors,
                "error_rate": (
                    round(self._total_errors / self._total_requests * 100, 2)
                    if self._total_requests > 0
                    else 0.0
                ),
                "by_status": dict(
                    sorted(
                        self._error_counts.items(),
                        key=lambda x: x[1],
                        reverse=True,
                    )[:10]
                ),
            },
            "performance": {
                "average_response_time_ms": avg_response_time,
                "total_response_time_ms": round(total_time, 2),
            },
        }

    def reset(self) -> None:
        """Reset all metrics."""
        self._request_counts.clear()
        self._error_counts.clear()
        self._response_times.clear()
        self._total_requests = 0
        self._total_errors = 0
        self._total_response_time = 0.0


# Global metrics collector instance
metrics_collector = MetricsCollector()


# ──────────────────────────────────────────────
#  Metrics Middleware
# ──────────────────────────────────────────────


class MetricsMiddleware(BaseHTTPMiddleware):
    """
    Middleware that records metrics for every request.

    Captures method, path, status code, and response time.
    """

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response: Response = await call_next(request)

        duration_ms = round((time.time() - start_time) * 1000, 2)

        # Record metrics
        metrics_collector.record_request(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=duration_ms,
        )

        return response


# ──────────────────────────────────────────────
#  Prometheus Text Format Export
# ──────────────────────────────────────────────


def get_prometheus_metrics() -> str:
    """
    Export metrics in Prometheus text format.

    Returns a string in the Prometheus exposition format.
    """
    m = metrics_collector.get_metrics()

    lines = [
        "# HELP smartgrid_requests_total Total request count",
        "# TYPE smartgrid_requests_total counter",
    ]
    lines.append(f'smartgrid_requests_total {m["requests"]["total"]}')

    for endpoint, count in m["requests"]["by_endpoint"].items():
        method, path = endpoint.split(":", 1)
        safe_path = path.replace("/", "_").replace("-", "_").strip("_") or "root"
        lines.append(
            f'smartgrid_requests_by_endpoint{{method="{method}",' f'endpoint="{path}"}} {count}'
        )

    lines.extend(
        [
            "",
            "# HELP smartgrid_errors_total Total error count",
            "# TYPE smartgrid_errors_total counter",
        ]
    )
    lines.append(f'smartgrid_errors_total {m["errors"]["total"]}')
    lines.append(f'smartgrid_error_rate {m["errors"]["error_rate"]}')

    lines.extend(
        [
            "",
            "# HELP smartgrid_response_time_ms Response time in milliseconds",
            "# TYPE smartgrid_response_time_ms gauge",
        ]
    )
    lines.append(
        f"smartgrid_average_response_time_ms " f'{m["performance"]["average_response_time_ms"]}'
    )

    return "\n".join(lines)
