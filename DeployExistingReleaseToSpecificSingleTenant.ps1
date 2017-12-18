##CONFIG##


$apiKey = "key"
$OctopusURL = "url"
$ProjectName = "project"
$EnvironmentName = "env"

$MachineName = "machine" #Machine name in Octopus. Accepts only 1 Machine.

$TenantID = "Tenants" #tenant ID, can be found in /api/tenants

$ReleaseVersion = "release" #Version of the release you want to deploy. Put 'Latest' if you want to deploy the latest version without having to know its number.

##PROCESS##

$Header =  @{ "X-Octopus-ApiKey" = $apiKey }
 
#Getting Project
Try{
    $Project = Invoke-WebRequest -Uri "$OctopusURL/api/projects/$ProjectName" -Headers $Header -ErrorAction Ignore| ConvertFrom-Json
    }
Catch{
    Write-Error $_
    Throw "Project not found: $ProjectName"
}
Write-host "project is $Project"
#Getting environment
$Environment = Invoke-WebRequest -Uri "$OctopusURL/api/Environments/all" -Headers $Header| ConvertFrom-Json
 
$Environment = $Environment | ?{$_.name -eq $EnvironmentName}
Write-Host "environment is $Environment"

If($Environment.count -eq 0){
    throw "Environment not found: $EnvironmentName"
}

#Getting machine
$tenant = Invoke-WebRequest -Uri "$OctopusURL/api/Tenants/$TenantID" -Headers $Header| ConvertFrom-Json

Write-Host "tennant is $tenant"

If($tenant.count -eq 0){
    throw "Tenant not found: $TenantID"
}

#Getting Release

If($ReleaseVersion -eq "Latest"){
    $release = ((Invoke-WebRequest "$OctopusURL/api/projects/$($Project.Id)/releases" -Headers $Header).content | ConvertFrom-Json).items | select -First 1
#    write-host "release is $release"
    write-host "url is $OctopusURL/api/projects/$($Project.Id)/releases"
    If($release.count -eq 0){
        throw "No releases found for project: $ProjectName"
    }
}
else{
    Try{
	$release = (Invoke-WebRequest "$OctopusURL/api/projects/$($Project.Id)/releases/$ReleaseVersion" -Headers $Header).content | ConvertFrom-Json
	write-host "release is $release"
       write-host "url is $OctopusURL/api/projects/$($Project.Id)/releases"
    }
    Catch{
        Write-Error $_    
        throw "Release not found: $ReleaseVersion"    
    }
}

   write-host "url is $OctopusURL/api/projects/$($Project.Id)/releases"
write-host "project id will be $Project.Id"
#Creating deployment
$DeploymentBody = @{ 
            ReleaseID = $release.Id
            EnvironmentID = $Environment.id
            TenantID = $tenant.id
          } | ConvertTo-Json


write-host "will be this: $DeploymentBody"
write-host

#exit
$d = Invoke-WebRequest -Uri $OctopusURL/api/deployments -Method Post -Headers $Header -Body $DeploymentBody

