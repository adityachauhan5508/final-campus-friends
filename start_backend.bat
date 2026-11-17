@echo off
echo ========================================================
echo Starting Smart Campus Assistant - Python FastAPI Backend
echo Port: 8000
echo ========================================================

cd /d "%~dp0"
if exist "backend\py_runtime\python.exe" (
    "backend\py_runtime\python.exe" -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
) else (
    python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
)
pause
