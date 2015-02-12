var express = require('express');
var globals = require(__dirname + '/../modules/globals');
var logger = require(__dirname + '/../modules/log');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var url = {
        cdnImagePrefix: globals.getCDNUrlPrefix(),
        gMapsAPI: globals.getGmapsAPI()
    };
    var isEnvtProd = (globals.getEnvironment() === 'production') ? true : false;

    res.render('index', {
        isProd: isEnvtProd,
        title: 'TaxiStop',
        url: url
    });
});

module.exports = router;
