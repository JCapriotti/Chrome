
var app = angular.module('app');

app.service('ExtensionService', function($q, $window, StorageService) {

	_management = $window.chrome.management;
	_this = this;

	// Returns all locally installed extensions
	this.getLocalExtensions = function () {
		var deferred = $q.defer();
		
		function getFriendlyType(type) {
			switch(type) {
				case "extension":
					return "Extension";
				case "theme":
					return "Theme";
				default:
					return "App"
			}
		}
		
		StorageService.getMyExtensions().then(function(my) {
			_management.getAll(function (data) {
				var extensions = [];
				if (data) {
					for (var i = 0; i < data.length; i++) {
						e = data[i];
						
						extensions.push({
							id: e.id,
							homepageUrl: e.homepageUrl,
							name: e.name,
							enabled: e.enabled,
							type: getFriendlyType(e.type),
							iconUrl: getIcon(e.icons),
							inMyList: findById(my, e.id) ? true : false
						});
					}
				}
				deferred.resolve(extensions);
			});
			
		});
		
		return deferred.promise;
	};
	

	this.getMyExtensions = function() {
		var deferred = $q.defer();

		_this.getLocalExtensions().then(function (local) {
			StorageService.getMyExtensions().then(function(data) {
				for (var i = 0; i < data.length; i++)
				{
					e = data[i];
					e.installed = findById(local, e.id) ? "Yes" : "No"
				}
				deferred.resolve(data);
			});
		});
		
		return deferred.promise;
	};	
	
	this.addAllLocalToMyList = function() {
		_management.getAll(function (data) {
			for (var i = 0; i < data.length; i++) {
				e = data[i];
				StorageService.addExtension(e.id, e.name, e.homepageUrl, getIcon(e.icons)).then(angular.noop);
			}
		});
	};
	
	this.removeFromMyList = function(id) {
//		delete _myExtensions[id];
//		StorageService.setMyExtensions(_myExtensions);
	};
	
	this.clear = function () {
		_storage.clear();
	};

	this.addExtensionToMyList = function (id, name, homepageUrl, iconUrl) {
//		var newItem = {};
//		newItem = {
//			id: id,
//			name: name,
//			homepageUrl: homepageUrl,
//			iconUrl: iconUrl
//		};
		
//		_myExtensions[newItem.id] = newItem;
//		StorageService.setMyExtensions(_myExtensions);
	};
	
	function getIcon(icons) {
		var retval = "";
		if (icons && icons.length) {
			retval = icons[0].url;
		}
		return retval;
	}	
	
	function findById(data, id) {
		for (i = 0; i < data.length; i++) {
			if (data[i].id === id)
				return data[i];				
		}
		return undefined;
	}
	
});


app.service('StorageService', function($q, $window) {
	
	_storage = $window.chrome.storage.local;
	_extensionKey = "Extensions";
	_this = this;
//	_myExtensions = undefined;

	this.getMyExtensions = function() {
		var deferred = $q.defer();
		_storage.get(_extensionKey, function (items) {
			extensions = items[_extensionKey];
			if (extensions) {
				var ret = [];
				for (var key in extensions) {
					var e = extensions[key];
					
					ret.push({
						id: e.id,
						name: e.name,
						homepageUrl: e.homepageUrl,
						iconUrl: e.iconUrl
					});
				}
			}				
			else {
				extensions = {};
			}
//			_myExtensions = extensions;
			deferred.resolve(ret);
		});
		return deferred.promise;
	};
	
//	this.setMyExtensions = function(extensions) {
//		var setVal = {};
//		setVal[_extensionKey] = extensions;
//		_storage.set(setVal);
//	};

	this.addExtension = function(id, name, homepageUrl, iconUrl) {
		var deferred = $q.defer();
		var newItem = {};
		newItem = {
			id: id,
			name: name,
			homepageUrl: homepageUrl,
			iconUrl: iconUrl
		};

		_storage.get(_extensionKey, function (items) {
			extensions = items[_extensionKey] ? items[_extensionKey] : {};
			extensions[newItem.id] = newItem;
			
			var setVal = {};
			setVal[_extensionKey] = extensions;
			_storage.set(setVal, function () {
				deferred.resolve();
			});
		});

		return deferred.promise;
	}
	
});

