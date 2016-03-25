var filters = angular.module('maritime.filters', [])

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

filters.filter('duration', function() {
    return function(sec) {
        var duration = moment.duration(sec, 'seconds');
        return pad(duration.hours(), 2)+":"+pad(duration.minutes(), 2)+":"+pad(duration.seconds(), 2)
    };
});
