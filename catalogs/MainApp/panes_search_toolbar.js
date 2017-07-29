function on_loaded() {
    update_category();
}

function update_category() {
    var category = __search_category();
    
    __update_category_button(category);
}

function __update_category_button(category) {
    var button = controller.object("btn.category." + $data["name"]);
    var image = "category_btn_" + category.toLowerCase() + "_white.png";
    
    button.action("property", { properties:"image=" + image })
}

function __search_category() {
    var category = storage.value("S_SEARCH.category");
    
    if (category) {
        return category;
    }
    
    return "WEB";
}
