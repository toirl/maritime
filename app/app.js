'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('maritime', [
  'ngRoute',
  'ngDragDrop',
  'timer',
  'maritime.version',
  'maritime.filters',
  'maritime.services',
  'maritime.controllers'
]);

app.constant('AppConfig', {
    url: 'http://localhost:8080',
});
