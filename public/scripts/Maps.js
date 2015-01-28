window.chanakya = window.chanakya || {};

/*
 * @Author: Shivam Shah <dev.shivamshah@gmail.com>
 * API to initialize Gmaps and services - Places, InfoWindow, Directions
 * Map._Details -> Object that holds all the Map details - referencs to services and locations
 *
 * Servies in use:
 *   map: stores the current google Map,
 *   places: stores the google map places service reference,
 *   infoWindow: stores the google map InfoWindow service,
 *   directionsService: stores the google map directions service reference,
 *   directionsDisplay: stores the google map directions display reference to draw on map,
 *
 * APIs available for interaction
 *   Details: get all the map details,
 *   intializeGmaps: initialize maps by giving a location,
 *   intializeGmapsUsingNavigator: initialize maps by using navigator,
 *   intializeInfoWindow: initialize the info window,
 *   setSource: ,
 *   clearSource: clears the source location,
 *   setDestination: ,
 *   clearDestination: clears the destination location,
 *   existsSource: checks if source location exists,
 *   existsDestination: checks if destination location exists,
 *   getSource: getSource,
 *   getDestination: getDestination,
 *   setMarker: sets a marker on the map for the location,
 *   clearMarkers: clears a marker on the map for the location,
 *   clearResults: clears the autocomplete results
 */
window.chanakya.Map = (function() {
    var Details = {
        map: null,
        places: null,
        infoWindow: null,
        directionsService: null,
        directionsDisplay: null,
        Source: {
            location: null,
            marker: null
        },
        Destination: {
            location: null,
            marker: null
        },
        Autocomplete: {
            source: null,
            destination: null,
            results: []
        },
        Directions: {
            TravelMode: {
                transit: google.maps.TravelMode.TRANSIT,
                walking: google.maps.TravelMode.WALKING,
                driving: google.maps.TravelMode.DRIVING
            },
            UnitSystem: {
                metric: google.maps.UnitSystem.METRIC,
                imperial: google.maps.UnitSystem.IMPERIAL
            },
            waypoints: [],
            routeAlternatives: false,
            travelModeSelected: google.maps.TravelMode.DRIVING,
            unitSystemSelected: google.maps.UnitSystem.METRIC
        },
        Markers: []
    };

    var initializeMaps = function(element, location) {
        // Initializing Maps, Place and Direction Services
        var mapOptions = {
            center: location,
            zoom: 14,
            disableDefaultUI: true,
            mapTypeControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            scaleControl: false,
            streetViewControl: false
        };
        chanakya.Map._Details.map = new google.maps.Map(element, mapOptions);
        chanakya.Map._Details.places = new google.maps.places.PlacesService(chanakya.Map._Details.map);
        chanakya.Map._Details.directionsService = new google.maps.DirectionsService();
        chanakya.Map._Details.directionsDisplay = new google.maps.DirectionsRenderer();
        chanakya.Map._Details.directionsDisplay.setMap(chanakya.Map._Details.map);
    }

    var setSource = function(location) {
        chanakya.Map._Details.Source.location = location;
        chanakya.Map._Details.Source.marker = chanakya.Map.setMarker(location, "Source");
    }

    var clearSource = function() {
        chanakya.Map._Details.Source.location = null;
        chanakya.Map.clearMarkers("source");
    }

    var setDestination = function(location) {
        chanakya.Map._Details.Destination.location = location;
        chanakya.Map._Details.Destination.marker = chanakya.Map.setMarker(location, "Destination");
    }

    var clearDestination = function() {
        chanakya.Map._Details.Destination.location = null;
        chanakya.Map.clearMarkers("destination");
    }

    var intializeGmaps = function(element, callback, location) {
        $('#searchSource').val("");
        $('#searchDestination').val("");
        // Initializing Maps, Place and Direction Services
        var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        initializeMaps(element, location);
        // Setting Source
        chanakya.Map.setSource(location);
        callback();
        return true;
    }

    var intializeGmapsUsingNavigator = function(element, callback) {
        $('#searchSource').val("My current location");
        $('#searchDestination').val("");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // Initializing Maps, Place and Direction Services
                var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                initializeMaps(element, location);
                // Setting Source
                chanakya.Map.setSource(location);
                var currentLoc = chanakya.Map.getGeoLocation(position.coords.latitude, position.coords.longitude, function(loc) {
                    $('#searchSource').val(loc);
                });
                callback();
                return true;
            });
        }
        return false;
    }

    var intializeInfoWindow = function(element) {
        chanakya.Map._Details.infoWindow = new google.maps.InfoWindow({
            content: element
        });
    }

    var setMarker = function(location, title, icon) {
        var marker = new google.maps.Marker({
            position: location,
            title: title,
            icon: (icon) ? icon : '',
        });
        marker.setMap(chanakya.Map._Details.map);
        chanakya.Map._Details.Markers.push(marker);
        return marker;
    }

    var clearMarkers = function(type) {
        type = (type) ? type.toLowerCase() : undefined;
        // Remove the source marker
        if ((!type || type === 'source') && (chanakya.Map.existsSource() && chanakya.Map.getSource().marker)) {
            chanakya.Map._Details.Source.marker.setMap(null);
            chanakya.Map._Details.Source.marker = null;
        }
        // Remove the destination marker
        if ((!type || type === 'destination') && (chanakya.Map.existsDestination() && chanakya.Map.getDestination().marker)) {
            chanakya.Map._Details.Destination.marker.setMap(null);
            chanakya.Map._Details.Destination.marker = null;
        }

        // Remove the cab markers
        if ((!type || type === 'cabs')) {
            for (var i = chanakya.Map._Details.Markers.length - 1; i >= 0; i--) {
                chanakya.Map._Details.Markers[i].setMap(null);
                chanakya.Map._Details.Markers[i] = null;
            };
            chanakya.Map._Details.Markers = [];
        }
    }

    var clearResults = function() {
        for (var i = 0; i < chanakya.Map._Details.Autocomplete.results.length; i++) {
            if (chanakya.Map._Details.Autocomplete.results[i]) {
                chanakya.Map._Details.Autocomplete.results[i] = null;
            }
        }
        chanakya.Map._Details.Autocomplete.results = [];
    }

    var existsSource = function() {
        if (!chanakya.Map._Details.Source) return false;
        if (chanakya.Map._Details.Source.location) return true;
        return false;
    }

    var existsDestination = function() {
        if (!chanakya.Map._Details.Destination) return false;
        if (chanakya.Map._Details.Destination.location) return true;
        return false;
    }

    var getGeoLocation = function(lat, lng, cb) {
        console.log("getting geo location");
        var latlng = new google.maps.LatLng(lat, lng);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'latLng': latlng
        }, function(results, status) {
            console.log("geocoder", status, results);
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    cb(results[0].formatted_address);
                }
            }
        });
    }

    var getSource = function() {
        return chanakya.Map._Details.Source;
    }

    var getDestination = function() {
        return chanakya.Map._Details.Destination;
    }

    var getSourceLatitude = function() {
        if (chanakya.Map.existsSource()) {
            return chanakya.Map.getSource().location.k;
        }
        return null;
    }

    var getSourceLongitude = function() {
        if (chanakya.Map.existsSource()) {
            return chanakya.Map.getSource().location.D;
        }
        return null;
    }

    var convertLatLngToLocation = function(latitude, longitude) {
        return new google.maps.LatLng(latitude, longitude);
    }

    return {
        _Details: Details,
        intializeGmaps: intializeGmaps,
        intializeGmapsUsingNavigator: intializeGmapsUsingNavigator,
        intializeInfoWindow: intializeInfoWindow,
        setSource: setSource,
        clearSource: clearSource,
        setDestination: setDestination,
        clearDestination: clearDestination,
        existsSource: existsSource,
        existsDestination: existsDestination,
        getGeoLocation: getGeoLocation,
        getSource: getSource,
        getDestination: getDestination,
        setMarker: setMarker,
        clearMarkers: clearMarkers,
        clearResults: clearResults,
        getSourceLatitude: getSourceLatitude,
        getSourceLongitude: getSourceLongitude,
        convertLatLngToLocation: convertLatLngToLocation
    }

}());
