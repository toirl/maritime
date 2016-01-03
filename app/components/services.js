var services = angular.module('maritime.services', ['ngResource']);

services.factory('Tags', ['$resource',
    function($resource) {
        return $resource('tags', {}, {
            query: {method:'GET', isArray:true}
        });
    }
]);

services.factory('Times', ['$resource',
    function($resource) {
        return $resource('times', {}, {
            query: {method:'GET', isArray:true}
        });
    }
]);
