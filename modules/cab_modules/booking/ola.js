var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var OLA = require(__dirname + '/../common/ola');

function buildBookingURL(userData, latitude, longitude, address, carType) {
    var url = '/v3/booking/create?enable_auto=true&accuracy=10.0&speed=0.0&altitude=0.0&pickup_mode=NOW&location_type=CUSTOM';
    url += '&user_id=' + encodeURIComponent(userData.connected_services.ola.userId);
    url += '&lat=' + latitude + '&lng=' + longitude
    url += '&fix_time=' + new Date().getTime();
    for (key in OLA.Taxi_Name_Map) {
        if (carType && (OLA.Taxi_Name_Map[key].toLowerCase() == carType.toLowerCase()))  {
            url += '&category_id=' + key;
            break;
        }
    }
    url += '&address=' + encodeURIComponent(address);

    console.log('OLA API url :: ' + OLA.options.request.host + url);

    return url;
}

function buildCancelBookingURL(userData, bookingId, reason) {
    var url = '/v3/booking/cancel?enable_auto=true';
    url += '&user_id=' + encodeURIComponent(userData.connected_services.ola.userId);
    url += '&booking_id=' + bookingId;

    if (reason) {
        url += '&reason=' + reason;
    } else {
        url += '&reason=Changed+my+mind';
    }

    return url;
}

function buildBookingInfoURL(userData) {
    var url = '/v3/cab/info?selected_by=USER&enable_auto=true&enable_delivery=true';
    url += '&user_id=' + encodeURIComponent(userData.connected_services.ola.userId);

    return url;
}

function buildCouponURL(userData, carType, couponCode) {
    var url = '/v3/booking/coupon/verify?pickup_date=0';
    for (key in OLA.Taxi_Name_Map) {
        if (carType && (OLA.Taxi_Name_Map[key].toLowerCase() == carType.toLowerCase()))  {
            url += '&car_category=' + key;
            break;
        }
    }
    url += '&coupon_code=' +couponCode;
    url += '&user_id=' + encodeURIComponent(userData.connected_services.ola.userId);

    return url;
}

function parseBookingResponse(type, response, status, partialBookingData) {
    var output = {
        status: response ? "success" : "failure",
        service: 'OLA'
    };

    if (type == 'create') {
        try {
            // Save booing Id and other details
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

exports.createBooking = function(responseHandler, response, userData, partialBookingData, carType, shouldParseData) {
    OLA.options.request.path = buildBookingURL(userData, partialBookingData.source_location.lat, partialBookingData.source_location.lng, partialBookingData.source_address, carType);

    request.getJSON(OLA.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('create', result, result.status, partialBookingData);
        }

        responseHandler(response, result);
    });
}

exports.cancelBooking = function(responseHandler, response, userData, bookingId, shouldParseData, reason) {
    OLA.options.request.path = buildCancelBookingURL(userData, bookingId, reason);
    
    request.getJSON(OLA.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.bookingInfo = function(responseHandler, response, userData, shouldParseData) {
    OLA.options.request.path = buildBookingInfoURL(userData);
    
    request.getJSON(OLA.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}
