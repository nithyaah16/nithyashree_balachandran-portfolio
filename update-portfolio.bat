@echo off
echo ========================================
echo   Quick Portfolio Update Script
echo ========================================
echo.

REM Check if this is a git repository
if not exist ".git" (
    echo ERROR: This is not a git repository yet.
    echo Please run the initial setup first or use deploy.bat
    pause
    exit /b 1
)

echo Current changes:
git status --porcelain

echo.
set /p commit_message="Enter a brief description of your changes: "

if "%commit_message%"=="" (
    set commit_message=Updated portfolio content
)

echo.
echo Step 1: Adding all changes...
git add .

echo Step 2: Committing changes...
git commit -m "%commit_message%"

echo Step 3: Pushing to GitHub...
git push

if errorlevel 1 (
    echo.
    echo ERROR: Failed to push changes
    echo Please check your internet connection and GitHub permissions
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Portfolio Updated
echo ========================================
echo.
echo Your changes have been pushed to GitHub!
echo Netlify will automatically update your live site in 1-2 minutes.
echo.
echo Your live site: https://yoursite.netlify.app
echo.
pause