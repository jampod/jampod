include("realtime_keywords_helper.js");

var realtime_keyword_source = "naver";
var realtime_keywords_index = 0;
var stop_realtime_keywords = false;

document.value("S_REALTIME.keywords", {});

function on_loaded() {
    var category = __search_category();
     
    __update_category_panes(category);

    __update_realtime_keywords(true);
    __rotate_realtime_keyword();
}

function on_unloaded() {
    stop_realtime_keywords = true;
}

function on_paging(data) {
    storage.value("S_SEARCH.category", data["code"]);
    
    __update_category_button(data["code"]);
    __update_category_label(data["title"]);
}

function on_change_category() {
    var category = __search_category();
    
    console.log("on_change_category: " + category);

    __update_category_panes(category);
    
    controller.action("hide", { group:"query.categories" });
}

function on_activate_mediabar() {
    var jukebox = controller.module("jukebox");

    if (jukebox.count() > 0) {
        
    }
}

function on_resume_menu() {
    console.log("on_resume_menu: " + document.value("category.changed"));
    if (document.value("category.changed")) {
        on_change_category();
    }
    console.log("on_resume_menu!");

    document.value("category.changed", false);
}

function on_resume_mediabar() {
    var jukebox = controller.module("jukebox");
   
    if (jukebox.count() > 0) {
    }
}

function goto_search_home() {
    document.value("S_SEARCH.keyword", null);
    
    controller.action("popup", { "display-unit":"S_SEARCH" });
}

function update_realtime_keywords() {
    __update_realtime_keywords(false);
}

function __update_category_panes(category) {
    var panes = controller.object("home.category");
    
    panes.action("pane", { pane:"P_HOME.CATEGORY_" + category });
}

function __update_category_button(category) {
    var button = controller.object("btn.category");
    var image = "category_btn_" + category.toLowerCase() + ".png";
    
    button.action("property", { properties:"image=" + image })
}

function __update_category_label(title) {
    var label = controller.object("label.category");
    
    label.action("property", { properties:"text=" + title })
}

function __search_category() {
    var category = storage.value("S_SEARCH.category");
    
    if (category) {
        return category;
    }
    
    return "WEB";
}

function __update_realtime_keywords(infinity) {
    var sources = [ "naver", "daum" ];
    
    sources.forEach(function(source) {
        __fetch_realtime_keywords(source, function(keywords) {
           var keywords_data = document.value("S_REALTIME.keywords");

            keywords_data[source] = keywords;
            document.value("S_REALTIME.keywords", keywords_data);
        });
    });

    if (infinity) {
        timeout(300, function() {
            if (!stop_realtime_keywords) {
                __update_realtime_keywords(true);
            }
        });
    }
}

function __rotate_realtime_keyword() {
    var keywords = document.value("S_REALTIME.keywords")[realtime_keyword_source];
    var cell = view.object("cell.realtime.keywords.widget");

    if (keywords) {
        if (realtime_keywords_index < Math.min(keywords.length, 10)) {
            cell.data("display-unit", keywords[realtime_keywords_index]);
            cell.action("reload");
    
            realtime_keywords_index = realtime_keywords_index + 1;
        } else {
            realtime_keyword_source = __next_realtime_keyword_source(realtime_keyword_source);
            realtime_keywords_index = 0;
        }
        
        timeout(3, function() {
            if (!stop_realtime_keywords) {
                __rotate_realtime_keyword();
            }
        });
    } else {
        timeout(0.5, function() {
            if (!stop_realtime_keywords) {
                __rotate_realtime_keyword();
            }
        });
    }
}

function __next_realtime_keyword_source(source) {
    if (source === "naver") {
        return "daum";
    }

    if (source === "daum") {
        return "naver";
    }

    return "naver";
}
