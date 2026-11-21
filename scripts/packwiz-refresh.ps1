<#
.SYNOPSIS
    Пересобирает index.toml и обновляет хеш индекса в pack.toml (аналог `packwiz refresh`).
.DESCRIPTION
    Проходит по файлам пака, считает sha256, пишет index.toml.
    Если рядом лежит scripts/file-sides.json вида { "путь/в/паке": "client" },
    для этих файлов в индекс добавляется side.
#>
param(
    [string]$Root
)

if (-not $Root) {
    if ($PSScriptRoot) { $Root = Split-Path $PSScriptRoot -Parent }
    else { $Root = (Get-Location).Path }
}

$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)

$skipDirs  = @('dist', 'scripts', '.git', '.github', 'docs', 'logs', 'crash-reports')
$skipFiles = @('pack.toml', 'index.toml', 'README.md', '.gitignore', 'LICENSE', 'CHANGELOG.md', 'pack-url.txt')
# личное/мусор, которое не должно уезжать игрокам
$skipPatterns = @('config/CSC/*', 'config/jei/server/*', 'config/jei/world/*', '*.log')

$sideMap = @{}
$sideFile = Join-Path $Root 'scripts\file-sides.json'
if (Test-Path $sideFile) {
    $j = Get-Content $sideFile -Raw | ConvertFrom-Json
    foreach ($p in $j.PSObject.Properties) { $sideMap[$p.Name] = $p.Value }
}

$entries = New-Object System.Collections.ArrayList
Get-ChildItem -Path $Root -Recurse -File -Force | ForEach-Object {
    $rel = $_.FullName.Substring($Root.Length + 1).Replace('\', '/')
    $top = ($rel -split '/')[0]
    if ($skipDirs -contains $top) { return }
    if ($skipFiles -contains $rel) { return }
    foreach ($sp in $skipPatterns) { if ($rel -like $sp) { return } }

    $hash = (Get-FileHash -Path $_.FullName -Algorithm SHA256).Hash.ToLower()
    $isMeta = $rel.EndsWith('.pw.toml')
    $side = $null
    if ($sideMap.ContainsKey($rel)) { $side = $sideMap[$rel] }
    [void]$entries.Add([pscustomobject]@{ Rel = $rel; Hash = $hash; Meta = $isMeta; Side = $side })
}

$sorted = $entries | Sort-Object Rel

$sb = New-Object System.Text.StringBuilder
[void]$sb.Append("hash-format = `"sha256`"`n")
foreach ($e in $sorted) {
    [void]$sb.Append("`n[[files]]`n")
    [void]$sb.Append("file = `"$($e.Rel)`"`n")
    [void]$sb.Append("hash = `"$($e.Hash)`"`n")
    if ($e.Meta) { [void]$sb.Append("metafile = true`n") }
    if ($e.Side) { [void]$sb.Append("side = `"$($e.Side)`"`n") }
}

$indexPath = Join-Path $Root 'index.toml'
[System.IO.File]::WriteAllText($indexPath, $sb.ToString(), $enc)
$indexHash = (Get-FileHash -Path $indexPath -Algorithm SHA256).Hash.ToLower()

$packPath = Join-Path $Root 'pack.toml'
$pack = [System.IO.File]::ReadAllText($packPath)
$pack = [regex]::Replace($pack, '(?m)^hash = "[^"]*"', "hash = `"$indexHash`"")
[System.IO.File]::WriteAllText($packPath, $pack, $enc)

Write-Host ("index.toml: {0} файлов, sha256 {1}" -f $sorted.Count, $indexHash)
