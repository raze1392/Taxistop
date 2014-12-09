window.chanakya = window.chanakya || {};

window.chanakya.Map = (function() {
  var Details = {
    map: null,
    places: null,
    markers: [],
    infoWindow: null,
    autocompleteSource: null,
    autocompleteDestination: null,
    results: [],
    source: null,
    destination: null
  };

  var intializeGmaps = function(element, callback, location) {
    $('#searchSource').val("");
    $('#searchDestination').val("");
    chanakya.Map.Details.map = new google.maps.Map(element, { center: location, zoom: 12 });
    chanakya.Map.Details.source = location;
    chanakya.Map.Details.markers[0] = chanakya.Map.setMarkerByLocation(location, "Source");
    chanakya.Map.Details.places = new google.maps.places.PlacesService(chanakya.Map.Details.map);
    callback();
    return true;
  }

  var intializeGmapsUsingNavigator = function(element, callback) {
    $('#searchSource').val("My current location");
    $('#searchDestination').val("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        chanakya.Map.Details.map = new google.maps.Map(element, { center: location, zoom: 12 });
        chanakya.Map.Details.source = location;
        chanakya.Map.Details.markers[0] = chanakya.Map.setMarker(position.coords.latitude, position.coords.longitude, "Source");
        chanakya.Map.Details.places = new google.maps.places.PlacesService(chanakya.Map.Details.map);
        callback();
        return true;
      });
    }
    return false;
  }

  var intializeInfoWindow = function(element) {
    chanakya.Map.Details.infoWindow = new google.maps.InfoWindow({ content: element });
  }

  var setMarker = function(latitude, longitude, title) {
    var position = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: position,
        title: title
    });
    marker.setMap(chanakya.Map.Details.map);
    return marker;
  }

  var setMarkerByLocation = function(location, title) {
    var marker = new google.maps.Marker({
        position: location,
        title: title
    });
    marker.setMap(chanakya.Map.Details.map);
    return marker;
  }

  var clearMarkers = function(index) {
    if (index) {
      if (chanakya.Map.Details.markers[index]) {
        chanakya.Map.Details.markers[index].setMap(null);
        //chanakya.Map.Details.markers.splice(index, 1);
      }
    } else {
      for (var i = 0; i < chanakya.Map.Details.markers.length; i++) {
        if (chanakya.Map.Details.markers[i]) {
          chanakya.Map.Details.markers[i].setMap(null);
        }
      }
      chanakya.Map.Details.markers = [];
    }
  }

  var clearResults = function() {
    for (var i = 0; i < chanakya.Map.Details.results.length; i++) {
      if (chanakya.Map.Details.results[i]) {
        chanakya.Map.Details.results[i] = null;
      }
    }
    chanakya.Map.Details.results = [];
  }

  return {
    Details: Details,
    intializeGmaps: intializeGmaps,
    intializeGmapsUsingNavigator: intializeGmapsUsingNavigator,
    intializeInfoWindow: intializeInfoWindow,
    setMarker: setMarker,
    setMarkerByLocation: setMarkerByLocation,
    clearMarkers: clearMarkers,
    clearResults: clearResults
  }

}());
