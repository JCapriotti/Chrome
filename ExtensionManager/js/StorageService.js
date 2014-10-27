
var app = angular.module('app');

app.service('StorageService', function ($q, $window) {


	this.addExtension = function (id) {
		$window.addExtension(id);
	};
	
	this.getSyncedExtensions = function () {
		var deferred = $q.defer();
		
		chrome.storage.local.get(null, function (data) {
			for (var i = 0; i < data.length; i++) {
				e = data[i];
				exts.push({
					id: e.id,
					homepageUrl: e.homepageUrl,
					name: e.name,
					enabled: e.enabled,
					type: getFriendlyType(e.type)
				});
			}
			deferred.resolve(exts);
		});
	}
});
