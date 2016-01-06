var controllers = angular.module('maritime.controllers', []);

controllers.controller('TagCtrl', ['$scope', '$rootScope', 'Tags', function($scope, $rootScope, Tags) {
  $scope.tags = Tags.query();

  $scope.add = function(tag) {
    $scope.tags.push(angular.copy(tag));
  }

  // Callbacks for drag and drop
  $scope.startDragCallback=function(event, ui, tag) {
    console.log("drag success, data:", tag);
    $rootScope.dragged = tag;
  }

}]);

controllers.controller('TimesCtrl', ['$scope', '$rootScope', 'Times', function($scope, $rootScope, Times) {
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

  $scope.DropCallback=function(event, ui, time){
    // FIXME: Using the rootscope like a global variable is hackish. Find a
    // better way to find out which tag has been dragged (ti) <2016-01-05 00:54>
    var tag = $rootScope.dragged;
    if (time.tags.indexOf(tag) == -1) {
      time.tags.push(tag);
    }
  }
}]);

controllers.controller('TimersCtrl', ['$scope', '$rootScope', 'Timers', 'Times', function($scope, $rootScope, Timers, Times) {

  // All timers
  $scope.timers = Timers.query();

  $scope.add = function() {
    $scope.timers.push(angular.copy({"tags": [], "time": {"duration": 0, "state": 0}}));
  }

  var setTags = function(time, tags) {
    // Copy the tags to currently attached to the timer. This is needed as
    // simply using timer.tags would only be a reference which means if you
    // remove a tag from a timer the tag will be removed from the times
    // created by this timer too. Using JSON here is the shortest way.
    var copytags = JSON.parse(JSON.stringify(tags));
    time.tags = copytags;
  }

  $scope.start = function(timer) {
    for (var i = 0, len = $scope.timers.length; i < len; i++) {
      if ($scope.timers[i].time.state == 1) {
        $scope.timers[i].time.state = 2;
      }
    }
    timer.time = {"duration": 0, "state": 1, "start_date": moment().format('YYYY-MM-DD')}
  }

  $scope.stop = function(timer) {
    timer.time.state = 0;
    // TODO: Actually save the new time
    // Save the stopped time on the server
    //Times.save(timer.time);
    // Notify listeners and provide the time that has been stopped
    $rootScope.$broadcast('timer:stopped',timer.time);
    setTags(timer.time, timer.tags)
  }

  $scope.pause = function(timer) {
    timer.time.state = 2;
  }

  $scope.DropCallback=function(event, ui, timer){
    // FIXME: Using the rootscope like a global variable is hackish. Find a
    // better way to find out which tag has been dragged (ti) <2016-01-05 00:54>
    var tag = $rootScope.dragged;
    if (timer.tags.indexOf(tag) == -1) {
      timer.tags.push(tag);
    }
  }

  $scope.removeTag = function(timer, tag) {
    var index = timer.tags.indexOf(tag)
    if (index > -1) {
       timer.tags.splice(index, 1)
    }
  }
}]);
