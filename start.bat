@echo off
TITLE ClaimAssure AI - Local Launcher
echo ===================================================
echo Starting ClaimAssure AI (Local Mode - No Docker Required)
echo ===================================================

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "ClaimAssure Backend" cmd /k "cd backend && (if not exist venv (python -m venv venv)) && call venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching React Frontend on http://localhost:3000 ...
start "ClaimAssure Frontend" cmd /k "cd frontend && (if not exist node_modules (npm install)) && npm run dev"

echo ===================================================
echo Applications are starting in two separate windows!
echo - Adjuster UI:  http://localhost:3000
echo - Swagger Docs: http://localhost:8000/docs
echo ===================================================
