var request = require('../modules/request');

var MERU = {};
MERU.options = {
    host: 'mobileapp.merucabs.com',
    port: 80,
    method: 'GET',
    path: ''
};

function buildURL(latitude, longitude, userId) {
    var url = '/NearByCab_ETA/GetNearByCabs.svc/rest/nearby?SuggestedRadiusMeters=5000&CabMaxCount=10';

    if (latitude && longitude) {
        url += '&Lat=' + latitude + '&Lng=' + longitude
    }

    console.log('MERU API url :: ' + MERU.options.host + url);
    return url;
}

exports.call = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    MERU.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(MERU.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        responseHandler(response, result);
    }, 'meru');
}
