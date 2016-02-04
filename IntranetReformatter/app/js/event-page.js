
var SITE_URL = "http://intranet/hr"

var urlFilters = {
    "url": [
        {hostEquals: "intranet", pathPrefix: "/od"},
        {hostEquals: "intranet", pathPrefix: "/OD"},
        {hostEquals: "intranet", pathPrefix: "/hr"},
        {hostEquals: "intranet", pathPrefix: "/HR"},
    ]
}

chrome.webNavigation.onDOMContentLoaded.addListener(onContentLoaded, urlFilters);
chrome.runtime.onMessage.addListener(messageHandler);


function showPageAction(tabId) {
    chrome.pageAction.show(tabId);
};

function onContentLoaded(tab) {
    showPageAction(tab.tabId)
    chrome.tabs.executeScript(tab.tabId, {file: "js/jquery.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tab.tabId, {file: "bootstrap/js/bootstrap.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tab.tabId, {file: "js/content-script.js", runAt: "document_end"});
    chrome.tabs.insertCSS(tab.tabId, {file: "bootstrap/css/bootstrap.min.css"});
    chrome.tabs.insertCSS(tab.tabId, {file: "/css/new.css"});
}

function messageHandler(request, sender, sendResponse) {
    if (request.command == "openTab") {
        openInNewActiveTab(request.url)
    }
    else if (request.command == "disable") {
        disable();
        chrome.tabs.reload();
    }
    else if (request.command == "showHomepage") {
        showHomepage();
    }
    else if (request.command == "validateUrlAndRedirect") {
        validateUrlAndRedirect(sender.tab.id, sender.tab.url)
    }
}

function openInNewActiveTab(url) {
    chrome.tabs.query({"active": true}, function(activeTab) {
        console.log(activeTab[0]);
        chrome.tabs.create({
            "url": url,
            "active": true,
            "index": activeTab[0].index + 1
        });
    });
}

function disable() {
    chrome.management.getSelf(function (ext) {
        chrome.management.setEnabled(ext.id, false);
    });
}

function showHomepage() {
    chrome.management.getSelf(function (ext) {
        openInNewActiveTab(ext.homepageUrl)
    });
}

function validateUrlAndRedirect(tabId, currentUrl) {
    if (currentUrl.toLowerCase().indexOf(SITE_URL) === -1) {
        chrome.tabs.update(tabId, {url: SITE_URL});
    }
}