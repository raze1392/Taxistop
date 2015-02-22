var express = require('express');
var globals = require(__dirname + '/../modules/globals');
var logger = require(__dirname + '/../modules/log');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var session = req.session;
	
    var url = {
        cdnImagePrefix: globals.getCDNUrlPrefix(),
        gMapsAPI: globals.getGmapsAPI()
    };

    res.render('index', {
        isProd: globals.isEnvironmentProduction(),
        title: 'TaxiStop',
        url: url
    });
});

router.get('/login.html', function(req, res) {
    var url = {
        cdnImagePrefix: globals.getCDNUrlPrefix(),
        gMapsAPI: globals.getGmapsAPI()
    };

    res.render('login', {
        isProd: globals.isEnvironmentProduction(),
        title: 'TaxiStop',
        url: url
    });
});

router.get('/content.html', function(req, res) {
    var url = {
        cdnImagePrefix: globals.getCDNUrlPrefix(),
        gMapsAPI: globals.getGmapsAPI()
    };

    res.render('content', {
        isProd: globals.isEnvironmentProduction(),
        title: 'TaxiStop',
        url: url
    });
});

module.exports = router;
