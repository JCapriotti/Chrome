
var heading = $("h1").first().html();
$("h1").replaceWith($('<h2>' + heading + '</h2>'));

$("body").children("table").eq(0).remove();
$("body").wrapInner('<div class="container"></div>');
$("body").prepend('<div id="title" class="jumbotron"><h1>Organizational Development</h1></div>');
$("body").prepend("<div>Broken? <a href=\"\">Right-click to launch</a> in Incognito and disable extension. Also <a id=\"showHomepage\" href=\"\">review</a> in app store.</div>")


// Update Links
$("a").each(function() {
    var href = $(this).attr("href");

    if ((href && href.substring(0, 6) == "\\\\nike") ||
       (href && href.substring(0, 7) == "file://")) 
    {
        if (href.substring(0, 6) == "\\\\nike") {
            href = href.replace(/\\/g, "/");
            href = "file:" + href;
        }

        $(this).removeAttr("target");
        $(this).click(function (event) {
            event.stopImmediatePropagation();
            chrome.runtime.sendMessage({command: "openTab", url: href});
        });
    }
});

function cleanupText(text) {
    text = text.replace(/&nbsp;/g, "");
    text = text.replace(/&gt;/g, "");
    return text;
}

function isSectionActive(section) {
    path = location.pathname;
    switch (section) {
        case "Organizational Development":
            if (path.indexOf('/orgdev/') > 0) return true;
            break;
        case "Total Rewards":
            if (path.indexOf('/benefits/') > 0) return true;
            break;
        case "HR General":
            if (path.indexOf('/emprel/') > 0) return true;
            break;
        case "Learning &amp; Talent Dev":
            if (path.indexOf('/learning/') > 0) return true;
            break;
        case "Talent Acquisition":
            if (path.indexOf('/recruiting/') > 0) return true;
            break;
        default:
            return false;
    }
}

function makeId(text) {
    text = text.replace(/ /g, '');
    text = text.replace(/&amp;/g, '');
    return text;
}

// Move nav area
var navElement = $("#nav").detach();

// Remove Home (first li and the hr after that)
navElement.children().eq(0).remove();
navElement.children().eq(0).remove();

// Remove the cell that contained the nav
$("td[class = 'mainnav']").detach();


var navData = [];

// Turn each top level li into a different nav bar.
navElement.children("li").each(function () {
    var nav = {};

    var title = $(this).children("a").eq(0).html();
    nav["title"] = cleanupText(title);

    if ($(this).children("ul").html()) {
        var menu = $(this).children("ul").html().replace("&nbsp;", "");
        nav["menu"] = menu;
    }
    else {
        nav["menu"] = "";
    }
 
    navData.push(nav);
});

var navTabs = '<div role="tabpanel">';
navTabs += '<ul class="nav nav-pills main-nav" role="tablist">';
$.each(navData, function (index, value) {
    var title = value['title'];
    var id = makeId(title);
    var html =
        '<li role="presentation" class="' + (isSectionActive(title) ? "active" : "") + '">' +
        '<a href="#' + id + '" aria-controls="' +  id + '" role="tab" data-toggle="pill">' +
        title +
        '</a>' +
        '</li>'
    navTabs += html;
});
navTabs += '</ul></div>'

var navMenus = '<div class="tab-content">';
$.each(navData, function (index, value) {
    var title = value['title'];
    var id = makeId(title);
    var html =
        '<div role="tabpanel" class="tab-pane ' + (isSectionActive(title) ? "active" : "") +'" id="'+ id + '">' +
        '<nav class="navbar navbar-default">' +
        '<div class="container-fluid">' +
        '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
        '<ul class="nav navbar-nav">' +
        value['menu'] +
        '</ul>' +
        '</div>' +
        '</nav>' +
        '</div>'
    navMenus += html;
});
navMenus += '</div>';

// Add the menu
$("#title").after(navMenus);
$("#title").after(navTabs);

// Now add some more bootstrap classes for submenus
$("ul[class = 'nav navbar-nav']:has('ul') > li").addClass("dropdown");
$("li[class = 'dropdown']:has('ul') > a")
    .addClass("dropdown-toggle")
    .attr("data-toggle", "dropdown")
    .attr("role", "button")
    .attr("aria-expanded", "false");
$("li[class = 'dropdown'] > ul")
    .addClass("dropdown-menu")
    .attr("role", "menu")


// Clean up the &nbsp; crap
$("a").each(function () {
    var text = $(this).html();
    text = cleanupText(text);
    $(this).html(text);
});

$("#disable").click(function (){
    chrome.runtime.sendMessage({command: "disable"});
});

// Update app store link
$("#showHomepage").click(function (event) {
    event.stopImmediatePropagation();
    chrome.runtime.sendMessage({command: "showHomepage"});
});
