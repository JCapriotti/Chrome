
var app = angular.module('app');

app.service('ExtensionService', function($q, $window, StorageService) {

	_management = $window.chrome.management;
	_this = this;

	////////////////////////////////////////////////////////////////////////////
	// Returns all locally installed extensions
	////////////////////////////////////////////////////////////////////////////
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
	

	////////////////////////////////////////////////////////////////////////////
	// Returns all extensions in "my" list
	////////////////////////////////////////////////////////////////////////////
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
	

	////////////////////////////////////////////////////////////////////////////
	// Adds all locally installed extensions to "my" list
	////////////////////////////////////////////////////////////////////////////
	this.addAllLocalToMyList = function() {
		_management.getAll(function (extensions) {
			for (var i = 0; i < extensions.length; i++) {
				e = extensions[i];
				StorageService.addExtension(e.id, e.name, e.homepageUrl, getIcon(e.icons)).then(angular.noop);
			}
		});
	};
	
	
	////////////////////////////////////////////////////////////////////////////
	// Removes an extension from list
	////////////////////////////////////////////////////////////////////////////
	this.removeExtensionFromMyList = function(id) {
		StorageService.removeExtension(id);
	};

	
	////////////////////////////////////////////////////////////////////////////
	// Adds extension to list
	////////////////////////////////////////////////////////////////////////////	
	this.addExtensionToMyList = function (id) {
		_management.get(id, function (data) {
			if (data) {
				StorageService.addExtension(data.id, data.name, data.homepageUrl, getIcon(data.icons))
			}
		});				
	};
	
	
	
	////////////////////////////////////////////////////////////////////////////
	// Gets the data for this extension
	////////////////////////////////////////////////////////////////////////////
	this.getMyExtensionData = function () {
		var deferred = $q.defer();

		_management.getSelf(function (data) {
			if (data) {
				deferred.resolve(data);
			}
		});				
		
		return deferred.promise;
	};
	
	
	////////////////////////////////////////////////////////////////////////////
	// Helper to get one icon from the list of extension icons.
	////////////////////////////////////////////////////////////////////////////
	function getIcon(icons) {
		var retval = "";
		if (icons && icons.length) {
			retval = icons[0].url;
		}
		return retval;
	}	
	
	////////////////////////////////////////////////////////////////////////////
	// Helper to find an extension in a collection by Id
	////////////////////////////////////////////////////////////////////////////
	function findById(data, id) {
		for (i = 0; i < data.length; i++) {
			if (data[i].id === id)
				return data[i];				
		}
		return undefined;
	}
	
});

