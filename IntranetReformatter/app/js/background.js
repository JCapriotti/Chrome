

// Set up loading of JS and CSS


var urlFilters = {
    "url": [
        {hostEquals: "intranet", pathPrefix: "/od"},
        {hostEquals: "intranet", pathPrefix: "/OD"}
    ]
}

chrome.webNavigation.onDOMContentLoaded.addListener(onContentLoaded, urlFilters);

function onContentLoaded(tab) {
    chrome.tabs.executeScript(tab.tabId, {file: "js/jquery.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tab.tabId, {file: "bootstrap/js/bootstrap.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tab.tabId, {file: "js/content-script.js", runAt: "document_end"});
    chrome.tabs.insertCSS(tab.tabId, {file: "bootstrap/css/bootstrap.min.css"});
    chrome.tabs.insertCSS(tab.tabId, {file: "/css/new.css"});
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
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
    });


function openInNewActiveTab(url)
{
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