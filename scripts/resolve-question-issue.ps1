[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^q-[a-f0-9]{8,64}$')]
    [string]$QuestionId
)

$ErrorActionPreference = 'Stop'
$supabaseUrl = $env:SUPABASE_URL
$secretKey = $env:SUPABASE_SECRET_KEY

if (-not $supabaseUrl) { throw 'SUPABASE_URL is not set.' }
if (-not $secretKey) { throw 'SUPABASE_SECRET_KEY is not set.' }

$uri = $supabaseUrl.TrimEnd('/') + '/rest/v1/rpc/resolve_ics_question_issue'
$headers = @{
    apikey = $secretKey
    Authorization = 'Bearer ' + $secretKey
    'Content-Type' = 'application/json'
    # Supabase secret keys are rejected when the request looks like it came
    # from a browser. PowerShell's default User-Agent can trigger that guard,
    # so identify this explicitly as the repository's server-side maintainer.
    'User-Agent' = 'ics-test-maintenance-script/1.0'
}
$body = @{ p_question_id = $QuestionId } | ConvertTo-Json -Compress
$removed = Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $body

if ($removed -eq $true) {
    Write-Host "Resolved and removed $QuestionId."
} else {
    Write-Host "No active issue report was found for $QuestionId."
}

