function select_keyword(data) {
    var textfield = controller.object("textfield.keyword");
    
    textfield.action("property", { properties:"text=" + data["keyword"].trim() });
    textfield.action("focus");
}
