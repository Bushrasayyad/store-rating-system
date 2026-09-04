# start-backend.ps1
Write-Host "🚀 Starting Backend..." -ForegroundColor Green

cd C:\Users\mubushera\store-rating-app

# 1. Start PostgreSQL
Write-Host "Starting PostgreSQL..." -ForegroundColor Yellow
docker-compose up -d

# Wait
Start-Sleep -Seconds 3

# 2. Check PostgreSQL
$result = docker exec store_rating_postgres pg_isready -U postgres
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL failed to start!" -ForegroundColor Red
}

# 3. Kill any process on port 5000
Write-Host "Cleaning port 5000..." -ForegroundColor Yellow
$pid = (netstat -ano | findstr :5000 | Select-String "LISTENING").ToString().Split()[-1]
if ($pid) { 
    taskkill /PID $pid /F
    Write-Host "✅ Killed process on port 5000" -ForegroundColor Green
}

# 4. Start Backend
Write-Host "Starting Backend..." -ForegroundColor Yellow
cd backend
npm run start:dev