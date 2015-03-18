var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/helpers/globals');

var API = require('../modules/api_modules/apiUtils');

router.get('/generate', function(request, response) {
    var hostInfo = request.headers.referrer || request.headers.host;
    var apikey = API.generateAPIKey(hostInfo);
    sendResponse(response, apikey);
});

router.get('/validate', function(request, response) {
    var apikey = decodeURIComponent(request.query.api);
    var hostInfo = request.headers.referrer || request.headers.host;
    
    var status = {
        status: API.isAPIKeyValid(apikey, hostInfo)
    };
    sendResponse(response, status);
});

function sendResponse(response, result) {
    response.json(result);
}

module.exports = router;
