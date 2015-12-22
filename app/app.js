'use strict';

// Declare app level module which depends on views, and components
angular.module('maritime', [
  'ngRoute',
  'maritime.view1',
  'maritime.view2',
  'maritime.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
