# full-test.ps1 - Complete API Testing
Write-Host "🚀 Testing Store Rating API" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

$baseUrl = "http://localhost:5000/api"

# 1. Get all stores
Write-Host "`n📋 Getting all stores..." -ForegroundColor Yellow
$stores = Invoke-RestMethod -Uri "$baseUrl/stores" -Method GET
Write-Host "Found $($stores.Count) stores" -ForegroundColor Green
$stores | Format-Table name, address, averageRating

# 2. Login
Write-Host "`n🔐 Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "jane123@example.com"
    password = "TestPassword123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json"

$token = $loginResponse.token
$userId = $loginResponse.user.id
Write-Host "✅ Logged in as: $($loginResponse.user.name)" -ForegroundColor Green

# 3. Get user's ratings
Write-Host "`n⭐ Getting your ratings..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $token" }
$ratings = Invoke-RestMethod -Uri "$baseUrl/ratings/user" -Method GET -Headers $headers
Write-Host "You have $($ratings.Count) ratings" -ForegroundColor Green

# 4. If no stores exist, create one (if admin)
if ($stores.Count -eq 0) {
    Write-Host "`n📝 No stores found. Creating a store..." -ForegroundColor Yellow
    
    # Check if user is admin
    if ($loginResponse.user.role -eq "admin") {
        $storeBody = @{
            name = "Test Store with more than 20 characters"
            email = "teststore@example.com"
            address = "123 Test Street, City, Country"
            ownerId = $userId
        } | ConvertTo-Json
        
        $newStore = Invoke-RestMethod -Uri "$baseUrl/stores" `
            -Method POST `
            -Headers $headers `
            -Body $storeBody
        
        Write-Host "✅ Store created: $($newStore.name)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ You need admin role to create stores" -ForegroundColor Yellow
        Write-Host "Run this command to make yourself admin:" -ForegroundColor Cyan
        Write-Host "docker exec -it store_rating_postgres psql -U postgres -d store_rating_db -c `"UPDATE users SET role = 'admin' WHERE email = 'jane123@example.com';`"" -ForegroundColor White
    }
}

Write-Host "`n✅ Testing complete!" -ForegroundColor Green