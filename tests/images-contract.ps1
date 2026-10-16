$ErrorActionPreference = "Stop"
$src = Get-Content "$PSScriptRoot\..\src\worker.js" -Raw -Encoding UTF8
$categoryStart = $src.IndexOf("var categoryImages={")
$categoryEnd = $src.IndexOf("};", $categoryStart)
$productStart = $src.IndexOf("var products=[")
$productEnd = $src.IndexOf("];", $productStart)

if ($categoryStart -lt 0 -or $categoryEnd -lt 0) { throw "categoryImages block missing" }
if ($productStart -lt 0 -or $productEnd -lt 0) { throw "products block missing" }

$categoryBlock = $src.Substring($categoryStart, $categoryEnd - $categoryStart)
$productBlock = $src.Substring($productStart, $productEnd - $productStart)
if ($categoryBlock -match "https?://") { throw "Category images must be self-hosted" }
if ($productBlock -match "https?://") { throw "Product images must be self-hosted" }
if ($src -match "photos/28772360|photos/16246068") { throw "Old generic home-card images remain" }

$matches = [regex]::Matches($src, '(?:src=|img:|"\w+":)"(/(?:products|categories)/[^"]+)"')
$paths = @($matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
if ($paths.Count -lt 10) { throw "Too few local image references: $($paths.Count)" }
foreach ($path in $paths) {
  $relative = $path.TrimStart("/") -replace "/", "\"
  $file = Join-Path "$PSScriptRoot\..\public" $relative
  if (-not (Test-Path $file -PathType Leaf)) { throw "Missing image asset: $path" }
}

$config = Get-Content "$PSScriptRoot\..\wrangler.jsonc" -Raw -Encoding UTF8 | ConvertFrom-Json
if ($config.assets.directory -ne "./public") { throw "Wrangler assets directory is not ./public" }
if ($config.assets.binding -ne "ASSETS") { throw "Wrangler ASSETS binding missing" }
Write-Output "Image contract OK ($($paths.Count) local image references)"
