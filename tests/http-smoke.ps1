$ErrorActionPreference = "Stop"
$base = "https://aberturasavenida.simondalmasso44.workers.dev"

function Assert-Http($path, $status, $contentTypePrefix) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing ($base + $path) -MaximumRedirection 0 -TimeoutSec 20
    $actual = [int]$r.StatusCode
    $ct = [string]$r.Headers["Content-Type"]
  } catch {
    if ($_.Exception.Response) {
      $actual = [int]$_.Exception.Response.StatusCode
      $ct = [string]$_.Exception.Response.Headers["Content-Type"]
    } else { throw }
  }
  if ($actual -ne $status) { throw "$path expected $status, got $actual" }
  if ($contentTypePrefix -and -not $ct.StartsWith($contentTypePrefix)) { throw "$path expected $contentTypePrefix, got $ct" }
  Write-Output "PASS $path $actual $ct"
}

Assert-Http "/" 200 "text/html"
Assert-Http "/health" 200 "application/json"
Assert-Http "/robots.txt" 200 "text/plain"
Assert-Http "/sitemap.xml" 200 "application/xml"
Assert-Http "/llms.txt" 200 "text/markdown"
Assert-Http "/definitely-not-a-real-page" 404 "text/plain"
