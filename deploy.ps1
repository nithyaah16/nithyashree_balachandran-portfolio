# Space Portfolio Deployment Script (PowerShell)
# This script helps you deploy your portfolio to GitHub Pages

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Space Portfolio Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version 2>$null
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow
git init

Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "Step 3: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial space portfolio deployment"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   IMPORTANT: Setup Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
Write-Host "   - Repository name should be: yourusername.github.io" -ForegroundColor Gray
Write-Host "   - Make it public" -ForegroundColor Gray
Write-Host "   - Don't initialize with README (we already have one)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Copy the repository URL from GitHub" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "✗ ERROR: Repository URL cannot be empty" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Adding GitHub remote..." -ForegroundColor Yellow
git remote add origin $repoUrl

Write-Host "Step 5: Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main

try {
    git push -u origin main
    $pushSuccess = $true
} catch {
    $pushSuccess = $false
}

if (-not $pushSuccess) {
    Write-Host ""
    Write-Host "✗ ERROR: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your repository URL and permissions" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   SUCCESS! Deployment Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Your portfolio has been deployed to GitHub!" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to your GitHub repository" -ForegroundColor White
Write-Host "2. Click on 'Settings' tab" -ForegroundColor White
Write-Host "3. Scroll down to 'Pages' section" -ForegroundColor White
Write-Host "4. Under 'Source', select 'Deploy from a branch'" -ForegroundColor White
Write-Host "5. Select 'main' branch and '/ (root)' folder" -ForegroundColor White
Write-Host "6. Click 'Save'" -ForegroundColor White
Write-Host ""

Write-Host "Your website will be available at:" -ForegroundColor Cyan
Write-Host "https://yourusername.github.io" -ForegroundColor Yellow
Write-Host ""
Write-Host "(Replace 'yourusername' with your actual GitHub username)" -ForegroundColor Gray
Write-Host ""

Write-Host "Don't forget to:" -ForegroundColor Cyan
Write-Host "- Add your profile picture to assets/images/profile.jpg" -ForegroundColor White
Write-Host "- Add your resume to assets/resume.pdf" -ForegroundColor White
Write-Host "- Update your contact information in index.html" -ForegroundColor White
Write-Host "- Replace project images with your actual project screenshots" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"