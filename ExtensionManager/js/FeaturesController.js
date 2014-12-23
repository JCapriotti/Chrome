
var app = angular.module('app');

app.controller('FeaturesController', function ($scope, ExtensionService) {

	ExtensionService.getMyExtensionData().then(function(data) {
		$scope.homepageUrl = data.homepageUrl;
	});

});




