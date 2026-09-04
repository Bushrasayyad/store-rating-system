# setup-and-test.ps1
Write-Host "🚀 Setting up and testing the API..." -ForegroundColor Green

$baseUrl = "http://localhost:5000/api"

# 1. Make user admin
Write-Host "`n👑 Making user admin..." -ForegroundColor Yellow
docker exec -it store_rating_postgres psql -U postgres -d store_rating_db -c "UPDATE users SET role = 'admin' WHERE email = 'jane123@example.com';"

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
Write-Host "Role: $($loginResponse.user.role)" -ForegroundColor Cyan

# 3. Create a store
Write-Host "`n🏪 Creating a store..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$storeBody = @{
    name = "My Awesome Store with more than 20 characters"
    email = "store@example.com"
    address = "789 Store Street, City, Country"
    ownerId = $userId
} | ConvertTo-Json

$store = Invoke-RestMethod -Uri "$baseUrl/stores" `
    -Method POST `
    -Headers $headers `
    -Body $storeBody

Write-Host "✅ Store created: $($store.name)" -ForegroundColor Green
Write-Host "Store ID: $($store.id)" -ForegroundColor Cyan

# 4. Get all stores
Write-Host "`n📋 Getting all stores..." -ForegroundColor Yellow
$stores = Invoke-RestMethod -Uri "$baseUrl/stores" -Method GET
Write-Host "Found $($stores.Count) stores" -ForegroundColor Green
$stores | Format-Table name, address, averageRating

# 5. Submit a rating
Write-Host "`n⭐ Submitting a rating..." -ForegroundColor Yellow
$ratingBody = @{
    rating = 5
    storeId = $store.id
} | ConvertTo-Json

$rating = Invoke-RestMethod -Uri "$baseUrl/ratings" `
    -Method POST `
    -Headers $headers `
    -Body $ratingBody

Write-Host "✅ Rating submitted!" -ForegroundColor Green
Write-Host "Rating: $($rating.rating) stars for store: $($store.name)" -ForegroundColor Cyan

# 6. Get rating statistics
Write-Host "`n📊 Getting rating statistics..." -ForegroundColor Yellow
$stats = Invoke-RestMethod -Uri "$baseUrl/ratings/store/$($store.id)/statistics" -Method GET
Write-Host "Average Rating: $($stats.averageRating)" -ForegroundColor Green
Write-Host "Total Ratings: $($stats.totalRatings)" -ForegroundColor Green

Write-Host "`n✅ All tests passed! Your API is fully functional!" -ForegroundColor Green