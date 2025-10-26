@echo off
echo ============================================
echo ML Service - Error Checker and Setup
echo ============================================
echo.

REM Navigate to the correct directory
cd /d "%~dp0"

echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ ERROR: Python not found!
    echo   Please install Python 3.8+ from https://www.python.org/downloads/
    echo   Make sure to check "Add to PATH" during installation!
    pause
    exit /b 1
)
python --version
echo ✓ Python found
echo.

echo [2/5] Checking virtual environment...
if not exist "venv\" (
    echo   Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ✗ ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment exists
)
echo.

echo [3/5] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ✗ ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment activated
echo.

echo [4/5] Checking/Installing Python packages...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo   Installing required packages...
    echo   This will take 2-3 minutes on first run...
    echo.
    pip install -r requirements.txt
    if errorlevel 1 (
        echo.
        echo ✗ ERROR: Failed to install packages
        echo   Try running: pip install -r requirements.txt
        pause
        exit /b 1
    )
    echo.
    echo ✓ All packages installed
) else (
    echo ✓ Packages already installed
)
echo.

echo [5/5] Running import tests...
python check_imports.py
if errorlevel 1 (
    echo.
    echo ✗ ERROR: Import test failed
    echo   Check the error messages above
    pause
    exit /b 1
)
echo.

echo ============================================
echo ✓ All checks passed!
echo ============================================
echo.
echo Your ML service is ready to run!
echo.
echo To start the service, run:
echo   python app.py
echo.
echo Or use the automated script:
echo   start-ml-service.bat
echo.
pause
