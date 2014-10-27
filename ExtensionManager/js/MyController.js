
var app = angular.module('app');

app.controller('MyController', function ($scope, ExtensionService) {

	ExtensionService.getMyExtensions().then(function(data) {
		$scope.myExtensions = data;
	});
	
	$scope.removeFromMyList = function(id) {
		ExtensionService.removeFromMyList(id);
	}

	$scope.myPredicate = "name";
	
});




