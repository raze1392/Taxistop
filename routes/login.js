var express = require('express');
var Firebase = require("firebase");
var globals = require(__dirname + '/../modules/globals');
var logger = require(__dirname + '/../modules/log');

var router = express.Router();

var cabServiceModules = {
    ola: require('../modules/ola'),
    tfs: require('../modules/tfs'),
    uber: require('../modules/uber'),
    meru: require('../modules/meru'),
}

router.post('/', function(request, response) {
    var session = request.session;

    sendResponse(response, {});
});

router.get('/service/:serviceName', function(request, response) {
    var session = request.session;
    var serviceName = request.params.serviceName;
    var email = request.query.email;
    var encPassword = request.query.password;
    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    var userCookie = request.cookies.user;

    if (serviceName && cabServiceModules[serviceName]) {
        cabServiceModules[serviceName].login(sendResponse, response, userCookie, email, encPassword, shouldParseData, saveCredentials);
    }
});

function sendResponse(response, result) {
    response.json(result);
}

function saveCredentials(userCookie, service, result) {
    var ref = new Firebase("https://flickering-inferno-5036.firebaseio.com/");
    ref.child(userCookie).child(service).set(result);
}

module.exports = router;
