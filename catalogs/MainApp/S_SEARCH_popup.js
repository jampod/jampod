function on_loaded() {
    var category = __search_category();

    __update_search_panes(category);
    __update_category_button(category);
}

function on_change_category() {
    var category = __search_category();

    __update_search_panes(category);
    __update_category_button(category);
    
    controller.action("hide", { group:"search.categories" });
    document.value("category.changed", true);
}

function on_search_paging(data) {
    var category = __search_category();
    
    storage.value("S_SEARCH.panes." + category, data["id"]);

    controller.action("hide", { group:"search.categories" });
}

function search_keyword(form) {
    var keyword = form.keyword.trim();

    __save_search_keyword(keyword);

    __reload_search_panes();
    __reload_query_history();

    controller.action("hide", { group:"search.categories" });
}

function query_keyword() {
    controller.action("show", { "object":"cell.query"});
    controller.action("hide", { "group":"search.categories"});
    
    __focus_keyword_textfield();
}

function cancel_query() {
    controller.action("show", { "group":"search.categories"});
    controller.action("hide", { "object":"cell.query"});
    
    __unfocus_keyword_textfield();
}

function show_realtime_keywords() {
    controller.action("show", { "object":"cell.realtime.keywords"});
    controller.action("hide", { "group":"search.categories"});
}

function close_realtime_keywords() {
    controller.action("show", { "group":"search.categories"});
    controller.action("hide", { "object":"cell.realtime.keywords"});
}

function goto_url() {
    var panes = controller.object("panes.search");
    var web = controller.object("web." + panes.data("display-unit")["name"]);
    var url = web.value("url");

    if (url) {
        controller.action("link", { url:web.value("url"), target:"browser" });
        controller.action("hide", { group:"search.categories" });
    } else {
        controller.action("toast", { message:"잠시 뒤에 다시 시도하세요." });
    }
}

function __update_search_panes(category) {
    var panes = controller.object("panes.search");
    var pane = storage.value("S_SEARCH.panes." + category);
    
    panes.action("property", { properties:"name=search." + category.toLowerCase() });
    panes.action("reload");
    panes.action("pane", { pane:pane ? pane : "1" });
}

function __reload_search_panes() {
    var panes = controller.object("panes.search");
    
    panes.action("reload");
}

function __reload_query_history() {
    var showcase = controller.object("showcase.query.history");
    
    showcase.action("reload");
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

function __unfocus_keyword_textfield() {
    var textfield = controller.object("textfield.keyword");
    
    textfield.action("unfocus");
}

function __save_search_keyword(keyword) {
    document.value("S_SEARCH.keyword", keyword);
    
    controller.action("remove", {
        "showcase":"query.history",
        "display-unit":keyword
    });
    
    controller.action("submit", { 
        "form":"search." + keyword,
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

