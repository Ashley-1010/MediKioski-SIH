"""MediKiosk FastAPI entrypoint.

Serves the patient/staff API under /api and the built frontend (dist/)
for everything else, so a single Render web service can host both.

Run from the repo root:
    uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend
"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base
from app.routes.patients import router as patients_router
from app import models  # noqa: F401 — import registers all model classes on Base

# Create tables on startup (SQLite by default; safe to call repeatedly)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MediKiosk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "medikiosk"}


# ── Serve the built frontend ──
DIST = Path(__file__).resolve().parent.parent.parent / "dist"

if DIST.exists():
    app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def spa(full_path: str):
        # Static files that exist (favicon, icons, ...)
        candidate = DIST / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        # SPA fallback: index.html handles client-side pages
        return FileResponse(DIST / "index.html")
