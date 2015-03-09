(function(w, a, crypto, utils) {
    w.chanakya = w.chanakya || {};
    w.chanakya.user = (function() {

        var userInfo;

        var setUserInfo = function(hash) {
            utils.fire.child("users").child(hash).on("value", function(user) {
                var info = user.val();
                if (info.ratesauth && (info.ratesauth.expires > ((new Date()).getTime() / 1000))) {
                    userInfo = info;
                } else {
                    var ratesAuth = utils.ratesfire.getAuth(),
                        token = utils.ratesfire.getAuth().token,
                        expires = utils.ratesfire.getAuth().expires;
                    if (ratesAuth && (expires > ((new Date()).getTime() / 1000))) {
                        setUserInfoObject(hash, info, ratesAuth);
                    } else {
                        getRatesAuth(hash, info);
                    }
                }
            }, function(errorObject) {
                userInfo = undefined;
            });
        }

        var ratesFailed = 0;
        var getRatesAuth = function(hash, info) {
            utils.ratesfire.authAnonymously(function(error, ratesAuth) {
                console.log("Authenticating for rates");
                if (error) {
                    if (ratesFailed > 5) {
                        console.log("Authenticating for rates has failed 5 time. Reload or try again.");
                    } else {
                        ratesFailed++;
                        getRatesAuth(info);
                        console.log("Rates Login Failed!", error);
                    }
                } else {
                    setUserInfoObject(hash, info, ratesAuth);
                }
            });
        }

        function setUserInfoObject(hash, info, ratesAuth) {
            userInfo = info;
            userInfo.ratesauth = {
                token: ratesAuth.token,
                expires: ratesAuth.expires
            };
            utils.fire.child("users").child(hash).child('ratesauth').child('token').set(ratesAuth.token);
            utils.fire.child("users").child(hash).child('ratesauth').child('expires').set(ratesAuth.expires);
        }

        var getUserInfo = function() {
            return userInfo;
        }

        function getName(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'google':
                    return authData.google.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
            }
        }

        var authHandle = function(error, authData, location, showError) {
            if (error) {
                handleError(error, showError);
            } else {
                saveAuth(authData, location);
            }
        };

        var saveAuth = function(authData, location) {
            var hash = crypto.SHA1(authData[authData.provider].email).toString();

            utils.fire.child("users").child(hash).child('uid').set(authData.uid);
            utils.fire.child("users").child(hash).child('name').set(getName(authData));
            utils.fire.child("users").child(hash).child('email').set(authData[authData.provider].email);

            if (authData[authData.provider].cachedUserProfile && authData[authData.provider].cachedUserProfile.picture) {
                if (authData.provider === 'google')
                    utils.fire.child("users").child(hash).child('picture').set(authData[authData.provider].cachedUserProfile.picture);
                else if (authData.provider === 'facebook')
                    utils.fire.child("users").child(hash).child('picture').set(authData[authData.provider].cachedUserProfile.picture.data.url);
            }

            utils.cookie.create({
                name: 'user',
                value: hash,
                days: 1
            });
            utils.fire.child("users").child(hash).child('timestamp').set((new Date()).getTime());
            utils.fire.child("users").child(hash).child(authData.provider).set({
                uid: authData.uid
            });
            setUserInfo(hash);
            location.path('/app');
        };

        var register = function(options, location, showError) {
            utils.fire.createUser({
                email: options.email,
                password: options.password
            }, function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    utils.fire.authWithPassword({
                        email: options.email,
                        password: options.password
                    }, function(error, authData) {
                        authHandle(error, authData, location, showError);
                    });
                }
            });
        };

        var login = function(options, location, showError) {
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
                        handleError(error, showError);
                }, {
                    scope: "email"
                });
            } else {
                utils.fire.authWithPassword({
                    email: options.email,
                    password: options.password
                }, function(error, authData) {
                    authHandle(error, authData, location, showError);
                });
            }
        };

        var logout = function(location) {
            utils.fire.unauth();
            utils.cookie.erase('user');
            utils.cookie.erase('loginClicked');
            location.path("/login");
        };

        var resetPassword = function(email, handleSuccess, handleError) {
            utils.fire.resetPassword({
                email: email
            }, function(error) {
                if (error === null) {
                    handleSuccess();
                } else {
                    handleError(error, handleError);
                }
            });
        };

        // var changeEmail = function(oldEmail, newEmail, password) {
        //     utils.fire.changeEmail({
        //         oldEmail: oldEmail,
        //         newEmail: newEmail,
        //         password: password
        //     }, function(error) {
        //         if (error === null) {
        //             console.log("Email changed successfully");
        //         } else {
        //             console.log("Error changing email:", error);
        //         }
        //     });
        // };

        var changePassword = function(email, oldPswd, newPswd, handleSuccess, handleError) {
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

        var handleError = function(error, showError) {
            console.log(error);
            utils.cookie.erase('user');
            utils.cookie.erase('loginClicked');
            switch (error.code) {
                case "INVALID_EMAIL":
                    showError("The specified user account email is invalid.");
                    break;
                case "INVALID_PASSWORD":
                    showError("The specified user account password is incorrect.");
                    break;
                case "INVALID_USER":
                    showError("The specified user account does not exist.");
                    break;
                default:
                    showError("Error logging user in");
            }
        };
        return {
            info: getUserInfo,
            setUserInfo: setUserInfo,
            saveAuth: saveAuth,
            register: register,
            login: login,
            logout: logout,
            resetPassword: resetPassword,
            changePassword: changePassword,
            handleError: handleError
        };
    }());
})(window, angular, CryptoJS, chanakya.utils);
