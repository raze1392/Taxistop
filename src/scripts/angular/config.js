var app = angular.module('chanakyaApp', ['ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase']);

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
