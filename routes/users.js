var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/helpers/globals');
var utils = require(__dirname + '/../modules/helpers/utils');
var session = require(__dirname + '/../modules/helpers/session_handler');
var userOps = require(__dirname + '/../modules/database_modules/user_operations');

var cabServiceModules = {
    ola: require('../modules/cab_modules/login/ola'),
    tfs: require('../modules/cab_modules/login/tfs'),
    uber: require('../modules/cab_modules/login/uber'),
    meru: require('../modules/cab_modules/login/meru'),
}

router.get('/', function(request, response) {
    var userId = request.query.userId;

    if (!userId && globals.isEnvironmentProduction()) {
        var result = {
            message: "Need a userId to query a user"
        }
        globals.sendResponse(response, result, 500);
    } else if (!userId && !globals.isEnvironmentProduction()) {
        userOps.getAllUsers(function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error fetching User"
                }
                globals.sendResponse(response, result, 500);
            } else {
                result = data;
                globals.sendResponse(response, result);
            }
        });
    } else {
        userOps.getUser(userId, function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error fetching User"
                }
                globals.sendResponse(response, result, 500);
            } else {
                result = data;
                globals.sendResponse(response, result);
            }
        });
    }
});

router.get('/signup', function(request, response) {
    var email = decodeURIComponent(request.query.email);
    var encPassword = request.query.password;
    var name = request.query.name;
    var phone = request.query.phone;

    if (!email || !encPassword || !name || !phone) {
        var result = {
            message: "Missing email, password, name and phone"
        }
        globals.sendResponse(response, result, 500);
    } else if (!utils.isValidEmail(email)) {
        globals.sendResponse(response, {
            message: "Invalid email id provided."
        }, 500);
    } else if (!utils.isValidPhone(phone)) {
        globals.sendResponse(response, {
            message: "Invalid phone number provided."
        }, 500);
    } else {
        var userTemplate = userOps.getUserTemplate(name, email, encPassword, phone);
        userOps.createUser(userTemplate, function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error Creating User"
                }
                globals.sendResponse(response, result, 500);
            } else {
                result = data;
                globals.sendResponse(response, result);
            }
        });
    }
});

router.get('/authenticate', function(request, response) {
    var email = request.query.email;
    var encPassword = request.query.password;
    var phone = request.query.phone;

    if (session.isAuthenticated(request)) {
        globals.sendResponse(response, session.getUserData(request));
    } else {
        if ((!email && !phone) || !encPassword) {
            var result = {
                message: "Need email/phone and password to authenticate"
            }
            sendResponse(response, result);
        } else {
            userOps.authenticateUser(email, encPassword, phone, function(data) {
                var result = {};

                if (data == -1) {
                    result = {
                        message: "Error Authenticating User"
                    }
                    globals.sendResponse(response, result, 500);
                } else {
                    // Setting session info
                    session.authenticateSession(request, data);
                    result = data;
                    globals.sendResponse(response, result);
                }
            });
        }
    }
});

router.get('/connect/:service', function(request, response) {
    var serviceName = request.params.service;
    var email = request.query.email;
    var encPassword = request.query.password;
    var phonenumber = request.query.phone;

    var shouldParseData = request.query.parseData ? (request.query.parseData == 'false' ? false : true) : true;

    if (!session.isAuthenticated(request)) {
        var result = {
            error: 'User not logged in'
        };
        globals.sendResponse(response, result, 500);
    } else {
        if (!email || !phonenumber || !encPassword) {
            var result = {
                message: "Need email, phone and password to authenticate"
            }
            globals.sendResponse(response, result, 500);
        } else {
            var userData = session.getUserData(request);
            if (serviceName && cabServiceModules[serviceName]) {
                // Save connected service insinde login module
                cabServiceModules[serviceName].login(globals.sendResponse, request, response, userData, email, encPassword, phonenumber, shouldParseData);
            }
        }
    }
});

router.get('/logout', function(request, response) {
    session.killSession(request);
    var result = {
        success: true,
        message: "User successfully logged out"
    }
    globals.sendResponse(response, result);
});

// Save user via POST
// router.post('/', function(request, response) {
//     var email = request.body.email;
//     var password = request.body.password;
//     var name = request.body.name;
//     var phone = request.body.phone;
// });

module.exports = router;
