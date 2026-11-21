# Синхронизирует серверную часть пака и запускает сервер.
# Запускать из папки сервера:  powershell -ExecutionPolicy Bypass -File ..\scripts\start-server.ps1 -ServerJar server.jar
param(
    [string]$Url,
    [string]$ServerJar,
    [string]$JavaArgs = '-Xmx8G',
    [switch]$SkipUpdate
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $root 'dist'
if (-not (Test-Path $dist)) { New-Item -ItemType Directory $dist -Force | Out-Null }

if (-not $Url) {
    $urlFile = Join-Path $root 'pack-url.txt'
    if (-not (Test-Path $urlFile)) { throw 'Не найден pack-url.txt и не передан -Url' }
    $Url = (Get-Content $urlFile -Raw).Trim()
}
if ($Url -like '*CHANGE-ME*') { throw 'В pack-url.txt заглушка. Укажите реальный адрес pack.toml.' }

$bootstrap = Join-Path $dist 'packwiz-installer-bootstrap.jar'
$installer = Join-Path $dist 'packwiz-installer.jar'

if (-not (Test-Path $bootstrap)) {
    Write-Host 'Скачиваю packwiz-installer-bootstrap.jar...'
    Invoke-WebRequest 'https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar' `
        -OutFile $bootstrap -UseBasicParsing
}
if (-not (Test-Path $installer)) {
    Write-Host 'Скачиваю packwiz-installer.jar...'
    try {
        Invoke-WebRequest 'https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar' -OutFile $installer -UseBasicParsing
    } catch {
        Write-Warning "Не удалось скачать packwiz-installer.jar: $($_.Exception.Message)"
    }
}

if (-not $SkipUpdate) {
    $instArgs = @()
    if (Test-Path $installer) {
        # без GitHub API: иначе 403 после 60 запросов в час с одного IP
        $instArgs += @('--bootstrap-main-jar', $installer, '--bootstrap-no-update')
    }
    $instArgs += @('-g', '-s', 'server', $Url)
    & java -jar $bootstrap @instArgs
    if ($LASTEXITCODE -ne 0) { throw "packwiz installer завершился с кодом $LASTEXITCODE" }
}

if ($ServerJar) {
    $nfArgs = Get-ChildItem 'libraries\net\neoforged\neoforge\*\win_args.txt' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($nfArgs) {
        $rel = $nfArgs.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/')
        & java $JavaArgs "@$rel" nogui
    } else {
        & java $JavaArgs -jar $ServerJar nogui
    }
}
