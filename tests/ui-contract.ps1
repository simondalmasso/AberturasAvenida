$ErrorActionPreference = "Stop"
$src = Get-Content "$PSScriptRoot\..\src\worker.js" -Raw

$required = @(
  "Abr",
  "Revisi",
  "Productos",
  "wa.link/uicwu2",
  "wa.me/5493425236559",
  "Pagar / enviar pedido por WhatsApp",
  "No se cobra en la web",
  "measurements",
  "INFORMADO POR EL CLIENTE",
  "FINAL EN OBRA",
  "meta name=",
  "description",
  "canonical",
  "application/ld+json",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "404"
)
foreach ($item in $required) {
  if (-not $src.Contains($item)) { throw "Missing contract: $item" }
}

$forbidden = @("AI-powered","inteligencia artificial","machine learning","Stripe","Mercado Pago","PayPal")
foreach ($item in $forbidden) {
  if ($src -match [regex]::Escape($item)) { throw "Forbidden claim/integration: $item" }
}

if ($src -match '<button class="owner-top"') { throw "Owner navigation is public" }
if ($src -notmatch 'URLSearchParams') { throw "Missing internal owner query access" }
if ($src -match 'aria-label="Abrir carrito"') { throw "Accessible-name mismatch restored" }


# Catalog must have two explicit, working groupings.
if ($src -notmatch 'var groups=\["Todos","Puertas","Ventanas"\]') { throw "Catalog filters must expose Todos / Puertas / Ventanas" }
$productMatch = [regex]::Match($src, 'var products=\[(.*?)\];\s*var activeFilter', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if (-not $productMatch.Success) { throw "Product catalog block missing" }
$productBlock = $productMatch.Groups[1].Value
$doorCount = [regex]::Matches($productBlock, 'group:"Puertas"').Count
$windowCount = [regex]::Matches($productBlock, 'group:"Ventanas"').Count
if ($doorCount -lt 1 -or $windowCount -lt 1) { throw "Products must be assigned to both Puertas and Ventanas groups" }
$productCount = [regex]::Matches($productBlock, 'id:"[^"]+"').Count
if ($productCount -ne 10) { throw "Expected 10 catalog products, found $productCount" }
if ($doorCount -ne 6 -or $windowCount -ne 4) { throw "Expected 6 Puertas and 4 Ventanas products, found $doorCount / $windowCount" }
if ($src -match 'raw.githubusercontent.com/simondalmasso/AberturasAvenida/main/public/brand/avenida-logo.png') { throw "Brand logo must be self-hosted" }
if ($productBlock -match 'group:"(?!Puertas|Ventanas)[^"]+"') { throw "Unexpected third catalog group found" }
if ($src -notmatch '01 · PUERTAS' -or $src -notmatch '02 · VENTANAS') { throw "Catalog group headings must clearly say Puertas / Ventanas" }

Write-Output "UI contract OK"
