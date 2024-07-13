var version = chrome.runtime.getManifest().version;
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var is_android = navigator.userAgent.toLowerCase().indexOf('android') > -1;

if (is_chrome) browser = "Chrome";
else if (is_firefox && is_android) browser = "Firefox for Android";
else if (is_firefox) browser = "Firefox";

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		
		localStorage.lastServer = message.server;
		
		if (message.task == "getBackgroundVariables"){
			sendResponse({
				version: version
			});
		} else {
			var xhr = new XMLHttpRequest();
			var url = "https://extensions.tote.hu/autoadventure/server.php";
			
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
			
			var params = "task=" + message.task;
			
			switch(message.task){
				case "registrate":
					params += "&name=" + message.name;
					params += "&email=" + message.email;
					params += "&browser=" + browser;
					params += "&version=" + version;
					break;
					
				case "login":
					params += "&email=" + message.email;
					params += "&password=" + message.password;
					params += "&server=" + message.server;
					params += "&profileId=" + message.profileId;
					params += "&profileName=" + message.profileName;
					params += "&race=" + message.race;
					params += "&level=" + message.level;
					params += "&position=" + message.position;
					params += "&browser=" + browser;
					params += "&version=" + version;
					break;
				
				case "checkIn":
					params += "&email=" + message.email;
					params += "&password=" + message.password;
					params += "&server=" + message.server;
					params += "&profileId=" + message.profileId;
					break;
				
				case "save":
					params += "&email=" + message.email;
					params += "&password=" + message.password;
					params += "&server=" + message.server;
					params += "&profileId=" + message.profileId;
					params += "&settings=" + message.settings;
					break;
			}

			if(message.task == "registrate" || message.task == "login"){
				xhr.onreadystatechange = function() {
					if(xhr.readyState == 4) {
						if (xhr.status == 200) {
							//console.log(xhr.responseText);
							var response;
							try{
								response = JSON.parse(xhr.responseText);
							
								sendResponse({
									loggedIn: response.loggedIn,
									message: response.message,
									license: response.license,
									profiles: response.profiles,
									settings: response.settings
								});	
							} catch(err){
								sendResponse({
									loggedIn: 'false',
									message: 'ERROR - Broken data received from server'
								});
							};
						} else sendResponse({
							loggedIn: 'false',
							message: 'Could not connect to server. Try again later'
						});
					}
				}
				
				xhr.timeout = 10000;
				
				xhr.ontimeout = function() {
					sendResponse({
						loggedIn: 'false',
						message: 'Could not connect to server. Try again later'
					});
				}
			}
				
			xhr.send(params);
			return true;
		}
	}
);