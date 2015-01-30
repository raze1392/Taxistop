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
    responseToSend.cabsEstimate['Meru'].distance = result.rows[5].elements[0].distance;
    responseToSend.cabsEstimate['Meru'].duration = result.rows[5].elements[0].duration;

    responseToSend.cabsEstimate['Genie'].distance = result.rows[0].elements[0].distance;
    responseToSend.cabsEstimate['Genie'].duration = result.rows[0].elements[0].duration;

    for (var i = 1; i < 5; i++) {
    	if (responseToSend.cabsEstimate['Meru'].duration.value > result.rows[i+5].elements[0].duration.value) {
        	responseToSend.cabsEstimate['Meru'].distance = result.rows[i+5].elements[0].distance;
            responseToSend.cabsEstimate['Meru'].duration = result.rows[i+5].elements[0].duration;
        }

        if (responseToSend.cabsEstimate['Genie'].duration.value > result.rows[i].elements[0].duration.value) {
            responseToSend.cabsEstimate['Genie'].distance = result.rows[i].elements[0].distance;
            responseToSend.cabsEstimate['Genie'].duration = result.rows[i].elements[0].duration;
        }
    };

    responseToSend.cabsEstimate['Meru'].distance = responseToSend.cabsEstimate['Meru'].distance.text;
    var duration = parseInt(responseToSend.cabsEstimate['Meru'].duration.text.substring(0, responseToSend.cabsEstimate['Meru'].duration.text.length-5));
    duration += responseToSend.AddtoETA;
    duration += " mins";
    responseToSend.cabsEstimate['Meru'].duration = duration;

    responseToSend.cabsEstimate['Genie'].distance = responseToSend.cabsEstimate['Genie'].distance.text;
    var duration = parseInt(responseToSend.cabsEstimate['Genie'].duration.text.substring(0, responseToSend.cabsEstimate['Genie'].duration.text.length-5));
    duration += responseToSend.AddtoETA;
    duration += " mins";
    responseToSend.cabsEstimate['Genie'].duration = duration;

    delete responseToSend.AddtoETA;

    return responseToSend;
}

// Data has the following structure
// data = {
//     service: 'meru',
//     responsePayload: output,
//     responseService: responseService,
//     destinationLocation: location,
//     sourceLocations: sourceLocations
// }
exports.call = function(responseHandler, data) {
    GOOGLE_DM.options.path = buildGoogleDistanceMatrixURL(data.sourceLocations, data.destinationLocation, data.mode);

    request.getJSON(GOOGLE_DM.options, function(statusCode, result) {
        var responseToSend = data.responsePayload;

        if (data.service === 'meru') {
        	responseHandler(data.responseService, parseGoogleEstimateForMeru(responseToSend, result));
        }
    });
}
