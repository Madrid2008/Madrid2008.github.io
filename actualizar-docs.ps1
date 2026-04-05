$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$docsPath = Join-Path $projectRoot "docs"

$filesToCopy = @("index.html", "main.js", "styles.css", "404.html", ".nojekyll")
$foldersToCopy = @("HTML", "imagenes")

New-Item -ItemType Directory -Force -Path $docsPath | Out-Null

foreach ($file in $filesToCopy) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $docsPath -Force
}

foreach ($folder in $foldersToCopy) {
    $targetPath = Join-Path $docsPath $folder
    if (Test-Path -LiteralPath $targetPath) {
        Remove-Item -LiteralPath $targetPath -Recurse -Force
    }

    Copy-Item -LiteralPath (Join-Path $projectRoot $folder) -Destination $docsPath -Recurse -Force
}

Write-Host "La carpeta docs fue actualizada y ya esta lista para GitHub Pages."
