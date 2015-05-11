var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var globals = require(__dirname + '/../../helpers/globals');
var session = require(__dirname + '/../../helpers/session_handler');
var cryptoTS = require(__dirname + '/../../helpers/crypt_auth');
var TFS = require(__dirname + '/../common/tfs');
var userOps = require(__dirname + '/../../../modules/database_modules/user_operations');

function buildLoginURL(email, encPassword) {
    var url = '/user/login/';
    return url;
}

function buildPostData(email, password, phonenumber) {
    var data = "appVersion=4.1.6&username=" + phonenumber;
    data += "&password=" + encodeURIComponent(cryptoTS.decryptTaxistopPassword(password));
    return data;
}

function parseLoginResponse(response, sessRequest, userData) {
    var output = {
        isSuccess: response ? ((response.status.toLowerCase() != 'failure') ? true : false) : false,
        service: 'TFS'
    };

    try {
        userData.connected_services["tfs"] = {
            is_phonenumber_verified: response.response_data.is_phonenumber_verified,
            user_id: response.response_data.user_id,
            referral_url: response.response_data.referral_url,
            referral_code: response.response_data.referral_code,
            phonenumber: response.response_data.customer_number,
            name: response.response_data.customer_name,
            email: response.response_data.customer_email
        };

        // DB access to save user info for connecting to TFS
        userOps.updateUser(userData, ['connected_services'], function(data) {
            if (data == -1) {
                delete userData.connected_services.tfs;
                session.setUserData(sessRequest, userData);
            } else {
                session.setUserData(sessRequest, userData);
            }
        });

        output.isSuccess = true;
        output.data = userData;
    } catch (ex) {
        output.isSuccess = false;
        logger.warn(ex.getMessage(), ex);
    }

    return output;
}

exports.login = function(responseHandler, sessRequest, response, userData, email, encPassword, phonenumber, shouldParseData) {
    TFS.options.requestPostAppApi.path = buildLoginURL();
    var data = buildPostData(email, encPassword, phonenumber);
    TFS.options.requestPostAppApi.headers['Content-Length'] = data.length;

    request.post(TFS.options.requestPostAppApi, data, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        var output = result;
        if (shouldParseData && result) {
            output = parseLoginResponse(result, sessRequest, userData);
            result = output.data;
        }

        if (!output.isSuccess) {
            responseHandler(response, output, 500);
        } else {
            responseHandler(response, result);
        }
    });
}
