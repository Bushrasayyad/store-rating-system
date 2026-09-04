# check-backend.ps1
Write-Host "🔍 Checking Backend Status..." -ForegroundColor Yellow

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api" -Method GET -TimeoutSec 2
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Start the backend by running:" -ForegroundColor Yellow
    Write-Host "cd C:\Users\mubushera\store-rating-app\backend" -ForegroundColor White
    Write-Host "npm run start:dev" -ForegroundColor White
    exit
}

# Try to register
Write-Host "`n📝 Testing registration..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "test$timestamp@example.com"

$body = @{
    name = "Test User with more than 20 characters"
    email = $email
    address = "123 Test Street, City, Country"
    password = "TestPassword123!"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 5
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "User: $($registerResponse.user.name)" -ForegroundColor Cyan
    Write-Host "Email: $($registerResponse.user.email)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Backend check complete!" -ForegroundColor Green