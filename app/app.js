'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('maritime', [
  'ngMaterial',
  'ngMessages',
  'ngRoute',
  'ngDragDrop',
  'timer',
  'maritime.filters',
  'maritime.services',
  'maritime.controllers'
]);

app.config(function($mdThemingProvider, $mdIconProvider){
      $mdThemingProvider.theme('default')
          .primaryPalette('blue-grey')
          .accentPalette('red');
});

app.constant('AppConfig', {
    url: 'http://localhost:8080',
});
