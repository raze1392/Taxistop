var request = require(__dirname + '/../modules/request');
var logger = require(__dirname + '/../modules/log');
var Firebase = require("firebase");
// var crypto = require("crypto");
// var Buffer = require('buffer').Buffer;

var OLA = {};
OLA.options = {
    host: 'mapi.olacabs.com',
    port: 80,
    method: 'GET',
    headers: {
        'api-key': '@ndro1d',
        'Host': 'mapi.olacabs.com',
        'client': 'android',
        'device_id': '911380450341890',
        'enable_auto': 'true',
        'install_id': '5f48380f-46c8-4df5-a565-2ab650bc19fd'
    },
    path: ''
};
OLA.Taxi_Name_Map = {
    economy_sedan: 'Sedan',
    compact: 'Mini',
    local_auto: 'Auto',
    pink: 'Pink',
    luxury_sedan: 'Prime',
    local_taxi: 'Kaali Peeli'
}

function buildCabsURL(latitude, longitude, userId) {
    var url = '/v3/cab/info?accuracy=15.0&speed=0.0&altitude=0.0&location_type=CUSTOM&selected_by=USER&enable_auto=true&enable_delivery=true';

    if (latitude && longitude) {
        url += '&custom_lat=' + latitude + '&custom_lng=' + longitude
    }

    if (userId) {
        url += '&user_id=' + userId;
    } else {
        url += '&user_id=YjTgq%2F3vNPAVbf63OC3e%2FT3AYM8iYAZ5U9MZQ9NvX93iZrnhHJpmjq%2B9qvkL%0Ae5xkBh41YoCrbExGknVr2%2BSwUg%3D%3D%0A++++';
    }

    url += '&cab_category=[economy_sedan,compact,luxury_sedan,pink,local_auto]';
    url += '&fix_time=' + new Date().getTime();

    //console.log('OLA API url :: ' + OLA.options.host + url);
    return url;
}

function buildPriceURL(userId) {
    var url = '/v3/info/fare_breakup?enable_auto=true';

    if (userId) {
        url += '&user_id=' + userId;
    } else {
        url += '&user_id=YjTgq%2F3vNPAVbf63OC3e%2FT3AYM8iYAZ5U9MZQ9NvX93iZrnhHJpmjq%2B9qvkL%0Ae5xkBh41YoCrbExGknVr2%2BSwUg%3D%3D%0A++++';
    }

    //console.log('OLA API url :: ' + OLA.options.host + url);
    return url;
}

function buildBookingURL(userId, latitude, longitude, address, carType) {
    var url = '/v3/booking/create?enable_auto=true&accuracy=10.0&speed=0.0&altitude=0.0&pickup_mode=NOW&location_type=CUSTOM';
    url += '&user_id=' + userId;
    url += '&lat=' + latitude + '&lng=' + longitude
    url += '&fix_time=' + new Date().getTime();
    for (key in OLA.Taxi_Name_Map) {
        if (OLA.Taxi_Name_Map[key].toLowerCase() == carType) {
            url += '&category_id=' + key;
            break;
        }
    }
    url += 'address=' + address;

    return url;
}

function buildTrackingURL(userId) {
    var url = '/v3/cab/info?enable_new_state=true&enable_auto=true';
    url += '&user_id=' + userId;

    return url;
}

function buildCancelBookingURL(userId, bookingId, reason) {
    var url = '/v3/booking/cancel?enable_auto=true';
    url += '&user_id=' + userId;
    url += '&booking_id=' + bookingId;

    if (reason) {
        url += '&reason=' + reason;
    } else {
        url += '&reason=Changed+my+mind';
    }

    return url;
}

function buildLoginURL(email, encPassword) {
    var url = '/v3/user/login?device_id=911380450341890&lat=29.3794796&lng=79.4637102';
    url += '&email=' + encodeURIComponent(email);
    // encPassword += '|';
    // var iv = new Buffer('');
    // var key = new Buffer('PRODKEYPRODKEY12', 'utf8');
    // var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    // var chunks = [];
    // chunks.push(cipher.update(new Buffer(encPassword, 'utf8'), 'buffer', 'base64'));
    // chunks.push(cipher.final('base64'));
    // encPassword = chunks.join('');
    url += '&password=' + encPassword;

    return url;
}

function parseCabsResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'OLA',
        cabs: {},
        cabsEstimate: []
    };

    if (type === 'cabs') {
        try {
            var cabsEstimate = {};
            var cabs = {};

            if (status && status.toLowerCase() === 'success' && response.cabs) {
                // Generate locations of available cabs
                for (var i = response.cabs.length - 1; i >= 0; i--) {
                    var tName = OLA.Taxi_Name_Map[response.cabs[i].category_id];

                    if (!cabs[tName]) {
                        cabs[tName] = [];
                    }

                    if (cabs[tName].length == 5) continue;

                    cabs[tName].push({
                        lat: response.cabs[i].lat,
                        lng: response.cabs[i].lng,
                    });
                }

                //detail of nearest cab
                for (var i = response.cab_categories.length - 1; i >= 0; i--) {
                    var availability = response.cab_categories[i].cab_availability;
                    var cabData = {
                        available: availability,
                        type: 'OLA'
                    };

                    if (availability) {
                        cabData.duration = response.cab_categories[i].duration.value;
                        cabData.distance = response.cab_categories[i].distance.value;
                    }

                    cabsEstimate[OLA.Taxi_Name_Map[response.cab_categories[i].id]] = cabData;
                };

                output.cabs = cabs;
                output.cabsEstimate = [];

                for (key in cabsEstimate) {
                    var _cEst = cabsEstimate[key];
                    _cEst.name = key;
                    output.cabsEstimate.push(_cEst);
                }
            }
        } catch (ex) {
            logger.warn(ex.getMessage(), ex);
            return output;
        }
    } else if (type === 'price') {

    }

    return output;
}

function parseBookingResponse(type, response, status) {
    var output = {
        status: response ? "success" : "failure",
        service: 'OLA'
    };

    if (type == 'create') {
        try {
            //Stub
        } catch (ex) {
            logger.warn(ex.getMessage(), ex);
            return output;
        }
    } else if (type == 'cancel') {
        try {
            //Stub
        } catch (ex) {
            logger.warn(ex.getMessage(), ex);
            return output;
        }
    }

    return output;
}

function parseLoginResponse(response, status, userCookie) {
    var output = {
        status: response ? ((status.toLowerCase() != 'failure') ? "success" : "failure") : "failure",
        service: 'OLA'
    };

    try {
        output.userId = response.user_id;
        output.referralCode = response.referral_code;
        output.olaMoney = response.ola_money_balance;

        var ref = new Firebase('https://flickering-inferno-5036.firebaseio.com');
        
    } catch (ex) {
        logger.warn(ex.getMessage(), ex);
        return output;
    }

    return output;
}

exports.cabs = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    OLA.options.path = buildCabsURL(latitude, longitude, userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseCabsResponse('cabs', result, result.status);
        }
        responseHandler(response, result);
    });
}


exports.price = function(responseHandler, response, srcLatitude, srcLongitude, destLatitude, destLongitude, shouldParseData, userId) {
    OLA.options.path = buildPriceURL(userId);

    request.getJSON(OLA.options, function(statusCode, result) {
        if (shouldParseData && result) {
            result = parseCabsResponse('price', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.createBooking = function(responseHandler, response, userId, latitude, longitude, address, carType, shouldParseData) {
    OLA.options.path = buildBookingURL(userId, latitude, longitude, address, carType);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('create', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.trackCab = function(responseHandler, response, userId, shouldParseData) {
    OLA.options.path = buildBookingURL(userId, latitude, longitude, address, carType);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse(result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.cancelBooking = function(responseHandler, response, userId, bookingId, shouldParseData, reason) {
    OLA.options.path = buildBookingURL(userId, latitude, longitude, address, carType);

    request.getJSON(OLA.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            result = parseBookingResponse('cancel', result, result.status);
        }
        responseHandler(response, result);
    });
}

exports.login = function(responseHandler, response, userCookie, email, encPassword, shouldParseData, saveCredentials) {
    OLA.options.path = buildLoginURL(email, encPassword);
console.log(OLA.options.path);
    request.getJSON(OLA.options, function(statusCode, result) {
        saveCredentials(userCookie, email, encPassword, 'ola', result);
        if (shouldParseData && result) {
            result = parseLoginResponse(result, result.status, userCookie);
        }
        responseHandler(response, result);
    });
}
