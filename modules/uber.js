var request = require(__dirname + '/../modules/request');
var logger = require(__dirname + '/../modules/log');

var UBER = {};
UBER.options = {
    host: 'api.uber.com',
    port: 443,
    method: 'GET',
    path: ''
};

function buildEstimateURL(latitude, longitude, userId) {
    var url = '/v1/estimates/time?server_token=RQ28hrjOR39zq2w5sof9xiTHolQ_z9t4n5T2etHP';

    if (latitude && longitude) {
        url += '&start_latitude=' + latitude + '&start_longitude=' + longitude
    }

    //console.log('UBER Estimate API url :: ' + UBER.options.host + url);
    return url;
}

function buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId) {
    var url = '/v1/estimates/price?server_token=RQ28hrjOR39zq2w5sof9xiTHolQ_z9t4n5T2etHP';

    if (srcLatitude && srcLongitude && destLatitude && destLongitude) {
        url += '&start_latitude=' + srcLatitude + '&start_longitude=' + srcLongitude;
        url += '&end_latitude=' + destLatitude + '&end_longitude=' + destLongitude;
    }

    //console.log('UBER Cost API url :: ' + UBER.options.host + url);
    return url;
}

function parseCabsResponse(type, response) {
    var output = {
        status: response ? "success" : "failure",
        service: 'UBER',
        cabs: {},
        cabsEstimate: []
    }

    try {
        if (type === 'estimate' && response && response.times) {
            output.cabsEstimate = [];

            for (var i = 0; i < response.times.length; i++) {
                var _cEst = {
                    name: response.times[i].localized_display_name,
                    available: true,
                    duration: parseFloat(response.times[i].estimate / 60).toFixed(2),
                    distance: null,
                    type: 'UBER'
                }
                output.cabsEstimate.push(_cEst);
            }
        } else if (type === 'price' && response.prices) {
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

exports.cabs = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    UBER.options.path = buildEstimateURL(latitude, longitude, userId);

    request.getJSON(UBER.options, function(statusCode, result) {
        if (shouldParseData) {
            result = parseCabsResponse('estimate', result);
        }
        responseHandler(response, result);
    });
}

exports.price = function(responseHandler, response, srcLatitude, srcLongitude, destLatitude, destLongitude, shouldParseData, userId) {
    UBER.options.path = buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId);

    request.getJSON(UBER.options, function(statusCode, result) {
        if (shouldParseData && result) {
            result = parseCabsResponse('price', result);
        }
        responseHandler(response, result);
    });
}
