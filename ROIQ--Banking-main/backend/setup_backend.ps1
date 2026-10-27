# setup_backend.ps1
# Creates a Python virtual environment and installs backend requirements.

$ErrorActionPreference = 'Stop'

Write-Host 'Creating Python virtual environment in .venv' -ForegroundColor Cyan
python -m venv .venv

Write-Host 'Activating virtual environment' -ForegroundColor Cyan
$activateScript = Join-Path $PWD '.venv\Scripts\Activate.ps1'
if (Test-Path $activateScript) {
    . $activateScript
} else {
    Write-Host 'Cannot find Activate.ps1. Please activate .venv manually.' -ForegroundColor Yellow
}

Write-Host 'Installing backend requirements from requirements.txt' -ForegroundColor Cyan
pip install --upgrade pip
pip install -r requirements.txt

Write-Host 'Setup complete. Activate the virtual environment with:' -ForegroundColor Green
Write-Host '    .\.venv\Scripts\Activate.ps1' -ForegroundColor Green
