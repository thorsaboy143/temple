@echo off
echo ========================================
echo Uploading Project to GitHub
echo ========================================
echo.

cd /d C:\Users\bhuva\Downloads\templee

echo Step 1: Checking git status...
git status
if %errorlevel% neq 0 (
    echo ERROR: Git command failed. Make sure git is installed.
    pause
    exit /b 1
)
echo.

echo Step 2: Removing .env from git tracking (if it exists)...
git rm --cached .env 2>nul
echo.

echo Step 3: Adding .gitignore changes...
git add .gitignore
if %errorlevel% neq 0 (
    echo ERROR: Failed to add .gitignore
    pause
    exit /b 1
)
echo.

echo Step 4: Committing .gitignore...
git commit -m "Update .gitignore to exclude .env file" 2>nul
echo.

echo Step 5: Adding all files...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo.

echo Step 6: Committing all files...
git commit -m "Initial commit" 2>nul
echo.

echo Step 7: Checking for existing remote...
git remote -v
echo.

echo Step 8: Removing old origin if it exists...
git remote remove origin 2>nul
echo.

echo Step 9: Adding new remote repository...
git remote add origin https://github.com/thorsaboy143/temple.git
if %errorlevel% neq 0 (
    echo ERROR: Failed to add remote
    pause
    exit /b 1
)
echo.

echo Step 10: Setting branch to main...
git branch -M main
if %errorlevel% neq 0 (
    echo ERROR: Failed to rename branch
    pause
    exit /b 1
)
echo.

echo Step 11: Pushing to GitHub...
echo.
echo IMPORTANT: You will be prompted for your GitHub credentials
echo Username: thorsaboy143
echo Password: Use your GitHub password or Personal Access Token
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Common issues:
    echo 1. Wrong credentials
    echo 2. Need Personal Access Token (if 2FA is enabled)
    echo 3. Repository already has content
    echo.
    echo To fix:
    echo - Try: git push -u origin main --force
    echo - Or get a Personal Access Token from: https://github.com/settings/tokens
    pause
    exit /b 1
)
echo.

echo ========================================
echo Upload Complete!
echo Visit: https://github.com/thorsaboy143/temple
echo ========================================
pause
