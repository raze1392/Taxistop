var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var UBER = require(__dirname + '/../common/uber');

// TODO
function buildBookingURL(userId, latitude, longitude, address, carType) {
    var url = '';
    url += '&user_id=' + userId;
    url += '&lat=' + latitude + '&lng=' + longitude
    url += '&fix_time=' + new Date().getTime();
    for (key in UBER.Taxi_Name_Map) {
        if (UBER.Taxi_Name_Map[key].toLowerCase() == carType) {
            url += '&category_id=' + key;
            break;
        }
    }
    url += 'address=' + address;

    return url;
}

// TODO
function buildCancelBookingURL(userId, bookingId, reason) {
    var url = '';
    url += '&user_id=' + userId;
    url += '&booking_id=' + bookingId;

    if (reason) {
        url += '&reason=' + reason;
    } else {
        url += '&reason=Changed+my+mind';
    }

    return url;
}

function parseBookingResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'UBER'
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

exports.createBooking = function(responseHandler, response, userId, latitude, longitude, address, carType, shouldParseData) {
    UBER.options.request.path = buildBookingURL(userId, latitude, longitude, address, carType);

    request.getJSON(UBER.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('create', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.cancelBooking = function(responseHandler, response, userId, bookingId, shouldParseData, reason) {
    UBER.options.request.path = buildCancelBookingURL(userId, bookingId, reason);

    request.getJSON(UBER.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}
