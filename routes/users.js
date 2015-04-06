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

router.post('/authenticate', function(request, response) {
    var email = request.body.email;
    var password = request.body.password;
    var phone = request.body.phone;

    if (!email || !password) {
        var result = {
            message: "Need email or phone, password to authenticate"
        }
        sendResponse(response, result);
    } else {
        userOps.authenticateUser(email, password, phone, function(data) {
            var result = {};

            if (data == -1) {
                result = {
                    message: "Error Creating User"
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
