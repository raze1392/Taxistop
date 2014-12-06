window.chanakya = window.chanakya || {};
window.chanakya.MapInfo = {
  map: null,
  places: null,
  markers: [],
  infoWindow: null,
  autocomplete: null,
  results: [],
  clearMarkers: function() {
    for (var i = 0; i < chanakya.MapInfo.markers.length; i++) {
      if (chanakya.MapInfo.markers[i]) {
        chanakya.MapInfo.markers[i].setMap(null);
      }
    }
    chanakya.MapInfo.markers = [];
  },
  clearResults: function() {
    for (var i = 0; i < chanakya.MapInfo.results.length; i++) {
      if (chanakya.MapInfo.results[i]) {
        chanakya.MapInfo.results[i] = null;
      }
    }
    chanakya.MapInfo.results = [];
  }
}

window.chanakya.Map = (function() {
  var CurrentLocation = {
    latitude: null,
    longitude: null,
    zoom: null,
    options: null,
  };

  var setLatitude = function(latitude) {
    CurrentLocation.latitude = latitude;
    if (CurrentLocation.longitude)
      setMapOptions(CurrentLocation.latitude, CurrentLocation.longitude, CurrentLocation.zoom);
  }

  var setLongitude = function(longitude) {
    CurrentLocation.longitude = longitude;
    if (CurrentLocation.latitude)
      setMapOptions(CurrentLocation.latitude, CurrentLocation.longitude, CurrentLocation.zoom);
  }

  var setLatLong = function(latitude, longitude) {
    CurrentLocation.latitude = latitude;
    CurrentLocation.longitude = longitude;
    setMapOptions(CurrentLocation.latitude, CurrentLocation.longitude, CurrentLocation.zoom);
  }

  var setZoom = function(zoom) {
    CurrentLocation.zoom = zoom;
    if (CurrentLocation.latitude && CurrentLocation.longitude)
      setMapOptions(CurrentLocation.latitude, CurrentLocation.longitude, CurrentLocation.zoom);
  }

  var setMapOptions = function(latitude, longitude, zoom) {
    CurrentLocation.options = {
      center: new google.maps.LatLng(latitude, longitude, zoom),
      zoom: (!zoom) ? 10: zoom
    };
  }

  var intializeInfoWindow = function(element) {
    chanakya.MapInfo.infoWindow = new google.maps.InfoWindow({ content: element });
  }

  var intializeGmaps = function(element, latitude, longitude, zoom) {
    if (!latitude && !longitude) {
      if (!CurrentLocation.latitude && !CurrentLocation.longitude) return false;
      setMapOptions(CurrentLocation.latitude, CurrentLocation.longitude, zoom);
    } else {
      setMapOptions(latitude, longitude, zoom);
    }

    chanakya.MapInfo.map = new google.maps.Map(element, CurrentLocation.options);
    return true;
  }

  var intializeGmapsUsingNavigator = function(element, callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setZoom(10);
        setLatLong(position.coords.latitude, position.coords.longitude);
        chanakya.MapInfo.map = new google.maps.Map(element, CurrentLocation.options);
        callback();
        return true;
      });
    }
    return false;
  }

  return {
    getLatitude: CurrentLocation.latitude,
    setLatitude: setLatitude,
    getLongitude: CurrentLocation.longitude,
    setLongitude: setLongitude,
    getLatLong: {
      latitude: CurrentLocation.latitude,
      longitude: CurrentLocation.longitude
    },
    setLatLong: setLatLong,
    getZoom: CurrentLocation.zoom,
    setZoom: setZoom,
    intializeGmaps: intializeGmaps,
    intializeGmapsUsingNavigator: intializeGmapsUsingNavigator,
    intializeInfoWindow: intializeInfoWindow
  }

}());
