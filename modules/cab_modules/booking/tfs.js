var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var TFS = require(__dirname + '/../common/tfs');

// TODO
function buildBookingURL(userId, latitude, longitude, address, carType) {
    var url = '/api/consumer-app/book-now/';
    return url;
}

function buildBookingStatusURL() {
    var url = '/api/consumer-app/booking-status/';
    return url;
}

// TODO
function buildCancelBookingURL(userId, bookingId, reason) {
    var url = '/api/customer/cancel-taxi/';
    return url;
}

function buildPostBookingCreateData(userId, srcLatitude, srcLongitude, srcAddress, destLatitude, destLongitude, destAddress, carType) {
    var data = 'userId=' + userId;
    data += '&direction=&source=android';
    data += '&customer_name=Shivam&customer_number=9412243445&customer_email=no.email%40example.com';
    data += '&coupon_code=';
    data += '&pickup_area=' + encodeURIComponent(srcAddress);
    data += '&pickup_latitude=' + srcLatitude + '&pickup_longitude=' + srcLongitude;
    data += '&drop_latitude=' + destLatitude + '&drop_longitude=' + destLongitude;
    data += '&drop_address=' + encodeURIComponent(destAddress);
    for (key in TFS.Taxi_Name_Map) {
        if (carType && (TFS.Taxi_Name_Map[key].toLowerCase() == carType.toLowerCase())) {
            url += '&car_type=' + key;
            break;
        }
    }
    data += '&booking_type=p2p';
    data += '&device_id=911380450341890&appVersion=4.1.4';

    return data;
}

function buildPostBookingCancelData(userId, bookingId, reason) {
    var data = 'user_id=' + userId;
    data += '&booking_id=' + bookingId;
    data += '&cancellation_reason=Entered+wrong+time&appVersion=4.1.4';

    return data;
}

function parseBookingResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'TFS'
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
    TFS.options.requestPost.path = buildBookingURL();
    var data = buildPostBookingCreateData(userId, srcLatitude, srcLongitude, srcAddress, destLatitude, destLongitude, destAddress, carType);
    TFS.options.requestPost.headers['Content-Length'] = data.length;

    console.log(data);

    request.post(TFS.options.requestPost, data, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('create', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.cancelBooking = function(responseHandler, response, userId, bookingId, shouldParseData, reason) {
    TFS.options.requestPost.path = buildCancelBookingURL();
    var data = buildPostBookingCancelData(userId, bookingId, reason);
    TFS.options.requestPost.headers['Content-Length'] = data.length;

    request.post(TFS.options.requestPost, data, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}
