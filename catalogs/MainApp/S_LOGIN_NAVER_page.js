function authorize(params, url, query, handler) {
	var client_id = params["client_id"];
	var client_secret = query["client_secret"];
	var state = params["state"];
	var code = query["code"];

	__query_access_token(client_id, client_secret, state, code, function(access_token) {
		__query_user_info(access_token, function(user_info) {
			var credentials = {};

			credentials["external_id"]  = user_info["id"];
			credentials["access_token"] = access_token;
			credentials["user_info"]    = user_info;

			handler(credentials);
		});
	});
}

function __query_access_token(client_id, client_secret, state, code, handler) {
	var base_url = "https://nid.naver.com/oauth2.0/token";
	var query = "";

	query += "client_id=" + client_id;
	query += "&";
	query += "client_secret=" + client_secret;
	query += "&";
	query += "state=" + state;
	query += "&";
	query += "code=" + code;
	query += "&";
	query += "grant_type=" + "authorization_code";

	fetch(base_url + "?" + query, null).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				handler(data["access_token"]);
			});
		}
	});
}

function __query_user_info(access_token, handler) {
	var url = "https://apis.naver.com/nidlogin/nid/getUserProfile.xml";

	fetch(url, { 
		method:"GET", 
		headers:{
			"Authorization":"Bearer " + access_token
		} 
	}).then(function(response) {
		if (response.ok) {
			response.xml().then(function(data) {
				var root_dict = data["data"];
				var res_dict = root_dict["response"][0];
				var user_info = {};

				for (var key in res_dict) {
					if (key !== "__attrs__") {
						if (res_dict[key][0]["__text__"]) {
							user_info[key] = res_dict[key][0]["__text__"];
						}
					}
				}

				handler(user_info);
			});
		}
	});
}
