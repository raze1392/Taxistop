var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/helpers/globals');

var cabServiceModules = {
    ola: require('../modules/cab_modules/cabs/ola'),
    tfs: require('../modules/cab_modules/cabs/tfs'),
    uber: require('../modules/cab_modules/cabs/uber'),
    meru: require('../modules/cab_modules/cabs/meru'),
}
var cabCostModules = {
    ola: require('../modules/cab_modules/pricing/ola'),
    tfs: require('../modules/cab_modules/pricing/tfs'),
    uber: require('../modules/cab_modules/pricing/uber'),
    meru: require('../modules/cab_modules/pricing/meru'),
}
var CAB_SERVICES = globals.getCabServices();

// Route to get cab list
router.get('/now/:cab', function(request, response) {
    var session = request.session;

    var latitude = request.query.lat;
    var longitude = request.query.lng;
    var cabService = request.params.cab;
    var validate = request.query.i;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    // Check that latitude and longitude are present and both are float
    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
        var result = {
            error: 'Latitude and Longitude not defined'
        };
        globals.sendResponse(response, result, 500);
    } else {
        // Check for cabservice and handle accordingly
        if (cabService && cabServiceModules[cabService] && (!globals.isEnvironmentProduction() || validate)) {
            cabServiceModules[cabService].cabs(globals.sendResponse, response, latitude, longitude, shouldParseData);
        } else if (cabService === 'all') {
            var ALL_RESP = {};
            ALL_RESP.cabs = {};
            ALL_RESP.cabsEstimate = [];
            ALL_RESP.serviceAdded = 0;
            gatherGlobalResponse(ALL_RESP, response, latitude, longitude, shouldParseData);
        } else {
            var result = {
                error: 'Unidentified endpoint/Not Allowed'
            };
            globals.sendResponse(response, result, 500);
        }
    }
});

// Route to get cab list
router.get('/later/', function(request, response) {
    var session = request.session;

    var latitude = request.query.lat;
    var longitude = request.query.lng;
    var validate = request.query.i;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    // Check that latitude and longitude are present and both are float
    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
        var result = {
            error: 'Latitude and Longitude not defined'
        };
        sendResponse(response, result);
    } else {
        var result = {
            error: 'Unidentified endpoint/Not Allowed'
        };
        sendResponse(response, result);
    }
});


// Route to get cab cost
router.get('/:cab/cost', function(request, response) {
    var session = request.session;

    var srcLatitude = request.query.srcLat;
    var srcLongitude = request.query.srcLng;
    var destLatitude = request.query.destLat;
    var destLongitude = request.query.destLng;
    var city = request.query.city;
    var cabService = request.params.cab;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (cabService && cabCostModules[cabService]) {
        cabCostModules[cabService].price(globals.sendResponse, response, srcLatitude, srcLongitude, destLatitude, destLongitude, city, shouldParseData);
    }
});

function gatherGlobalResponse(ALL_RESP, response, latitude, longitude, shouldParseData) {
    for (service in cabServiceModules) {
        //console.log('Calling service ' + service);
        cabServiceModules[service].cabs(function(response, result) {
            ALL_RESP.serviceAdded++;
            if (result) {
                ALL_RESP.cabs[result.service] = result.cabs;
                ALL_RESP.cabsEstimate = ALL_RESP.cabsEstimate.concat(result.cabsEstimate);
            }
            if (ALL_RESP.serviceAdded === CAB_SERVICES.length) {
                globals.sendResponse(response, ALL_RESP);
            }
        }, response, latitude, longitude, shouldParseData);
    }
}

module.exports = router;
