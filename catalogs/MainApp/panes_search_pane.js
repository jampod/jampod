function on_loaded() {
    var keyword = document.value("S_SEARCH.keyword");
    
    if (keyword) {
        if ($data["query-type"] === "script") {
            eval($data["query"].replace("${KEYWORD}", keyword));
        } else {
            __query_keyword(keyword);
        }
    } else {
        __goto_home();
    }
}

function on_request(url) {
    if (__is_host_for_keyword(url["host"])) {
        var query = url["query"];

        if ($data["uses-fragment"] === "yes") {
            var fragment = url["fragment"];
            
            if (fragment) {
                query = fragment;
            }
        }

        if (query && $data["keyword-pattern"]) {
            query = query.replace(new RegExp($data["keyword-pattern"]), "$1");
        }
        
        var keyword = query ? __parse_keyword_from_query(query) : null;

        if (!keyword && $data["keyword-in-path"] === "yes") {
            var path = data["path"];

            if (path) {
                if ($data["keyword-pattern"]) {
                    path = path.replace(new RegExp($data["keyword-pattern"]), "$1");
                }
                
                keyword = path.substr(path.lastIndexOf('/') + 1);
            }
        }

        if (keyword) {
            if ($data["space-character"]) {
                keyword = keyword.replace($data["space-character"], " ");
            }
            
            __save_search_keyword(keyword);
            __reload_query_history();
        }
    }
}

function __goto_home() {
    var web = controller.object("web." + $data["name"]);

    web.action("property", { properties:"url=" + $data["home"] });
}

function __query_keyword(keyword) {
    var web = controller.object("web." + $data["name"]);
    var query = $data["query"];
    
    query = query.replace("${KEYWORD}", __encode_uri_value(keyword, $data["encoder"]));
    
    web.action("property", { properties:"url=" + query });
}

function __query_travel_myrealtrip(keyword) {
    var web = controller.object("web." + $data["name"]);
    var url = "https://www.myrealtrip.com/search/autocomplete?q=" + keyword;

    fetch(url).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var location = (data.length > 0) ? data[0] : null;

                if (location) {
                    var query = "https://www.myrealtrip.com/offers?"
                              + "country=" + location["country_key_name"].replace(" ", "%20") + "&" 
                              + "keyword=${KEYWORD}";

                    if (location["location_type"] !== "country") {
                        query += "&" + location["location_type"] + "=" + location["key_name"].replace(" ", "%20");
                    }
                    
                    query = query.replace("${KEYWORD}", __encode_uri_value(keyword, $data["encoder"]));

                    web.action("property", { properties:"url=" + query });
                } else {
                    timeout(0.1, function() {
                        web.action("property", { properties:"url=" + $data["home"] });
                    });

                    controller.action("toast", { message:"검색결과가 없습니다." });
                }
            });
        } else {
            timeout(0.1, function() {
                web.action("property", { properties:"url=" + $data["home"] });
            });

            controller.action("toast", { message:"검색에 실패했습니다." });
        }             
    });
}

function __query_land_daum(keyword) {
    var web = controller.object("web." + $data["name"]);
    var appkey = "0c7e628627f8bef95eecb8aee69ad56a";
    var url = "https://apihub.daum.net/local/v1/keyword.json?query=" + keyword + "&appkey=" + appkey;

    fetch(url).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var items = data["channel"]["item"];
                var location = (items.length > 0) ? items[0] : null;

                if (location) {
                    var query = "https://m.realestate.daum.net/#/?docid=" + location["id"] + "&keyword=${KEYWORD}";

                    query = query.replace("${KEYWORD}", __encode_uri_value(keyword, $data["encoder"]));

                    web.action("property", { properties:"url=" + query });
                } else {
                    timeout(0.1, function() {
                        web.action("property", { properties:"url=" + $data["home"] });
                    });

                    controller.action("toast", { message:"검색결과가 없습니다." });
                }
            });
        } else {
            timeout(0.1, function() {
                web.action("property", { properties:"url=" + $data["home"] });
            });

            controller.action("toast", { message:"검색에 실패했습니다." });
        }
    });
}

function __query_land_dabang(keyword) {
    var web = controller.object("web." + $data["name"]);
    var url = "http://www.dabangapp.com/api/2/loc/keyword?keyword=" + keyword;

    fetch(url).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var location = (data.length > 0) ? data[0] : null;

                if (location) {
                    if (location["id"]) {
                        var query = "http://www.dabangapp.com/mobile#/map?"
                                  + "id=" + "&" + "type=search" + "&"
                                  + "filters=%7B%22location%22%3A%5B%5B" + location["location"][0] + "%2C" + location["location"][1]
                                  + "%5D%2C%5B" + location["location"][0] + "%2C" + location["location"][1] + "%5D%5D%7D" + "&"
                                  + "position=%7B%22center%22%3A%5B" + location["location"][0] + "%2C" + location["location"][1]
                                  + "%5D%2C%22zoom%22%3A" + location["zoom"] + "%7D";
                                 
                        web.action("property", { properties:"url=" + query });

                        return;
                    }

                    if (location["code"]) {
                        var query = "http://www.dabangapp.com/mobile#/map?"
                                  + "id=" + location["code"] + "&"
                                  + "type=" + location["type"] + "&"
                                  + "filters=%7B%22location%22%3A%5B%5B" + location["location"][0] + "%2C" + location["location"][1]
                                  + "%5D%2C%5B" + location["location"][0] + "%2C" + location["location"][1] + "%5D%5D%7D" + "&" 
                                  + "position=%7B%22center%22%3A%5B" + location["location"][0] + "%2C" + location["location"][1]
                                  + "%5D%2C%22zoom%22%3A" + location["zoom"] + "%7D";
                                 
                        web.action("property", { properties:"url=" + query });

                        return; 
                    }
                } else {
                    timeout(0.1, function() {
                        web.action("property", { properties:"url=" + $data["home"] });
                    });

                    controller.action("toast", { message:"검색결과가 없습니다." });
                }
            });
        } else {
            timeout(0.1, function() {
                web.action("property", { properties:"url=" + $data["home"] });
            });

            controller.action("toast", { message:"검색에 실패했습니다." });
        }
    });
}

function __is_host_for_keyword(host) {
    var hosts = $data["keyword-host"].split(',');
    
    for (i = 0; i < hosts.length; i++) {
        if (hosts[i] === host) {
            return true;
        }
    }
    
    return false;
}

function __parse_keyword_from_query(query) {
    var alternate_url_variable = $data["alternate-url-variable"];

    if (alternate_url_variable) {
        var url = __get_query_variable(query, alternate_url_variable);

        if (url) {
            query = url.replace(/[^?]+\?(.+)/g, "$1");
        }
    }
    
    var variables = $data["keyword-variable"].split(',');
    
    for (var i = 0; i < variables.length; i++) {
        var keyword = __get_query_variable(query, variables[i]);
        
        if (keyword) {
            return keyword.trim();
        }
    }

    return null;
}

function __get_query_variable(query, variable) {
    var params = query.split('&');
    
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        
        if (param[0] === variable) {
            return __decode_uri_value(param[1], $data["encoder"]).trim();
        }
    }
    
    return null;
}

function __encode_uri_value(value, encoder) {
    if (encoder === "unicode") {
        return encodeURIComponent(escape(value));
    }

    if (encoder === "double") {
        return encodeURIComponent(encodeURIComponent(value));
    }
    
    if (encoder === "local") {
        return encode(value, $data["charset"]);
    }
    
    return encodeURIComponent(value);
}

function __decode_uri_value(value, encoder) {
    if (encoder === "unicode") {
        return unescape(decodeURIComponent(value.replace(/\+/g, "%20")));
    }
    
    if (encoder === "double") {
        return decodeURIComponent(decodeURIComponent(value.replace(/\+/g, "%20")));
    }

    if (encoder === "local") {
        return decode(value, $data["charset"]);
    }

    return decodeURIComponent(value.replace(/\+/g, "%20"));
}

function __save_search_keyword(keyword) {
    document.value("S_SEARCH.keyword", keyword);

    view.object("keyword").action("property", { properties:"value=" + keyword });
    
    controller.action("remove", {
        "showcase":"query.history",
        "display-unit":keyword
    });
    
    controller.action("submit", { 
        "form":"search." + $data["name"],
        "showcase":"query.history",
        "display-unit":keyword
    });     
}

function __reload_query_history() {
    var showcase = controller.object("showcase.query.history");
    
    showcase.action("reload");
}
