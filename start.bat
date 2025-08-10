@echo off
echo Starting WhatsApp Clone...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Frontend" cmd /k "npm run client"

echo.
echo WhatsApp Clone is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause > nul 