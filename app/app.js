'use strict';

// Declare app level module which depends on views, and components
angular.module('maritime', [
  'ngRoute',
  'ngDragDrop',
  'maritime.view1',
  'maritime.view2',
  'maritime.version',
  'maritime.filters',
  'maritime.services',
  'maritime.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
