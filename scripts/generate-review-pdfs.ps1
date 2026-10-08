[CmdletBinding()]
param(
    [string]$Output,
    [string[]]$Module,
    [string]$Font,
    [switch]$KeepOutput
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$generator = Join-Path $PSScriptRoot 'export-question-review-pdfs.py'
$requirements = Join-Path $PSScriptRoot 'review-pdf-requirements.txt'
$venv = Join-Path $repo '.venv-review-pdf'

$candidates = @()
$bundled = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
if (Test-Path -LiteralPath $bundled) { $candidates += $bundled }
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand) { $candidates += $pythonCommand.Source }
$pyCommand = Get-Command py -ErrorAction SilentlyContinue
if ($pyCommand) { $candidates += $pyCommand.Source }

$python = $null
foreach ($candidate in $candidates | Select-Object -Unique) {
    & $candidate -c 'import reportlab, PIL' 2>$null
    if ($LASTEXITCODE -eq 0) {
        $python = $candidate
        break
    }
}

if (-not $python) {
    if (-not $pythonCommand) {
        throw 'Python was not found. Install Python 3.11 or later.'
    }
    Write-Host 'First run: creating an isolated PDF environment and installing dependencies...'
    & $pythonCommand.Source -m venv $venv
    $python = Join-Path $venv 'Scripts\python.exe'
    & $python -m pip install -r $requirements
    if ($LASTEXITCODE -ne 0) { throw 'Failed to install PDF dependencies.' }
}

$arguments = @($generator)
if ($Output) { $arguments += @('--output', $Output) }
foreach ($moduleId in $Module) { $arguments += @('--module', $moduleId) }
if ($Font) { $arguments += @('--font', $Font) }
if ($KeepOutput) { $arguments += '--keep-output' }

Push-Location $repo
try {
    & $python @arguments
    if ($LASTEXITCODE -ne 0) { throw "PDF generation failed with exit code $LASTEXITCODE" }
} finally {
    Pop-Location
}

