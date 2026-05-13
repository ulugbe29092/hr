@echo off
echo ========================================
echo   NEXUS Platform - Local Development
echo ========================================
echo.

echo [1/5] Starting Docker services...
docker-compose up -d postgres redis elasticsearch
if %errorlevel% neq 0 (
    echo ERROR: Docker services failed to start
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)
echo ✓ Docker services started
echo.

echo [2/5] Waiting for database to be ready...
timeout /t 5 /nobreak >nul
echo ✓ Database ready
echo.

echo [3/5] Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Backend npm install failed
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)
cd ..
echo ✓ Backend dependencies ready
echo.

echo [4/5] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Frontend npm install failed
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)
cd ..
echo ✓ Frontend dependencies ready
echo.

echo [5/5] Starting development servers...
echo.
echo ========================================
echo   Services are starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001/api
echo API Docs: http://localhost:3001/api/docs
echo.
echo Press Ctrl+C to stop all services
echo ========================================
echo.

start "NEXUS Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak >nul
start "NEXUS Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✓ Development servers started in separate windows
echo.
pause
