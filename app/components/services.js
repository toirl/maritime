var services = angular.module('maritime.services', ['ngResource']);

services.factory('Tags', ['$resource', 'AppConfig',
    function($resource, AppConfig) {
        return $resource(AppConfig.url+'/tags/:id', {id:'@id'}, {
            // Default query method, this method can be deleted as it
            // implements the same behaviour like the default query method of
            // the resource.
            query: {method:'GET'},
        });
    }
]);

services.factory('Times', ['$resource', 'AppConfig',
    function($resource, AppConfig) {
        return $resource(AppConfig.url+'/times/:id', {id:'@id'}, {
            // Default query method, this method can be deleted as it
            // implements the same behaviour like the default query method of
            // the resource.
            query: {method:'GET'},
            update: {method:'PUT'},
        });
    }
]);

services.factory('Timers', ['$resource', 'AppConfig',
    function($resource, AppConfig) {
        return $resource(AppConfig.url+'/timers/:id', {id:'@id'}, {
            // Default query method, this method can be deleted as it
            // implements the same behaviour like the default query method of
            // the resource.
            query: {method:'GET'},
            update: {method:'PUT'},
        });
    }
]);
