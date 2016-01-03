var filters = angular.module('maritime.filters', [])

filters.filter('duration', function() {
    return function(seconds) {
        return moment.duration(seconds, 'seconds').humanize();
    };
});
