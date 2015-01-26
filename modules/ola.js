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

    console.log('OLA API url :: ' + OLA.options.host +  url);
    return url;
}

exports.call = function(responseHandler, response, latitude, longitude, userId) {
    OLA.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        responseHandler(response, result);
    });
}
