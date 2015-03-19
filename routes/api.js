var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/helpers/globals');

var APIUtils = require('../modules/auth_modules/apiUtils');

router.get('/generate', function(request, response) {
    var hostInfo = request.query.host;
    // var hostInfo = request.headers.referrer || request.headers.host;
    var apikey = APIUtils.generateAPIKey(hostInfo);
    sendResponse(response, apikey);
});

router.get('/validate', function(request, response) {
    var apikey = decodeURIComponent(request.query.api);
    var hostInfo = decodeURIComponent(request.query.host);
    
    var status = {
        status: APIUtils.isAPIKeyValid(apikey, hostInfo)
    };
    sendResponse(response, status);
});

function sendResponse(response, result) {
    response.json(result);
}

module.exports = router;
