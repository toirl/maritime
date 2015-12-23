var services = angular.module('maritime.services', ['ngResource']);

services.factory('Tags', ['$resource',
    function($resource) {
        return $resource('phones', {}, {
            query: {method:'GET', isArray:true}
        });
    }
]);
