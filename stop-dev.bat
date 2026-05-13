@echo off
echo ========================================
echo   Stopping NEXUS Platform
echo ========================================
echo.

echo Stopping Docker services...
docker-compose down
echo ✓ Docker services stopped
echo.

echo Killing Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node processes stopped
) else (
    echo No Node processes running
)
echo.

echo ========================================
echo   All services stopped
echo ========================================
pause
