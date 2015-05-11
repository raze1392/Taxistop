var request = require(__dirname + '/../../helpers/request');
var logger = require(__dirname + '/../../helpers/log');
var MERU = require(__dirname + '/../common/meru');

function buildBookingURL() {
    var url = '/assets/GenieServices/GenieBookingAPI.php';

    return url;
}

function buildPostData(userData, srcLat, srcLng, srcAddress) {
    var data = 'Action=currentBooking&JsoneString='
    data += JSON.stringify({
        "userid": userData.connected_services.meru.userId,
        "isgenie": "0",
        "address": encodeURIComponent(srcAddress),
        "sub_area_id": "2768",
        "tracking_number": "",
        "customer_mobile": userData.phone,
        "PickupAreaId": "589",
        "PickupArea": "Btm 1st stage",
        "PickupSubArea": "Udupi garden",
        "City": "Bangalore",
        "PickupCityId": "5",
        "CustomerName": userData.name,
        "CustomerEmail": userData.email,
        "number_of_hours": "0",
        "return_journey": "0",
        "PromoCode": "",
        "device_id": "911380450341890",
        "pickupLatitude": srcLat,
        "pickupLongitude": srcLng,
        "CabDeviceId": "8051269,800367,801824",
        "ETA": "6,11,13",
        "device_type": "Android",
        "imageType": "hdpi",
        "auth_token": userData.connected_services.meru.authToken
    });

    console.log(data);

    return data;
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
        service: 'MERU'
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

exports.createBooking = function(responseHandler, response, userData, srcLatitude, srcLongitude, srcAddress, destLatitude, destLongitude, destAddress, carType, shouldParseData) {
    MERU.options.requestPost.path = buildBookingURL();

    var data = buildPostData(userData, srcLatitude, srcLongitude, srcAddress);

    MERU.options.requestPost.headers['Content-Length'] = data.length;
    MERU.options.requestPost.headers['Oauthtoken'] =  "9mgtdq9lqk1vncjfrchrcijiekw18c2qt6llmyttkg5x36h4okek1uywoe3k83ae";
    MERU.options.requestPost.headers['Mobilenumber'] = "9448800035";

    request.post(MERU.options.requestPost, data, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('create', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.cancelBooking = function(responseHandler, response, userId, bookingId, shouldParseData, reason) {
    MERU.options.request.path = buildCancelBookingURL(userId, bookingId, reason);

    request.getJSON(MERU.options.request, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}
