@echo off
echo ========================================
echo   Space Portfolio Deployment Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo Step 1: Initializing Git repository...
git init

echo Step 2: Adding all files...
git add .

echo Step 3: Creating initial commit...
git commit -m "Initial space portfolio deployment"

echo.
echo ========================================
echo   IMPORTANT: Setup Instructions
echo ========================================
echo.
echo 1. Create a new repository on GitHub
echo    - Repository name should be: yourusername.github.io
echo    - Make it public
echo    - Don't initialize with README (we already have one)
echo.
echo 2. Copy the repository URL from GitHub
echo.

set /p repo_url="Enter your GitHub repository URL: "

if "%repo_url%"=="" (
    echo ERROR: Repository URL cannot be empty
    pause
    exit /b 1
)

echo.
echo Step 4: Adding GitHub remote...
git remote add origin %repo_url%

echo Step 5: Pushing to GitHub...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Failed to push to GitHub
    echo Please check your repository URL and permissions
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Deployment Complete
echo ========================================
echo.
echo Your portfolio has been deployed to GitHub!
echo.
echo Next steps:
echo 1. Go to your GitHub repository
echo 2. Click on "Settings" tab
echo 3. Scroll down to "Pages" section
echo 4. Under "Source", select "Deploy from a branch"
echo 5. Select "main" branch and "/ (root)" folder
echo 6. Click "Save"
echo.
echo Your website will be available at:
echo https://yourusername.github.io
echo.
echo (Replace 'yourusername' with your actual GitHub username)
echo.
echo Don't forget to:
echo - Add your profile picture to assets/images/profile.jpg
echo - Add your resume to assets/resume.pdf
echo - Update your contact information in index.html
echo - Replace project images with your actual project screenshots
echo.
pause