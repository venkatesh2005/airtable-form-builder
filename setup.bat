@echo off
REM Setup script for local development on Windows

echo Setting up Airtable Form Builder...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Backend setup
echo.
echo Setting up backend...
cd backend

if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please edit backend\.env with your configuration
)

echo Installing backend dependencies...
call npm install

cd ..

REM Frontend setup
echo.
echo Setting up frontend...
cd frontend

if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your Airtable OAuth credentials and MongoDB URI
echo 2. Start MongoDB (if running locally)
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend: cd frontend ^&^& npm start
echo.
echo Visit http://localhost:3000 to use the application
pause
