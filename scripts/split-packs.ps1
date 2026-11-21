<#
.SYNOPSIS
    Разделяет мастер-пак на клиентский и серверный паки (для двух отдельных репозиториев).
.DESCRIPTION
    Берёт мастер-пак (все моды + конфиги), раскладывает по side:
      client: side = client/both, config + kubejs + ресурспаки + шейдеры
      server: side = server/both, config + kubejs + defaultconfigs
    В каждом результате пересобирает index.toml.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\split-packs.ps1 `
      -Source "E:\dsh\create-mental-trauma-pack" `
      -ClientOut "E:\dsh\create-mental-trauma-client" `
      -ServerOut "E:\dsh\create-mental-trauma-server"
#>
param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$ClientOut,
    [Parameter(Mandatory = $true)][string]$ServerOut
)

$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)

function Write-Utf8($path, $text) {
    $d = Split-Path $path -Parent
    if (-not (Test-Path $d)) { New-Item -ItemType Directory $d -Force | Out-Null }
    [System.IO.File]::WriteAllText($path, ($text -replace "`r`n", "`n"), $enc)
}

$sideOverrides = @{}
$sidesFile = Join-Path $Source 'scripts\file-sides.json'
if (Test-Path $sidesFile) {
    $j = Get-Content $sidesFile -Raw | ConvertFrom-Json
    foreach ($p in $j.PSObject.Properties) { $sideOverrides[$p.Name] = $p.Value }
}

function Get-ModSide($path) {
    if ($sideOverrides.ContainsKey($path)) { return $sideOverrides[$path] }
    return 'both'
}

$packToml = [System.IO.File]::ReadAllText((Join-Path $Source 'pack.toml'))
$mcVer = [regex]::Match($packToml, '(?m)^minecraft = "([^"]+)"').Groups[1].Value
$nfVer = [regex]::Match($packToml, '(?m)^neoforge = "([^"]+)"').Groups[1].Value
$author = [regex]::Match($packToml, '(?m)^author = "([^"]*)"').Groups[1].Value
$baseName = [regex]::Match($packToml, '(?m)^name = "([^"]*)"').Groups[1].Value

$clientDirs = @('config', 'kubejs', 'resourcepacks', 'shaderpacks', 'fancymenu_data', 'defaultconfigs')
$serverDirs = @('config', 'kubejs', 'defaultconfigs')

function Build-Pack($out, $suffix, $keepSides, $dirs, $url) {
    if (Test-Path $out) {
        foreach ($m in @('mods', 'config', 'kubejs', 'resourcepacks', 'shaderpacks', 'fancymenu_data', 'defaultconfigs', 'pack.toml', 'index.toml', 'pack-url.txt')) {
            $p = Join-Path $out $m
            if (Test-Path $p) { Remove-Item $p -Recurse -Force }
        }
    }
    New-Item -ItemType Directory (Join-Path $out 'mods') -Force | Out-Null
    New-Item -ItemType Directory (Join-Path $out 'scripts') -Force | Out-Null

    $n = 0
    foreach ($f in Get-ChildItem (Join-Path $Source 'mods') -File) {
        if ($f.Name -like '*.pw.toml') {
            $t = Get-Content $f.FullName -Raw
            $side = [regex]::Match($t, '(?m)^side = "([^"]+)"').Groups[1].Value
            if (-not $side) { $side = 'both' }
            if ($keepSides -notcontains $side) { continue }
        } else {
            $side = Get-ModSide ("mods/" + $f.Name)
            if ($keepSides -notcontains $side) { continue }
        }
        Copy-Item $f.FullName (Join-Path $out "mods\$($f.Name)") -Force
        $n++
    }

    foreach ($d in $dirs) {
        $src = Join-Path $Source $d
        if (-not (Test-Path $src)) { continue }
        $dst = Join-Path $out $d
        New-Item -ItemType Directory $dst -Force | Out-Null
        Copy-Item (Join-Path $src '*') $dst -Recurse -Force
    }

    Write-Utf8 (Join-Path $out 'pack.toml') @"
name = "$baseName - $suffix"
author = "$author"
version = "1.0.0"
pack-format = "packwiz:1.1.0"

[index]
file = "index.toml"
hash-format = "sha256"
hash = "PLACEHOLDER"

[versions]
minecraft = "$mcVer"
neoforge = "$nfVer"
"@
    Write-Utf8 (Join-Path $out 'pack-url.txt') "$url`n"
    Copy-Item (Join-Path $Source 'scripts\packwiz-refresh.ps1') (Join-Path $out 'scripts\packwiz-refresh.ps1') -Force
    & (Join-Path $out 'scripts\packwiz-refresh.ps1') | Out-Null
    Write-Host ("{0}: {1} файлов в mods/" -f $suffix, $n)
}

$clientUrl = 'https://khjh-dev.github.io/create-mental-trauma-client/pack.toml'
$serverUrl = 'https://khjh-dev.github.io/create-mental-trauma-server/pack.toml'

Build-Pack $ClientOut 'Client' @('client', 'both', 'server') $clientDirs $clientUrl
Build-Pack $ServerOut 'Server' @('server', 'both') $serverDirs $serverUrl

Write-Host "клиент: $ClientOut"
Write-Host "сервер: $ServerOut"
