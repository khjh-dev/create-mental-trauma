<#
.SYNOPSIS
    Собирает/обновляет packwiz-пак из готового инстанса PrismLauncher.
.DESCRIPTION
    1. Хеширует все jar'ы в <Instance>\minecraft\mods
    2. Ищет их на Modrinth по sha512 -> делает метаданные (автообновляемые)
    3. Что не нашлось — копирует в пак как файл (кастомные сборки)
    4. Копирует config / kubejs / resourcepacks / shaderpacks
    5. Пересобирает index.toml
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\import-instance.ps1 -Instance "C:\Users\smeta\AppData\Roaming\PrismLauncher\instances\Create- Mental Trauma"
#>
param(
    [Parameter(Mandatory = $true)][string]$Instance,
    [string]$Out,
    [string]$McVersion = '1.21.1',
    [string]$NeoForgeVersion,
    [string[]]$ForceClient = @('Fog-neoforge', 'Fractal Lightning', 'FoggyBorder', 'ImmersiveThunder', 'planetarium', 'bc_particle', 'pulse-trims'),
    [switch]$NoRefresh
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

if (-not $Out) {
    if ($PSScriptRoot) { $Out = Split-Path $PSScriptRoot -Parent } else { $Out = (Get-Location).Path }
}
$mcDir = Join-Path $Instance 'minecraft'
if (-not (Test-Path $mcDir)) { throw "Не нашёл $mcDir — проверьте путь к инстансу" }

$enc = New-Object System.Text.UTF8Encoding($false)
function Write-Utf8($path, $text) {
    $d = Split-Path $path -Parent
    if (-not (Test-Path $d)) { New-Item -ItemType Directory $d -Force | Out-Null }
    [System.IO.File]::WriteAllText($path, ($text -replace "`r`n", "`n"), $enc)
}
function Esc($s) { ($s -replace '\\', '\\\\') -replace '"', '\"' }
$hdrs = @{'User-Agent' = 'create-mental-trauma-pack/1.0'}
$api = 'https://api.modrinth.com/v2'

# --- 0. версия NeoForge из mmc-pack.json, если не задана ---
if (-not $NeoForgeVersion) {
    $mmc = Join-Path $Instance 'mmc-pack.json'
    if (Test-Path $mmc) {
        $j = Get-Content $mmc -Raw | ConvertFrom-Json
        $comp = $j.components | Where-Object { $_.uid -eq 'net.neoforged' } | Select-Object -First 1
        if ($comp) { $NeoForgeVersion = $comp.version }
    }
    if (-not $NeoForgeVersion) { throw 'Не смог определить версию NeoForge, передайте -NeoForgeVersion' }
}

# --- 1. хеши ---
$jars = Get-ChildItem (Join-Path $mcDir 'mods') -Filter *.jar -File
Write-Host "jar'ов в инстансе: $($jars.Count)"
$byHash = [ordered]@{}
$failed = @()
foreach ($j in $jars) {
    try {
        $h = (Get-FileHash $j.FullName -Algorithm SHA512 -ErrorAction Stop).Hash.ToLower()
        if (-not $byHash.Contains($h)) { $byHash[$h] = $j.Name }
    } catch { $failed += $j.Name }
}

# --- 2. поиск на Modrinth ---
$found = @{}
$hashes = @($byHash.Keys)
for ($i = 0; $i -lt $hashes.Count; $i += 100) {
    $end = [Math]::Min($i + 99, $hashes.Count - 1)
    $body = @{ hashes = @($hashes[$i..$end]); algorithm = 'sha512' } | ConvertTo-Json -Compress
    $r = Invoke-RestMethod "$api/version_files" -Method Post -Body $body -ContentType 'application/json' -Headers $hdrs -TimeoutSec 120
    foreach ($pr in $r.PSObject.Properties) { $found[$pr.Name] = $pr.Value }
}
Write-Host "опознано на Modrinth: $($found.Count) из $($byHash.Count)"

# --- 3. метаданные проектов (нужны client_side/server_side) ---
$ids = @($found.Values | ForEach-Object { $_.project_id } | Sort-Object -Unique)
$projects = @{}
for ($i = 0; $i -lt $ids.Count; $i += 50) {
    $end = [Math]::Min($i + 49, $ids.Count - 1)
    $arr = @($ids[$i..$end]) | ConvertTo-Json -Compress
    $r = Invoke-RestMethod "$api/projects?ids=$([uri]::EscapeDataString($arr))" -Headers $hdrs -TimeoutSec 120
    foreach ($p in $r) { $projects[$p.id] = $p }
}

# --- 4. чистим управляемое содержимое пака ---
foreach ($m in @('mods', 'config', 'kubejs', 'resourcepacks', 'shaderpacks', 'fancymenu_data', 'defaultconfigs')) {
    $p = Join-Path $Out $m
    if (Test-Path $p) { Remove-Item $p -Recurse -Force }
}
New-Item -ItemType Directory (Join-Path $Out 'mods') -Force | Out-Null

# --- 5. метаданные модов ---
$modCount = 0
foreach ($prop in $found.GetEnumerator()) {
    $v = $prop.Value
    $p = $projects[$v.project_id]
    if (-not $p) { continue }
    $file = $v.files | Where-Object { $_.primary } | Select-Object -First 1
    if (-not $file) { $file = $v.files | Where-Object { $_.filename -like '*.jar' } | Select-Object -First 1 }
    if (-not $file) { continue }

    $side = 'both'
    if ($p.server_side -eq 'unsupported') { $side = 'client' }
    elseif ($p.client_side -eq 'unsupported') { $side = 'server' }
    foreach ($pat in $ForceClient) { if ($file.filename -like "$pat*") { $side = 'client' } }

    Write-Utf8 (Join-Path $Out "mods\$($p.slug).pw.toml") @"
name = "$(Esc $v.name)"
filename = "$(Esc $file.filename)"
side = "$side"

[download]
hash-format = "sha512"
hash = "$($file.hashes.sha512)"
url = "$($file.url)"

[update]
[update.modrinth]
mod-id = "$($v.project_id)"
version = "$($v.id)"
"@
    $modCount++
}

# --- 6. кастомные jar'ы файлами ---
$custom = 0
foreach ($h in $byHash.Keys) {
    if ($found.ContainsKey($h)) { continue }
    $name = $byHash[$h]
    Copy-Item (Join-Path "$mcDir\mods" $name) (Join-Path $Out "mods\$name") -Force
    $custom++
}

# --- 7. контент ---
foreach ($d in @('config', 'kubejs', 'resourcepacks', 'shaderpacks', 'fancymenu_data', 'defaultconfigs')) {
    $src = Join-Path $mcDir $d
    if (-not (Test-Path $src)) { continue }
    $dst = Join-Path $Out $d
    New-Item -ItemType Directory $dst -Force | Out-Null
    Copy-Item (Join-Path $src '*') $dst -Recurse -Force
}

# --- 8. pack.toml (имя/автора сохраняем, если пак уже был) ---
$packPath = Join-Path $Out 'pack.toml'
$packName = 'Create: Mental Trauma'
$packAuthor = 'smeta'
$packVersion = '1.0.0'
if (Test-Path $packPath) {
    $old = [System.IO.File]::ReadAllText($packPath)
    $m = [regex]::Match($old, '(?m)^name = "([^"]*)"'); if ($m.Success) { $packName = $m.Groups[1].Value }
    $m = [regex]::Match($old, '(?m)^author = "([^"]*)"'); if ($m.Success) { $packAuthor = $m.Groups[1].Value }
    $m = [regex]::Match($old, '(?m)^version = "([^"]*)"'); if ($m.Success) { $packVersion = $m.Groups[1].Value }
}
Write-Utf8 $packPath @"
name = "$packName"
author = "$packAuthor"
version = "$packVersion"
pack-format = "packwiz:1.1.0"

[index]
file = "index.toml"
hash-format = "sha256"
hash = "PLACEHOLDER"

[versions]
minecraft = "$McVersion"
neoforge = "$NeoForgeVersion"
"@

Write-Host "модов с автообновлением: $modCount"
Write-Host "кастомных jar'ов       : $custom"
if ($failed.Count -gt 0) { Write-Warning "не удалось прочитать: $($failed -join ', ')" }
Write-Host "размер пака            : $([math]::Round(((Get-ChildItem $Out -Recurse -File | Measure-Object Length -Sum).Sum/1MB),1)) MB"

if (-not $NoRefresh) {
    & (Join-Path $PSScriptRoot 'packwiz-refresh.ps1')
}
