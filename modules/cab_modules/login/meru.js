var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var session = require(__dirname + '/../../helpers/session_handler');
var globals = require(__dirname + '/../../helpers/globals');
var cryptoTS = require(__dirname + '/../../helpers/crypt_auth');
var MERU = require(__dirname + '/../common/meru');
var userOps = require(__dirname + '/../../../modules/database_modules/user_operations');

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

function parseLoginResponse(response, status, userData) {
    var output = {
        status: response ? ((status.toLowerCase() != 'failure') ? "success" : "failure") : "failure",
        service: 'MERU'
    };

    try {
        userData.connected_services.meru = {};

        userOps.updateUser(userData, ['connected_services'], function(data) {
            if (data == -1) {
                output.message = "Error Authenticating User";
                output.error = true;
            } else {
                output.error = false;
                output.data = userData;
            }
        });
    } catch (ex) {
        output.error = true;
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.login = function(responseHandler, sessRequest, response, userData, email, encPassword, phonenumber, shouldParseData) {
    MERU.options.requestPost.path = buildLoginURL();
    var data = buildPostData(email, encPassword, phonenumber);
    MERU.options.requestPost.headers['Content-Length'] = data.length;

    request.post(MERU.options.requestPost, data, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        var output = result;
        if (shouldParseData && result) {
            output = parseLoginResponse(result, result.status, userData);
            result = output.data;
        }

        if (output.error) {
            responseHandler(response, output, 500);
        } else {
            session.setUserData(sessRequest, result);
            responseHandler(response, result);
        }
    });
}
