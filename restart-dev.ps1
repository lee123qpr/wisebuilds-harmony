# PowerShell script to restart the development server
Write-Host "Stopping any running dev servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "vite" } | Stop-Process -Force

Write-Host "Starting development server..." -ForegroundColor Green
npm run dev 