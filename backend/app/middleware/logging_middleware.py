import logging
import time
import uuid
from typing import Awaitable, Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("platform")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id

        start_time = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception as exc:
            process_time_ms = int((time.perf_counter() - start_time) * 1000)
            logger.error(
                f"Request ID: {request_id} | {request.method} {request.url.path} failed "
                f"after {process_time_ms}ms with error: {exc}"
            )
            raise exc

        process_time_ms = int((time.perf_counter() - start_time) * 1000)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-Ms"] = str(process_time_ms)

        logger.info(
            f"Request ID: {request_id} | {request.method} {request.url.path} "
            f"| Status: {response.status_code} | Time: {process_time_ms}ms"
        )
        return response
