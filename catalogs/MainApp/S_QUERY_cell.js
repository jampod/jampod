var keyword_suggestions = {};
var current_keyword = null;
var current_suggestion = null;

function on_loaded() {
    var category = storage.value("S_SEARCH.category");

    __update_category_button(category);
}

function on_change_category() {
    var category = storage.value("S_SEARCH.category");

    __update_category_button(category);
    __focus_keyword_textfield();
    __clear_suggestions();

    if (current_keyword) {
        timeout(0.1, function() {
            __suggest_keyword(current_keyword);
        });
    }

    controller.action("hide", { group:"query.categories" });
    document.value("category.changed", true);
}

function on_change_keyword() {
    console.log("on_change_keyword");
    var keyword = controller.object("textfield.keyword").value();
    
    if (keyword.length > 0) {
        __suggest_keyword(keyword);
    } else {
        __clear_keyword();
    }
}

function search_keyword(form) {
    var keyword = form.keyword.trim();

    __save_search_keyword(keyword);
    
    controller.action("popup", {
    	"display-unit":"S_SEARCH",
    	"target":"self"                  
    });
}

function load_suggestion(keyword, location, length, sortkey, sortorder, handler) {
    if (current_suggestion) {
        handler(current_suggestion);
    
        return;
    }
    
    handler([]);
}

function select_suggestion(data) {
    var textfield = controller.object("textfield.keyword");
    
    textfield.action("property", { properties:"text=" + data["keyword"] });
    textfield.action("focus");
}

function __update_category_button(category) {
    var button = controller.object("btn.query.category");
    var image = "category_btn_" + category.toLowerCase() + ".png";
    
    button.action("property", { properties:"image=" + image })
}

function __focus_keyword_textfield() {
    var textfield = controller.object("textfield.keyword");
    
    textfield.action("focus");
}

function __clear_keyword_textfield() {
    var textfield = controller.object("textfield.keyword");
    
    textfield.action("clear");
}

function __suggest_keyword(keyword) {
    var suggestion = keyword_suggestions[keyword];
  
    if (!suggestion) {
        __fetch_suggestion_for_keyword(keyword, function(suggestion) {
            keyword_suggestions[keyword] = suggestion;
                                       
            __update_suggestion_for_keyword(keyword, suggestion);
        });
       
        return;
    }
    
    __update_suggestion_for_keyword(keyword, suggestion);
}

function __clear_keyword() {
    __hide_suggestion_section();
    
    current_keyword = null;
}

function __fetch_suggestion_for_keyword(keyword, handler) {
    var params = controller.object("home.category").data("display-unit");
    var url = params["suggest-query"].replace("${KEYWORD}", __encode_uri_value(keyword, params["suggest-query-encoder"]));
    
    fetch(url).then(function(response) {
        if (response.ok) {
            response.text().then(function(text) {
                if (params["suggest-data-pattern"]) {
                    var group = params["suggest-data-group"] ? parseInt(params["suggest-data-group"]) : 0;
                    var regex = new RegExp(params["suggest-data-pattern"]);
                    
                    text = regex.exec(text)[group];
                }

                var data  = __parse_data_with_text(text, params["suggest-data-type"]);
                var items = __get_data_with_path(data, params["suggest-data-path"]);
                var suggestion = [];
    
                for (var i = 0; i < items.length; i++) {
                    suggestion.push(__get_suggestion_item(items[i], params));
                }
    
                handler(suggestion);
            });
        }
    });
}

function __update_suggestion_for_keyword(keyword, suggestion) {
    var showcase = controller.object("showcase.suggestion");
    
    current_keyword = keyword;
    current_suggestion = suggestion;

    showcase.action("reload");
    
    __show_suggestion_section();
}

function __get_suggestion_item(data, params) {
    var item = { keyword:__get_data_with_path(data, params["suggest-keyword-path"]) };
    
    if (params["query-type"] === "location") {
        item["latitude"]  = __get_data_with_path(data, params["suggest-latitude-path"]);
        item["longitude"] = __get_data_with_path(data, params["suggest-longitude-path"]);

        return item;
    }

    if (params["query-type"] === "code") {
        item["code"] = __get_data_with_path(data, params["suggest-code-path"]);

        return item;
    }

    return item;
}

function __clear_suggestions() {
    for (var suggestion in keyword_suggestions) {
        delete keyword_suggestions[suggestion];
    } 

    keyword_suggestions = {};
}

function __show_suggestion_section() {
    var section = controller.object("suggestion");
    
    section.action("show");
}

function __hide_suggestion_section() {
    var section = controller.object("suggestion");
    
    section.action("hide");
}

function __save_search_keyword(keyword) {
    document.value("S_SEARCH.keyword", keyword);
    
    controller.action("remove", {
        "showcase":"query.history",
        "display-unit":keyword
    });
    
    controller.action("submit", { 
        "form":"search",
        "showcase":"query.history",
        "display-unit":keyword
    });
}

function __search_category() {
    var category = storage.value("S_SEARCH.category");
    
    if (category) {
        return category;
    }
    
    return "WEB";
}

function __parse_data_with_text(text, type) {
    if (type === "object") {
        return eval("(" + text + ")");
    }

    return JSON.parse(text);
}

function __get_data_with_path(data, path) {
    var subpaths = path ? path.split(',') : [];

    subpaths.forEach(function(subpath) {
        if (subpath[0] == '[') {
            var regex = /\[([0-9]+)\]/g;
            var matches = regex.exec(subpath);

            data = data[parseInt(matches[1])];

            return;
        }

        if (subpath[0] == '/') {
            var regex = /\/(.+)\//g;
            var matches = regex.exec(subpath);
        
            data = data.match(new RegExp(matches[1]))[0];

            return;
        }
        
        data = data[subpath];
    });
    
    return data;
}

function __encode_uri_value(value, encoder) {
    if (encoder === "unicode") {
        return encodeURIComponent(escape(value));
    }

    return value;
}
