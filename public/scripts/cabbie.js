var map_container = document.getElementById('map-canvas');
var source_container = document.getElementById('searchSource');
var destination_container = document.getElementById('searchDestination');

function onSourceChangeCallback(latitude, longitude) {
    $.getJSON(
        '/cabs/ola', {
            lat: latitude,
            lng: longitude
        },
        function(jsonData) {
            mapNearByCabs(jsonData.cabs, 'ola');
        });

    // $.getJSON(
    //     '/cabs/tfs', {
    //         lat: latitude,
    //         lng: longitude
    //     },
    //     function(jsonData) {
    //         console.log('====== TFS ======');
    //         console.log(jsonData);
    //     });

    // $.getJSON(
    //     '/cabs/uber', {
    //         lat: latitude,
    //         lng: longitude
    //     },
    //     function(jsonData) {
    //         console.log('====== UBER ======');
    //         console.log(jsonData);
    //     });

    // $.getJSON(
    //     '/cabs/meru', {
    //         lat: latitude,
    //         lng: longitude
    //     },
    //     function(jsonData) {
    //         console.log('====== MERU ======');
    //         console.log(jsonData);
    //     });
}

google.maps.event.addDomListener(window, 'load', function() {
    chanakya.Map.intializeGmapsUsingNavigator(map_container, source_container, destination_container, function() {
        chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
        chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);
    });
});

// binding source changed listener
source_container.addEventListener('sourceLocationChanged', function(event) {
    onSourceChangeCallback(event.detail.lat, event.detail.lng);
}, false);

function mapNearByCabs(cabs, service) {
    chanakya.Map.clearMarkers('cabs');
    for (cabType in cabs) {
        var _cabs = cabs[cabType];
        for (var i = 0; i < 2; i++) {
            var _c = cabs[cabType][i];
            if (_c) {
                var location = chanakya.Map.convertLatLngToLocation(_c.lat, _c.lng);
                chanakya.Map.setMarker(location, service.toUpperCase() + ' ' + cabType, '../images/sedan_map_v1.png');
            }
        };
    }
}
