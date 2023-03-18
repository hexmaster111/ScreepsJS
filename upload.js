var https = require('https');
var fs = require('fs');
const tokens = require('./TOKENS.json');

var filesInDir = fs.readdirSync('./src');
if (filesInDir == undefined || filesInDir.length == 0) {
    console.log("No files found in src folder! Creating main.js");
    fs.mkdirSync('./src');
}

var files = {};
var gotMain = false;
for (var i in filesInDir) {
    var file = filesInDir[i];
    if (file.split('.').pop() != 'js') {
        console.log('Skipping ' + file);
        continue;
    }
    var name = file.split('.')[0];
    if (name == 'main') { gotMain = true; }
    var fileContent = fs.readFileSync('./src/' + file, 'utf8');
    files[name] = fileContent;
}

if (!gotMain) {
    console.log('No main.js found!');
    console.log("Creating One and exiting...");
    fs.writeFileSync('./src/main.js', "module.exports.loop = function () {\n\n};", 'utf8');
    return;
}

var email = tokens.email;
var password = tokens.password;

var data = {
    branch: 'default',
    modules: files
};

var req = https.request({
    hostname: 'screeps.com',
    port: 443,
    path: '/api/user/code',
    method: 'POST',
    auth: email + ':' + password,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

req.write(JSON.stringify(data));
req.end();