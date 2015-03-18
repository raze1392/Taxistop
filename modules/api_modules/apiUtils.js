var logger = require(__dirname + '/../helpers/log');
var crypto = require("crypto");
var Buffer = require('buffer').Buffer;

function generateAPIKey(data) {
	var sha = crypto.createHash('sha512');
	sha.update(data);
	var hash = sha.digest('base64');
	return hash;
}

exports.generateAPIKey = generateAPIKey;

exports.isAPIKeyValid = function(apikey, hostInfo) {
	var generatedAPIKey = generateAPIKey(hostInfo);
	console.log(apikey);
	console.log(generatedAPIKey);
	console.log(apikey === generatedAPIKey);
	
	if (apikey === generatedAPIKey) {
		return true;
	} else {
		return false;
	}
}

