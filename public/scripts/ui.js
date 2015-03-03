(function(w, a, crypto, utils) {
    var app = a.module('chanakyaApp', ['ngSanitize', 'ngRoute', 'firebase']);

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/login', {
                templateUrl: 'login.html',
                controller: 'ChanakyaLoginCtrl'
            }).
            when('/app', {
                templateUrl: 'content.html',
                controller: 'ChanakyaMainCtrl'
            }).
            otherwise({
                redirectTo: '/app'
            });
        }
    ]).run(['$rootScope', '$location',
        function($rootScope, $location) {
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if (!utils.fire.getAuth()) {
                    if (next.templateUrl !== "login.html")
                        $location.path("/login");
                } else {
                    if (next.templateUrl !== "content.html")
                        $location.path("/app");
                }
            });
        }
    ]);

    app.controller('ChanakyaLoginCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', "$firebaseAuth",
        function($scope, $rootScope, $http, $timeout, $location, $firebaseAuth) {
            $scope.init = function() {
                $scope.showLogin = false;
                $scope.login = true;
                $scope.forgot = false;
                $scope.authObj = $firebaseAuth(utils.fire);
                $scope.loaded = true;
                $scope.email = "";
                $scope.password = "";
                if ($scope.authObj.$getAuth()) {
                    console.log("Already logged in", $scope.authObj.$getAuth().uid);
                    $location.path('/app');
                }
                $scope.social = true;

                $scope.authObj.$onAuth(function(authData) {
                    if (authData) {
                        chanakya.user.saveAuth(authData, $location);
                    } else {
                        if (!utils.cookie.get('loginClicked')) {
                            $scope.showLogin = true;
                        }
                    }
                });
            };

            $scope.loginSubmit = function(provider) {
                $scope.errorMsg = undefined;
                $scope.actionDisabled = true;
                if (provider === 'google' || provider === 'facebook') {
                    login({
                        provider: provider
                    }, $location, showError);
                } else if ($scope.forgot) {
                    resetPassword($scope.email);
                } else {
                    if (!utils.validateEmail($scope.email)) {
                        showError("Please enter valid email id.");
                    } else if ($scope.password.trim().length < 6) {
                        if ($scope.login)
                            showError("Please enter valid password.");
                        else
                            showError("Password must me at least 6 characters long.");
                    } else if ($scope.login) {
                        login({
                            provider: 'password',
                            email: $scope.email,
                            password: $scope.password
                        }, $location, showError);
                    } else {
                        register({
                            provider: 'password',
                            email: $scope.email,
                            password: $scope.password
                        }, $location, showError);
                    }
                }
            };

            function resetPassword(email) {
                chanakya.user.resetPassword(email, handleResetPasswordSuccess, showError);
            }

            function handleResetPasswordSuccess() {
                $scope.actionDisabled = false;
                console.log("Password reset email sent successfully!");
            }

            function login(options) {
                chanakya.user.login(options, $location, showError);
            }

            function register(options) {
                chanakya.user.register(options, showError);
            }

            function showError(err) {
                console.log('called', err);
                $scope.showLogin = true;
                $scope.actionDisabled = false;
                $scope.errorMsg = err;
            }

            $scope.init();
        }
    ]);

    app.controller('ChanakyaMainCtrl', ['$scope', '$rootScope', '$http', '$interval', '$location', "$firebaseAuth",
        function($scope, $rootScope, $http, $interval, $location, $firebaseAuth) {
            if (!utils.fire.getAuth()) {
                $location.path('/login');
            } else {
                var auth = utils.fire.getAuth();
                if (auth.expires < ((new Date()).getTime() / 1000)) {
                    chanakya.user.logout($location);
                }
            }

            $scope.source = {
                lat: undefined,
                lng: undefined
            };
            $scope.cabs = {
                selected: 'ola'
            };
            $scope.loading = true;
            $scope.loadingMsg = "loading...";

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

            $scope.getTravelTime = function(cab) {
                if (!w.chanakya.Map.existsDestination() || !cab.available)
                    return "";
                if ($scope.travelInfoLoadFailed) return "failed";
                if ($scope.travelTime === 0) return "wait";
                var totalTravelTime = Math.floor(cab.duration) + $scope.travelTime;
                return Math.floor(totalTravelTime) + " mins";
            };

            $scope.getArrivalTime = function(cab) {
                if (cab.available)
                    return "Arrives in " + Math.floor(cab.duration) + " mins";
                return "Not available";
            };

            $scope.uberCost = {
                uberGO: "",
                uberX: "",
                UberBLACK: "",
                multipliers: {
                    uberGO: 1,
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

            $scope.showFilter = function(cab) {
                if (!cab.available)
                    return false;
                if ($scope.cabs.selected === "all")
                    return true;
                if (_l(cab.type) !== $scope.cabs.selected)
                    return false;
                return true;
            };

            $scope.sortNowList = function(cab) {
                return cab.cheapest ? 0 : (cab.closest ? 1 : (cab.recommended ? 2 : 3));
            };

            $scope.typingOn = false;
            $scope.isShownDetails = function() {
                if (!$scope.isMobile) return true;
                return !$scope.typingOn;
            };

            $scope.clearSource = function() {
                $scope.source = undefined;
                // $scope.destination = undefined;
                w.chanakya.Map.clearSource();
                w.chanakya.Map.Directions.clearDirections();
            };

            $scope.clearDestination = function() {
                $scope.destination = undefined;
                w.chanakya.Map.clearDestination();
                w.chanakya.Map.Directions.clearDirections();
            };

            $scope.openApp = function(type) {
                if ($scope.isAndroidApp) {
                    Android.openApp(_l(type));
                }
            };

            $scope.promoteApp = function(promotion) {
                if ($scope.isAndroidApp && promotion) {
                    Android.promoteTaxiStop(promotion);
                } else if (promotion == "like") {
                    window.open('//bit.ly/TaxiStop');
                }
            };

            $scope.logout = function() {
                chanakya.user.logout($location);
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
            $scope.selectService = function(service, hard) {
                if ($scope.refreshTrue) {
                    $scope.refreshTrue = false;
                    $scope.getService(service, true);
                }
                if ($scope.cabs.selected === service && !hard) return;
                if (!hard)
                    setMapHeight(($scope.availableTypes[service] > 5 ? 5 : $scope.availableTypes[service]) * 43);
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

                $scope.cabs.estimate = data.cabsEstimate;
                $scope.cabs.coordinates = data.cabs;

                for (var j = 0; j < $scope.cabs.estimate.length; j++) {
                    if ($scope.cabs.estimate[j].available) {
                        $scope.cabs.estimate[j].recommended = _l($scope.cabs.estimate[j].type) == "tfs" ? true : false;
                        $scope.availableTypes[_l(data.cabsEstimate[j].type)] ++;
                        $scope.availableTypes.all++;
                    }
                }

                $scope.loading = false;
                if (!silent) $scope.selectService(service, true);
                setMapHeight(($scope.availableTypes[$scope.cabs.selected] > 5 ? 5 : $scope.availableTypes[$scope.cabs.selected]) * 43);
                //setMapHeight(0);
            }

            function setMapHeight(lessHeight) {
                if (!$scope.isMobile)
                    map_container.style.height = document.body.clientHeight;
                else if ($scope.availableTypes[$scope.cabs.selected] === 0)
                    map_container.style.height = ($scope.mapHeight - 25) + "px";
                else
                    map_container.style.height = ($scope.mapHeight - lessHeight) + "px";
                google.maps.event.trigger(w.chanakya.Map.getMap(), "resize");

                if (w.chanakya.Map.existsSource() && w.chanakya.Map.existsDestination()) return;
                w.chanakya.Map.getMap().setCenter(w.chanakya.Map.getSource().location);
            }

            $scope.showMask = function() {
                return $scope.loading || $scope.availableTypes[$scope.cabs.selected] === 0;
            };

            $scope.getCabs = function(service, silent) {
                $http.get('cabs/all?lat=' + $scope.source.lat + '&lng=' + $scope.source.lng).success(function(data) {
                    processData(service, data, silent);
                });
            };

            $scope.getService = function(service, silent) {
                $scope.getCabs(service, silent);
            };

            $scope.init = function() {
                $scope.authObj = $firebaseAuth(utils.fire);
                $scope.loaded = true;
                $scope.loggedIn = utils.fire.getAuth() ? true : false;
                $scope.isMobile = utils.mobilecheck();
                $scope.isAndroidApp = utils.androidAppCheck();
                if ($scope.isMobile && !$scope.isAndroidApp) {
                    $scope.mapHeight = document.body.clientHeight - (78 + 70);
                    map_container.style.height = $scope.mapHeight + "px";
                } else if ($scope.isMobile && $scope.isAndroidApp) {
                    $scope.mapHeight = screen.height - (78 + 70);
                    map_container.style.height = $scope.mapHeight + "px";
                }
                $interval(function() {
                    $scope.refreshTrue = true;
                }, 30000);

                $scope.authObj.$onAuth(function(authData) {
                    if (authData) {
                        console.log("App Logged in as:", authData.uid);
                    } else {
                        console.log("App Logged out");
                    }
                });

                if ($scope.isAndroidApp) {
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
                    w.chanakya.Map.intializeGmaps(map_container, source_container, destination_container, location, function() {
                        w.chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
                        w.chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);
                    });
                } else {
                    w.chanakya.Map.intializeGmapsUsingNavigator(map_container, source_container, destination_container, function() {
                        w.chanakya.Map.Search.initializeAutocompleteSourceBox(source_container);
                        w.chanakya.Map.Search.initializeAutocompleteDestinationBox(destination_container);
                    });
                }

                // TODO: sample login call for ola
                // $http.get('/login/service/ola?email=akush2007@gmail.com&password=It2InBNhr6bO865/hiTuvg==')
                //     .success(function(data) {
                //         console.log(data);
                //     });

            };

            $scope.setSourceUserLocation = function(hard) {
                $scope.newSource = {};
                if ($scope.isAndroidApp) {
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
                    setSource(location);
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            setSource(position.coords);
                            return true;
                        });
                    }
                }
            };

            function setSource(location) {
                $scope.newSource = location;
                var origin = new google.maps.LatLng(location.latitude, location.longitude);
                var destination = new google.maps.LatLng($scope.source.lat, $scope.source.lng);

                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix({
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    durationInTraffic: false,
                    avoidHighways: false,
                    avoidTolls: false,
                }, setSourceCallback);
            }

            function setSourceCallback(response, status) {
                if (response.rows[0].elements[0].distance.value > 50 && $scope.newSource.latitude) {
                    w.chanakya.Map.setSource(w.chanakya.Map.convertLatLngToLocation($scope.newSource.latitude, $scope.newSource.longitude));
                }
            }

            source_container.addEventListener('sourceLocationChanged', function(event) {
                $scope.typingOn = false;
                $scope.source = {
                    lat: event.detail.lat,
                    lng: event.detail.lng
                };
                $scope.getService($scope.cabs.selected);
                calculateDistance();
                getUberCost();
            }, false);

            destination_container.addEventListener('destinationLocationChanged', function(event) {
                $scope.typingOn = false;
                $scope.destination = {
                    lat: event.detail.lat,
                    lng: event.detail.lng
                };
                calculateDistance();
                getUberCost();
            }, false);

            function calculateDistance() {
                if (!$scope.destination || !$scope.destination.lat) return;
                var origin = new google.maps.LatLng($scope.source.lat, $scope.source.lng);
                var destination = new google.maps.LatLng($scope.destination.lat, $scope.destination.lng);

                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix({
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    durationInTraffic: false,
                    avoidHighways: false,
                    avoidTolls: false,
                }, setDistanceCallback);
            }

            $scope.travelTime = 0;
            $scope.travelDistance = 0;
            $scope.travelInfoLoadFailed = false;

            function setDistanceCallback(response, status) {
                if (response.rows[0].elements[0].distance.value) {
                    $scope.travelInfoLoadFailed = false;
                    $scope.travelTime = Math.ceil(response.rows[0].elements[0].duration.value / 60);
                    $scope.travelDistance = response.rows[0].elements[0].distance.value / 1000;
                } else {
                    $scope.travelInfoLoadFailed = true;
                }
            }

            function getUberCost() {
                if (!$scope.destination || !$scope.destination.lat) return;
                $scope.uberCost = {
                    uberX: "",
                    UberBLACK: "",
                    multipliers: {
                        uberX: 1,
                        UberBLACK: 1
                    }
                };
                $http.get('cabs/uber/cost?srcLat=' + $scope.source.lat + '&srcLng=' + $scope.source.lng + '&destLat=' + $scope.destination.lat + '&destLng=' + $scope.destination.lng).success(function(data) {
                    for (var item in data.prices) {
                        if (data.prices[item].low_estimate == data.prices[item].high_estimate)
                            $scope.uberCost[data.prices[item].name] = data.prices[item].low_estimate;
                        else
                            $scope.uberCost[data.prices[item].name] = data.prices[item].low_estimate + "-" + data.prices[item].high_estimate;
                        $scope.uberCost.multipliers[data.prices[item].name] = data.prices[item].multiplier;
                    }
                });
            }

            function mapNearByCabs() {
                w.chanakya.Map.clearMarkers('cabs');
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
})(window, angular, CryptoJS, chanakya.utils);
