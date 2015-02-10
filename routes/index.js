var express = require('express');
var globals = require('../modules/globals');
var environment = process.env.NODE_ENV;

var router = express.Router();
var APIKeys = globals.getGoogleAPIKeys();
var API_INDEX = 0;

/* GET home page. */
router.get('/', function(req, res) {
	var url = {};
	if (environment === 'production') {
		url.cdnImagePrefix = 'http://akush.github.io/taxistop';
	} else {
		url.cdnImagePrefix = '';
	}
	url.gMapsAPI = (APIKeys[API_INDEX] === "" ? ("&key=" + APIKeys[API_INDEX+1]) : ("&key=" + APIKeys[API_INDEX]));
    API_INDEX = (API_INDEX + 1) % (APIKeys.length);

    var isEnvtProd = (environment === 'production') ? true : false;

    res.render('index', {
        isProd: isEnvtProd,
        title: 'TaxiStop',
        url: url
    });
});

module.exports = router;
