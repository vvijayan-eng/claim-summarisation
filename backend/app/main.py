from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api.api_v1 import api_router
from app.models import *  # ensure all models are registered
from app.services.synthetic_data_generator import synthetic_generator

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed synthetic data if first run
    db = SessionLocal()
    try:
        from app.models.claim import Claim
        if db.query(Claim).count() == 0:
            print("[Startup] Database is empty. Seeding realistic synthetic insurance claims...")
            synthetic_generator.generate_seed_data(db)
            print("[Startup] Seed data generated successfully.")
    except Exception as e:
        print(f"[Startup] Seeding error: {e}")
    finally:
        db.close()
        
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description=(
        "Enterprise AI-powered claims document summarization, OCR extraction, "
        "rule validation, and explainable fraud risk detection for insurance carriers."
    ),
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router, prefix="/api")  # Convenience alias

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "azure_openai_target": settings.AZURE_OPENAI_DEPLOYMENT_NAME,
        "compliance": "HIPAA / GDPR Ready",
        "simulation_mode": settings.SIMULATION_MODE
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to ClaimAssure AI - Claims Document Summarization & Validation Platform",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
