<#
.SYNOPSIS
    Собирает zip-инстанс для PrismLauncher / PolyMC / ElyPrismLauncher
    с уже прописанной pre-launch командой обновления.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\build-client-zip.ps1
#>
param(
    [string]$Url,
    [string]$OutFile
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $root 'dist'
New-Item -ItemType Directory $dist -Force | Out-Null

if (-not $Url) { $Url = (Get-Content (Join-Path $root 'pack-url.txt') -Raw).Trim() }
if ($Url -like '*CHANGE-ME*') {
    throw 'В pack-url.txt заглушка. Укажите адрес, по которому доступен pack.toml (например https://nick.github.io/repo/pack.toml).'
}

$pack = Get-Content (Join-Path $root 'pack.toml') -Raw
$mc = [regex]::Match($pack, '(?m)^minecraft\s*=\s*"([^"]+)"').Groups[1].Value
$nf = [regex]::Match($pack, '(?m)^neoforge\s*=\s*"([^"]+)"').Groups[1].Value
if (-not $nf) { throw 'В pack.toml нет версии neoforge' }

$bootstrap = Join-Path $dist 'packwiz-installer-bootstrap.jar'
$installer = Join-Path $dist 'packwiz-installer.jar'
if (-not (Test-Path $bootstrap)) {
    Invoke-WebRequest 'https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar' -OutFile $bootstrap -UseBasicParsing
}
if (-not (Test-Path $installer)) {
    Invoke-WebRequest 'https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar' -OutFile $installer -UseBasicParsing
}

$stage = Join-Path $dist 'client-build'
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
$mcDir = Join-Path $stage '.minecraft'
New-Item -ItemType Directory $mcDir -Force | Out-Null

$enc = New-Object System.Text.UTF8Encoding($false)
$cmd = '"$INST_JAVA" -jar packwiz-installer-bootstrap.jar --bootstrap-main-jar packwiz-installer.jar --bootstrap-no-update ' + $Url

$instanceCfg = @"
InstanceType=OneSix
iconKey=default
name=Create Mental Trauma
OverrideMemory=true
MinMemAlloc=4096
MaxMemAlloc=8192
OverrideJavaArgs=false
OverrideCommands=true
PreLaunchCommand=$cmd
"@
[System.IO.File]::WriteAllText((Join-Path $stage 'instance.cfg'), ($instanceCfg -replace "`r`n", "`n"), $enc)

$mmc = @"
{
    "formatVersion": 1,
    "components": [
        { "uid": "net.minecraft", "version": "$mc", "important": true },
        { "uid": "net.neoforged", "version": "$nf", "important": true }
    ]
}
"@
[System.IO.File]::WriteAllText((Join-Path $stage 'mmc-pack.json'), ($mmc -replace "`r`n", "`n"), $enc)

Copy-Item $bootstrap $mcDir
Copy-Item $installer $mcDir

$readme = @"
Create: Mental Trauma — инстанс для PrismLauncher / PolyMC / ElyPrismLauncher

1. Add Instance -> Import from zip -> выберите этот архив.
2. Запустите игру. Перед запуском сборка сама докачает нужные моды
   (первый запуск долгий: качается около 450 МБ).
3. Дальше обновления прилетают автоматически при каждом запуске игры.

Если pre-launch команда не подхватилась:
Edit Instance -> Settings -> Custom commands -> включить Custom Commands,
в поле Pre-launch command вставить:

$cmd
"@
[System.IO.File]::WriteAllText((Join-Path $stage 'README.txt'), ($readme -replace "`r`n", "`n"), $enc)

if (-not $OutFile) { $OutFile = Join-Path $dist 'Create-Mental-Trauma-prism.zip' }
if (Test-Path $OutFile) { Remove-Item $OutFile -Force }
Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $OutFile -Force
Compress-Archive -Path (Join-Path $stage '.minecraft') -DestinationPath $OutFile -Update

Write-Host "готово: $OutFile ($([math]::Round((Get-Item $OutFile).Length / 1KB, 1)) КБ)"
