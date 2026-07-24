from datetime import datetime, timezone
from typing import Any

from fastapi import status


def build_success_response(data: Any, processing_time_ms: int = 0) -> dict[str, Any]:
    return {
        "success": True,
        "data": data,
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "processing_time_ms": processing_time_ms,
        },
    }


def build_error_response(code: str, message: str, request_id: str | None = None) -> dict[str, Any]:
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "request_id": request_id,
        },
    }


def build_health_response(status: str, service: str | None = None) -> dict[str, Any]:
    return {
        "status": status,
        "service": service or "backend-platform",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
