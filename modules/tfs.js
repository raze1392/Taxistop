var request = require('../modules/request');

var TFS = {};
TFS.options = {
    host: 'iospush.taxiforsure.com',
    port: 80,
    method: 'GET',
    path: ''
};
TFS.Taxi_Name_Map = {
    hatchback: 'Hatchback',
    sedan: 'Sedan',
    auto: 'Auto',
    nano: 'Nano'
}

function buildURL(latitude, longitude, userId) {
    var url = '/getNearestDriversForApp/?density=320&appVersion=4.1.1';

    if (latitude && longitude) {
        url += '&latitude=' + latitude + '&longitude=' + longitude
    }

    //console.log('TFS API url :: ' + TFS.options.host + url);
    return url;
}

function parseResponse(response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'TFS',
        cabs: {},
        cabsEstimate: []
    }

    try {
        var cabsEstimate = {};
        var cabs = {};

        if (status && status.toLowerCase() === 'success' && response.data) {
            // Generate locations of available cabs
            for (var i = response.data.length - 1; i >= 0; i--) {
                var tName = TFS.Taxi_Name_Map[response.data[i].carType.toLowerCase()];

                if (!cabs[tName]) {
                    cabs[tName] = [];
                }

                cabs[tName].push({
                    lat: response.data[i].latitude,
                    lng: response.data[i].longitude,
                    distance: parseFloat(response.data[i].distance),
                    duration: response.data[i].duration,
                });
            };

            for (cab in cabs) {
                var cabEO = {
                    available: false,
                    type: 'TFS'
                };

                if (cabs[cab].length > 0) {
                    cabEO['available'] = true;
                    cabEO['distance'] = cabs[cab][0].distance;
                    cabEO['duration'] = cabs[cab][0].duration;
                    delete cabs[cab][0].distance;
                    delete cabs[cab][0].duration;

                    for (var i = cabs[cab].length - 1; i >= 1; i--) {
                        if (cabs[cab][i].distance < cabEO.distance) {
                            cabEO['distance'] = cabs[cab][i].distance;
                            cabEO['duration'] = cabs[cab][i].duration;
                        }

                        delete cabs[cab][i].distance;
                        delete cabs[cab][i].duration;
                    };
                }

                cabsEstimate[cab] = cabEO;
            }

            output.cabs = cabs;
            output.cabsEstimate = [];

            for (key in cabsEstimate) {
                var _cEst = cabsEstimate[key];
                _cEst.name = key;
                output.cabsEstimate.push(_cEst);
            }
        }
    } catch (ex) {
        console.log("Error in TFS");
        return output;
    }

    return output;
}

exports.call = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    TFS.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(TFS.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseResponse(result.response_data, result.status);
        }
        responseHandler(response, result);
    });
}
