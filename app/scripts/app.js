'use strict';

angular.module('angularApp', [])
//  .config(function ($routeProvider) {
  .config(function ($routeProvider, $locationProvider) {//, $httpProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
