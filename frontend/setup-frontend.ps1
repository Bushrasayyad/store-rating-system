# setup-frontend.ps1
Write-Host "🚀 Setting up Frontend..." -ForegroundColor Green

cd C:\Users\mubushera\store-rating-app\frontend

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
npm run dev