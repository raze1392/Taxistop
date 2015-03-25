(function(w, a, crypto, utils, map, undefined) {
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
})(window, angular, CryptoJS, window.chanakya.utils, window.chanakya.Map);
