var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var session = require(__dirname + '/../../helpers/session_handler');
var session = require(__dirname + '/../../helpers/session_handler');
var UBER = require(__dirname + '/../common/uber');
var userOps = require(__dirname + '/../../../modules/database_modules/user_operations');
// var crypto = require("crypto");
// var Buffer = require('buffer').Buffer;

function buildLoginURL(email, encPassword) {
    var url = '';
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

function parseLoginResponse(response, status, userData) {
    var output = {
        status: response ? ((status.toLowerCase() != 'failure') ? "success" : "failure") : "failure",
        service: 'UBER'
    };

    try {
        userData.connected_services.ola = {};

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
    UBER.options.request.path = buildLoginURL(email, encPassword);

    request.getJSON(UBER.options.request, function(statusCode, result) {
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
