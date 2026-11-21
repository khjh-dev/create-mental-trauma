<#
.SYNOPSIS
    Обновляет метаданные модов в паке до последних совместимых версий.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\update-mods.ps1
    powershell -ExecutionPolicy Bypass -File scripts\update-mods.ps1 -Slug create
#>
param(
    [string]$Slug,
    [switch]$NoRefresh
)

$ErrorActionPreference = 'Stop'
if (-not $PSScriptRoot) { throw 'Запускайте как файл, а не через Invoke-Expression' }
$root = Split-Path $PSScriptRoot -Parent
$hdrs = @{'User-Agent' = 'create-mental-trauma-pack/1.0'}
$api = 'https://api.modrinth.com/v2'

$pack = Get-Content (Join-Path $root 'pack.toml') -Raw
$mc = [regex]::Match($pack, '(?m)^minecraft\s*=\s*"([^"]+)"').Groups[1].Value
$loader = $null
foreach ($c in @('neoforge', 'forge', 'fabric', 'quilt')) { if ($pack -match "(?m)^$c\s*=") { $loader = $c; break } }

$files = Get-ChildItem (Join-Path $root 'mods') -Filter *.pw.toml
if ($Slug) { $files = $files | Where-Object { $_.BaseName -eq $Slug } }
if (-not $files) { throw "Не нашёл .pw.toml для '$Slug'" }

$updated = 0
foreach ($f in $files) {
    $text = Get-Content $f.FullName -Raw
    $modId = [regex]::Match($text, '(?m)^mod-id\s*=\s*"([^"]+)"').Groups[1].Value
    $cur = [regex]::Match($text, '(?m)^version\s*=\s*"([^"]+)"').Groups[1].Value
    if (-not $modId) { continue }
    $side = [regex]::Match($text, '(?m)^side\s*=\s*"([^"]+)"').Groups[1].Value
    if (-not $side) { $side = 'both' }

    try {
        $uri = "$api/project/$modId/version?loaders=%5B%22$loader%22%5D&game_versions=%5B%22$mc%22%5D"
        $versions = Invoke-RestMethod $uri -Headers $hdrs -TimeoutSec 60
    } catch { Write-Warning "$($f.BaseName): ошибка запроса"; continue }
    if (-not $versions -or @($versions).Count -eq 0) { continue }

    $latest = @($versions) | Sort-Object { [datetime]$_.date_published } | Select-Object -Last 1
    if ($latest.id -eq $cur) { continue }

    $file = $latest.files | Where-Object { $_.primary } | Select-Object -First 1
    if (-not $file) { $file = $latest.files | Where-Object { $_.filename -like '*.jar' } | Select-Object -First 1 }
    if (-not $file) { continue }

    $name = $latest.name -replace '\\', '\\\\' -replace '"', '\"'
    $toml = @"
name = "$name"
filename = "$($file.filename)"
side = "$side"

[download]
hash-format = "sha512"
hash = "$($file.hashes.sha512)"
url = "$($file.url)"

[update]
[update.modrinth]
mod-id = "$modId"
version = "$($latest.id)"
"@
    [System.IO.File]::WriteAllText($f.FullName, ($toml -replace "`r`n", "`n"), (New-Object System.Text.UTF8Encoding($false)))
    Write-Host ("обновлён {0}: {1}" -f $f.BaseName, $latest.version_number)
    $updated++
}

Write-Host "обновлено: $updated"
if ($updated -gt 0 -and -not $NoRefresh) { & (Join-Path $PSScriptRoot 'packwiz-refresh.ps1') }
