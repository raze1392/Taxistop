window.chanakya = window.chanakya || {};
window.chanakya.Map = window.chanakya.Map || {};

/*
 * @Author: Shivam Shah <dev.shivamshah@gmail.com>
 * API to search a location on GMaps using Autocomplete
 *
 * APIs available for interaction
 *   initializeAutocompleteSourceBox: initializes the Autocompletebox to set source,
 *   initializeAutocompleteDestinationBox: initializes the Autocompletebox to set destination
 */
window.chanakya.Map.Search = (function() {
    var initializeAutocompleteSourceBox = function(element) {
        chanakya.Map._Details.Autocomplete.source = new google.maps.places.Autocomplete(element, {});
        google.maps.event.addListener(chanakya.Map._Details.Autocomplete.source, 'place_changed', function() {
            onPlaceChanged(element, "source");
        });
    }

    var initializeAutocompleteDestinationBox = function(element) {
        chanakya.Map._Details.Autocomplete.destination = new google.maps.places.Autocomplete(element, {});
        google.maps.event.addListener(chanakya.Map._Details.Autocomplete.destination, 'place_changed', function() {
            onPlaceChanged(element, "destination");
        });
    }

    var search = function() {
        var search = {
            bounds: chanakya.Map._Details.map.getBounds()
        };
        chanakya.Map._Details.places.nearbySearch(search, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    chanakya.Map._Details.Autocomplete.results.push(results[i]);
                    //console.log(results[i]);
                }
            }
        });
    }

    var onPlaceChanged = function(element, type) {
        type = type.toLowerCase();
        var placeDetails = {};

        if (type === "source") {
            placeDetails = {
                title: "Source",
                type: type
            };
        } else if (type === "destination") {
            placeDetails = {
                title: "Destination",
                type: type
            };
        }

        var place = chanakya.Map._Details.Autocomplete[placeDetails.type].getPlace();
        if (place.geometry) {
            chanakya.Map._Details.map.panTo(place.geometry.location);
            chanakya.Map["clear" + placeDetails.title]();
            chanakya.Map["set" + placeDetails.title](place.geometry.location);
        } else {
            element.placeholder = 'Enter a place';
        }

        // If both Source and Destination is selected, then show the route
        if (chanakya.Map.existsSource() && chanakya.Map.existsDestination()) {
            chanakya.Map.Directions.getDirections(chanakya.Map.getSource().location, chanakya.Map.getDestination().location);
        }
    }

    return {
        initializeAutocompleteSourceBox: initializeAutocompleteSourceBox,
        initializeAutocompleteDestinationBox: initializeAutocompleteDestinationBox
    }

}());
