var express = require('express');
var router = express.Router();

var request = require('../modules/request');
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

function sendResponse(response, result) {
    response.json(result);
}

module.exports = router;
