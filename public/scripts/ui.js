window.chanakya = window.chanakya || {};

window.mobilecheck = function() {
    var check = false;
    (function(a, b) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function _l(str) {
    return str.toLowerCase();
}

var chanakyaApp = angular.module('chanakyaApp', ['ngSanitize']);

chanakyaApp.controller('ChanakyaCtrl', ['$scope', '$http', '$interval',
    function($scope, $http, $interval) {
        $scope.source = {
            lat: undefined,
            lng: undefined
        };
        $scope.cabs = {
            selected: 'Ola'
        };
        var map_container = document.getElementById('map-canvas');
        var source_container = document.getElementById('searchSource');
        var destination_container = document.getElementById('searchDestination');

        var CAB_TYPE = {
            Mini: '../images/mini.png',
            Hatchback: '../images/mini.png',
            Genie: '../images/mini.png',
            Nano: '../images/mini.png',
            Sedan: '../images/sedan.png',
            Meru: '../images/sedan.png',
            Prime: '../images/prime.png',
            'Kaali Peeli': '../images/mini.png',
        }

        $scope.services = [{
            name: "Ola",
            icon: "images/ola-icon-50x50.png"
        }, {
            name: "Uber",
            icon: "images/uber-icon-50x50.png"
        }, {
            name: "TFS",
            icon: "images/tfs-icon-50x50.jpg"
        }, {
            name: "Meru",
            icon: "images/meru-icon-50x50.jpg"
        }];

        $scope.mask = false;
        $scope.availableTypes = 0;

        function processData(selected, data) {
            if (!data.cabsEstimate) {
                $scope.mask = true;
                return;
            }
            $scope.mask = false;
            $scope.cabs.selected = selected;
            $scope.cabs.estimate = data.cabsEstimate;
            $scope.cabs.coordinates = data.cabs;
            mapNearByCabs($scope.cabs.coordinates, $scope.cabs.selected);
            $scope.availableTypes = 0;
            for (var i = 0; i < data.cabsEstimate.length; i++) {
                if (data.cabsEstimate[i].available) $scope.availableTypes++;
            };
            // setMapHeight($scope.availableTypes * 43);
            setMapHeight(0);
        }

        function setMapHeight(lessHeight) {
            if ($scope.availableTypes == 0)
                map_container.style.height = ($scope.mapHeight - 25) + "px";
            map_container.style.height = ($scope.mapHeight - lessHeight) + "px";
        }

        $scope.showMask = function() {
            if ($scope.isMobile) return $scope.availableTypes != 0;
            return $scope.cabs.estimate && $scope.cabs.estimate.length > 0;
        }

        $scope.getOla = function() {
            $http.get('cabs/ola?lat=' + $scope.source.lat + '&lng=' + $scope.source.lng).success(function(data) {
                processData("ola", data);
            });
        }

        $scope.getUber = function() {
            $http.get('cabs/uber?lat=' + $scope.source.lat + '&lng=' + $scope.source.lng).success(function(data) {
                processData("uber", data);
            });
        }

        $scope.getTfs = function() {
            $http.get('cabs/tfs?lat=' + $scope.source.lat + '&lng=' + $scope.source.lng).success(function(data) {
                processData("tfs", data);
            });
        }

        $scope.getMeru = function() {
            $http.get('cabs/meru?lat=' + $scope.source.lat + '&lng=' + $scope.source.lng).success(function(data) {
                processData("meru", data);
            });
        }

        $scope.getService = function(service) {
            if (service.toLowerCase() == 'ola') {
                $scope.getOla();
            }
            if (service.toLowerCase() == 'uber') {
                $scope.getUber();
            }
            if (service.toLowerCase() == 'tfs') {
                $scope.getTfs();
            }
            if (service.toLowerCase() == 'meru') {
                $scope.getMeru();
            }
        }

        $scope.travelTime = 0;
        $scope.travelDistance = 0;
        $scope.setTravelInfo = function() {
            if (!$scope.destination || !$scope.destination.lat) return;
            var url = 'eta?srcLat=' + $scope.source.lat + '&srcLng=' + $scope.source.lng;
            url += '&destLat=' + $scope.destination.lat + '&destLng=' + $scope.destination.lng;
            $http.get(url).success(function(data) {
                $scope.travelTime = Math.ceil(data.duration.value / 60);
                $scope.travelDistance = data.distance.value / 1000;
            });
        }

        $scope.getTravelTime = function(cab) {
            if (!chanakya.Map.existsDestination() || !cab.available)
                return "";
            if ($scope.travelTime == 0) return "wait";
            var totalTravelTime = cab.duration + $scope.travelTime;
            return Math.floor(totalTravelTime) + " mins";
        }

        $scope.getArrivalTime = function(cab) {
            if (cab.available)
                return "Arrives in " + Math.floor(cab.duration) + " mins";
            return "Not available";
        }

        $scope.uberCost = {
            uberX: "",
            UberBLACK: "",
            multipliers: {
                uberX: 1,
                UberBLACK: 1
            }
        };
        $scope.getTravelCost = function(cab) {
            if (!chanakya.Map.existsDestination() || !cab.available)
                return "";
            if ($scope.travelDistance == 0) return "calculating";
            if ($scope.cabs.selected.toLowerCase() == "ola") {
                return "apx &#8377;" + Math.ceil(chanakya.cost.ola($scope.travelDistance, cab.name.toLowerCase()));
            }
            if ($scope.cabs.selected.toLowerCase() == "tfs") {
                return "apx &#8377;" + Math.ceil(chanakya.cost.tfs($scope.travelDistance, cab.name.toLowerCase()));
            }

            if (_l($scope.cabs.selected) == "uber") {
                if ($scope.uberCost[cab.name] == "") {
                    return "calculating";
                }
                var multiplier = "";
                if ($scope.uberCost.multipliers[cab.name] != 1) {
                    multiplier = "<span class='multiplier'>" + $scope.uberCost.multipliers[cab.name] + "x</span>";
                }
                return multiplier + "apx &#8377;" + $scope.uberCost[cab.name];
            }

        }
        $scope.getUberCost = function() {
            $http.get('cabs/uber/cost?srcLat=' + $scope.source.lat + '&srcLng=' + $scope.source.lng + '&destLat=' + $scope.destination.lat + '&destLng=' + $scope.destination.lng).success(function(data) {
                for (item in data.prices) {
                    $scope.uberCost[data.prices[item].name] = data.prices[item].low_estimate + "-" + data.prices[item].high_estimate;
                    $scope.uberCost.multipliers[data.prices[item].name] = data.prices[item].multiplier;
                }
            });
        }

        $scope.showFilter = function(cab) {
            if ($scope.isMobile && !cab.available)
                return false;
            return true;
        }

        $scope.init = function() {
            $scope.isMobile = window.mobilecheck();
            if ($scope.isMobile) {
                $scope.mapHeight = document.body.clientHeight - (78 + 70);
                map_container.style.height = $scope.mapHeight + "px";
            }
            $interval(function() {
                $scope.callAtInterval();
            }, 60000);
        }
        $scope.callAtInterval = function() {
            $scope.getService($scope.cabs.selected);
            if ($scope.destination && $scope.destination.lat) {
                $scope.setTravelInfo();
                $scope.getUberCost();
            }
        }


        google.maps.event.addDomListener(window, 'load', function() {
            if (/TaxiStopApp\/[0-9\.]+$/.test(navigator.userAgent)) {
                console.log(Android.getUserLocation());
                var location = Android.getUserLocation().split('|');
                chanakya.Map.intializeGmaps(map_container, source_container, destination_container, {
                        latitude: location[0],
                        longitude: location[1]
                    },
                    function() {
                        chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
                        chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);
                    });
            } else {
                chanakya.Map.intializeGmapsUsingNavigator(map_container, source_container, destination_container, function() {
                    chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
                    chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);
                });
            }
        });

        source_container.addEventListener('sourceLocationChanged', function(event) {
            $scope.source = {
                lat: event.detail.lat,
                lng: event.detail.lng
            };
            $scope.getService($scope.cabs.selected);
        }, false);

        destination_container.addEventListener('destinationLocationChanged', function(event) {
            $scope.destination = {
                lat: event.detail.lat,
                lng: event.detail.lng
            };
            $scope.uberCost = {
                uberX: "",
                UberBLACK: "",
                multipliers: {
                    uberX: 1,
                    UberBLACK: 1
                }
            };
            $scope.getService($scope.cabs.selected);
            $scope.setTravelInfo();
            $scope.getUberCost();
        }, false);

        function buildGoogleDistanceMatrixURL(sourceLocation, destinationLocation, mode) {
            var url = "https://maps.googleapis.com/maps/api/distancematrix/json";
            url += '?destinations=' + destinationLocation.lat + "," + destinationLocation.lng;
            url += '&origins=' + sourceLocation.lat + "," + sourceLocation.lng;

            if (mode) {
                url += '&mode=' + mode;
            }
            return url;
        }

        // TODO: change for all
        function mapNearByCabs(cabs, service) {
            chanakya.Map.clearMarkers('cabs');
            for (cabType in cabs) {
                var _cabs = cabs[cabType];
                for (var i = 0; i < 2; i++) {
                    var _c = cabs[cabType][i];
                    if (_c) {
                        var location = chanakya.Map.convertLatLngToLocation(_c.lat, _c.lng);
                        chanakya.Map.setMarker(location, service.toUpperCase() + ' ' + cabType, CAB_TYPE[cabType]);
                    }
                };
            }
        }

        $scope.init();
    }
]);
