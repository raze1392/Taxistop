var express = require('express');
var globals = require('../modules/globals');

var router = express.Router();
var APIKeys = globals.getGoogleAPIKeys();
var API_INDEX = 0;

/* GET home page. */
router.get('/', function(req, res) {
	var mapUrl = 'https://maps.googleapis.com/maps/api/js?libraries=places';
	mapUrl += (APIKeys[API_INDEX] === "" ? ("&key=" + APIKeys[API_INDEX+1]) : ("&key=" + APIKeys[API_INDEX]));
    API_INDEX = (API_INDEX + 1) % (APIKeys.length);

    res.render('index', {
        title: 'TaxiStop',
        gmaps: mapUrl
    });
});

module.exports = router;
