var request = require(__dirname + '/../helpers/request');
var logger = require(__dirname + '/../helpers/log');
var UBER = require(__dirname + '/../common/uber');

function buildURL(latitude, longitude, userId) {
    var url = '/v1/estimates/time?server_token=' + UBER.options.serverToken;

    if (latitude && longitude) {
        url += '&start_latitude=' + latitude + '&start_longitude=' + longitude
    }

    //console.log('UBER Estimate API url :: ' + UBER.options.host + url);
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
        if (response && response.times) {
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
        }
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.cabs = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    UBER.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(UBER.options, function(statusCode, result) {
        if (shouldParseData) {
            result = parseResponse(result);
        }
        responseHandler(response, result);
    });
}
