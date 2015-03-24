(function(w, a, crypto, utils, map, undefined) {
    var app = a.module('chanakyaApp', ['ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase']);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/app/now");
        $urlRouterProvider.when("/app", "/app/now");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "login.html"
            })
            .state('app', {
                url: "/app",
                templateUrl: "content.html",
                abstract: true
            })
            .state('app.profile', {
                url: "/profile",
                data: {
                    selectedTab: 'profile'
                }
            })
            .state('app.now', {
                url: "/now",
                data: {
                    selectedTab: 'now'
                }
            })
            .state('app.later', {
                url: "/later",
                data: {
                    selectedTab: 'later'
                }
            })
            .state('app.options', {
                url: "/options",
                data: {
                    selectedTab: 'options'
                }
            });
    }]);

    app.service('User', ['$location', function($location) {
        var _user = this;
        _user.info = undefined;
        _user.fire = utils.fire;
        _user.logout = function() {
            _user.info = undefined;
            _user.fire.unauth();
            utils.cookie.erase('user');
            utils.cookie.erase('loginClicked');
            utils.Storage.erase('user.info');
            $location.path("/login");
        };
        _user.changePassword = function(email, oldPswd, newPswd, handleSuccess, handleError) {
            utils.fire.changePassword({
                email: email,
                oldPassword: oldPswd,
                newPassword: newPswd
            }, function(error) {
                if (error === null) {
                    handleSuccess();
                } else {
                    handleError(error);
                }
            });
        };

        //
        _user.setUserInfo = function(hash) {
            console.debug('setting user info');
            $.ajax({
                url: utils.fire.toString() + "/users/" + hash + ".json?auth=" + utils.fire.getAuth().token,
                jsonp: "updateUserInfo",
                success: function(user) {
                    _user.getRatesAuth(hash, user);
                },
                error: function(xhr, status, err) {
                    info = undefined;
                }
            });
        };

        _user.getRatesAuth = function(hash, info) {
            console.log('getting rates auth', utils.fire.toString() + "/ratesAuth/.json?auth=" + utils.fire.getAuth().token);
            $.ajax({
                url: utils.fire.toString() + "/ratesAuth/.json?auth=" + utils.fire.getAuth().token,
                jsonp: "updateRatesAuth",
                success: function(ratesAuth) {
                    if (!ratesAuth || !ratesAuth.expires || ratesAuth.expires < ((new Date()).getTime() / 1000)) {
                        _user.setRatesAuth(hash, info);
                    } else {
                        _user.setUserInfoObject(hash, info, ratesAuth);
                    }
                },
                error: function(xhr, status, err) {
                    console.error(err);
                }
            });
        };

        _user.ratesFailed = 0;
        _user.setRatesAuth = function(hash, info) {
            utils.ratesfire.authAnonymously(function(error, ratesAuth) {
                console.log("Authenticating for rates");
                if (error) {
                    if (ratesFailed > 5) {
                        console.log("Authenticating for rates has failed 5 time. Reload or try again.");
                    } else {
                        ratesFailed++;
                        _user.setRatesAuth(hash, info);
                        console.log("Rates Login Failed!", error);
                    }
                } else {
                    _user.setUserInfoObject(hash, info, ratesAuth);
                    utils.fire.child("ratesAuth").set({
                        token: ratesAuth.token,
                        expires: ratesAuth.expires
                    });
                }
            });
        };

        _user.setUserInfoObject = function(hash, info, ratesAuth) {
            _user.info = info;
            _user.info.ratesauth = {
                token: ratesAuth.token,
                expires: ratesAuth.expires
            };
            _user.saveUserInfo(_user.info);
            w.location.hash = '#/app';
        };

        _user.saveUserInfo = function(info) {
            console.log('registering info event');
            utils.Storage.set("user.info", info);
            var userInfoChangedEvent = new CustomEvent('userInfoChanged', {
                details: info
            });
            w.dispatchEvent(userInfoChangedEvent);
        };

    }]);

    app.controller('ChanakyaLoginCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', "$firebaseAuth", 'User',
        function($scope, $rootScope, $http, $timeout, $location, $firebaseAuth, User) {
            $scope.authObj = $firebaseAuth(utils.fire);
            $scope.init = function() {
                $scope.showLogin = true;
                $scope.login = true;
                $scope.forgot = false;
                $scope.loaded = true;
                $scope.email = "";
                $scope.password = "";
                $scope.social = true;
                if ($scope.authObj.$getAuth()) {
                    console.log("Already logged in", $scope.authObj.$getAuth().uid);
                    $location.path('/app');
                }
            };

            $scope.loginSubmit = function(provider) {
                $scope.errorMsg = undefined;
                $scope.actionDisabled = true;
                $scope.showLogin = false;
                $scope.successMsg = "";
                $scope.errorMsg = "";
                if (provider === 'google' || provider === 'facebook') {
                    login({
                        provider: provider
                    });
                } else if ($scope.forgot) {
                    if (!utils.validateEmail($scope.email))
                        showError("Please enter valid email id.");
                    else
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
                        });
                    } else {
                        register({
                            provider: 'password',
                            email: $scope.email,
                            password: $scope.password
                        });
                    }
                }
            };

            // login action functions
            var register = function(options, location, showError) {
                $scope.authObj.$createUser({
                    email: options.email,
                    password: options.password
                }).then(function(userData) {
                    console.log("User " + userData.uid + " created successfully!");
                    return $scope.authObj.$authWithPassword({
                        email: options.email,
                        password: options.password
                    });
                }).then(function(authData) {
                    saveAuth(authData);
                }).catch(function(error) {
                    handleError(error);
                });
            };

            var login = function(options) {
                console.log('trying login', options);
                if (utils.cookie.get('loginClicked')) return;
                utils.cookie.create({
                    name: 'loginClicked',
                    value: true,
                    secs: 60
                });
                if (options.provider === 'facebook' || options.provider === 'google') {
                    utils.fire.authWithOAuthRedirect(options.provider, function(error, authData) {
                        if (error)
                            handleError(error);
                    }, {
                        scope: "email"
                    });
                } else {
                    console.log("Authenticating with password");
                    $scope.authObj.$authWithPassword({
                        email: options.email,
                        password: options.password
                    }).then(function(authData) {
                        console.log(authData);
                        saveAuth(authData);
                    }).catch(function(error) {
                        console.log(error);
                        handleError(error);
                    });
                }
            };

            var resetPassword = function(email) {
                $scope.authObj.$resetPassword({
                    email: email
                }).then(function() {
                    handleResetPasswordSuccess();
                }).catch(function(error) {
                    handleError(error);
                });
            };

            function handleResetPasswordSuccess() {
                $scope.actionDisabled = false;
                showSuccess("Password reset email sent successfully!");
            }

            function saveAuth(authData) {
                var hash = crypto.SHA1(authData[authData.provider].email).toString();

                $.ajax({
                    url: utils.fire.toString() + "/users/" + hash + ".json?auth=" + utils.fire.getAuth().token,
                    jsonp: "updateUser",
                    success: function(user) {
                        console.log(user);
                        user = user || {};
                        user.uid = authData.uid;
                        user.name = user.name || getName(authData);
                        user.email = user.email || authData[authData.provider].email;
                        if (authData[authData.provider].cachedUserProfile && authData[authData.provider].cachedUserProfile.picture) {
                            if (authData.provider === 'google')
                                user.picture = authData[authData.provider].cachedUserProfile.picture;
                            else if (authData.provider === 'facebook')
                                user.picture = authData[authData.provider].cachedUserProfile.picture.data.url;
                        }
                        user.timestamp = (new Date()).getTime();
                        user.facebook = user.facebook || null;
                        user.google = user.google || null;
                        user.password = user.password || null;
                        user[authData.provider] = authData.provider[authData.provider] || {
                            uid: authData.uid
                        };
                        utils.fire.child("users").child(hash).set(user);
                        utils.cookie.create({
                            name: 'user',
                            value: hash,
                            days: 1
                        });

                        User.setUserInfo(hash);
                        w.location.hash = '#/app';
                    },
                    error: function(xhr, status, err) {
                        console.log(err);
                    }
                });
            }

            function handleError(error) {
                console.log(error);
                switch (error.code) {
                    case "INVALID_EMAIL":
                        showError("The specified user account email is invalid.");
                        break;
                    case "INVALID_PASSWORD":
                        showError("The specified user account password is incorrect.");
                        break;
                    case "INVALID_USER":
                        showError("The specified user account does not exist. Please register.");
                        break;
                    default:
                        showError("Error logging user in");
                }
            }

            function showError(err) {
                $scope.showLogin = true;
                $scope.actionDisabled = false;
                $scope.errorMsg = err;
            }

            function showSuccess(msg) {
                $scope.showLogin = true;
                $scope.actionDisabled = false;
                $scope.successMsg = msg;
            }

            function cleanMsg() {
                $timeout(function() {
                    $scope.errorMsg = "";
                    $scope.successMsg = "";
                }, 3000);
            }

            $scope.init();

        }
    ]);

    app.controller('ChanakyaMainCtrl', ['$scope', '$rootScope', '$http', '$interval', '$location', "$firebaseAuth", 'User',
        function($scope, $rootScope, $http, $interval, $location, $firebaseAuth, User) {
            $scope.authObj = $firebaseAuth(utils.fire);
            $scope.authData = $scope.authObj.$getAuth();
            // Check login status, move to angular var
            if (!$scope.authData) {
                $location.path('/login');
            } else {
                if ($scope.authData.expires < ((new Date()).getTime() / 1000)) {
                    User.logout();
                }
            }

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.selectedTab)
                    $scope.serviceRadio = toState.data.selectedTab;
            });

            $scope.serviceRadio = window.location.hash.split('/')[2];
            $scope.$watch('serviceRadio', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $location.path('/app/' + newValue);
                }
            });

            $scope.optionList = [{
                id: 'about',
                title: 'About',
                content: "<p>Check available taxis and cabs in your area and their prices for making better judgement about travel time and money.</p><p>Currently it checks for Ola, Uber, Taxi for sure and Meru cabs.</p> <p>Click on the cab detail from the list to go to vendor's app to book yourself a ride.</p>",
                open: false,
                smallText: true,
                action: null
            }, {
                id: 'coupons',
                title: 'Coupons',
                content: "here are the coupons",
                action: null,
                subAction: true
            }, {
                id: 'share',
                abstract: true,
                title: 'Share',
                action: function() {
                    $scope.promoteApp('share');
                }
            }, {
                id: 'like',
                abstract: true,
                title: 'Like',
                action: function() {
                    $scope.promoteApp('like');
                }
            }];

            $scope.dummyAction = function() {
                console.log("dummy");
            };

            $scope.options = {};
            $scope.options.opened = "";
            $scope.optionAction = function(option) {
                option.open = true;
                if (option.action)
                    option.action();
            };




        }
    ]);







})(window, angular, CryptoJS, window.chanakya.utils, window.chanakya.Map);
