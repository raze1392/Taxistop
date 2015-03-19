var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var OLA = require(__dirname + '/../common/ola');

function buildBookingURL(userId, latitude, longitude, address, carType) {
    var url = '/v3/booking/create?enable_auto=true&accuracy=10.0&speed=0.0&altitude=0.0&pickup_mode=NOW&location_type=CUSTOM';
    url += '&user_id=' + encodeURIComponent(userId);
    url += '&lat=' + latitude + '&lng=' + longitude
    url += '&fix_time=' + new Date().getTime();
    for (key in OLA.Taxi_Name_Map) {
        if (OLA.Taxi_Name_Map[key].toLowerCase() == carType.toLowerCase()) {
            url += '&category_id=' + key;
            break;
        }
    }
    url += '&address=' + encodeURIComponent(address);

    console.log('OLA API url :: ' + OLA.options.request.host + url);

    return url;
}

function buildCancelBookingURL(userId, bookingId, reason) {
    var url = '/v3/booking/cancel?enable_auto=true';
    url += '&user_id=' + encodeURIComponent(userId);
    url += '&booking_id=' + bookingId;

    if (reason) {
        url += '&reason=' + reason;
    } else {
        url += '&reason=Changed+my+mind';
    }

    return url;
}

function buildBookingInfoURL(userId) {
    var url = '/v3/cab/info?selected_by=USER&enable_auto=true&enable_delivery=true';
    url += '&user_id=' + encodeURIComponent(userId);

    return url;
}

function parseBookingResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'OLA'
    };

    if (type == 'create') {
        try {
            //Stub
        } catch (ex) {
            logger.warn(ex.getMessage(), ex);
            return output;
        }
    } else if (type == 'cancel') {
        try {
            //Stub
        } catch (ex) {
            logger.warn(ex.getMessage(), ex);
            return output;
        }
    }

    return output;
}

exports.createBooking = function(responseHandler, response, userId, srcLatitude, srcLongitude, srcAddress, destLatitude, destLongitude, destAddress, carType, shouldParseData) {
    OLA.options.request.path = buildBookingURL(userId, srcLatitude, srcLongitude, srcAddress, carType);

    request.getJSON(OLA.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('create', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.cancelBooking = function(responseHandler, response, userId, bookingId, shouldParseData, reason) {
    OLA.options.request.path = buildCancelBookingURL(userId, bookingId, reason);
    
    request.getJSON(OLA.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.bookingInfo = function(responseHandler, response, userId, shouldParseData) {
    OLA.options.request.path = buildBookingInfoURL(userId);
    
    request.getJSON(OLA.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}
