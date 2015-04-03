var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var OLA = require(__dirname + '/../common/ola');
var Firebase = require("firebase");

function buildLoginURL(email, encPassword) {
    var url = '/v3/user/login?device_id=911380450341890&lat=29.3794796&lng=79.4637102';
    url += '&email=' + encodeURIComponent(email);
    url += '&password=' + encPassword;

    return url;
}

function parseLoginResponse(response, status, userCookie) {
    var output = {
        status: response ? ((status.toLowerCase() != 'failure') ? "success" : "failure") : "failure",
        service: 'OLA'
    };

    try {
        output.userId = response.user_id;
        output.referralCode = response.referral_code;
        output.walletAmount = response.ola_money_balance;

        //var ref = new Firebase('https://flickering-inferno-5036.firebaseio.com');    
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.login = function(responseHandler, response, userCookie, email, encPassword, phonenumber, shouldParseData, saveCredentials) {
    OLA.options.request.path = buildLoginURL(email, encPassword);

    request.getJSON(OLA.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        saveCredentials(userCookie, email, encPassword, 'ola', result);
        if (shouldParseData && result) {
            result = parseLoginResponse(result, result.status, userCookie);
        }
        responseHandler(response, result);
    });
}
