# Helper Script to Initialize Git and Connect to GitHub
# Run this script by right-clicking and choosing 'Run with PowerShell', or inside a PowerShell terminal.

$gitCmd = "git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git was not automatically detected in your system PATH." -ForegroundColor Yellow
    $customPath = Read-Host "Enter the absolute path to your git.exe (e.g. C:\Program Files\Git\bin\git.exe)"
    if ($customPath -and (Test-Path $customPath)) {
        $gitCmd = $customPath
    } else {
        Write-Error "Invalid Git path. Please install Git (https://git-scm.com/) and run this script again."
        exit
    }
}

Write-Host "Initializing Git Repository..." -ForegroundColor Cyan
& $gitCmd init

Write-Host "Staging files (respecting .gitignore)..." -ForegroundColor Cyan
& $gitCmd add .

Write-Host "Creating initial commit..." -ForegroundColor Cyan
& $gitCmd commit -m "Initial commit: StadiumVerseAI Match-Day Companion"

$remoteUrl = Read-Host "Enter your newly created GitHub repository remote URL (e.g. https://github.com/username/stadiumverse-ai.git)"
if ($remoteUrl) {
    # Check if origin already exists and remove if necessary
    $existingRemote = & $gitCmd remote | Where-Object { $_ -eq "origin" }
    if ($existingRemote) {
        & $gitCmd remote remove origin
    }
    
    & $gitCmd remote add origin $remoteUrl
    Write-Host "`nGit setup complete!" -ForegroundColor Green
    Write-Host "Repository connected to origin remote: $remoteUrl" -ForegroundColor Green
    Write-Host "`nTo push to GitHub when ready, run:" -ForegroundColor Cyan
    Write-Host "git branch -M main" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
} else {
    Write-Host "No remote URL provided. Local Git repository initialized successfully." -ForegroundColor Yellow
}
