var request = require('../modules/request');

var GOOGLE_DM = {};
GOOGLE_DM.options = {
    host: 'maps.googleapis.com',
    port: 443,
    method: 'GET',
    path: ''
};

function buildGoogleDistanceMatrixURL(sourceLocations, destinationLocation, mode) {
    var url = "/maps/api/distancematrix/json";
    url += '?destinations=' + destinationLocation.lat + "," + destinationLocation.lng;
    url += '&origins=';
    for (var i = sourceLocations.length - 1; i >= 0; i--) {
        url += sourceLocations[i].lat + "," + sourceLocations[i].lng + "|";
    };
    url = url.substring(0, url.length - 1);

    if (mode) {
        url += '&mode=' + mode;
    }

    return url;
}

function parseGoogleEstimateForMeru(responseToSend, result) {
    if (result && result.rows.length > 0) {
        var MeruIndex = 0;
        var MeruLength = responseToSend.cabs.Meru ? responseToSend.cabs.Meru.length : 0;
        var GenieLength = responseToSend.cabs.Genie ? responseToSend.cabs.Genie.length : 0;

        var genieAvailable = responseToSend.cabs.Genie ? true : false;
        if (genieAvailable) {
            MeruIndex = 0 + responseToSend.cabs.Genie.length;
        }

        responseToSend.cabsEstimate['Meru'].distance = result.rows[MeruIndex].elements[0].distance;
        responseToSend.cabsEstimate['Meru'].duration = result.rows[MeruIndex].elements[0].duration;

        if (genieAvailable) {
            responseToSend.cabsEstimate['Genie'].distance = result.rows[0].elements[0].distance;
            responseToSend.cabsEstimate['Genie'].duration = result.rows[0].elements[0].duration;
        }

        for (var i = 0; i < GenieLength; i++) {
            if (responseToSend.cabsEstimate['Genie'].duration.value > result.rows[i].elements[0].duration.value) {
                responseToSend.cabsEstimate['Genie'].distance = result.rows[i].elements[0].distance;
                responseToSend.cabsEstimate['Genie'].duration = result.rows[i].elements[0].duration;
            }
        }
        for (var i = 0; i < MeruLength; i++) {
            if (responseToSend.cabsEstimate['Meru'].duration.value > result.rows[i + GenieLength].elements[0].duration.value) {
                responseToSend.cabsEstimate['Meru'].distance = result.rows[i + GenieLength].elements[0].distance;
                responseToSend.cabsEstimate['Meru'].duration = result.rows[i + GenieLength].elements[0].duration;
            }


        };

        responseToSend.cabsEstimate['Meru'].distance = parseFloat(responseToSend.cabsEstimate['Meru'].distance.text.split(' ')[0]);
        var duration = parseInt(responseToSend.cabsEstimate['Meru'].duration.text.split(' ')[0]);
        duration += responseToSend.AddtoETA;
        responseToSend.cabsEstimate['Meru'].duration = duration;

        if (genieAvailable) {
            responseToSend.cabsEstimate['Genie'].distance = parseFloat(responseToSend.cabsEstimate['Genie'].distance.text.split(' ')[0]);
            var duration = parseInt(responseToSend.cabsEstimate['Genie'].duration.text.split(' ')[0]);
            duration += responseToSend.AddtoETA;
            responseToSend.cabsEstimate['Genie'].duration = duration;
        }

        var tempEstimate = [];
        for (key in responseToSend.cabsEstimate) {
            var _cEst = responseToSend.cabsEstimate[key];
            _cEst.name = key;
            tempEstimate.push(_cEst);
        }
        responseToSend.cabsEstimate = tempEstimate;
        delete responseToSend.AddtoETA;

    } else {
        responseToSend.cabsEstimate = [];
    }

    return responseToSend;
}

function parseGoogleOutputForEstimate(responseToSend, result) {
    if (!responseToSend.shouldParseData) return result;

    var output = {
        success: false,
        distance: null,
        duration: null
    };

    if (result && result.rows.length > 0) {
        output.success = true;
        output.distance = result.rows[0].elements[0].distance;
        output.duration = result.rows[0].elements[0].duration;
    }

    return output;
}

// Data has the following structure
// data = {
//     service: 'meru', //service
//     responsePayload: output, //output to process and send
//     responseService: responseService, //response service that sends the response
//     destinationLocation: location, //destination location
//     sourceLocations: sourceLocations //array of source locations
// }
exports.call = function(responseHandler, data) {
    GOOGLE_DM.options.path = buildGoogleDistanceMatrixURL(data.sourceLocations, data.destinationLocation, data.mode);

    request.getJSON(GOOGLE_DM.options, function(statusCode, result) {
        var responseToSend = data.responsePayload;

        if (data.service === 'meru') {
            responseHandler(data.responseService, parseGoogleEstimateForMeru(responseToSend, result));
        } else if (data.service === 'google') {
            responseHandler(data.responseService, parseGoogleOutputForEstimate(responseToSend, result));
        }
    });
}
