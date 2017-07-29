function authorize(params, url, query, handler) {
	var client_id = params["client_id"];
	var client_secret = query["client_secret"];
	var redirect_uri = params["redirect_uri"];
	var code = query["code"];

	__query_access_token(client_id, client_secret, redirect_uri, code, function(access_token) {
		__query_user_info(access_token, function(user_info) {
			var credentials = {};

			credentials["external_id"]  = user_info["id"].toString();
			credentials["access_token"] = access_token;
			credentials["user_info"]    = user_info;

			handler(credentials);
		});
	});
}

function __query_access_token(client_id, client_secret, redirect_uri, code, handler) {
	var base_url = "https://kauth.kakao.com/oauth/token";
    var body = "";
    
    body += "client_id=" + client_id;
    body += "&";
    body += "client_secret=" + client_secret;
    body += "&";
    body += "redirect_uri=" + redirect_uri;
    body += "&";
    body += "code=" + code;
    body += "&";
	body += "grant_type=" + "authorization_code";
    
	fetch(base_url, { 
		method:"POST", 
		body:body
	}).then(function(response) {
    	if (response.ok) {
			response.json().then(function(data) {
                handler(data["access_token"]);
			});
		}
	});
}

function __query_user_info(access_token, handler) {
	var url = "https://kapi.kakao.com/v1/user/me";

	fetch(url, { 
		method:"GET", 
		headers:{
			"Authorization":"Bearer " + access_token,
            "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"
		} 
	}).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				handler(data);
			});
		}
	});
}
