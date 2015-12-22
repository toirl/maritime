'use strict';

angular.module('maritime.version', [
  'maritime.version.interpolate-filter',
  'maritime.version.version-directive'
])

.value('version', '0.1');
