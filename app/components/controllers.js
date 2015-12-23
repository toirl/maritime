var controllers = angular.module('maritime.controllers', []);

controllers.controller('TagCtrl', ['$scope', 'Tags', function($scope, Tags) {
  $scope.tags = Tags.query();

  $scope.add = function(tag) {
    $scope.tags.push(angular.copy(tag));
  }
}]);
