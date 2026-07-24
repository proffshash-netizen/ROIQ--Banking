import asyncio
import json
from typing import AsyncGenerator


async def generate_mock_progress() -> AsyncGenerator[dict[str, object], None]:
    steps = [
        {"status": "Initializing analysis pipeline...", "progress": 10},
        {"status": "Fetching company financial data...", "progress": 30},
        {"status": "Extracting risk variables...", "progress": 60},
        {"status": "Running AI scoring engine...", "progress": 80},
        {"status": "Finalizing risk report...", "progress": 100},
    ]
    for step in steps:
        await asyncio.sleep(0.5)  # Yield progress updates periodically
        yield {
            "event": "progress",
            "data": json.dumps(step),
        }
