window.chanakya = window.chanakya || {};

/*
 * @Author: Shivam Shah <dev.shivamshah@gmail.com>
 * API to initialize Gmaps and services - Places, InfoWindow, Directions
 * Map.Details -> Object that holds all the Map details - referencs to services and locations
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
    }
  };

  var initializeMaps = function(element, location) {
    // Initializing Maps, Place and Direction Services
    chanakya.Map.Details.map = new google.maps.Map(element, { center: location, zoom: 12 });
    chanakya.Map.Details.places = new google.maps.places.PlacesService(chanakya.Map.Details.map);
    chanakya.Map.Details.directionsService = new google.maps.DirectionsService();
    chanakya.Map.Details.directionsDisplay = new google.maps.DirectionsRenderer();
    chanakya.Map.Details.directionsDisplay.setMap(chanakya.Map.Details.map);
  }

  var setSource = function(location) {
    chanakya.Map.Details.Source.location = location;
    chanakya.Map.Details.Source.marker = chanakya.Map.setMarker(location, "Source");
  }

  var clearSource = function() {
    chanakya.Map.Details.Source.location = null;
    chanakya.Map.clearMarkers("source");
  }

  var setDestination = function(location) {
    chanakya.Map.Details.Destination.location = location;
    chanakya.Map.Details.Destination.marker = chanakya.Map.setMarker(location, "Destination");
  }

  var clearDestination = function() {
    chanakya.Map.Details.Destination.location = null;
    chanakya.Map.clearMarkers("destination");
  }

  var intializeGmaps = function(element, callback, location) {
    $('#searchSource').val("");
    $('#searchDestination').val("");
    // Initializing Maps, Place and Direction Services
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
        callback();
        return true;
      });
    }
    return false;
  }

  var intializeInfoWindow = function(element) {
    chanakya.Map.Details.infoWindow = new google.maps.InfoWindow({ content: element });
  }

  var setMarker = function(location, title) {
    var marker = new google.maps.Marker({
        position: location,
        title: title
    });
    marker.setMap(chanakya.Map.Details.map);
    return marker;
  }

  var clearMarkers = function(type) {
    type = (type) ? type.toLowerCase() : undefined;
    // Remove the source marker
    if ((!type || type === 'source') && (chanakya.Map.existsSource() && chanakya.Map.getSource().marker)) {
      chanakya.Map.Details.Source.marker.setMap(null);
      chanakya.Map.Details.Source.marker = null;
    }
    // Remove the destination marker
    if ((!type || type === 'destination') && (chanakya.Map.existsDestination() && chanakya.Map.getDestination().marker)) {
      chanakya.Map.Details.Destination.marker.setMap(null);
      chanakya.Map.Details.Destination.marker = null;
    }
  }

  var clearResults = function() {
    for (var i = 0; i < chanakya.Map.Details.Autocomplete.results.length; i++) {
      if (chanakya.Map.Details.Autocomplete.results[i]) {
        chanakya.Map.Details.Autocomplete.results[i] = null;
      }
    }
    chanakya.Map.Details.Autocomplete.results = [];
  }

  var existsSource = function () {
    if (!chanakya.Map.Details.Source) return false;
    if (chanakya.Map.Details.Source.location) return true;
    return false;
  }

  var existsDestination = function () {
    if (!chanakya.Map.Details.Destination) return false;
    if (chanakya.Map.Details.Destination.location) return true;
    return false;
  }

  var getSource = function() {
    return chanakya.Map.Details.Source;
  }

  var getDestination = function() {
    return chanakya.Map.Details.Destination;
  }

  return {
    Details: Details,
    intializeGmaps: intializeGmaps,
    intializeGmapsUsingNavigator: intializeGmapsUsingNavigator,
    intializeInfoWindow: intializeInfoWindow,
    setSource: setSource,
    clearSource: clearSource,
    setDestination: setDestination,
    clearDestination: clearDestination,
    existsSource: existsSource,
    existsDestination: existsDestination,
    getSource: getSource,
    getDestination: getDestination,
    setMarker: setMarker,
    clearMarkers: clearMarkers,
    clearResults: clearResults
  }

}());
