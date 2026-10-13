[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$')]
    [string]$PaperId,
    [Parameter(Mandatory = $true)]
    [ValidateSet('Hide', 'Restore', 'ResolveReports')]
    [string]$Action
)
$ErrorActionPreference = 'Stop'
if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_SECRET_KEY) { throw 'Configure SUPABASE_URL and SUPABASE_SECRET_KEY in the local maintainer environment only.' }
$rpc = if ($Action -eq 'ResolveReports') { 'resolve_ics_community_paper_reports' } else { 'moderate_ics_community_paper' }
$argsBody = @{ p_id = $PaperId }
if ($Action -ne 'ResolveReports') { $argsBody.p_hidden = ($Action -eq 'Hide') }
$headers = @{ apikey = $env:SUPABASE_SECRET_KEY; 'Content-Type' = 'application/json'; 'User-Agent' = 'ics-test-maintenance-script/1.0' }
if ($env:SUPABASE_SECRET_KEY.StartsWith('ey')) { $headers.Authorization = 'Bearer ' + $env:SUPABASE_SECRET_KEY }
$result = Invoke-RestMethod -Method Post -Uri ($env:SUPABASE_URL.TrimEnd('/') + '/rest/v1/rpc/' + $rpc) -Headers $headers -Body ($argsBody | ConvertTo-Json -Compress)
if ($Action -eq 'ResolveReports') { Write-Host "Cleared reports for $PaperId. The paper and participation/like records are retained; new reports remain possible." }
elseif ($result -eq $true) { Write-Host "$Action completed for $PaperId. All paper data is retained and can be restored." }
else { Write-Host "No paper was found for $PaperId." }
