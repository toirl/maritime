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

controllers.controller('TimersCtrl', ['$scope', 'Timers', function($scope, Timers) {

  // All timers
  $scope.timers = Timers.query();

  $scope.add = function() {
    $scope.timers.push(angular.copy({"tags": [], "time": {"duration": 0, "state": 0}}));
  }

  $scope.start = function(timer) {
    for (var i = 0, len = $scope.timers.length; i < len; i++) {
      if ($scope.timers[i].time.state == 1) {
        $scope.timers[i].time.state = 2;
      }
    }
    timer.time.state = 1;
  }

  $scope.stop = function(timer) {
    timer.time.state = 0;
  }

  $scope.pause = function(timer) {
    timer.time.state = 2;
  }
}]);
