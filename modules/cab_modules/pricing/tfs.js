var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var TFS = require(__dirname + '/../common/tfs');

function buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId, city) {
    var url = '/api/consumer-app/fares-new/v3/';
    url += '?trip_type=pn&booking_type=p2p&source=app&appVersion=4.1.6&appVersionCode=35';

    var date = new Date();
    url += '&pickup_time=' + date.toTimeString().substring(0, 5);
    url += '&pickup_date=' + date.getDate() + "/" + (((date.getMonth()+1) < 10) ? ("0" + (date.getMonth()+1)) : (date.getMonth()+1)) + "/" + date.getFullYear();
    if (srcLatitude && srcLongitude && destLatitude && destLongitude) {
        url += '&pickup_latitude=' + srcLatitude + '&pickup_longitude=' + srcLongitude;
        url += '&drop_latitude=' + destLatitude + '&drop_longitude=' + destLongitude;
    }
    url += '&city=' + city;
console.log(url);
    return url;
}

function parseResponse(response) {
    var output = {
        status: response ? "success" : "failure",
        service: 'TFS',
        prices: []
    }

    try {
        
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.price = function(responseHandler, response, srcLatitude, srcLongitude, destLatitude, destLongitude, city, shouldParseData, userId) {
    TFS.options.requestGet.path = buildPriceURL(srcLatitude, srcLongitude, destLatitude, destLongitude, userId, city);

    request.getJSON(TFS.options.requestGet, function(statusCode, result) {
        if (shouldParseData && result) {
            result = parseResponse(result);
        }
        responseHandler(response, result);
    });
}
