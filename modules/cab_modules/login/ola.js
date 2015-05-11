var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var session = require(__dirname + '/../../helpers/session_handler');
var OLA = require(__dirname + '/../common/ola');
var userOps = require(__dirname + '/../../../modules/database_modules/user_operations');

function buildLoginURL(email, encPassword) {
    var url = '/v3/user/login?device_id=911380450341890&lat=29.3794796&lng=79.4637102';
    url += '&email=' + encodeURIComponent(email);
    url += '&password=' + encPassword;

    return url;
}

function parseLoginResponse(response, userData) {
    var output = {
        service: 'OLA'
    };

    try {
        userData.connected_services.ola = {
            userId: response.user_id,
            referralCode: response.referral_code,
            walletAmount: response.ola_money_balance
        };

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
    OLA.options.secureRequest.path = buildLoginURL(email, encPassword);

    console.log(OLA.options.secureRequest.path);

    request.getJSON(OLA.options.secureRequest, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        var output = result;
        if (shouldParseData && result) {
            console.log(result);
            output = parseLoginResponse(result, userData);
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
