var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var globals = require(__dirname + '/../../helpers/globals');
var cryptoTS = require(__dirname + '/../../helpers/crypt_auth');
var MERU = require(__dirname + '/../common/meru');
var Firebase = require("firebase");

function buildLoginURL(email, encPassword) {
    var url = '/assets/GenieServices/GenieUsersAPI.php'
    return url;
}

function buildPostData(email, password, phonenumber) {
    var data = "Action=userLogin&JsoneString="
    data += JSON.stringify({
        "phonenumber": phonenumber,
        "pwd": cryptoTS.decryptTaxistopPassword(password),
        "device_id": "911380450341890",
        "device_type": "Android",
        "isupdate": "0",
        "APIVersion": "3.2",
        "imageType": "hdpi",
        "gcm_key": ""
    });
    return data;
}

function parseLoginResponse(response, status, userCookie) {
    var output = {
        status: response ? ((status.toLowerCase() != 'failure') ? "success" : "failure") : "failure",
        service: 'MERU'
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
    MERU.options.requestPost.path = buildLoginURL();
    var data = buildPostData(email, encPassword, phonenumber);
    MERU.options.requestPost.headers['Content-Length'] = data.length;

    request.post(MERU.options.requestPost, data, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        saveCredentials(userCookie, email, encPassword, 'meru', result);
        if (shouldParseData && result) {
            result = parseLoginResponse(result, result.status, userCookie);
        }
        responseHandler(response, result);
    });
}
