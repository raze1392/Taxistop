exports.isAuthenticated = function(request) {
    var session = request.session;
    if (session.authenticated)
        return true;

    return false;
}

exports.authenticateSession = function(request, userData) {
    var session = request.session;
    if (!session.authenticated) {
        session.authenticated = true;
        session.userData = userData;
        return true;
    }
    return false;
}

exports.killSession = function(request) {
    var session = request.session;
    if (session.authenticated) {
        session.authenticated = false;
        session.userData = {};
        return true;
    }
    return false;
}

// To be only called if user is authenticated hence no check required inside
exports.getUserData = function(request) {
    var session = request.session;
    return session.userData;
}

exports.setUserData = function(request, newUserData) {
    var session = request.session;
    session.userData = newUserData;
    return true;
}
