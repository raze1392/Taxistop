var express = require('express');
var router = express.Router();

var cabServiceModules = {
    ola: require('../modules/ola'),
    tfs: require('../modules/tfs'),
    uber: require('../modules/uber'),
    meru: require('../modules/meru'),
}

router.get('/:cab', function(request, response) {
    var latitude = request.query.lat;
    var longitude = request.query.lng;
    var cabService = request.params.cab;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (cabService && cabServiceModules[cabService]) {
        cabServiceModules[cabService].call(sendResponse, response, latitude, longitude, shouldParseData);
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

module.exports = router;
