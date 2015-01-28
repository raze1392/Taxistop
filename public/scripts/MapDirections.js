window.chanakya = window.chanakya || {};
window.chanakya.Map = window.chanakya.Map || {};

/*
 * @Author: Shivam Shah <dev.shivamshah@gmail.com>
 * API to get Directions between 2 places
 *
 * APIs available for interaction
 *   getDirections: fetches Directions between 2 places and renders it on the map,
 *   setTravelMode: sets the TravelMode to get the directions for,
 *   getTravelMode: gets the currently set TravelMode - default is DRIVING,
 *   setRouteAlternatives: sets the display of Route alternatives to true/false - default is FALSE,
 *   getRouteAlternatives: gets the currently set Route alternative,
 *   setUnitSystem: sets the UnitSystem to use,
 *   getUnitSystem: gets the currently selected UnitSystem
 */
window.chanakya.Map.Directions = (function() {
    var getDirections = function(source, destination) {
        var request = {
            origin: source,
            destination: destination,
            travelMode: chanakya.Map.Directions.getTravelMode(),
            provideRouteAlternatives: chanakya.Map.Directions.getRouteAlternatives(),
            unitSystem: chanakya.Map.Directions.getUnitSystem()
        };

        chanakya.Map._Details.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                chanakya.Map.clearMarkers();
                chanakya.Map._Details.directionsDisplay.setDirections(response);
                $('.centerMarker').hide();
            }
        });
    }

    var setTravelMode = function(travelMode) {
        travelMode = travelMode.toLowerCase();
        if (chanakya.Map._Details.Directions.TravelMode[travelMode]) {
            chanakya.Map._Details.Directions.travelModeSelected = chanakya.Map._Details.Directions.TravelMode[travelMode]
        } else {
            chanakya.Map._Details.Directions.travelModeSelected = chanakya.Map._Details.Directions.TravelMode.driving;
        }

        // If both Source and Destination is selected, then show the route
        if (chanakya.Map.existsSource() && chanakya.Map.existsDestination()) {
            c.getDirections(chanakya.Map.getSource().location, chanakya.Map.getDestination().location);
        }
    }

    var getTravelMode = function() {
        return chanakya.Map._Details.Directions.travelModeSelected;
    }

    var setRouteAlternatives = function(arg) {
        if (typeof arg === "boolean") chanakya.Map._Details.Directions.routeAlternatives = arg;
        else chanakya.Map._Details.Directions.routeAlternatives = false;
    }

    var getRouteAlternatives = function(arg) {
        return chanakya.Map._Details.Directions.routeAlternatives;
    }

    var setUnitSystem = function(unit) {
        unit = unit.toLowerCase();
        if (chanakya.Map._Details.Directions.UnitSystem[unit]) {
            chanakya.Map._Details.Directions.unitSystemSelected = chanakya.Map._Details.Directions.UnitSystem[unit]
        } else {
            chanakya.Map._Details.Directions.unitSystemSelected = chanakya.Map._Details.Directions.UnitSystem.metric;
        }

        // If both Source and Destination is selected, then show the route
        if (chanakya.Map.existsSource() && chanakya.Map.existsDestination()) {
            c.getDirections(chanakya.Map.getSource().location, chanakya.Map.getDestination().location);
        }
    }

    var getUnitSystem = function() {
        return chanakya.Map._Details.Directions.unitSystemSelected;
    }

    return {
        getDirections: getDirections,
        setTravelMode: setTravelMode,
        getTravelMode: getTravelMode,
        setRouteAlternatives: setRouteAlternatives,
        getRouteAlternatives: getRouteAlternatives,
        setUnitSystem: setUnitSystem,
        getUnitSystem: getUnitSystem
    }

}());
