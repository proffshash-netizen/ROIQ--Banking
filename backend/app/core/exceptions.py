from fastapi import HTTPException, status


class PlatformError(Exception):
    """Base exception for platform-level failures."""

    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)


class AuthenticationError(PlatformError):
    def __init__(self, message: str = "Authentication failed") -> None:
        super().__init__("authentication_error", message)


class AuthorizationError(PlatformError):
    def __init__(self, message: str = "Insufficient permissions") -> None:
        super().__init__("authorization_error", message)


class ServiceUnavailableError(PlatformError):
    def __init__(self, message: str = "Service unavailable") -> None:
        super().__init__("service_unavailable", message)


class NotImplementedError(PlatformError):
    def __init__(self, message: str = "Service not implemented yet") -> None:
        super().__init__("not_implemented", message)


def to_http_exception(error: PlatformError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error.message)
