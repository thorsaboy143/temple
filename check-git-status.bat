@echo off
echo ========================================
echo Git Status Diagnostic
echo ========================================
echo.

cd /d C:\Users\bhuva\Downloads\templee

echo Checking if git is installed...
git --version
echo.

echo Current directory:
cd
echo.

echo Checking git status...
git status
echo.

echo Checking remote repositories...
git remote -v
echo.

echo Checking current branch...
git branch
echo.

echo Checking git log (last 3 commits)...
git log --oneline -3
echo.

echo ========================================
pause
