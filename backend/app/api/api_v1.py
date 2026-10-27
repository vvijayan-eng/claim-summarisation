from fastapi import APIRouter
from app.api.claims import router as claims_router
from app.api.documents import router as documents_router
from app.api.analytics import router as analytics_router

api_router = APIRouter()
api_router.include_router(claims_router)
api_router.include_router(documents_router)
api_router.include_router(analytics_router)
