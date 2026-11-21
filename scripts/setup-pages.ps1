<#
.SYNOPSIS
    Публикация пака на GitHub Pages: прописывает remote, считает URL,
    вшивает его в пак, в инстанс и в клиентский zip.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\setup-pages.ps1 `
      -Remote "https://github.com/smeta/create-mental-trauma.git" `
      -Instance "C:\Users\smeta\AppData\Roaming\PrismLauncher\instances\Create- Mental Trauma"
#>
param(
    [string]$Remote,
    [string]$Instance,
    [string]$Branch = 'main',
    [switch]$NoZip
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

function Get-Git {
    $c = Get-Command git -ErrorAction SilentlyContinue
    if ($c) { return $c.Source }
    foreach ($p in @('C:\Program Files\Git\cmd\git.exe', "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe")) {
        if (Test-Path $p) { return $p }
    }
    throw 'git не найден. Установите: winget install --id Git.Git -e'
}
$git = Get-Git

if ($Remote) {
    $has = & $git remote 2>$null
    if ($has -contains 'origin') { & $git remote set-url origin $Remote } else { & $git remote add origin $Remote }
}

$origin = (& $git remote get-url origin 2>$null)
if (-not $origin) {
    throw @"
У репозитория нет remote. Создайте пустой репозиторий на GitHub и выполните:

  git remote add origin https://github.com/<логин>/<репо>.git

или запустите этот скрипт с -Remote "https://github.com/<логин>/<репо>.git"
"@
}
$origin = $origin.Trim()

$owner = $null; $repo = $null
if ($origin -match 'github\.com[:/](?<owner>[^/]+)/(?<repo>[^/]+?)(\.git)?$') {
    $owner = $Matches['owner']; $repo = $Matches['repo']
} else {
    throw "Не понял remote: $origin (ожидался github.com)"
}

$packUrl = "https://$owner.github.io/$repo/pack.toml"
Write-Host "хостинг: $packUrl"

$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $root 'pack-url.txt'), "$packUrl`n", $enc)
[System.IO.File]::WriteAllText((Join-Path $root 'scripts\prelaunch.txt'), "`"`$INST_JAVA`" -jar packwiz-installer-bootstrap.jar --bootstrap-main-jar packwiz-installer.jar --bootstrap-no-update $packUrl`n", $enc)
Write-Host 'pack-url.txt и scripts\prelaunch.txt обновлены'

if ($Instance) {
    & (Join-Path $PSScriptRoot 'enable-in-instance.ps1') -Instance $Instance -Url $packUrl
}

if (-not $NoZip) {
    & (Join-Path $PSScriptRoot 'build-client-zip.ps1') -Url $packUrl
}

Write-Host ''
Write-Host 'Дальше:'
Write-Host "  git add -A; git commit -m 'update'; git push -u origin $Branch"
Write-Host "  GitHub -> Settings -> Pages -> Source: GitHub Actions (workflow уже в репозитории)"
Write-Host "  проверить: $packUrl"
