
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Extensions are stored in storage with keys of "Extension_<id>"
//
// Rationale regarding storage sync limits: 
//		MAX_ITEMS = 512 - Will allow close to 512 extensions to exist in list
//		QUOTA_BYTES_PER_ITEM = 8192 - Extensions in the list need to store additional data like homepage url, icon url, 
//			etc. If extensions were all stored in one item, there may only be enough space for 80-100 extensions.
// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var app = angular.module('app');

app.service('StorageService', function($q, $window) {
	
	_storage = $window.chrome.storage.sync;
	_extensionKey = "Extension_";


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Gets list of "My Extensions". Waits for initialization promise to return, then returns local data.
	// Uses an array so that it works well with Angular orderBy filter
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.getMyExtensions = function() {
		var deferred = $q.defer();
		_storage.get(null, function (items) {
			if (items) {
				var ret = [];
				for (var key in items) {
					if (key.indexOf(_extensionKey) == 0) {
						var e = items[key];
						ret.push({
							id: e.id,
							name: e.name,
							homepageUrl: e.homepageUrl,
							iconUrl: e.iconUrl
						});
					}
				}
			}				
			deferred.resolve(ret);
		});
		return deferred.promise;
	};
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Removes extension from list
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.removeExtension = function(id) {
		var deferred = $q.defer();
		var key = getKey(id);
		_storage.remove(key, function () {
			deferred.resolve();
		});
		return deferred.promise;
	};

	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Adds many extension to the list
	// extensions is an array of objects containing:
	//		id, name, homepageUrl, iconUrl
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.addExtensions = function(extensions) {
		var deferred = $q.defer();
		var storageExtensions = {};

		for (var i = 0; i < extensions.length; i++) {
			var e = extensions[i];
			var key = getKey(e.id);
			storageExtensions[key] = e;
		}
		
		_storage.set(storageExtensions, function () {
			deferred.resolve();
		});		
		return deferred.promise;
	};

	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Adds an extension to the list
	// extension:
	//		id, name, homepageUrl, iconUrl
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.addExtension = function(extension) {
		return this.addExtensions([extension]);
	};
	
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.clearStorage = function () {
		_storage.clear();
	};


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Helper to get a chrome.storage key for an extension
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getKey(id) {
		return _extensionKey + id;
	}
	
	
});
