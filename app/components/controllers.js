var controllers = angular.module('maritime.controllers', []);

controllers.controller('TagCtrl', ['$scope', 'Tags', function($scope, Tags) {
  $scope.tags = Tags.query();

  $scope.add = function(tag) {
    $scope.tags.push(angular.copy(tag));
  }
}]);

controllers.controller('TimesCtrl', ['$scope', 'Times', function($scope, Times) {
  $scope.times = Times.query();

  // Calculate the total time of all time entries. Please note that this
  // function seems to be called per item in the $scope.times array, and is
  // recalled if this array changes.
  $scope.totalTime = function(times) {
    totalTime = 0;
    for (var time = 0, len = $scope.times.length; time < len; time++) {
      totalTime += $scope.times[time].duration;
    }
    return totalTime;
  }
}]);
