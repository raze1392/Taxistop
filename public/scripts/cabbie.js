var map_container = document.getElementById('map-canvas');
var source_container = document.getElementById('searchSource');
var destination_container = document.getElementById('searchDestination');

google.maps.event.addDomListener(window, 'load', function() {
    chanakya.Map.intializeGmapsUsingNavigator(map_container, function() {
        chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
        chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);

        var latitude = chanakya.Map.getSourceLatitude;
        var longitude = chanakya.Map.getSourceLongitude;

        $.getJSON(
            '/cabs/ola', {
                lat: latitude,
                lng: longitude
            },
            function(jsonData) {
                mapNearByCabs(jsonData.cabsNearby, 'ola');
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
    });
});

function mapNearByCabs(cabs, service) {
    for (var i = cabs.length - 1; i >= 0 && i > cabs.length - 6; i--) {
        var location = chanakya.Map.convertLatLngToLocation(cabs[i].lat, cabs[i].lng);
        chanakya.Map.setMarker(location, service.toUpperCase() + ' ' + cabs[i].type, '../images/sedan_map_v1.png');
    };
}
