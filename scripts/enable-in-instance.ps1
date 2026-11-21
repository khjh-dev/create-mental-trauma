<#
.SYNOPSIS
    Прописывает pre-launch обновление в инстанс PrismLauncher.
.DESCRIPTION
    Делает бэкап instance.cfg, включает Custom Commands и ставит команду
    packwiz-installer-bootstrap.jar перед запуском игры.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\enable-in-instance.ps1 `
        -Instance "C:\Users\smeta\AppData\Roaming\PrismLauncher\instances\Create- Mental Trauma" `
        -Url "https://example.com/pack.toml"
#>
param(
    [Parameter(Mandatory = $true)][string]$Instance,
    [Parameter(Mandatory = $true)][string]$Url
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$cfgPath = Join-Path $Instance 'instance.cfg'
if (-not (Test-Path $cfgPath)) { throw "Нет instance.cfg в $Instance" }

$mcDir = Join-Path $Instance 'minecraft'
$bootstrap = Join-Path $root 'dist\packwiz-installer-bootstrap.jar'
$installer = Join-Path $root 'dist\packwiz-installer.jar'
New-Item -ItemType Directory (Join-Path $root 'dist') -Force | Out-Null

if (-not (Test-Path $bootstrap)) {
    Invoke-WebRequest 'https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar' -OutFile $bootstrap -UseBasicParsing
}
if (-not (Test-Path $installer)) {
    Invoke-WebRequest 'https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar' -OutFile $installer -UseBasicParsing
}
Copy-Item $bootstrap $mcDir -Force
Copy-Item $installer $mcDir -Force

Copy-Item $cfgPath "$cfgPath.bak" -Force
$cfg = [System.IO.File]::ReadAllText($cfgPath)
$cmd = '"$INST_JAVA" -jar packwiz-installer-bootstrap.jar --bootstrap-main-jar packwiz-installer.jar --bootstrap-no-update ' + $Url

if ($cfg -match '(?m)^PreLaunchCommand=') {
    $cfg = [regex]::Replace($cfg, '(?m)^PreLaunchCommand=.*$', 'PreLaunchCommand=' + $cmd)
} else {
    $cfg = $cfg.TrimEnd() + "`nPreLaunchCommand=$cmd`n"
}
if ($cfg -match '(?m)^OverrideCommands=') {
    $cfg = [regex]::Replace($cfg, '(?m)^OverrideCommands=.*$', 'OverrideCommands=true')
} else {
    $cfg = $cfg.TrimEnd() + "`nOverrideCommands=true`n"
}
[System.IO.File]::WriteAllText($cfgPath, $cfg, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "готово: $cfgPath (бэкап рядом: instance.cfg.bak)"
Write-Host "команда: $cmd"
