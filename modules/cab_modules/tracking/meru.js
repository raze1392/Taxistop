var request = require(__dirname + '/../../helpers/request');
var request = require(__dirname + '/../../helpers/request');
var MERU = require(__dirname + '/../common/meru');

function buildTrackingURL(userId) {
    var url = '';
    url += '&user_id=' + userId;

    return url;
}

function parseResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'MERU'
    };

    try {
        //Stub
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }
}

exports.trackCab = function(responseHandler, response, userId, shouldParseData) {
    MERU.options.path = buildTrackingURL(userId);

    request.getJSON(MERU.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseResponse(result, result.status);
        }
        responseHandler(response, result);
    });
}
