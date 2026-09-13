import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
from db.database import Base, engine
from db.seed import seed_demo_users
from api.auth import router as auth_router
from api.registrations import router as registrations_router
from api.encounters import router as encounters_router
from api.documents import router as documents_router
from api.summary import router as summary_router
from api.doctor import router as doctor_router
from api.patients import router as patients_router

Base.metadata.create_all(bind=engine)
seed_demo_users()

app = FastAPI(
    title="MediKiosk API",
    version="1.0.0",
    description="AI-assisted patient case-taking and clinical record management API."
)

allowed = os.getenv("CORS_ORIGINS", "*")
origins = [x.strip() for x in allowed.split(",")] if allowed != "*" else ["*"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=allowed != "*",
    allow_methods=["*"], allow_headers=["*"]
)

app.include_router(auth_router, prefix="/api")
app.include_router(registrations_router, prefix="/api")
app.include_router(encounters_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(summary_router, prefix="/api")
app.include_router(doctor_router, prefix="/api")
app.include_router(patients_router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "medikiosk-api", "version": "1.0.0"}

# If the React build exists, FastAPI can serve the built SPA after API routes.
frontend_dist = Path(__file__).resolve().parent.parent / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
