window.chanakya.MapSearch = (function () {
  var SearchPlaces = {
    refineSearch: null,
    country: null
  }

  var searchWithGeoLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        chanakya.MapInfo.autocomplete.setBounds(new google.maps.LatLngBounds(geolocation, geolocation));
      });
    }
  }

  var search = function() {
    var search = {
      bounds: chanakya.MapInfo.map.getBounds()
    };

    chanakya.MapInfo.places.nearbySearch(search, function(results, status) {
      console.log("SEXS");
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          chanakya.MapInfo.results.push(results[i]);
          console.log(results[i]);
        }
      }
    });
  }

  var onPlaceChanged = function(element) {
    var place = chanakya.MapInfo.autocomplete.getPlace();
    if (place.geometry) {
      chanakya.MapInfo.map.panTo(place.geometry.location);
      chanakya.MapInfo.map.setZoom(15);
      //search();
      console.log(place);
    } else {
      element.placeholder = 'Enter a city';
    }
  }


  var initializePlaces = function(element) {
    chanakya.MapInfo.autocomplete = new google.maps.places.Autocomplete(element, {});
    chanakya.MapInfo.places = new google.maps.places.PlacesService(chanakya.MapInfo.map);

    google.maps.event.addListener(chanakya.MapInfo.autocomplete, 'place_changed', function() {
      onPlaceChanged(element);
    });
  }

  return {
    initializePlaces: initializePlaces
  }
}());
