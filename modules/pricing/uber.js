var request = require(__dirname + '/../helpers/request');
var logger = require(__dirname + '/../helpers/log');
var UBER = require(__dirname + '/../common/uber');

function buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId) {
    var url = '/v1/estimates/price?server_token=' + UBER.options.serverToken;

    if (srcLatitude && srcLongitude && destLatitude && destLongitude) {
        url += '&start_latitude=' + srcLatitude + '&start_longitude=' + srcLongitude;
        url += '&end_latitude=' + destLatitude + '&end_longitude=' + destLongitude;
    }

    //console.log('UBER Cost API url :: ' + UBER.options.host + url);
    return url;
}

function parseResponse(response) {
    var output = {
        status: response ? "success" : "failure",
        service: 'UBER',
        cabs: {},
        cabsEstimate: []
    }

    try {
        if (response.prices) {
            output.prices = [];

            for (var i = 0; i < response.prices.length; i++) {
                var _cEst = {
                    name: response.prices[i].localized_display_name,
                    available: true,
                    duration: parseFloat(response.prices[i].duration / 60).toFixed(2),
                    distance: response.prices[i].distance,
                    multiplier: response.prices[i].surge_multiplier,
                    low_estimate: response.prices[i].low_estimate,
                    high_estimate: response.prices[i].high_estimate
                }
                output.prices.push(_cEst);
            }
        }
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.price = function(responseHandler, response, srcLatitude, srcLongitude, destLatitude, destLongitude, shouldParseData, userId) {
    UBER.options.path = buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId);

    request.getJSON(UBER.options, function(statusCode, result) {
        if (shouldParseData && result) {
            result = parseResponse(result);
        }
        responseHandler(response, result);
    });
}
