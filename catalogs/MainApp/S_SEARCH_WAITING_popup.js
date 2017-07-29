function on_loaded() {
    var keyword = document.value("S_SEARCH.keyword");
    
    __update_keyword(keyword);

    timeout(1.0, function() {
        controller.action("popup", { "display-unit":"S_SEARCH" });
    });
}

function __update_keyword(keyword) {
	var label = view.object("label.keyword");
    
    label.action("property", { "properties":"text=" + keyword });
}
