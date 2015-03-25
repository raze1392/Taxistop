(function(w, a, crypto, utils, map, undefined) {
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

})(window, angular, CryptoJS, window.chanakya.utils, window.chanakya.Map);
