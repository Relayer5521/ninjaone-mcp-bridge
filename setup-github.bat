@echo off
echo ========================================
echo NinjaOne MCP - GitHub Upload Script
echo ========================================
echo.

cd /d C:\MSP-Lab\ninjaone-mcp

echo Initializing Git repository...
git init

echo.
echo Configuring Git (update with your info)...
git config user.name "Your Name"
git config user.email "your.email@example.com"

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit - NinjaOne MCP Server"

echo.
echo ========================================
echo Repository initialized locally!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub named 'ninjaone-mcp'
echo 2. Do NOT initialize with README or .gitignore
echo 3. Run the following commands:
echo.
echo git remote add origin https://github.com/YOUR_USERNAME/ninjaone-mcp.git
echo git branch -M main
echo git push -u origin main
echo.
echo ========================================
pause
