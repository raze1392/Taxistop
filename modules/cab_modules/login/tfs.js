var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var globals = require(__dirname + '/../../helpers/globals');
var TFS = require(__dirname + '/../common/tfs');
var Firebase = require("firebase");

function buildLoginURL(email, encPassword) {
    var url = '/user/login/';
    return url;
}

function buildPostData(email, password, phonenumber) {
    var data = "appVersion=4.1.6&username=" + phonenumber;
    data += "&password=" + encodeURIComponent(globals.decryptTaxistopPassword(password));
    return data;
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

exports.login = function(responseHandler, response, userCookie, email, encPassword, phonenumber, shouldParseData, saveCredentials) {
    TFS.options.requestPostAppApi.path = buildLoginURL();
    var data = buildPostData(email, encPassword, phonenumber);
    TFS.options.requestPostAppApi.headers['Content-Length'] = data.length;



    request.post(TFS.options.requestPostAppApi, data, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        saveCredentials(userCookie, email, encPassword, 'ola', result);
        if (shouldParseData && result) {
            result = parseLoginResponse(result, result.status, userCookie);
        }
        responseHandler(response, result);
    });
}
