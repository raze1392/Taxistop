var mongoose = require('mongoose');
var logger = require(__dirname + '/../helpers/log');
var cryptoTS = require(__dirname + '/../helpers/crypt_auth');
var User = require(__dirname + '/models/user.js');

function copyUser(sourceUser, destinationUser) {
    if (sourceUser.name) destinationUser.name = sourceUser.name;
    if (sourceUser.phone) destinationUser.phone = sourceUser.phone;
    if (sourceUser.password) destinationUser.password = sourceUser.password;
}

var getUserTemplate = function(name, email, password, phone) {
    var user = {
        name: name,
        email: email,
        password: password,
        id: cryptoTS.hashIt(email),
        phone: phone,
        bookings: [],
        connected_services: [],
        sos: [],
        verified: false
    }

    return user;
}

var createUser = function(user, callback) {
    var user = new User(user);
    existsUser(user.email, user.phone, function(data) {
        if (!data) {
            user.save(function(err) {
                if (!err) {
                    callback(user);
                } else {
                    logger.error("Error creating user " + user.name + " with Id " + user.id);
                    callback(-1);
                }
            });
        } else {
            callback({
                message: "User already exists",
                error: -10,
                success: false
            });
        }
    });
}

var getUser = function(userId, callback) {
    User.find({
        id: userId
    }, function(err, user) {
        if (!err) {
            if (user.length == 1) {
                callback(user);
            } else if (user.length > 1) {
                logger.error("[Database Inconsistency] Multiple user exists with this userId " + userId);
                callback({
                    message: "Error fetching user details",
                    error: -21,
                    success: false
                });
            } else {
                callback({
                    message: "User doesn't exist",
                    error: -11,
                    success: false
                });
            }
        } else {
            logger.error("Error finding user with Id " + userId);
            callback(-1);
        }
    });
}

var authenticateUser = function(email, password, phone, callback) {
    var searchCriteria = {
        password: password
    };
    if (email)
        searchCriteria['email'] = email;
    if (phone)
        searchCriteria['phone'] = phone;
    console.log(searchCriteria);

    User.find(searchCriteria, function(err, user) {
        if (!err) {
        	if (user.length == 1) {
        		callback(user[0]);	
        	} else if (user.length > 1) {
                logger.error("[Database Inconsistency] Multiple user exists with this userId " + userId);
                callback({
                    message: "Error authenticating user",
                    error: -21,
                    success: false
                });
            } else {
                callback({
                    message: "User Authentication failed",
                    error: -12,
                    success: false
                });
            }
            
        } else {
            logger.error("Error authenticating user with Id " + userId);
            callback(-1);
        }
    });
}

var updateUser = function(userId, newUser, callback) {
    User.find({
        id: userId
    }, function(err, user) {
        if (!err) {
            copyUser(newUser, user);
            user.save(function(err) {
                if (!err) {
                    callback(user.id);
                } else {
                    logger.error("Error updating user " + user.name + " with Id " + user.id);
                    callback(-1);
                }
            });
        } else {
            logger.error("Error finding user for update with Id " + userId);
            callback(-1); 
        }
    });
}

var existsUser = function(email, phone, callback) {
    User.find({
        email: email
    }, function(err, users) {
        if (!err) {
            if (users.length <= 0) {
                User.find({
                    phone: phone
                }, function(err, users) {
                    if (!err) {
                        callback(users.length > 0);
                    } else {
                        logger.error("Error checking if a user exists");
                        callback(-1);
                    }
                });
            } else {
                callback(users.length > 0);
            }
        } else {
            logger.error("Error checking if a user exists");
            callback(-1);
        }
    });
}

var getAllUsers = function(callback) {
    User.find({}, function(err, users) {
        if (!err) {
            callback(users);
        } else {
            logger.error("Error getting all users");
            callback(-1);
        }
    });
}

var UserOps = {
    createUser: createUser,
    getUser: getUser,
    authenticateUser: authenticateUser,
    updateUser: updateUser,
    getAllUsers: getAllUsers,
    getUserTemplate: getUserTemplate
};

module.exports = UserOps;
