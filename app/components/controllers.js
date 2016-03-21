var controllers = angular.module('maritime.controllers', []);

controllers.controller('TagCtrl', ['$scope', '$rootScope', 'Tags', function($scope, $rootScope, Tags) {
  $scope.tags = [];
  var response = Tags.query();
  response.$promise.then(function(data){
      $scope.tags = data.data;
  });

  $scope.add = function(tag) {
    var response = Tags.save(tag);
    response.$promise.then(function(data){
      $scope.tags.push(data.data);
    });
  }
  $scope.remove = function(tag) {
    var index = $scope.tags.indexOf(tag)
    if (index > -1) {
        var response = Tags.remove(tag);
        response.$promise.then(function(data){
          $scope.tags.splice(index, 1);
        });
    }
  }

  // Callbacks for drag and drop
  $scope.startDragCallback=function(event, ui, tag) {
    console.log("drag success, data:", tag);
    $rootScope.dragged = tag;
  }

}]);

controllers.controller('TimesCtrl', ['$scope', '$rootScope', 'Times', function($scope, $rootScope, Times) {
  $scope.times = []
  var response = Times.query();
  response.$promise.then(function(data){
      $scope.times = data.data;
  });

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

  // Remove the tag from the time
  $scope.removeTag = function(time, tag) {
    var index = time.tags.indexOf(tag)
    if (index > -1) {
       time.tags.splice(index, 1)
    }
    // TODO: Update the time on server (ti) <2016-01-06 20:55>
  }
  var addTag = function(time, tag) {
    var index = time.tags.indexOf(tag)
    if (time.tags.indexOf(tag) == -1) {
      time.tags.push(tag);
    }
    // TODO: Update the time on server (ti) <2016-01-06 20:55>
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
    addTag(time, $rootScope.dragged)
  }
}]);

controllers.controller('TimersCtrl', ['$scope', 'Timers', function($scope, Timers) {

  $scope.timers = Timers.query();

  $scope.add = function() {
    $scope.timers.push(angular.copy({"tags": [], "time": {"duration": 0, "state": 0}}));
  }

}]);

controllers.controller('TimerCtrl', ['$scope', '$rootScope', 'Timers', 'Times', function($scope, $rootScope, Timers, Times) {

    var setTags = function(time, tags) {
      // Copy the tags to currently attached to the timer. This is needed as
      // simply using timer.tags would only be a reference which means if you
      // remove a tag from a timer the tag will be removed from the times
      // created by this timer too. Using JSON here is the shortest way.
      var copytags = JSON.parse(JSON.stringify(tags));
      time.tags = copytags;
    }

    $scope.start = function() {
        if ($scope.timer.time.state == 2) {
            console.log("Timer resumed", $scope.timer.time.state);
            $scope.timer.time.state = 1;
            $scope.$broadcast("timer-resume");
        } else {
            console.log("Timer start", $scope.timer.time.state);
            $scope.timer.time = {"duration": 0, "state": 1, "start_date": moment().format('YYYY-MM-DD')}
            $scope.$broadcast("timer-start");
        }
    };

    $scope.pause = function() {
        console.log("Timer paused", $scope.timer.time.state);
        $scope.timer.time.state = 2;
        $scope.$broadcast("timer-stop");
    };

    $scope.stop = function() {
        $scope.$broadcast("timer-stop");
        $scope.timer.time.state = 0;
        $scope.timer.time.description = $scope.timer.description;
        // Copy the tags to currently attached to the timer. This is needed as
        // simply using timer.tags would only be a reference which means if you
        // remove a tag from a timer the tag will be removed from the times
        // created by this timer too. Using JSON here is the shortest way.
        $scope.timer.time.tags = JSON.parse(JSON.stringify($scope.timer.tags));
        // TODO: Actually save the new time
        // Save the stopped time on the server
        //Times.save($scope.timer.time);
        $rootScope.$broadcast('timer:stopped',$scope.timer.time);
    };

    $scope.$on("timer-stopped", function(event, data) {
        $scope.timer.time.duration = data.seconds + data.minutes*60 + data.hours*60*60;
        console.log("Timer stopped", $scope.timer.time);
    });

    // Handling Dragging and dropping Tags.
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
