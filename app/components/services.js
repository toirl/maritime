var services = angular.module('maritime.services', ['ngResource']);

services.factory('Tags', ['$resource',
    function($resource) {
        return $resource('json_data/tags/:id', {id:'@id'}, {
            // Default query method, this method can be deleted as it
            // implements the same behaviour like the default query method of
            // the resource.
            query: {method:'GET'}
        });
    }
]);

services.factory('Times', ['$resource',
    function($resource) {
        return $resource('json_data/times/:id', {id:'@id'}, {
            // Default query method, this method can be deleted as it
            // implements the same behaviour like the default query method of
            // the resource.
            query: {method:'GET'},
        });
    }
]);

services.factory('Timers', ['$resource',
    function($resource) {
        return $resource('json_data/timers/:id', {id:'@id'}, {
            // Default query method, this method can be deleted as it
            // implements the same behaviour like the default query method of
            // the resource.
            query: {method:'GET'},
            update: {method:'PUT'},
        });
    }
]);
