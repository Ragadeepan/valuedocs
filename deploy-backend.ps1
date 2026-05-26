# ValueDocs Backend — One-Command Railway Deploy
# Usage: .\deploy-backend.ps1 -Token "your_railway_token"
param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ValueDocs Backend → Railway Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set Railway token for this session
$env:RAILWAY_TOKEN = $Token

# Verify token works
Write-Host "`n[1/5] Verifying Railway token..." -ForegroundColor Yellow
$me = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Invalid token. Get one at: https://railway.app/account/tokens" -ForegroundColor Red
    exit 1
}
Write-Host "Logged in as: $me" -ForegroundColor Green

# Create Railway project
Write-Host "`n[2/5] Creating Railway project..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\backend"
railway init --name valuedocs-api 2>&1
Write-Host "Project created!" -ForegroundColor Green

# Load and set env vars from backend/.env
Write-Host "`n[3/5] Setting environment variables..." -ForegroundColor Yellow
$envFile = "$PSScriptRoot\backend\.env"
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $idx = $line.IndexOf("=")
        if ($idx -gt 0) {
            $key = $line.Substring(0, $idx)
            $val = $line.Substring($idx + 1)
            railway variables --set "$key=$val" 2>&1 | Out-Null
            Write-Host "  Set $key" -ForegroundColor DarkGray
        }
    }
}
railway variables --set "NODE_ENV=production" 2>&1 | Out-Null
railway variables --set "FRONTEND_URL=https://valuedocs-web1.web.app" 2>&1 | Out-Null
Write-Host "All env vars set!" -ForegroundColor Green

# Deploy
Write-Host "`n[4/5] Deploying backend..." -ForegroundColor Yellow
railway up --detach
Write-Host "Deployed!" -ForegroundColor Green

# Generate public domain
Write-Host "`n[5/5] Generating public URL..." -ForegroundColor Yellow
$domain = railway domain 2>&1
Write-Host "Backend URL: $domain" -ForegroundColor Cyan

# Update frontend .env
Write-Host "`nUpdating frontend/.env with backend URL..." -ForegroundColor Yellow
$frontendEnv = "$PSScriptRoot\frontend\.env"
$apiUrl = "https://$domain/api"
(Get-Content $frontendEnv) -replace "VITE_API_URL=.*", "VITE_API_URL=$apiUrl" | Set-Content $frontendEnv
Write-Host "  VITE_API_URL=$apiUrl" -ForegroundColor Green

# Rebuild and redeploy frontend
Write-Host "`nRebuilding frontend with live backend URL..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
npm run build 2>&1 | Select-String "built in|error"

Set-Location "$PSScriptRoot"
firebase deploy --only hosting 2>&1 | Select-String "complete|error"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   FULLY DEPLOYED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: https://valuedocs-web1.web.app" -ForegroundColor Cyan
Write-Host "Backend:  https://$domain" -ForegroundColor Cyan
Write-Host "API:      $apiUrl" -ForegroundColor Cyan
Write-Host ""
