# NinjaOne MCP - GitHub Upload Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NinjaOne MCP - GitHub Upload Script" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location C:\MSP-Lab\ninjaone-mcp

Write-Host "Initializing Git repository..." -ForegroundColor Green
git init

Write-Host ""
Write-Host "Configuring Git (update with your info)..." -ForegroundColor Green
git config user.name "Your Name"
git config user.email "your.email@example.com"

Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Green
git commit -m "Initial commit - NinjaOne MCP Server"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Repository initialized locally!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a new repository on GitHub named 'ninjaone-mcp'" -ForegroundColor White
Write-Host "2. Do NOT initialize with README or .gitignore" -ForegroundColor White
Write-Host "3. Run the following commands:" -ForegroundColor White
Write-Host ""
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/ninjaone-mcp.git" -ForegroundColor Cyan
Write-Host "git branch -M main" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
