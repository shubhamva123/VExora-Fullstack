from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.notes import router as notes_router
from app.routers.tasks import router as tasks_router
from app.routers.calendar import router as calendar_router
from app.routers.files import router as files_router
from app.routers.chat import router as chat_router
from app.routers.dashboard import router as dashboard_router
from app.routers.revision import router as revision_router
from app.routers.ai import router as ai_router

app = FastAPI(
    title="VExora Backend",
    version="1.0.0",
)

# ---------------------------------
# CORS
# ---------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|10\.97\.130\.169)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ---------------------------------
# API Routers
# ---------------------------------
app.include_router(auth_router, prefix="/api")
app.include_router(notes_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(calendar_router, prefix="/api")
app.include_router(files_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(revision_router, prefix="/api")
app.include_router(ai_router, prefix="/api")

# ---------------------------------
# Root
# ---------------------------------
@app.get("/")
def root():
    return {
        "status": "running",
        "project": "VExora Backend",
        "version": "1.0.0",
    }


# ---------------------------------
# Health Check
# ---------------------------------
@app.get("/health")
def health():
    return {
        "status": "healthy",
    }