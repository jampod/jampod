function feed_keywords(keyword, location, length, sortkey, sortorder, handler) {
    var keywords = document.value("S_REALTIME.keywords")[$data["vendor"]];
    
    if (!keywords) {
        keywords = [];
    }
    
    handler(keywords);
}

function search_keyword(data) {
    var keyword = data.keyword.trim();

    storage.value("S_SEARCH.category", "WEB");
    storage.value("S_SEARCH.panes.WEB", "P_SEARCH.WEB_" + data["source"].toUpperCase());
    
    __save_search_keyword(keyword);
    
    controller.action("popup", { "display-unit":"S_SEARCH" });
    document.value("category.changed", true);
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
