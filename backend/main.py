from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.scan import router as scan_router
from backend.api.chat import router as chat_router
from backend.api.dashboard import router as dashboard_router

app = FastAPI(
    title="PrivAI Guard",
    description="AI Privacy Gateway",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router)
app.include_router(chat_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "message": "PrivAI Guard API is running"
    }