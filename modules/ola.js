var request = require('../modules/request');

var OLA = {};
OLA.options = {
    host: 'mapi.olacabs.com',
    port: 80,
    method: 'GET',
    headers: {
        'api-key': '@ndro1d',
        'Host': 'mapi.olacabs.com',
        'client': 'android',
        'device_id': 911380450341890,
        'enable_auto': true
    },
    path: ''
};
OLA.Taxi_Name_Map = {
    economy_sedan: 'Sedan',
    compact: 'Mini',
    local_auto: 'Auto',
    pink: 'Pink',
    luxury_sedan: 'Prime',
    local_taxi: 'Kaali Peeli'
}

function buildCabsURL(latitude, longitude, userId) {
    var url = '/v3/cab/info?accuracy=15.0&speed=0.0&altitude=0.0&location_type=CUSTOM&selected_by=USER&enable_auto=true&enable_delivery=true';

    if (latitude && longitude) {
        url += '&custom_lat=' + latitude + '&custom_lng=' + longitude
    }

    if (userId) {
        url += '&user_id=' + userId;
    } else {
        url += '&user_id=YjTgq%2F3vNPAVbf63OC3e%2FT3AYM8iYAZ5U9MZQ9NvX93iZrnhHJpmjq%2B9qvkL%0Ae5xkBh41YoCrbExGknVr2%2BSwUg%3D%3D%0A++++';
    }

    url += '&cab_category=[economy_sedan,compact,luxury_sedan,pink,local_auto]';
    url += '&fix_time=' + new Date().getTime();

    //console.log('OLA API url :: ' + OLA.options.host + url);
    return url;
}

function buildPriceURL(userId) {
    var url = '/v3/info/fare_breakup?&enable_auto=true';

    if (userId) {
        url += '&user_id=' + userId;
    } else {
        url += '&user_id=YjTgq%2F3vNPAVbf63OC3e%2FT3AYM8iYAZ5U9MZQ9NvX93iZrnhHJpmjq%2B9qvkL%0Ae5xkBh41YoCrbExGknVr2%2BSwUg%3D%3D%0A++++';
    }

    //console.log('OLA API url :: ' + OLA.options.host + url);
    return url;
}

function parseResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'OLA',
        cabs: {},
        cabsEstimate: []
    };

    if (type === 'cabs') {
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
            console.log("Error in OLA");
            return output;
        }
    } else if (type === 'price') {

    }

    return output;
}

exports.call = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    OLA.options.path = buildCabsURL(latitude, longitude, userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseResponse('cabs', result, result.status);
        }
        responseHandler(response, result);
    });
}


exports.price = function(responseHandler, response, srcLatitude, srcLongitude, destLatitude, destLongitude, shouldParseData, userId) {
    OLA.options.path = buildPriceURL(userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        if (shouldParseData && result) {
            result = parseResponse('price', result, result.status);
        }
        responseHandler(response, result);
    });
}
