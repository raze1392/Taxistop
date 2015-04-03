var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var MERU = require(__dirname + '/../common/meru');

function buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId) {
    var url = '';

    if (srcLatitude && srcLongitude && destLatitude && destLongitude) {
        url += '&start_latitude=' + srcLatitude + '&start_longitude=' + srcLongitude;
        url += '&end_latitude=' + destLatitude + '&end_longitude=' + destLongitude;
    }

    return url;
}

function parseResponse(response) {
    var output = {
        status: response ? "success" : "failure",
        service: 'MERU',
        prices: []
    }

    try {
        
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.price = function(responseHandler, response, srcLatitude, srcLongitude, destLatitude, destLongitude, city, shouldParseData, userId) {
    MERU.options.request.path = buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId, city);

    request.getJSON(MERU.options.request, function(statusCode, result) {
        if (shouldParseData && result) {
            result = parseResponse(result);
        }
        responseHandler(response, result);
    });
}
