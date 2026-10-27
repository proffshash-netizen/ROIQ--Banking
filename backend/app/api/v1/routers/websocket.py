from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ....websocket.connection_manager import ConnectionManager

router = APIRouter(tags=["Streaming"])
manager = ConnectionManager()


@router.websocket("")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    await manager.broadcast(
        "System: A new analyst connection has subscribed to the live risk feed."
    )
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client broadcast: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("System: Subscribed analyst has disconnected.")
