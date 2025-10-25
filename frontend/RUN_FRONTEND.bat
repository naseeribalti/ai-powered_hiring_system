@echo off
REM AI-Powered Hiring System - Frontend Launch Script
REM This script will install dependencies and start the development server

echo.
echo ============================================
echo AI-Powered Hiring System - Frontend Launcher
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [SUCCESS] Node.js is installed
node --version

echo.
echo [INFO] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencies installed!
echo.
echo [INFO] Starting development server...
echo.
echo The application will open at: http://localhost:3000
echo.
echo Make sure your backend is running on: http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
