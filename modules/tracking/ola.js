var request = require(__dirname + '/../helpers/request');
var request = require(__dirname + '/../helpers/request');
var OLA = require(__dirname + '/../common/ola');

function buildTrackingURL(userId) {
    var url = '/v3/cab/info?enable_new_state=true&enable_auto=true';
    url += '&user_id=' + userId;

    return url;
}

function parseResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'OLA'
    };

    try {
        //Stub
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }
}

exports.trackCab = function(responseHandler, response, userId, shouldParseData) {
    OLA.options.path = buildTrackingURL(userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseResponse(result, result.status);
        }
        responseHandler(response, result);
    });
}
