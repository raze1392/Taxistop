(function(w, a, crypto, utils, map, undefined) {

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
