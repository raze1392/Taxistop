var request = require(__dirname + '/../helpers/request');
var logger = require(__dirname + '/../helpers/log');
var OLA = require(__dirname + '/../common/ola');

function buildPriceURL(userId) {
    var url = '/v3/info/fare_breakup?enable_auto=true';

    if (userId) {
        url += '&user_id=' + userId;
    } else {
        url += '&user_id=' + OLA.options.userId;
    }

    return url;
}

function parseResponse(response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'OLA',
        prices: []
    };

    try {
        var cabsEstimate = {};
        var cabs = {};

        if (status && status.toLowerCase() === 'success' && response.cabs) {
            // Generate locations of available cabs
            for (var i = response.cabs.length - 1; i >= 0; i--) {
                var tName = OLA.Taxi_Name_Map[response.cabs[i].category_id];

                if (!cabs[tName]) {
                    cabs[tName] = [];
                }

                if (cabs[tName].length == 5) continue;

                cabs[tName].push({
                    lat: response.cabs[i].lat,
                    lng: response.cabs[i].lng,
                });
            }

            //detail of nearest cab
            for (var i = response.cab_categories.length - 1; i >= 0; i--) {
                var availability = response.cab_categories[i].cab_availability;
                var cabData = {
                    available: availability,
                    type: 'OLA'
                };

                if (availability) {
                    cabData.duration = response.cab_categories[i].duration.value;
                    cabData.distance = response.cab_categories[i].distance.value;
                }

                cabsEstimate[OLA.Taxi_Name_Map[response.cab_categories[i].id]] = cabData;
            };

            output.cabs = cabs;
            output.cabsEstimate = [];

            for (key in cabsEstimate) {
                var _cEst = cabsEstimate[key];
                _cEst.name = key;
                output.cabsEstimate.push(_cEst);
            }
        }
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.price = function(responseHandler, response, srcLatitude, srcLongitude, destLatitude, destLongitude, shouldParseData, userId) {
    OLA.options.path = buildPriceURL(userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        if (shouldParseData && result) {
            result = parseResponse(result, result.status);
        }
        responseHandler(response, result);
    });
}
