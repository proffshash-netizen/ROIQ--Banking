from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

from ....streaming.event_generator import generate_mock_progress

router = APIRouter(tags=["Streaming"])


@router.get("")
async def stream_events() -> EventSourceResponse:
    """Stream AI pipeline analysis progress in real-time."""
    return EventSourceResponse(generate_mock_progress())
