@echo off
echo ============================================
echo   ValueDocs Backend Deploy to Railway
echo ============================================
echo.

:: Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Railway CLI...
    npm install -g @railway/cli
)

:: Login to Railway (opens browser for 30 seconds)
echo Step 1: Login to Railway (browser will open)...
railway login

:: Initialize Railway project linked to this backend
echo.
echo Step 2: Creating Railway project...
cd backend
railway init --name valuedocs-api

:: Set environment variables
echo.
echo Step 3: Setting environment variables...

for /f "tokens=1,* delims==" %%a in (.env) do (
    if not "%%a"=="" if not "%%a:~0,1%"=="#" (
        railway variables --set "%%a=%%b"
    )
)

:: Override NODE_ENV and PORT for production
railway variables --set "NODE_ENV=production"
railway variables --set "PORT=3000"

:: Deploy
echo.
echo Step 4: Deploying...
railway up --detach

:: Get the URL
echo.
echo Step 5: Getting deployment URL...
railway domain

echo.
echo ============================================
echo   Deployment complete!
echo   Copy the URL above and update:
echo   frontend/.env: VITE_API_URL=<URL>/api
echo   Then run: cd frontend && npm run build
echo   Then run: firebase deploy --only hosting
echo ============================================
pause
