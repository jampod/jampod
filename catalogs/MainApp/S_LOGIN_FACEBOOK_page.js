function authorize(params, url, query, handler) {
	var client_id = params["app_id"];
	var client_secret = query["client_secret"];
	var redirect_uri = params["redirect_uri"];
	var code = query["code"];

	__query_access_token(client_id, client_secret, redirect_uri, code, function(access_token) {
		__query_user_info(access_token, function(user_info) {
			var credentials = {};

			credentials["external_id"]  = user_info["id"];
			credentials["access_token"] = access_token;
			credentials["user_info"]    = user_info;

			handler(credentials);
		});
	});
}

function __query_access_token(client_id, client_secret, redirect_uri, code, handler) {
	var base_url = "https://graph.facebook.com/oauth/access_token";
	var query = "";

	query += "client_id=" + client_id;
	query += "&";
	query += "client_secret=" + client_secret;
	query += "&";
	query += "redirect_uri=" + redirect_uri;
	query += "&";
	query += "code=" + code;

	fetch(base_url + "?" + query, null).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				handler(data["access_token"]);
			});
		}
	});
}

function __query_user_info(access_token, handler) {
	var base_url = "https://graph.facebook.com/me";
	var query = "";

	query += "fields=" + "id,name,email";
	query += "&";
	query += "access_token=" + access_token;

	fetch(base_url + "?" + query, null).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				handler(data);
			});
		}
	});
}
