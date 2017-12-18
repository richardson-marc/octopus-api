#!/usr/bin/env node
//const lodash = require('lodash');
//const async = require('async');
const request = require('request');
const rp = require('request-promise-native');
const ProjectId = "Projects-461"
const EnvironmentName = "d1"
//getTenant looks for the tenant ID that matches the name in -t
// on the command line, that works now, good
//getProjects should find project ID that matches the name from the -p
// on the command line, that seems to work, good
// getReleases should getall release for the above project ID
// I think this works...
// find the release where "ReleaseNotes" matchs the release from the
// -r option on command line

//const Tenant = "Tenants-155"
// need to get project, and from that release I think
//const ReleaseID = "Releases-8467"
//const TenantName = "d10-c"

//const EnvironmentID = "Environments-1171"
const OctoConfig = require('./octo_tools.json');
const OctopusURL = (OctoConfig.OctopusUrl)
const apiKey = (OctoConfig.OctoApiKey)
//console.log(`${OctopusURL}`)
//console.log(`${apiKey}`)
const applicationMap = {
    'dont': '[DO NOT DEPLOY] Mirror Table Update Service Overflow',
    'dbmigrator': 'Analytics DB Migrator',
    'audit': 'Audit Table Update Service',
    'board': 'Board Cache Event Processor Service',
    'backup': 'Create Octopus Backup',
    'sumo': 'Create Sumo Sources',
    'verify': 'Data Verification Service',
    'datadog': 'Datadog Monitor Windows Services',
    'event': 'Event Stream Queuer',
    'fact': 'Fact Table Update Service',
    'kanban': 'Kanban App | Kanban Service | DTS Loader | DTS Processor',
    'mirror': 'Mirror Table Update Service',
    'newrelic': 'New Relic .Net Agent',
    'bulk': 'SFDC Bulk Loader',
};

const environmentMap = {
    "d1": "Environments-1171",
    "u3": "Environments-1181",
    "e3": "Environments-1182",
    "u4": "Environments-1201",
    "e4": "Environments-1221",
    "a1-be-b": "Environments-1049",
}
    
const GetArgs = function GetArgs() {
const help = `-r release
-p project (kanban, mirror, etc)
-t tenant (d10-c, as-c, etc)`
const argv = require('yargs')
    .usage('Usage: $0 -r [release] -p [project] -t [tenant] -h [help]')
//    .demandOption(['r','p'])
    .argv;

    if(argv.h) {
	console.log(`${help}`)
	process.exit()
    }
if(argv.r){
    console.log('release : ' + argv.r);
    global.ReleaseVersion = argv.r
}
if (argv.p) {
    console.log('project : ' + argv.p);
    global.Project = argv.p
}
if (argv.t) {
//    console.log('tenant : ' + argv.t);
    global.OctoTenant = argv.t
    console.log(`tenant: ${OctoTenant}`)
}
    getTenants(OctoTenant)
    getEnvironments()
    getProjects()
    getReleases(ProjectId,ReleaseVersion)
//    RunDeploy(EnvironmentID, TenantID, ReleaseID)
}

const getReleases = function getReleases(ProjectId,ReleaseVersion) {
//duh, undef
//    console.log(`in get releases, project id is ${ProjectId}`)
var options = {
    //    just the kanban project

            url: `https://octo.leankit.io/api/projects/${ProjectId}/releases`, // this works fine
    method: 'GET',
    headers:{ //headers,
	'User-Agent': 'node.js',
        'X-Octopus-ApiKey': `${apiKey}`
    },
}

// Start the request
//console.log(`arg is ${argv.p}`)
request(options, function (error, response, body) {
//    if (!error) { // && response.statusCode != 200) {  ????
    // Print out the response body
    dt = body // undefined
//    console.log(body)
    foo = JSON.stringify(dt)
    const releases = JSON.parse(dt)
//    console.log("releases is")
//    console.log(`${releases}`)
    for(let i = 0, l = releases.Items.length; i < l; i++) {
	const mine = releases.Items[i].Id
//	console.log(`ReleaseVersion is ${ReleaseId}`)
	//	console.log(`mine is ${mine}`)
	//ok this is better...
	if (releases.Items[i].ReleaseNotes.match(ReleaseVersion) ) {


//     	console.log(`release.Items is ${releases.Items[i].Id}`)
//	console.log(`release version is ${ReleaseVersion}`) // this is semver
//	    console.log(releases.Items[i].ReleaseNotes)
	    const ReleaseID = releases.Items[i].Id
//	    console.log(`ReleaseID is ${ReleaseID}`)
	}
     }
})
}
    
//    RunDeploy(EnvironmentID, TenantName, ReleaseID)

    
const getProjects = function getProjects() {
//    console.log(`in get projects project is ${Project}`) // '2'
    const OctoApp = applicationMap[`${Project}`];
    console.log(`octo app is ${OctoApp}`)
    var options = {
    //    just the kanban project
            url: 'https://octo.leankit.io/api/projects/all', // this works fine
    method: 'GET',
    headers:{ //headers,
        'User-Agent': 'node.js',
        'X-Octopus-ApiKey': `${apiKey}`
    },
}

    // Start the request
//    console.log(`in getProjects, arg is ${Project}`) // doubled?
request(options, function (error, response, body) {
//    if (!error) { // && response.statusCode != 200) {  ????
    // Print out the response body

    dt = body // undefined

    foo = JSON.stringify(dt)
    const tenants = JSON.parse(dt)
    tenants.forEach(function(arrayItem) {
        //      if (arrayItem.Name.match(OctoTenant) ) {
//      console.log(`further down project is`)
//      console.log(`${OctoApp}`)
        if (arrayItem.Name.match(OctoApp) ) {
//              console.log("logging")
//            console.log(arrayItem.Name);
//                console.log(arrayItem.Id);
    }
        });
})
    //    RunDeploy(EnvironmentID, TenantName, ReleaseID)
//    getReleases(ProjectId,ReleaseVersion)
}
const getTenants = function getTenants() {


    
var options = {
                url: 'https://octo.leankit.io/api/tenants/all', // this works fine
    method: 'GET',
    headers:{ //headers,
        'User-Agent': 'node.js',
        'X-Octopus-ApiKey': `${apiKey}`
    },
}
request(options, function (error, response, body) {
//    if (!error) { // && response.statusCode != 200) {  ????
    // Print out the response body

    dt = body // undefined

    const tenants = JSON.parse(dt)
        tenants.forEach(function(arrayItem) {
        if (arrayItem.Name.match(OctoTenant) ) {
//            console.log(arrayItem.Name);
//            console.log(arrayItem.Id);
	    global.TenantID = arrayItem.Id
//	    console.log(`tenant id is ${TenantID}`)
	    return TenantID
        }
	})
//    console.log (`env id ${EnvironmentID} tenant id ${TenantID} release id ${ReleaseID}`)
//    RunDeploy(EnvironmentID, TenantID, ReleaseID)
})

}
const getEnvironments = function getEnvironments() {
    
var options = {
                url: 'https://octo.leankit.io/api/environments/all', // this works fine
    method: 'GET',
    headers:{ //headers,
        'User-Agent': 'node.js',
        'X-Octopus-ApiKey': `${apiKey}`
    },
}
request(options, function (error, response, body) {
//    if (!error) { // && response.statusCode != 200) {  ????
    // Print out the response body

    dt = body // undefined
    console.log(dt)
    const environments = JSON.parse(dt)
        environments.forEach(function(arrayItem) {
//        if (arrayItem.Name.match(OctoTenant) ) {
//            console.log(arrayItem.Name);
	    //            console.log(arrayItem.Id);
	    global.EnvironmentName = arrayItem.Name
	    global.EnvironmentID = arrayItem.Id
	    console.log(`Environment id is ${EnvironmentID}`)
	    console.log(`Environment name is ${EnvironmentName}`)
	    return EnvironmentID
//        }
	})
//    console.log (`env id ${EnvironmentID} tenant id ${TenantID} release id ${ReleaseID}`)
//    RunDeploy(EnvironmentID, TenantID, ReleaseID)
})

}
const RunDeploy = function RunDeploy(EnvironmentID, TenantID, ReleaseID) {
    console.log(`envid is ${EnvironmentID}`)
    console.log(`tenant id is ${TenantID}`)
    console.log(`release id is ${ReleaseID}`)
    console.log(`posting this to octo EnvironmentID: ${EnvironmentID}, TenantID: ${TenantID}, ReleaseID: ${ReleaseID}`)
    const rp = require('request-promise-native');
     const options = {
         method: 'POST',
	 uri: `https://octo.leankit.io/api/deployments`,

        resolveWithFullResponse: true,
        headers: {
            'Content-Type': 'application/json',
            'X-Octopus-ApiKey': `${apiKey}`
        },
//       body: ${BodyObject}
         body: { "EnvironmentID": `${EnvironmentID}`, "TenantID": `${TenantID}`, "ReleaseID": `${ReleaseID}` },

        json: true, // Automatically stringifies the body to JSON
        simple: false
     };
        // this does not run...
//                 console.log(`body is ${body}`)
    rp(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("success, kid")
        }
    })
        .then(function (response) {
            console.log("post to octopus returned status %d", response.statusCode);
//	    console.log(response)
        })
            .catch(function (err) {
                console.log(err)
        });
  }


GetArgs()
//getProjects()
//getTenants(OctoTenant)

//getReleases(ProjectId)
