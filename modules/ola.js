var request = require('../modules/request');

var OLA = {};
OLA.options = {
    host: 'mapi.olacabs.com',
    port: 80,
    method: 'GET',
    headers: {
        'api-key': '@ndro1d',
        'Host': 'mapi.olacabs.com',
        'client': 'android'
    },
    path: ''
};
OLA.Taxi_Name_Map = {
    economy_sedan: 'Sedan',
    compact: 'Mini',
    local_auto: 'Auto',
    pink: 'Pink',
    luxury_sedan: 'Prime'
}

function buildURL(latitude, longitude, userId) {
    var url = '/v3/cab/info?accuracy=10.0&fix_time=1414867768827&speed=0.0&altitude=0.0&location_type=CUSTOM&selected_by=USER&&enable_auto=true&enable_delivery=true';

    if (latitude && longitude) {
        url += '&custom_lat=' + latitude + '&custom_lng=' + longitude
    }

    if (userId) {
        url += '&user_id=' + userId;
    } else {
        url += '&user_id=z%2FSOjdAeOaXpiu3YGpZbX4yan5NjzSyoFQ3bMhayj%2FLK11hcaHYppAIW6bxl%0AU%2BVT64RfuNjRmCF8em1tgbyD3g%3D%3D%0A++++';
    }

    url += '&cab_category=[economy_sedan,compact,luxury_sedan,pink,local_auto]';

    console.log('OLA API url :: ' + OLA.options.host + url);
    return url;
}

function parseResponse(response, status) {
    var output = {
        status: status
    }

    var cabsEstimate = {};
    var cabs = {};

    if (status && status.toLowerCase() === 'success') {
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
        		available: availability
        	};

        	if (availability) {
        		cabData.duration = response.cab_categories[i].duration.value;
        		cabData.distance = response.cab_categories[i].distance.value;
        	}

        	cabsEstimate[OLA.Taxi_Name_Map[response.cab_categories[i].id]] = cabData;
        };

        output.cabs = cabs;
        output.cabsEstimate = cabsEstimate;
    }

    return output;
}

exports.call = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    OLA.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData) {
            result = parseResponse(result, result.status);
        }
        responseHandler(response, result);
    });
}
