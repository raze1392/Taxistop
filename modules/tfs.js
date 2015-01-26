var request = require('../modules/request');

var TFS = {};
TFS.options = {
    host: 'iospush.taxiforsure.com',
    port: 80,
    method: 'GET',
    path: ''
};

function buildURL(latitude, longitude, userId) {
    var url = '/getNearestDriversForApp/?density=320&appVersion=4.1.1';

    if (latitude && longitude) {
        url += '&latitude=' + latitude + '&longitude=' + longitude
    }

    console.log('TFS API url :: ' + TFS.options.host + url);
    return url;
}

exports.call = function(responseHandler, response, latitude, longitude, userId) {
    TFS.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(TFS.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        responseHandler(response, result);
    });
}
