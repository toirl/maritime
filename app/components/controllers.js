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

  // Listen to different events in the application.
  //
  // A timer has been stopped. Add the time element to the current scope.
  $scope.$on('timer:stopped', function(event, time) {
    $scope.times.unshift(time);
  });
}]);

controllers.controller('TimersCtrl', ['$scope', '$rootScope', 'Timers', 'Times', function($scope, $rootScope, Timers, Times) {

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
    timer.time = {"duration": 0, "state": 1, "tags": timer.tags, "start_date": moment().format('YYYY-MM-DD')}
  }

  $scope.stop = function(timer) {
    timer.time.state = 0;
    // TODO: Actually save the new time
    // Save the stopped time on the server
    //Times.save(timer.time);
    // Notify listeners and provide the time that has been stopped
    $rootScope.$broadcast('timer:stopped',timer.time);
  }

  $scope.pause = function(timer) {
    timer.time.state = 2;
  }
}]);
