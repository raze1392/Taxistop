var request = require('../modules/request');
var googleDistance = require('../modules/googleDistance');

var MERU = {};
MERU.options = {
    host: 'mobileapp.merucabs.com',
    port: 80,
    method: 'GET',
    path: ''
};
MERU.Taxi_Name_Map = {
    genie: 'Genie',
    meru: 'Meru',
}

function buildURL(latitude, longitude, userId) {
    var url = '/NearByCab_ETA/GetNearByCabs.svc/rest/nearby?SuggestedRadiusMeters=5000&CabMaxCount=10';

    if (latitude && longitude) {
        url += '&Lat=' + latitude + '&Lng=' + longitude
    }

    //console.log('MERU API url :: ' + MERU.options.host + url);
    return url;
}

function parseResponse(responseHandler, responseService, location, response) {
    var output = {
        status: response ? "success" : "failure",
        cabs: {},
        cabsEstimate: []
    }

    try {
        var cabsEstimate = {};
        var cabs = {};
        var sourceLocations = [];

        if (response && response.Cablist) {
            // Generate locations of available cabs
            for (var i = response.Cablist.length - 1; i >= 0; i--) {
                var tName = MERU.Taxi_Name_Map[response.Cablist[i].Brand.toLowerCase()];

                if (!cabs[tName]) {
                    cabs[tName] = [];
                    cabsEstimate[tName] = {};
                }

                var _c = {
                    lat: response.Cablist[i].Lat,
                    lng: response.Cablist[i].Lng
                }

                cabs[tName].push(_c);
                sourceLocations.push(_c);
            }

            output.cabs = cabs;
            output.cabsEstimate = cabsEstimate;
            output.AddtoETA = parseInt(response.AddtoETA);

            var data = {
                service: 'meru',
                responsePayload: output,
                responseService: responseService,
                destinationLocation: location,
                sourceLocations: sourceLocations
            }

            if (response.Cablist.length > 0) {
                googleDistance.call(responseHandler, data);
            } else {
                data.responsePayload.cabsEstimate = [];
                responseHandler(data.responseService, data.responsePayload);
            }
        }
    } catch (ex) {
        console.log("Error in Meru");
        return output;
    }

    return output;
}


exports.call = function(responseHandler, response, latitude, longitude, shouldParseData, userId) {
    MERU.options.path = buildURL(latitude, longitude, userId);

    request.getJSON(MERU.options, function(statusCode, result) {
        //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        if (shouldParseData && result) {
            // Here we make a call to google service which will take care of sending the response back
            var location = {
                lat: latitude,
                lng: longitude
            }
            result = parseResponse(responseHandler, response, location, result);
        } else {
            responseHandler(response, result);
        }
    }, 'meru');
}
