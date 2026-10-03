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

Write-Output "UI contract OK"
