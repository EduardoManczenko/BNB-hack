Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
$job = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    node server.js
}

Start-Sleep -Seconds 3

Write-Host "`n🧪 Testando API..." -ForegroundColor Yellow

# Test Health
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get
    Write-Host "✅ Health Check: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check falhou: $_" -ForegroundColor Red
    Stop-Job $job
    Remove-Job $job
    exit 1
}

# Test Balance
Write-Host "`n💰 Testando Balance..." -ForegroundColor Yellow
try {
    $balance = Invoke-RestMethod -Uri "http://localhost:3001/api/balance" -Method Get
    if ($balance.success) {
        Write-Host "✅ Saldo encontrado: $$($balance.totalBalance)" -ForegroundColor Green
        Write-Host "📊 Moedas: $($balance.balances.Count)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erro: $($balance.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Balance falhou: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Resposta: $responseBody" -ForegroundColor Yellow
    }
}

$jobId = $job.Id
Write-Host "`n✅ Servidor rodando em background (Job ID: $jobId)" -ForegroundColor Green
Write-Host "Para parar, execute: Stop-Job $jobId; Remove-Job $jobId" -ForegroundColor Cyan

