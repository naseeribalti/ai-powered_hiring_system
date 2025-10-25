#!/usr/bin/env pwsh

# AI-Powered Hiring System - Frontend Launch Script (PowerShell)
# This script will install dependencies and start the development server

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "AI-Powered Hiring System - Frontend Launcher" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[SUCCESS] Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[INFO] Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[SUCCESS] Dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "The application will open at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Make sure your backend is running on: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm start
