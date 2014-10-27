
var app = angular.module('app');

app.controller('LocalController', function ($scope, ExtensionService) {

	function loadExtensions() {
		ExtensionService.getLocalExtensions().then(function(data) {
			$scope.localExtensions = data;
		});
	}
	
	$scope.removeLocal = function(id) {
		chrome.management.uninstall(id, function () {
			loadExtensions();
		});
	}
	
	$scope.setEnabled = function(id, enabled) {
		chrome.management.setEnabled(id, enabled);
	}

	$scope.setInMyList = function(id, inMyList) {
		if (inMyList) {
			ExtensionService.addExtensionToMyList();
		}
		else {
			ExtensionService.removeFromMyList(id);
		}
		
	}
	
	$scope.localPredicate = "name";
	
	loadExtensions();
});




