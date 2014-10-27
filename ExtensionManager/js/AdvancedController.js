
var app = angular.module('app');

app.controller('AdvancedController', function ($scope, ExtensionService) {

	$scope.addAllLocalToMyList = function() {
		ExtensionService.addAllLocalToMyList();
	}
	
	$scope.clear = function() {
		ExtensionService.clear();
	}
	
});




