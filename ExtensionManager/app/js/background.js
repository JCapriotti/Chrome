

// Shows Options popup when the extension button is clicked 
chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({url: "options.html"});
});


chrome.management.onInstalled.addListener(function (info) {
//	service = angular.injector(["ng", "app"]).get("ExtensionService");
//	service.addExtensionToMyList(info.id, info.name);
});

