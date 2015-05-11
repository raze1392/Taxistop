var express = require('express');
var router = express.Router();

var googleDistance = require('../modules/helpers/googleDistance');

router.get('/', function(request, response) {
    var srcLocation = {
        lat: request.query.srcLat,
        lng: request.query.srcLng
    };
    var destLocation = {
        lat: request.query.destLat,
        lng: request.query.destLng
    };
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    var data = {
        service: 'google',
        responsePayload: {
            shouldParseData: shouldParseData
        },
        responseService: response,
        destinationLocation: destLocation,
        sourceLocations: [srcLocation]
    }

    googleDistance.call(globals.sendResponse, data);
});

module.exports = router;
