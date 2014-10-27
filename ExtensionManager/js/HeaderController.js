
var app = angular.module('app');

app.controller('HeaderController', function ($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
});



