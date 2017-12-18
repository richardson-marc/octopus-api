#!/usr/local/bin/node
const lodash = require('lodash');
const async = require('async');
const request = require('request');
const rp = require('request-promise-native');
const apiKey = "key"
const OctopusURL = "url"
const ProjectName = "Projects-461"
const EnvironmentName = "d1"
const Tenant = "Tenants-155"
const ReleaseVersion = "37.0.0"
const TenantName = "d10-c"

function httpGet(url, callback) {
  const options = {
    url :  url,
      json : true,
      headers:{ 
        'User-Agent': 'node.js',
        'X-Octopus-ApiKey': `${apiKey}`
    },
  };
  request(options,
    function(err, res, body) {
      callback(err, body);
    }
  );
}

const projects = `https://octo.leankit.io/api/projects/${ProjectName}`
const allenvs  = `https://octo.leankit.io/api/environments/all`
const tenant = `https://octo.leankit.io/api/Tenants/${Tenant}`
//const release = `https://octo.leankit.io/api/projects/${ProjectName}/releases/${ReleaseVersion}`
const release = `https://octo.leankit.io/api/projects/${ProjectName}/releases`
const alltenants = `https://octo.leankit.io/api/tenants/all`
const allprojects = `https://octo.leankit.io/api/projects/all`
const urls= [

    // we need EnvironmentID, TenantID, ReleaseID
    //    alltenants,  // this barfs
    projects,
    allenvs,
    tenant,
    release,
    alltenants  // this is ok
];

var newurls
async.map(urls, httpGet, function (err, res){
    if (err) return console.log(err);
  
      //project
    const Project = JSON.stringify(res[0])
//    console.log(Project)
    projectid = JSON.parse(Project).Id
    console.log(`project ID is ${projectid}`)

    //environment
    const Environment = JSON.stringify(res[1])
    console.log(`environment name is ${EnvironmentName}`)
    global.envid = JSON.parse(Environment)[0].Id// yep
    console.log(`environment id is ${envid}`)

    //tenant
    const Tenant = JSON.stringify(res[2])
    global.TenantID = JSON.parse(Tenant).Id
    console.log(`the TenantID is ${TenantID}`)
    const Release = JSON.stringify(res[3])
    console.log(Release)
    global.releaseid = JSON.parse(Release).Id
    global.releaseNotes = JSON.parse(Release).ReleaseNotes
    // this seems to be fine, phew!
    console.log(`the release id is ${releaseid}`)
    console.log(`the release nodes are ${releaseNotes}`)
//    const thistenants = JSON.stringify(res[4])
//    console.log(thistenants)
//    global.whatever = JSON.parse(thistenants)[0].Id
    const AllReleases = JSON.stringify(res[4])
    global.AllReleaseStuff = JSON.parse(AllReleases).Id
    console.log(`all release stuff: ${AllReleaseStuff}`)
    // only the first one
//    console.log(whatever)
    // list of all tenants

    function Body(EnvironmentID, TenantID, ReleaseID) {
	this.EnvironmentID = EnvironmentID;
	this.TenantID = TenantID;
	this.ReleaseID = ReleaseID
    }
    // do these need to be quoted?
    const BodyObject = new Body ( global.envid, global.TenantID, global.releaseid)
    JSON.stringify (BodyObject)
    return envid
})

    const RunDeploy = function RunDeploy(EnvironmentID, TenantID, ReleaseID) {
	console.log("running RunDeploy")
     const options = {
        method: 'POST',
        uri: `https://octo.leankit.io/api/deployments`,
        resolveWithFullResponse: true,
        headers: {
            'Content-Type': 'application/json',
            'X-Octopus-ApiKey': `${apiKey}`
        },
//	 body: ${BodyObject}
	 body: { "EnvironmentID": `${envid}`, "TenantID": `${TenantID}`, "ReleaseID": `${releaseid}` },
//	  body: { "deployment" :{'revision': '1', 'changelog': 'see description', 'description': `deployment of ${nr_appname} release ${NodeVer} to ${lk_instance}`, 'user': 'lkdevops@leankit.com'} },

        json: true, // Automatically stringifies the body to JSON
        simple: false
     };
	
//		 console.log(`body is ${body}`)
    rp(options, function (error, response, body) {
        if (!error && response.statusCode != 200) {
	    console.log("success, kid")
        }
    })
            .then(function (response) {
		console.log("post to octopus returned status %d", response.statusCode);
//		console.log(response)
		console.log(`body is EnvironmentID: ${envid}, TenantID: ${TenantID}, ReleaseID: ${releaseid}`)
        })
            .catch(function (err) {
		console.log(err)
        });
    }
//    RunDeploy()
//});

