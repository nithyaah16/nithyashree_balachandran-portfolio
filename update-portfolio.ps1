# Quick Portfolio Update Script (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Quick Portfolio Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if this is a git repository
if (-not (Test-Path ".git")) {
    Write-Host "✗ ERROR: This is not a git repository yet." -ForegroundColor Red
    Write-Host "Please run the initial setup first or use deploy.ps1" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Current changes:" -ForegroundColor Yellow
git status --porcelain

Write-Host ""
$commitMessage = Read-Host "Enter a brief description of your changes"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Updated portfolio content"
}

Write-Host ""
Write-Host "Step 1: Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host "Step 2: Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push
    $pushSuccess = $true
} catch {
    $pushSuccess = $false
}

if (-not $pushSuccess) {
    Write-Host ""
    Write-Host "✗ ERROR: Failed to push changes" -ForegroundColor Red
    Write-Host "Please check your internet connection and GitHub permissions" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   SUCCESS! Portfolio Updated" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Your changes have been pushed to GitHub!" -ForegroundColor Green
Write-Host "✓ Netlify will automatically update your live site in 1-2 minutes." -ForegroundColor Green
Write-Host ""
Write-Host "Your live site: https://yoursite.netlify.app" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"