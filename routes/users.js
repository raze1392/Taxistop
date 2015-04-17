var express = require('express');
var router = express.Router();
var globals = require(__dirname + '/../modules/helpers/globals');
var userOps = require(__dirname + '/../modules/database_modules/user_operations');

router.get('/', function(request, response) {
    var userId = request.query.userId;

    if (!userId && globals.isEnvironmentProduction()) {
        var result = {
            message: "Need a userId to query a user"
        }
        sendResponse(response, result);
    } else if (!userId && !globals.isEnvironmentProduction()) {
        userOps.getAllUsers(function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error fetching User"
                }
            } else {
                result = data
            }

            sendResponse(response, result);
        });
    } else {
        userOps.getUser(userId, function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error fetching User"
                }
            } else {
                result = data
            }

            sendResponse(response, result);
        });
    }
});

router.get('/signup', function(request, response) {
    var email = request.query.email;
    var encPassword = request.query.password;
    var name = request.query.name;
    var phone = request.query.phone;

    if (!email || !encPassword || !name || !phone) {
        var result = {
            message: "Missing email, password, name and phone"
        }
        sendResponse(response, result);
    } else {
        var userTemplate = userOps.getUserTemplate(name, email, encPassword, phone);
        userOps.createUser(userTemplate, function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error Creating User"
                }
            } else {
                result = data;
            }
            
            sendResponse(response, result);
        });
    }
});

// Save user via POST
router.post('/', function(request, response) {
    var email = request.body.email;
    var password = request.body.password;
    var name = request.body.name;
    var phone = request.body.phone;

    if (!email || !password || !name || !phone) {
        var result = {
            message: "Post should contain email, password, name and phone"
        }
        sendResponse(response, result);
    } else {
        var userTemplate = userOps.getUserTemplate(name, email, password, phone);
        userOps.createUser(userTemplate, function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error Creating User"
                }
            } else {
                result = data;
            }
            
            sendResponse(response, result);
        });
    }
});

router.get('/authenticate', function(request, response) {
    var email = request.query.email;
    var encPassword = request.query.password;
    var phone = request.query.phone;

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
            } else {
                result = data
            }

            sendResponse(response, result);
        });
    }
});

function sendResponse(response, result) {
    response.json(result);
}

module.exports = router;
