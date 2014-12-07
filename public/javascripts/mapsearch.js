window.chanakya = window.chanakya || {};
window.chanakya.Map = window.chanakya.Map || {}:
window.chanakya.Map.Search = (function () {

  var initializeSourceBox = function(element) {
    chanakya.Map.Details.autocompleteSource = new google.maps.places.Autocomplete(element, {});
    google.maps.event.addListener(chanakya.Map.Details.autocompleteSource, 'place_changed', function() {
      onPlaceChanged(element, "source");
    });
  }

  var initializeDestinationBox = function(element) {
    chanakya.Map.Details.autocompleteDestination = new google.maps.places.Autocomplete(element, {});
    google.maps.event.addListener(chanakya.Map.Details.autocompleteDestination, 'place_changed', function() {
      onPlaceChanged(element, "destination");
    });
  }

  var search = function() {
    var search = {
      bounds: chanakya.Map.Details.map.getBounds()
    };
    chanakya.Map.Details.places.nearbySearch(search, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          chanakya.Map.Details.results.push(results[i]);
          console.log(results[i]);
        }
      }
    });
  }

  var onPlaceChanged = function(element, type) {
    var placeDetails = {};

    if (type === "source") {
      placeDetails = {
        autocomplete: "autocompleteSource",
        index: 0,
        title: "Source",
        type: type
      };
    } else if (type === "destination"){
      placeDetails = {
        autocomplete: "autocompleteDestination",
        index: 1,
        title: "Destination",
        type: type
      };
    }

    var place = chanakya.Map.Details[placeDetails.autocomplete].getPlace();
    if (place.geometry) {
      chanakya.Map.Details.map.panTo(place.geometry.location);
      chanakya.Map.Details[placeDetails.type] = place;
      chanakya.Map.clearMarkers(placeDetails.index);
      chanakya.Map.Details.markers[placeDetails.index] = chanakya.Map.setMarkerByLocation(place.geometry.location, placeDetails.title);
    } else {
      element.placeholder = 'Enter a city';
    }
  }

  return {
    initializeSourceBox: initializeSourceBox,
    initializeDestinationBox: initializeDestinationBox
  }

}());
