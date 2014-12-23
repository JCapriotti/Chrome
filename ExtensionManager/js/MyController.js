
var app = angular.module('app');

app.controller('MyController', function ($scope, ExtensionService) {

	function load() {
		ExtensionService.getMyExtensions().then(function(data) {
			$scope.myExtensions = data;
		});
	}
	
	$scope.removeFromMyList = function(id) {
		ExtensionService.removeExtensionFromMyList(id);
		load();
	}

	$scope.myPredicate = "name";
	load();
	
});




