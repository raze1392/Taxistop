var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/helpers/globals');

var cabServiceModules = {
    ola: require('../modules/cab_modules/booking/ola'),
    tfs: require('../modules/cab_modules/booking/tfs'),
    uber: require('../modules/cab_modules/booking/uber'),
    meru: require('../modules/cab_modules/booking/meru'),
}
var CAB_SERVICES = globals.getCabServices();

router.get('/:cab/:bookingStatus', function(request, response) {
    var cabService = request.params.cab;
    var bookingStatus = request.params.bookingStatus;
    //var validate = request.query.i;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (bookingStatus == 'create') {
        var srcLatitude = request.query.srcLat;
        var srcLongitude = request.query.srcLng;
        var srcAddress = request.query.srcAddr;
        var destLatitude = request.query.destLat;
        var destLongitude = request.query.destLng;
        var destAddress = request.query.destAddr;
        var carType = request.query.carType;
        var userId = request.query.userId;

        if (isNaN(parseFloat(srcLatitude)) || isNaN(parseFloat(srcLongitude))) {
            var result = {
                error: 'Latitude/Longitude not defined'
            };
            sendResponse(response, result);
        } else {
            if (cabService && cabServiceModules[cabService]) {
                cabServiceModules[cabService].createBooking(sendResponse, response, userId, srcLatitude, srcLongitude, srcAddress, destLatitude, destLongitude, destAddress, carType, shouldParseData);
            }
        }
    } else if (bookingStatus == 'cancel') {
        var reason = request.query.reason;
        var bookingId = request.query.bookingId;
        var userId = request.query.userId;
        
        if (!userId || !bookingId) {
            var result = {
                error: 'BookingId/UserId not defined'
            };
            sendResponse(response, result);
        } else {
            if (cabService && cabServiceModules[cabService]) {
                cabServiceModules[cabService].cancelBooking(sendResponse, response, userId, bookingId, shouldParseData, reason);
            }
        }
    } else if (bookingStatus == 'info') {
        var userId = request.query.userId;

        if (!userId) {
            var result = {
                error: 'UserId not defined'
            };
            sendResponse(response, result);
        } else {
            if (cabService && cabServiceModules[cabService]) {
                cabServiceModules[cabService].bookingInfo(sendResponse, response, userId, shouldParseData);
            }
        }
    }
});

function sendResponse(response, result) {
    response.json(result);
}

module.exports = router;
