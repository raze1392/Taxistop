var express = require('express');
var Firebase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");
var globals = require(__dirname + '/../modules/helpers/globals');
var logger = require(__dirname + '/../modules/helpers/log');

var router = express.Router();

var cabServiceModules = {
    ola: require('../modules/cab_modules/login/ola'),
    tfs: require('../modules/cab_modules/login/tfs'),
    uber: require('../modules/cab_modules/login/uber'),
    meru: require('../modules/cab_modules/login/meru'),
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

    if (!userCookie) {
        failedResponse(response, 'user not logged in');
    } else {
        var ref = new Firebase("https://vivid-inferno-8339.firebaseio.com/users/" + userCookie + "/timestamp");
        var tokenGenerator = new FirebaseTokenGenerator("4fbWFdEsKHSwkNG6xDikveNBMnSBbYGPlkn4QSNG");
        var token = tokenGenerator.createToken({
            uid: "1",
            taxistopService: true
        }, {
            admin: true
        });
        ref.authWithCustomToken(token, function(error, authData) {
            if (!error) {
                ref.on("value", function(timestamp) {
                    if (timestamp.val()) {
                        if (serviceName && cabServiceModules[serviceName]) {
                            cabServiceModules[serviceName].login(sendResponse, response, userCookie, email, encPassword, shouldParseData, saveCredentials);
                        }
                    } else {
                        failedResponse(response, 'invalid user');
                    }
                }, function(errorObject) {
                    failedResponse(response, 'invalid user');
                });
            } else {
                failedResponse(response, 'error occured');
            }
        });
    }
});

function failedResponse(response, msg) {
    sendResponse(response, {
        success: false,
        message: msg
    });
}

function sendResponse(response, result) {
    response.json(result);
}

function saveCredentials(userCookie, email, encPassword, service, result) {
    var data = result;
    result.email = email;
    result.encPassword = encPassword;
    result.timestamp = (new Date()).getTime();
    var ref = new Firebase("https://flickering-inferno-5036.firebaseio.com/");
    var tokenGenerator = new FirebaseTokenGenerator("QbJrI593zkc2pvfQnHNIXsrNfgIUSR8MlOGVpRIq");
    var token = tokenGenerator.createToken({
        uid: "1",
        taxistopService: true
    }, {
        admin: true
    });
    ref.authWithCustomToken(token, function(error, authData) {
        if (!error) {
            ref.child(userCookie).child(service).set(data);
        }
    });
}

module.exports = router;
