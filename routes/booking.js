var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/helpers/globals');
var session = require(__dirname + '/../modules/helpers/session_handler');
var bookingOps = require(__dirname + '/../modules/database_modules/booking_operations');

var cabServiceModules = {
    ola: require('../modules/cab_modules/booking/ola'),
    tfs: require('../modules/cab_modules/booking/tfs'),
    uber: require('../modules/cab_modules/booking/uber'),
    meru: require('../modules/cab_modules/booking/meru'),
}

router.get('/create', function(request, response) {
    var service = request.query.service;
    //var validate = request.query.i;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (!session.isAuthenticated(request)) {
        var result = {
            error: 'User not logged in'
        };
        globals.sendResponse(response, result, 500);
    } else {
        var srcLatitude = request.query.srcLat;
        var srcLongitude = request.query.srcLng;
        var srcAddress = request.query.srcAddr;
        var destLatitude = request.query.destLat;
        var destLongitude = request.query.destLng;
        var destAddress = request.query.destAddr;
        var carType = request.query.carType;

        if (isNaN(parseFloat(srcLatitude)) || isNaN(parseFloat(srcLongitude))) {
            var result = {
                error: 'Latitude/Longitude not defined'
            };
            globals.sendResponse(response, result, 500);
        } else {
            var local_service = 'taxistop'
            if (!service) local_service = service;

            var bookingTemplate = bookingOps.getBookingTemplate(new Date(), srcAddress, {
                lat: srcLatitude,
                lng: srcLongitude
            }, destAddress, {
                lat: destLatitude,
                lng: destLongitude
            }, service);

            if (service && cabService && cabServiceModules[cabService]) {
                cabServiceModules[cabService].createBooking(globals.sendResponse, response, session.getUserData(), bookingTemplate, carType, shouldParseData);
            }
        }
    }
});

router.get('/cancel', function(request, response) {
    var service = request.query.service;
    //var validate = request.query.i;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (!session.isAuthenticated(request)) {
        var result = {
            error: 'User not logged in'
        };
        globals.sendResponse(response, result, 500);
    } else {
        var reason = request.query.reason;
        var bookingId = request.query.bookingId;

        if (!bookingId) {
            var result = {
                error: 'BookingId not defined'
            };
            globals.sendResponse(response, result, 500);
        } else {
            if (cabService && cabServiceModules[cabService]) {
                cabServiceModules[cabService].cancelBooking(globals.sendResponse, response, session.getUserData(), bookingId, shouldParseData, reason);
            }
        }
    }
});

router.get('/', function(request, response) {
    var service = request.query.service;
    //var validate = request.query.i;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (!session.isAuthenticated(request)) {
        var result = {
            error: 'User not logged in'
        };
        globals.sendResponse(response, result, 500);
    } else {
        if (!userId) {
            var result = {
                error: 'UserId not defined'
            };
            globals.sendResponse(response, result, 500);
        } else {
            if (cabService && cabServiceModules[cabService]) {
                cabServiceModules[cabService].bookingInfo(globals.sendResponse, response, userId, shouldParseData);
            }
        }
    }
});

module.exports = router;
