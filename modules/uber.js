var request = require('../modules/request');

var UBER = {};
UBER.options = {
    host: 'api.uber.com',
    port: 443,
    method: 'GET',
    path: ''
};

function buildURL(latitude, longitude, userId) {
    var url = '/v1/estimates/time?server_token=RQ28hrjOR39zq2w5sof9xiTHolQ_z9t4n5T2etHP';

    if (latitude && longitude) {
        url += '&start_latitude=' + latitude + '&start_longitude=' + longitude
    }

    console.log('UBER API url :: ' + UBER.options.host + url);
    return url;
}

function parseResponse(response) {
    var output = {
        status: "success"
    }
    output.cabsEstimate = [];

    for (var i = 0; i < response.times.length; i++) {
        var _cEst = {
            name: response.times[i].localized_display_name,
            available: true,
            duration: response.times[i].estimate / 60,
            distance: null
        }
        output.cabsEstimate.push(_cEst);
    }

    return output;
}

exports.call = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    UBER.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(UBER.options, function(statusCode, result) {
        if (shouldParseData) {
            result = parseResponse(result);
        }
        responseHandler(response, result);
    });
}
