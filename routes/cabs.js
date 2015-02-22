var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/globals');

var cabServiceModules = {
    ola: require('../modules/ola'),
    tfs: require('../modules/tfs'),
    uber: require('../modules/uber'),
    meru: require('../modules/meru'),
}
var CAB_SERVICES = globals.getCabServices();

// Route to get cab list
router.get('/:cab', function(request, response) {
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
        sendResponse(response, result);
    } else {
        // Check for cabservice and handle accordingly
        if (cabService && cabServiceModules[cabService] && (!globals.isEnvironmentProduction() || validate)) {
            cabServiceModules[cabService].cabs(sendResponse, response, latitude, longitude, shouldParseData);
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
            sendResponse(response, result);
        }
    }
});


// Route to get cab cost
router.get('/:cab/cost', function(request, response) {
    var session = request.session;

    var srcLatitude = request.query.srcLat;
    var srcLongitude = request.query.srcLng;
    var destLatitude = request.query.destLat;
    var destLongitude = request.query.destLng;
    var cabService = request.params.cab;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (cabService && cabServiceModules[cabService]) {
        cabServiceModules[cabService].price(sendResponse, response, srcLatitude, srcLongitude, destLatitude, destLongitude, shouldParseData);
    }
});

function sendResponse(response, result) {
    response.json(result);
}

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
                sendResponse(response, ALL_RESP);
            }
        }, response, latitude, longitude, shouldParseData);
    }
}

module.exports = router;
