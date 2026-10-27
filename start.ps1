Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting ClaimAssure AI (Local Mode - No Docker Required)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Start Backend
Write-Host "[1/2] Starting Backend (FastAPI on Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; if (-not (Test-Path 'venv')) { python -m venv venv }; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt; uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend
Write-Host "[2/2] Starting Frontend (React on Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; if (-not (Test-Path 'node_modules')) { npm install }; npm run dev"

Write-Host "`nApplications starting in background terminal windows!" -ForegroundColor Yellow
Write-Host "Adjuster Console : http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Swagger Docs : http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
