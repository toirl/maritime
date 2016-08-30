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
          // TODO: Propagate the deleting to other controllers as the tag need
          // to be deleted in timers and timelogs too (ti) <2016-03-21 20:12> 
        });
    }
  }

  // Callbacks for drag and drop
  $scope.startDragCallback=function(event, ui, tag) {
    console.log("drag success, data:", tag);
    $rootScope.dragged = tag;
  }

}]);

controllers.controller('TimesCtrl', ['$mdEditDialog', '$scope', '$rootScope', 'Times', 'AppConfig', function($mdEditDialog, $scope, $rootScope, Times, AppConfig) {

  $scope.times = [];

  // editingdata stores information on which table row is currently edited.
  $scope.editingData = [];

  // Ordering, Pagination and Selection.
  $scope.selected = [];
  $scope.searchFilter = '';
  $scope.query = {
    order: 'start_date',
    limit: 5,
    page: 1
  };

  $scope.onReorder = function (order) {
    if (order == "start_date") {
        $scope.times.sort(function(a, b){
            if (a.start_date < b.start_date) {
                return -1
            } else if (a.start_date > b.start_date) {
                return 1
            } else {
                return 0
            }
        });
    }
    if (order == "-start_date") {
        $scope.times.sort(function(b, a){
            if (a.start_date < b.start_date) {
                return -1
            } else if (a.start_date > b.start_date) {
                return 1
            } else {
                return 0
            }
        });
    }
    if (order == "duration") {
        $scope.times.sort(function(a, b){return a.duration-b.duration});
    }
    if (order == "-duration") {
        $scope.times.sort(function(a, b){return b.duration-a.duration});
    }
  };

  var response = Times.query();
  response.$promise.then(function(data){
      $scope.times = data.data;
  });

  $scope.update = function(time) {
      Times.update(time);
  }

  $scope.getExportUrl= function(times) {
      time_ids = []
      for (var i = 0, len = times.length; i < len; i++) {
          time_ids.push(times[i].id);
      }
      return AppConfig.url+'/times/export' + encodeURI("?times="+time_ids)
  }


  $scope.edit = function (event, time, field) {
    // if auto selection is enabled you will want to stop the event
    // from propagating and selecting the row
    event.stopPropagation();

    var promise = $mdEditDialog.small({
      modelValue: $(time).attr(field),
      save: function (input) {
        $(time).attr(field, input.$modelValue);
        Times.update(time);
      },
      targetEvent: event,
      validators: {
      }
    });
  };

  // Calculate the total time of all time entries. Please note that this
  // function seems to be called per item in the $scope.times array, and is
  // recalled if this array changes.
  $scope.totalTime = function(times) {
    totalTime = 0;
    for (var time = 0, len = times.length; time < len; time++) {
      totalTime += times[time].duration;
    }
    return totalTime;
  }
  //
  // Remove the timelog
  $scope.remove = function(selected) {
    for (var i = 0, len = selected.length; i < len; i++) {
      var index = $scope.times.indexOf(selected[i])
      if (index > -1) {
          Times.remove(selected[i]);
          $scope.times.splice(index, 1)
      }
    }
  }

  // Remove the tag from the time
  $scope.removeTag = function(time, tag) {
    var index = time.tags.indexOf(tag)
    if (index > -1) {
        Times.update(time);
        time.tags.splice(index, 1)
    }
  }
  var addTag = function(time, tag) {
    var index = time.tags.indexOf(tag)
    if (time.tags.indexOf(tag) == -1) {
        Times.update(time);
        time.tags.push(tag);
    }
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

    $scope.timers = []
    var response = Timers.query();
    response.$promise.then(function(data){
        $scope.timers = data.data;
    });
    
    $scope.add = function() {
        var response = Timers.save({});
        response.$promise.then(function(data) {
            $scope.timers.push(data.data);
      });
    }

    $scope.remove = function(timer) {
        var index = $scope.timers.indexOf(timer)
        if (index > -1) {
            var response = Timers.delete(timer);
            response.$promise.then(function(data) {
                $scope.timers.splice(index, 1);
            });
        }
    };

}]);

controllers.controller('ChipCtrl', ['$scope', '$rootScope', 'Timers', 'Tags', function($scope, $rootScope, Timers, Tags) {
            var self = this;
            self.readonly = false;
            self.searchText = null;
            self.selectedItem = null;
            self.querySearch = querySearch;
            self.autocompleteDemoRequireMatch = false;

            self.tags = []
            var response = Tags.query();
            response.$promise.then(function(data){
                self.tags = data.data;
            });

            self.newTag = function(tag) {
                // Look if there is already a tag with this name. If so return
                // it. Otherwise return a new empty tag. If tag is already an
                // object then this is a tag found using autocomplete
                // mechanism.
                if (angular.isObject(tag)) {
                    return tag;
                }
                for (var i = 0, len = self.tags.length; i < len; i++) {
                   if (self.tags[i].name == tag) {
                      return self.tags[i];
                   }
                }
                return {name: tag, description: "", id: ""}
            };

            self.addTag = function(tag, timer) {
                if ( tag.id == "" ) {
                    var response = Tags.save(tag);
                    response.$promise.then(function(data){
                        tag.id = data.data.id;
                        Timers.update(timer);
                    });
                } else {
                        Timers.update(timer);
                }
            };

            self.removeTag = function(timer) {
                Timers.update(timer);
            };

            /**
             * Search for vegetables.
             */
            function querySearch (query) {
                var results = query ? self.tags.filter(createFilterFor(query)) : [];
                return results;
            }

            /**
             * Create filter function for a query string
             */
            function createFilterFor(query) {
              var lowercaseQuery = angular.lowercase(query);

              return function filterFn(tag) {
                var name = angular.lowercase(tag.name);
                return (name.indexOf(lowercaseQuery) === 0);
              };

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

    $scope.update = function() {
        Timers.update($scope.timer);
    }


    $scope.start = function() {
        if ($scope.timer.time.state == 2) {
            console.log("Timer resumed", $scope.timer.time.state);
            $scope.timer.time.state = 1;
            Timers.update($scope.timer);
            $scope.$broadcast("timer-resume");
        } else {
            console.log("Timer start", $scope.timer.time.state);
            $scope.timer.time = {"duration": 0, "state": 1, "start_date": moment().format('YYYY-MM-DD')}
            Timers.update($scope.timer);
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
        var response = Times.save($scope.timer.time);
        response.$promise.then(function(data){
            $rootScope.$broadcast('timer:stopped', data.data);
        });
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
        Timers.update(timer);
      }
    };

    $scope.addTag = function(timer, tag) {
      if (timer.tags.indexOf(tag) == -1) {
        timer.tags.push(tag);
        Timers.update(timer);
      }
    };

    $scope.makeTag = function(tag) {
        console.log(tag);
        return {name: tag};
    };

    $scope.removeTag = function(timer, tag) {
      var index = timer.tags.indexOf(tag)
      if (index > -1) {
         timer.tags.splice(index, 1)
         Timers.update(timer);
      }
    }

}]);
