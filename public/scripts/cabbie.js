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
                console.log('====== OLA ======');
                console.log(jsonData);
            });

        $.getJSON(
            '/cabs/tfs', {
                lat: latitude,
                lng: longitude
            },
            function(jsonData) {
                console.log('====== TFS ======');
                console.log(jsonData);
            });

        $.getJSON(
            '/cabs/uber', {
                lat: latitude,
                lng: longitude
            },
            function(jsonData) {
                console.log('====== UBER ======');
                console.log(jsonData);
            });

        $.getJSON(
            '/cabs/meru', {
                lat: latitude,
                lng: longitude
            },
            function(jsonData) {
                console.log('====== MERU ======');
                console.log(jsonData);
            });
    });
});
