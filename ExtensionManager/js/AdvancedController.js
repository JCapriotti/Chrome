
var app = angular.module('app');

app.controller('AdvancedController', function ($scope, ExtensionService, StorageService) {

	$scope.addAllLocalToMyList = function() {
		ExtensionService.addAllLocalToMyList();
	}
	
	$scope.clear = function() {
		StorageService.clearStorage();
	}
});




