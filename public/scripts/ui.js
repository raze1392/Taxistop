(function(w, a) {

    w.chanakya = w.chanakya || {};

    w.mobilecheck = function() {
        var check = false;
        (function(a, b) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || w.opera);
        return check;
    };

    w.androidAppCheck = function() {
        var check = false;
        (function(a, b) {
            if (/TaxiStopApp\/[0-9\.]+$/.test(navigator.userAgent)) check = true;
        })(navigator.userAgent || navigator.vendor || w.opera);
        return check;
    };

    function _l(str) {
        return str.toLowerCase();
    }

    function _u(str) {
        return str.toUpperCase();
    }

    var chanakyaApp = angular.module('chanakyaApp', ['ngSanitize']);

    chanakyaApp.controller('ChanakyaCtrl', ['$scope', '$http', '$interval',
        function($scope, $http, $interval) {
            $scope.source = {
                lat: undefined,
                lng: undefined
            };
            $scope.cabs = {
                selected: 'ola'
            };
            $scope.loading = true;

            var map_container = document.getElementById('map-canvas');
            var source_container = document.getElementById('searchSource');
            var destination_container = document.getElementById('searchDestination');

            var CAB_TYPE = {
                Mini: w.CDN_IMAGE_PREFIX + '/images/mini.png',
                Hatchback: w.CDN_IMAGE_PREFIX + '/images/mini.png',
                Genie: w.CDN_IMAGE_PREFIX + '/images/mini.png',
                Nano: w.CDN_IMAGE_PREFIX + '/images/mini.png',
                Sedan: w.CDN_IMAGE_PREFIX + '/images/sedan.png',
                Meru: w.CDN_IMAGE_PREFIX + '/images/sedan.png',
                Prime: w.CDN_IMAGE_PREFIX + '/images/prime.png',
                Pink: w.CDN_IMAGE_PREFIX + '/images/prime.png',
                Auto: w.CDN_IMAGE_PREFIX + '/images/auto.png',
                'Kaali Peeli': w.CDN_IMAGE_PREFIX + '/images/mini.png',
                uberX: w.CDN_IMAGE_PREFIX + '/images/mini.png',
                UberBLACK: w.CDN_IMAGE_PREFIX + '/images/sedan.png'
            };

            $scope.services = [{
                name: "ola",
                icon: w.CDN_IMAGE_PREFIX + "/images/ola-icon-50x50.png"
            }, {
                name: "uber",
                icon: w.CDN_IMAGE_PREFIX + "/images/uber-icon-50x50.png"
            }, {
                name: "tfs",
                icon: w.CDN_IMAGE_PREFIX + "/images/tfs-icon-50x50.jpg"
            }, {
                name: "meru",
                icon: w.CDN_IMAGE_PREFIX + "/images/meru-icon-50x50.jpg"
            }];

            $scope.getCabImg = function(name) {
                return CAB_TYPE[name];
            };

            $scope.getCabTypeImg = function(type) {
                if (_l(type) == 'ola') return $scope.services[0].icon;
                if (_l(type) == 'uber') return $scope.services[1].icon;
                if (_l(type) == 'tfs') return $scope.services[2].icon;
                if (_l(type) == 'meru') return $scope.services[3].icon;
            };

            $scope.travelTime = 0;
            $scope.travelDistance = 0;
            $scope.travelInfoLoadFailed = false;
            $scope.setTravelInfo = function() {
                if (!$scope.destination || !$scope.destination.lat) return;
                var url = 'eta?srcLat=' + $scope.source.lat + '&srcLng=' + $scope.source.lng;
                url += '&destLat=' + $scope.destination.lat + '&destLng=' + $scope.destination.lng;
                $http.get(url).success(function(data) {
                    if (data.success) {
                        $scope.travelInfoLoadFailed = false;
                        $scope.travelTime = Math.ceil(data.duration.value / 60);
                        $scope.travelDistance = data.distance.value / 1000;
                    } else {
                        $scope.travelInfoLoadFailed = true;
                    }
                });
            };

            $scope.getTravelTime = function(cab) {
                if (!w.chanakya.Map.existsDestination() || !cab.available)
                    return "";
                if ($scope.travelInfoLoadFailed) return "failed";
                if ($scope.travelTime === 0) return "wait";
                var totalTravelTime = cab.duration + $scope.travelTime;
                return Math.floor(totalTravelTime) + " mins";
            };

            $scope.getArrivalTime = function(cab) {
                if (cab.available)
                    return "Arrives in " + Math.floor(cab.duration) + " mins";
                return "Not available";
            };

            $scope.uberCost = {
                uberX: "",
                UberBLACK: "",
                multipliers: {
                    uberX: 1,
                    UberBLACK: 1
                }
            };
            $scope.getTravelCost = function(cab) {
                if (!w.chanakya.Map.existsDestination() || !cab.available)
                    return "";
                if ($scope.travelDistance === 0) return "calculating";
                if (_l(cab.type) == "ola") {
                    if ($scope.travelInfoLoadFailed) return "failed";
                    return "apx &#8377;" + Math.ceil(w.chanakya.cost.ola($scope.travelDistance, cab.name.toLowerCase()));
                }
                if (_l(cab.type) == "tfs") {
                    if ($scope.travelInfoLoadFailed) return "failed";
                    return "apx &#8377;" + Math.ceil(w.chanakya.cost.tfs($scope.travelDistance, cab.name.toLowerCase()));
                }
                if (_l(cab.type) == "meru") {
                    if ($scope.travelInfoLoadFailed) return "failed";
                    return "apx &#8377;" + Math.ceil(w.chanakya.cost.meru($scope.travelDistance, cab.name.toLowerCase()));
                }

                if (_l(cab.type) == "uber") {
                    if ($scope.uberCost[cab.name] === "") {
                        return "calculating";
                    }
                    var multiplier = "";
                    if ($scope.uberCost.multipliers[cab.name] != 1) {
                        multiplier = "<span class='multiplier'>" + $scope.uberCost.multipliers[cab.name] + "x</span>";
                    }
                    return multiplier + " &#8377;" + $scope.uberCost[cab.name];
                }

            };
            $scope.getUberCost = function() {
                $http.get('cabs/uber/cost?srcLat=' + $scope.source.lat + '&srcLng=' + $scope.source.lng + '&destLat=' + $scope.destination.lat + '&destLng=' + $scope.destination.lng).success(function(data) {
                    for (var item in data.prices) {
                        if (data.prices[item].low_estimate == data.prices[item].high_estimate)
                            $scope.uberCost[data.prices[item].name] = data.prices[item].low_estimate;
                        else
                            $scope.uberCost[data.prices[item].name] = data.prices[item].low_estimate + "-" + data.prices[item].high_estimate;
                        $scope.uberCost.multipliers[data.prices[item].name] = data.prices[item].multiplier;
                    }
                });
            };

            $scope.showFilter = function(cab) {
                if (!cab.available)
                    return false;
                if ($scope.cabs.selected === "all")
                    return true;
                if (_l(cab.type) !== $scope.cabs.selected)
                    return false;
                return true;
            };

            $scope.typingOn = false;
            $scope.isShownDetails = function() {
                if (!$scope.isMobile) return true;
                return !$scope.typingOn;
            };

            $scope.clearDestination = function() {
                $scope.destination = undefined;
                w.chanakya.Map.Directions.clearDirections();
            };

            $scope.openApp = function(type) {
                if ($scope.isAndroidApp) {
                    Android.openApp(type);
                }
            };

            $scope.promoteApp = function(promotion) {
                if ($scope.isAndroidApp && promotion) {
                    Android.promoteTaxiStop(promotion);
                }
            };

            $scope.mask = false;
            $scope.availableTypes = {
                ola: 0,
                uber: 0,
                tfs: 0,
                meru: 0,
                all: 0
            };

            function clearData() {
                $scope.cabs.selected = "";
                $scope.cabs.estimate = [];
                $scope.cabs.coordinates = {};
                $scope.availableTypes = {
                    ola: 0,
                    uber: 0,
                    tfs: 0,
                    meru: 0,
                    all: 0
                };
                mapNearByCabs();
            }

            $scope.refreshTrue = false;
            $scope.selectService = function(service, hard, silent) {
                if (silent) return;
                if ($scope.refreshTrue) {
                    $scope.refreshTrue = false;
                    $scope.getService(service);
                }
                if ($scope.cabs.selected === service && !hard) return;
                $scope.cabs.selected = service;
                mapNearByCabs();
            };

            function processData(service, data, silent) {
                $scope.mask = false;
                $scope.availableTypes = {
                    ola: 0,
                    uber: 0,
                    tfs: 0,
                    meru: 0,
                    all: 0
                };
                if (!data.cabsEstimate) {
                    $scope.mask = true;
                    return;
                }

                for (var j = 0; j < data.cabsEstimate.length; j++) {
                    if (data.cabsEstimate[j].available) {
                        $scope.availableTypes[_l(data.cabsEstimate[j].type)] ++;
                        $scope.availableTypes.all++;
                    }
                }

                $scope.cabs.estimate = data.cabsEstimate;
                $scope.cabs.coordinates = data.cabs;

                $scope.loading = false;
                $scope.selectService(service, true, true);
                //setMapHeight($scope.availableTypes * 43);
                setMapHeight(0);
            }

            function setMapHeight(lessHeight) {
                if ($scope.availableTypes === 0)
                    map_container.style.height = ($scope.mapHeight - 25) + "px";
                else
                    map_container.style.height = ($scope.mapHeight - lessHeight) + "px";
                google.maps.event.trigger(w.chanakya.Map.getMap(), "resize");

                if (w.chanakya.Map.existsSource() && w.chanakya.Map.existsDestination()) return;
                w.chanakya.Map.getMap().setCenter(w.chanakya.Map.getSource().location);
            }

            $scope.showMask = function() {
                return $scope.availableTypes[$scope.cabs.selected] !== 0;
            };

            $scope.getCabs = function(service) {
                $http.get('cabs/all?lat=' + $scope.source.lat + '&lng=' + $scope.source.lng).success(function(data) {
                    processData(service, data);
                });
            };

            $scope.getService = function(service) {
                $scope.loading = true;
                $scope.getCabs(service);
            };

            $scope.init = function() {
                $scope.isMobile = w.mobilecheck();
                $scope.isAndroidApp = w.androidAppCheck();
                if ($scope.isMobile && !$scope.isAndroidApp) {
                    $scope.mapHeight = document.body.clientHeight - (78 + 70);
                    map_container.style.height = $scope.mapHeight + "px";
                } else if ($scope.isMobile && $scope.isAndroidApp) {
                    $scope.mapHeight = screen.height - (78 + 70);
                    map_container.style.height = $scope.mapHeight + "px";
                }
                $interval(function() {
                    $scope.refreshTrue = true;
                }, 5000);
            };

            google.maps.event.addDomListener(w, 'load', function() {
                if (w.androidAppCheck()) {
                    console.log(Android.getUserLocation());
                    var androidLoc = Android.getUserLocation();
                    var location = {
                        latitude: 21.0000,
                        longitude: 78.0000
                    };
                    if (androidLoc) {
                        androidLoc = androidLoc.split('|');
                        location = {
                            latitude: androidLoc[0],
                            longitude: androidLoc[1]
                        };
                    }
                    w.chanakya.Map.intializeGmaps(map_container, source_container, destination_container, location,
                        function() {
                            w.chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
                            w.chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);
                        });
                } else {
                    w.chanakya.Map.intializeGmapsUsingNavigator(map_container, source_container, destination_container, function() {
                        w.chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
                        w.chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);
                    });
                }
            });

            source_container.addEventListener('sourceLocationChanged', function(event) {
                $scope.source = {
                    lat: event.detail.lat,
                    lng: event.detail.lng
                };
                $scope.getService($scope.cabs.selected);
                $scope.typingOn = false;
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
                $scope.setTravelInfo();
                $scope.getUberCost();
                $scope.typingOn = false;
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

            function mapNearByCabs() {
                if ($scope.cabs.selected !== 'all') {
                    showNearByCabs($scope.cabs.coordinates[_u($scope.cabs.selected)], $scope.cabs.selected);
                    return;
                }
                for (var i = 0; i < $scope.services.length; i++) {
                    showNearByCabs($scope.cabs.coordinates[_u($scope.services[i].name)], $scope.services[i].name, true);
                }

            }

            function showNearByCabs(cabs, service, persist) {
                if (!persist) w.chanakya.Map.clearMarkers('cabs');
                for (var cabType in cabs) {
                    var _cabs = cabs[cabType];
                    for (var i = 0; i < 2; i++) {
                        var _c = cabs[cabType][i];
                        if (_c) {
                            var location = w.chanakya.Map.convertLatLngToLocation(_c.lat, _c.lng);
                            w.chanakya.Map.setMarker(location, service.toUpperCase() + ' ' + cabType, CAB_TYPE[cabType]);
                        }
                    }
                }
            }

            $scope.init();
        }
    ]);
})(window, angular);
