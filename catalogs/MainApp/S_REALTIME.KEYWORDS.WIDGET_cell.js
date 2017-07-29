function search_keyword(form) {
    var keyword = form.keyword.trim();

    storage.value("S_SEARCH.category", "WEB");
    storage.value("S_SEARCH.panes.WEB", "P_SEARCH.WEB_" + $data["source"].toUpperCase());
    
    __save_search_keyword(keyword);

    controller.action("popup", { "display-unit":"S_SEARCH_WAITING" });
    owner.action("script", { script:"on_change_category" });
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
