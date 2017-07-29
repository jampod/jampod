var categories = [
    "WEB", "ISSUE", "IMAGE", "VIDEO", "KNOWLEDGE",
    "SHOPPING", "PRICE", "MAP", "DIC", "HASHTAG",
    "TRAVEL", "FOOD", "STAY", "MOVIE", "MUSIC",
    "BOOK", "GAME", "LAND", "STOCK", "APP"
];

for (var i = 0; i < categories.length; ++i) {
    eval(
        "var select_" + categories[i].toLowerCase() + " = function() {" +
            "__select_category(\"" + categories[i] + "\");" +
        "};"
    );
}

function __select_category(category) {
    storage.value("S_SEARCH.category", category);

    owner.action("script", { script:"on_change_category" });
}
