function __fetch_realtime_keywords(source, handler) {
    if (source === "naver") {
        __fetch_naver_realtime_keywords(function(keywords) {
            handler(keywords);
        });

        return;
    }

    if (source === "daum") {
        __fetch_daum_realtime_keywords(function(keywords) {
            handler(keywords);
        });

        return;
    }
}

function __fetch_naver_realtime_keywords(handler) {
    var url = "https://m.naver.com";
    
    fetch(url).then(function(response) {
        if (response.ok) {
            response.text().then(function(text) {
                var regex = /oRTK[^\[]+(\[+[^\]]+\])/g;
                var kcans = JSON.parse(regex.exec(text)[1]);
                var fluctuations = { "sm":"unchanged", "up":"up", "dw":"down", "nw":"new" };
                var keywords = [];

                for (var index = 0; index < kcans.length; index++) {
                    var kcan = kcans[index];

                    keywords.push({
                        "source":"naver",
                        "ranking":(index + 1).toString(),
                        "keyword":kcan["k"],
                        "fluctuation":fluctuations[kcan["c"]],
                        "fluctuation-value":Math.abs(parseInt(kcan["n"])).toString()
                    });
                }

                handler(keywords);
            });
        }
    });
}
                                                                    
function __fetch_daum_realtime_keywords(handler) {
    var url = "http://m.daum.net";

    fetch(url).then(function(response) {
        if (response.ok) {
            response.text().then(function(text) {
                var pattern = "<span class=\"txt_issue\">([^<]+)</span>\s*" +
                              "<em[^>]+>\s*" +
                              "<span class=\"num_rank\">([^<]+)</span>\s*" +
                              "<span class=\"[^>]*ico_([^\"]+)[^<]+</span>";
                var regex = new RegExp(pattern, "g");
                var snippets = text.match(regex);
                var keywords = [];

                for (var index = 0; index < snippets.length; index++) {
                    var regex = new RegExp(pattern, "g");
                    var snippet = regex.exec(snippets[index]);

                    keywords.push({
                        "source":"daum",
                        "ranking":(index + 1).toString(),
                        "keyword":snippet[1],
                        "fluctuation":snippet[3],
                        "fluctuation-value":Math.abs(parseInt(snippet[2])).toString()
                    });
                }

                handler(keywords);
            });
        }
    });
}

