

var app = angular.module('app', ['ngRoute']);

app.config(['$compileProvider', '$routeProvider', function($compileProvider, $routeProvider) {   
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|chrome):/);
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|chrome):/);
	
	$routeProvider.
		when('/local', {
			templateUrl: 'local.html',
			controller: 'LocalController'
		}).
		when('/my', {
			templateUrl: 'my.html',
			controller: 'MyController'
		}).
		when('/features', {
			templateUrl: 'features.html',
		}).
		when('/advanced', {
			templateUrl: 'advanced.html',
			controller: 'AdvancedController'
		}).
		otherwise({
			redirectTo: '/local'
		});
}]);



