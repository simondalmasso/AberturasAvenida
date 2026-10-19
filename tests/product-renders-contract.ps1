$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$src = Get-Content (Join-Path $root "src\worker.js") -Raw -Encoding UTF8
$products = @(
  "puerta-placa.webp",
  "puerta-m118.webp",
  "puerta-madera-m4.webp",
  "puerta-chapa-m218.webp",
  "porton-aluminio-blanco.webp",
  "porton-aluminio-negro.webp",
  "puerta-ventana-apaisada.webp",
  "ventana-corrediza-entera.webp"
)
$productStart = $src.IndexOf("var products=[")
$productEnd = $src.IndexOf("];", $productStart)
if ($productStart -lt 0 -or $productEnd -lt 0) { throw "Product catalog block missing" }
$productBlock = $src.Substring($productStart, $productEnd - $productStart)
if ($src -notmatch '\.product-media img\{[^}]*object-fit:contain') { throw "Product cards must preserve image bounds with object-fit:contain" }
$totalBytes = 0
foreach ($name in $products) {
  $rel = "/products/$name"
  if (-not $productBlock.Contains($rel)) { throw "Catalog does not reference required asset: $rel" }
  $path = Join-Path $root ("public\products\" + $name)
  if (-not (Test-Path $path -PathType Leaf)) { throw "Missing render: $rel" }
  $file = Get-Item $path
  if ($file.Length -le 0 -or $file.Length -gt 60000) { throw "Unexpected size for $rel : $($file.Length)" }
  $bytes = [IO.File]::ReadAllBytes($path)
  if ($bytes.Length -lt 12 -or [Text.Encoding]::ASCII.GetString($bytes,0,4) -ne "RIFF" -or [Text.Encoding]::ASCII.GetString($bytes,8,4) -ne "WEBP") { throw "Invalid WebP asset: $rel" }
  $totalBytes += $file.Length
}
if ($products.Count -ne 8) { throw "Expected eight main product WebP renders" }
$categoryNames = @("cerramiento.webp","porton.webp","puerta.webp","ventana.webp")
$complementNames = @("mosquitera-enrollable.webp","cortina-roller.webp")
foreach ($name in $categoryNames) {
  $path = Join-Path $root ("public\categories\" + $name)
  if (-not (Test-Path $path -PathType Leaf)) { throw "Missing category illustration: $name" }
  $f = Get-Item $path
  if ($f.Length -le 0 -or $f.Length -gt 50000) { throw "Unexpected category image size: $name" }
}
foreach ($name in $complementNames) {
  $path = Join-Path $root ("public\products\" + $name)
  if (-not (Test-Path $path -PathType Leaf)) { throw "Missing complement illustration: $name" }
  $f = Get-Item $path
  if ($f.Length -le 0 -or $f.Length -gt 60000) { throw "Unexpected complement image size: $name" }
}
Write-Output "Product render contract OK (8 optimized WebP renders; $totalBytes bytes total; 4 category WebP and 2 complementary WebP assets)"
