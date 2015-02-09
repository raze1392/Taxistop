var express = require('express');
var router = express.Router();

var cabServiceModules = {
    ola: require('../modules/ola'),
    tfs: require('../modules/tfs'),
    uber: require('../modules/uber'),
    meru: require('../modules/meru'),
}
var totalCabServiceModules = 4;

var ALL_RESP = {};
ALL_RESP.cabs = {};
ALL_RESP.cabsEstimate = [];
ALL_RESP.serviceAdded = 0;

router.get('/:cab', function(request, response) {
    var latitude = request.query.lat;
    var longitude = request.query.lng;
    var cabService = request.params.cab;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (cabService && cabServiceModules[cabService]) {
        cabServiceModules[cabService].call(sendResponse, response, latitude, longitude, shouldParseData);
    } else if (cabService === 'all') {
        for (service in cabServiceModules) {
            cabServiceModules[service].call(gatherGlobalResponse, response, latitude, longitude, shouldParseData);
        }
    }
});

router.get('/:cab/cost', function(request, response) {
    var srcLatitude =  request.query.srcLat;
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

function gatherGlobalResponse(response, result) {
    ALL_RESP.serviceAdded++;
    ALL_RESP.cabs[result.service] = result.cabs;
    ALL_RESP.cabsEstimate = ALL_RESP.cabsEstimate.concat(result.cabsEstimate);
    if (ALL_RESP.serviceAdded === totalCabServiceModules) {
        delete ALL_RESP.serviceAdded;
        sendResponse(response, ALL_RESP);
    }
}

module.exports = router;
