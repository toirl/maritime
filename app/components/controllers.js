var controllers = angular.module('maritime.controllers', []);

controllers.controller('TagListCtrl', ['$scope', 'Tags', function($scope, Tags) {
  $scope.tags = Tags.query();
}]);
