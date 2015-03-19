var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var TFS = require(__dirname + '/../common/ola');
var Firebase = require("firebase");
// var crypto = require("crypto");
// var Buffer = require('buffer').Buffer;

function buildLoginURL(email, encPassword) {
    var url = '/v3/user/login?device_id=911380450341890&lat=29.3794796&lng=79.4637102';
    url += '&email=' + encodeURIComponent(email);
    // encPassword += '|';
    // var iv = new Buffer('');
    // var key = new Buffer('PRODKEYPRODKEY12', 'utf8');
    // var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    // var chunks = [];
    // chunks.push(cipher.update(new Buffer(encPassword, 'utf8'), 'buffer', 'base64'));
    // chunks.push(cipher.final('base64'));
    // encPassword = chunks.join('');
    url += '&password=' + encPassword;

    return url;
}

function parseLoginResponse(response, status, userCookie) {
    var output = {
        status: response ? ((status.toLowerCase() != 'failure') ? "success" : "failure") : "failure",
        service: 'TFS'
    };

    try {

        //var ref = new Firebase('https://flickering-inferno-5036.firebaseio.com');    
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.login = function(responseHandler, response, userCookie, email, encPassword, shouldParseData, saveCredentials) {
    TFS.options.request.path = buildLoginURL(email, encPassword);

    request.getJSON(TFS.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        saveCredentials(userCookie, email, encPassword, 'ola', result);
        if (shouldParseData && result) {
            result = parseLoginResponse(result, result.status, userCookie);
        }
        responseHandler(response, result);
    });
}
