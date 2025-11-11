@echo off
echo ========================================
echo Uploading Project to GitHub
echo ========================================
echo.

cd /d C:\Users\bhuva\Downloads\templee

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Removing .env from git tracking...
git rm --cached .env
echo.

echo Step 3: Adding .gitignore changes...
git add .gitignore
git commit -m "Update .gitignore to exclude .env file"
echo.

echo Step 4: Adding all files...
git add .
git commit -m "Initial commit"
echo.

echo Step 5: Adding remote repository...
git remote add origin https://github.com/thorsaboy143/temple.git
echo.

echo Step 6: Setting branch to main...
git branch -M main
echo.

echo Step 7: Pushing to GitHub...
echo You will be prompted for your GitHub credentials...
git push -u origin main
echo.

echo ========================================
echo Upload Complete!
echo Visit: https://github.com/thorsaboy143/temple
echo ========================================
pause
