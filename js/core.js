//https://github.com/cure53/DOMPurify/blob/master/dist/purify.min.js

var temp, title, report, reqAp, grottoCount, grottoDifficulty, led, mode, race, huntLocation, started, profileChecked, activeOrder, adventure, critical, minPrice = 0, slowLikeHuman, graveyardMain, workTimeAp, workTimeHp, lastEvolveArray, gold, redStone, blueStone, sword, levelStart, levelEnd = 0, change, currentPlace, targetPlace, goldId, evolveInProgress, s = 300000, hasClan = 0;
var adventure = [], lvl = [], evolveArray = [], itemNames = [], hp = [], ap = [], level = [], options = [], activeOrder = [], asp = [], aspectInputArray = [], whitelistPlayers = [], blacklistPlayers = [],  blacklistId = 0;
var stayAlive, pauseAt, resumeAt, startHealing, stopHealing, church, huntCount;

var highPriorityDecisions = [
	[35,300,300,0,0,0,0,200,100], //tovább
	[44,200,-200,0,0,0,0,0,0], //fel a hegyekbe
	[34,-200,200,0,0,0,0,0,0], //be az erdőbe
	[21,-100,-100,0,0,0,0,-200,0], //elfogad
	[42,-200,-200,0,0,0,0,-200,0], //szerencse a szerencsétlenségben
	[36,-300,-300,0,0,0,0,-200,-100], //kaland befejezése
	[99,-300,-300,0,0,0,0,-200,-100] //kaland félbeszakítása
];

var aspects = [[1,2,6,2,0,0,-10,0,0],[3,0,-5,0,0,1,3,1,0],[4,3,1,0,0,-5,0,0,1],[5,-10,0,0,2,6,2,0,0],[6,1,0,0,-5,0,0,1,3],[7,-5,0,0,1,3,1,0,0],[8,1,3,1,0,0,-5,0,0],[9,0,0,-5,0,0,1,3,1],[10,3,1,0,0,-5,0,0,1],[11,-10,0,0,2,6,2,0,0],[12,-5,0,0,1,3,1,0,0],[20,0,2,6,2,0,0,-10,0],[21,0,0,1,3,1,0,0,-5],[22,1,3,1,0,0,-5,0,0],[23,0,2,6,2,0,0,-10,0],[24,0,0,1,3,1,0,0,-5],[25,-5,-5,0,1,4,4,1,0],[26,0,0,-10,0,0,2,6,2],[27,0,2,6,2,0,0,-10,0],[28,4,1,0,-5,-5,0,1,4],[29,-5,0,1,4,4,1,0,-5],[30,1,3,1,0,0,-5,0,0],[31,2,0,0,-10,0,0,2,6],[32,6,2,0,0,-10,0,0,2],[37,0,2,6,2,0,0,-10,0],[38,1,0,0,-5,0,0,1,3],[39,2,6,2,0,0,-10,0,0],[43,6,2,0,0,-10,0,0,2],[46,0,2,6,2,0,0,-10,0],[53,2,6,2,0,0,-10,0,0]];

chrome.runtime.sendMessage({task: "getBackgroundVariables"}, function (response) {
		version = response.version
	}
);

document.addEventListener("DOMContentLoaded", function(){
	if (document.getElementById('infobar')){
		runFunctionOnPage("/profile", checkProfile);
		injectHTML(chrome.extension.getURL('/html/frame.html'));
		var loop = setInterval(function(){
			if (document.getElementById('bfaa_container') && profileChecked == 1) {
				clearInterval(loop);
				
				if(localStorage.getItem("email_" + profileId) && localStorage.getItem("pass_" + profileId)) login(localStorage.getItem("email_" + profileId), localStorage.getItem("pass_" + profileId));
				else selectForm('loginForm');
				
				document.getElementById("link_login").addEventListener("click", function(){selectForm('loginForm')});
				document.getElementById("link_registrate").addEventListener("click", function(){selectForm('registrationForm')});
				document.getElementById("link_logout").addEventListener("click", logout);
				document.getElementById("btn_logout").addEventListener("click", logout);
				document.getElementById("btn_login").addEventListener("click", login);
				document.getElementById("btn_registrate").addEventListener("click", registrate);
			}
		}, 0);
	}
});

function injectHTML(file){
	var node = document.getElementById('infobar');
	var id = 'BiteFight_Auto_Adventure';
	
	if (node){
		var html = document.createElement('div');
		html.id = id;
		node.parentNode.insertBefore(html, node.nextSibling);
		
		var xhr = getXMLHttp();
		xhr.open('GET', file, true);

		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status < 400) document.querySelector("#"+id).innerHTML = DOMPurify.sanitize(xhr.responseText);
		};

		xhr.send();
		return true;
	} else return false;
}

function selectForm(id){
	var forms = document.getElementById('BiteFight_Auto_Adventure').getElementsByClassName('form');
	for (i=0; i<forms.length; i++) forms[i].style.display = 'none';
	if (id) document.getElementById(id).style.display = 'block';
}

function checkIn(){
	chrome.runtime.sendMessage({
		task: "checkIn",
		email: localStorage.getItem("email_" + profileId),
		password: localStorage.getItem("pass_" + profileId),
		server: server,
		profileId: profileId
	}, function(response) {
		//no response
	});
}

function save(){
	//Stroy
	settings = '{';
	
	settings += '"preset":'+ JSON.stringify(preset);
	settings += ',"decisions":"'+ JSON.stringify(decisions) +'"';
	settings += ',"whitelistDecisions":'+ JSON.stringify(whitelistDecisions);
	settings += ',"blacklistDecisions":'+ JSON.stringify(blacklistDecisions);
	settings += ',"aspectInputArray":'+ JSON.stringify(aspectInputArray);
	settings += ',"stayAlive":'+ JSON.stringify(stayAlive);
	settings += ',"church":'+ JSON.stringify(church);
	settings += ',"pauseAt":'+ JSON.stringify(pauseAt);
	settings += ',"resumeAt":'+ JSON.stringify(resumeAt);
	settings += ',"startHealing":'+ JSON.stringify(startHealing);
	settings += ',"stopHealing":'+ JSON.stringify(stopHealing);
	
	//Man Hunt
	settings += ',"huntLocation":'+ JSON.stringify(huntLocation);
	settings += ',"huntCount":'+ JSON.stringify(huntCount);
	
	//Grotto
	settings += ',"grottoDifficulty":'+ JSON.stringify(grottoDifficulty);
	settings += ',"grottoCount":'+ JSON.stringify(grottoCount);
	
	//HoP
	settings += ',"hopMinHp":'+ JSON.stringify(hopMinHp);
	
	//PvP
	settings += ',"pvpMode":'+ JSON.stringify(pvpMode);
	settings += ',"pvpMinHp":'+ JSON.stringify(pvpMinHp);
	settings += ',"whitelistPlayers":'+ JSON.stringify(whitelistPlayers);
	settings += ',"blacklistPlayers":'+ JSON.stringify(blacklistPlayers);
	
	//Global
	settings += ',"goldId":'+ JSON.stringify(goldId);
	settings += ',"evolveArray":'+ JSON.stringify(evolveArray);
	settings += ',"goldClan":'+ JSON.stringify(goldClan);
	settings += ',"graveyardMain":'+ JSON.stringify(graveyardMain);
	settings += ',"workTimeAp":'+ JSON.stringify(workTimeAp);
	settings += ',"workTimeHp":'+ JSON.stringify(workTimeHp);
	settings += ',"graveyardAp":'+ JSON.stringify(graveyardAp);
	settings += ',"graveyardHp":'+ JSON.stringify(graveyardHp);
	settings += ',"slowLikeHuman":'+ JSON.stringify(slowLikeHuman);
	settings += ',"tooltips":'+ JSON.stringify(tooltips);
	
	settings += '}';
	
	if(session()) localStorage.setItem("settings_" + profileId, settings);
	else {
		chrome.runtime.sendMessage({
			task: "save",
			email: localStorage.getItem("email_" + profileId),
			password: localStorage.getItem("pass_" + profileId),
			server: server,
			profileId: profileId,
			settings: settings
		}, function(response) {
			//no response
		});
	}
}

function main(settings){
	localStorage.removeItem("settings_" + profileId);
	
	if(checkExp()){
		setInterval(checkIn, s);
		
		try {
			openTab(Number(sessionStorage.currentTab));
		} catch {
			openTab(0);
		}
		
		//Story
		if (settings.preset) preset = settings.preset; else preset = 'health';
		
		try {
			var k;
			decisions = JSON.parse(settings.decisions);
			
			if (decisions[0].length != highPriorityDecisions[0].length) decisions = highPriorityDecisions;
			else {
				for (i=0; i < highPriorityDecisions.length; i++){
					k=0;
					
					for (j=0; j < decisions.length; j++){
						if(highPriorityDecisions[i][0] == decisions[j][0]){
							k++;
							decisions[j] = highPriorityDecisions[i];
						}
					}
					
					if (k==0) decisions.push(highPriorityDecisions[i]);
				}
			}
		} catch {
			decisions = highPriorityDecisions;
		}
		
		if (settings.whitelistDecisions) whitelistDecisions = settings.whitelistDecisions; else whitelistDecisions = [];
		if (settings.blacklistDecisions) blacklistDecisions = settings.blacklistDecisions; else blacklistDecisions = [];
		if (settings.aspectInputArray) aspectInputArray = settings.aspectInputArray; else aspectInputArray = [0,0,0,0,0,0,0,0];
		if (settings.stayAlive) stayAlive = settings.stayAlive; else stayAlive = "1";
		if (settings.church) church = settings.church; else church = "1";
		if (settings.pauseAt) pauseAt = settings.pauseAt; else pauseAt = "15";
		if (settings.resumeAt) resumeAt = settings.resumeAt; else resumeAt = "25";
		if (settings.startHealing) startHealing = settings.startHealing; else startHealing = "-1";
		if (settings.stopHealing) stopHealing = settings.stopHealing; else stopHealing = "80";
		
		//Man Hunt
		if (settings.huntLocation) huntLocation = settings.huntLocation; else huntLocation = "1";
		if (settings.huntCount) huntCount = settings.huntCount; else huntCount = "1";
		
		//Grotto
		if (settings.grottoDifficulty) grottoDifficulty = settings.grottoDifficulty; else grottoDifficulty = "Easy";
		if (settings.grottoCount) grottoCount = settings.grottoCount; else grottoCount = "1";
		
		//HoP
		if (settings.hopMinHp) hopMinHp = settings.hopMinHp; else hopMinHp = "25";
		
		//PvP
		if (settings.pvpMode) pvpMode = settings.pvpMode; else pvpMode = "1";
		if (settings.pvpMinHp) pvpMinHp = settings.pvpMinHp; else pvpMinHp = "25";
		if (settings.whitelistPlayers) whitelistPlayers = settings.whitelistPlayers; else whitelistPlayers = [];
		if (settings.blacklistPlayers) blacklistPlayers = settings.blacklistPlayers; else blacklistPlayers = [];
		
		//Global
		if (settings.goldId) goldId = settings.goldId; else goldId = "0";
		if (settings.evolveArray) evolveArray = settings.evolveArray; else evolveArray = [];
		if (settings.goldClan) goldClan = settings.goldClan; else goldClan = "10";
		if (settings.graveyardMain) graveyardMain = settings.graveyardMain; else graveyardMain = "0";
		if (settings.workTimeAp) workTimeAp = settings.workTimeAp; else workTimeAp = "8";
		if (settings.workTimeHp) workTimeHp = settings.workTimeHp; else workTimeHp = "1";
		if (settings.graveyardAp) graveyardAp = settings.graveyardAp; else graveyardAp = "3";
		if (settings.graveyardHp) graveyardHp = settings.graveyardHp; else graveyardHp = "15";
		if (settings.slowLikeHuman) slowLikeHuman = settings.slowLikeHuman; else slowLikeHuman = "0";
		if (settings.tooltips) tooltips = settings.tooltips; else tooltips = "1";
		
		window.onunload = function () {
			save();
		}
		
		bfaa_header = document.getElementById('bfaa_header');
		bfaa_container = document.getElementById('bfaa_container');
		btnStatus = document.getElementById('status');
		btnClearLog = document.getElementById('btn_log');
		presetSwitch = document.getElementById('presetSwitch');
		goldSwitch = document.getElementById('goldSwitch');
		workTimeApSwitch = document.getElementById('workTimeAp');
		workTimeHpSwitch = document.getElementById('workTimeHp');
		huntLocationSwitch = document.getElementById('huntLocationSwitch');
		pvpModeSwitch = document.getElementById('pvpModeSwitch');
		grottoSwitch = document.getElementById('grottoSwitch');
		stayAliveSwitch = document.getElementById('stayAlive');	
		selfHealing = document.getElementById('selfHealing');
		graveyardMainSwitch = document.getElementById('graveyardMainSwitch');
		evolveDorm = document.getElementById('evolveForm');
		stayAliveForm = document.getElementById('stayAliveForm');
		huntCountInput = document.getElementById('huntCount');
		demonHuntCountInput = document.getElementById('demonHuntCount');
		hopMinHpInput = document.getElementById('hopMinHp');
		pvpMinHpInput = document.getElementById('pvpMinHp');
		goldClanInput = document.getElementById('goldClan');
		graveyardHpInput = document.getElementById('graveyardHp');
		graveyardApInput = document.getElementById('graveyardAp');
		pauseAtInput = document.getElementById('pauseAt');
		resumeAtInput = document.getElementById('resumeAt');
		startHealingInput = document.getElementById('startHealing');
		stopHealingInput = document.getElementById('stopHealing');
		churchInput = document.getElementById('churchInput');
		
		whitelistDecisionsDisplay = document.getElementById('whitelistDecisions');
		blacklistDecisionsDisplay = document.getElementById('blacklistDecisions');
		
		whitelistDisplay = document.getElementById('whitelist');
		blacklistDisplay = document.getElementById('blacklist');
		tooltipSwitch = document.getElementById('aa_tooltips');
		humanSwitch = document.getElementById('slowLikeHuman');
		logArea = document.getElementById('log_area');

		btnStory = document.getElementById('btn_story');
		btnManHunt = document.getElementById('btn_manHunt');
		btnDemonHunt = document.getElementById('btn_demonHunt');
		btnHop = document.getElementById('btn_hop');
		btnPvp = document.getElementById('btn_pvp');

		tabStory = document.getElementById('tab_story');
		tabManHunt = document.getElementById('tab_man_hunt');
		tabDemonHunt = document.getElementById('tab_grotto');
		tabHop = document.getElementById('tab_hop');
		tabPvp = document.getElementById('tab_pvp');

		aspectInput = document.getElementsByClassName('aspectInput');
		evolveSwitch = document.getElementsByClassName('evolveSwitch');
		updateInput = document.getElementsByClassName('updateInput');
		updateClick = document.getElementsByClassName('updateClick');
		tabs = document.getElementsByClassName('tablinks');
		modes = document.getElementsByClassName('mode');
		
		blacklistDisplay.value = blacklistPlayers;
		whitelistDisplay.value = whitelistPlayers;
		
		blacklistDecisionsDisplay.value = blacklistDecisions;
		whitelistDecisionsDisplay.value = whitelistDecisions;


		if(!sessionStorage.counter) sessionStorage.counter = 0;
		if(!localStorage.mode) localStorage.mode = 0;
		
		if(!sessionStorage.getItem("log_" + profileId)) sessionStorage.setItem("log_" + profileId, "");

		if (localStorage.bfaaVisible != 0) bfaa_container.style.display = 'block';
		else bfaa_container.style.display = 'none';

		if(evolveArray){
			for(i=0; i < evolveSwitch.length; i++){
				if(evolveArray[i] == 1) evolveSwitch[i].checked = true;
			}
		}

		if(aspectInputArray){
			for(i=0; i < aspectInput.length; i++){
				aspectInput[i].value = aspectInputArray[i];
			}
		}

		try {document.getElementById('presetSwitch').querySelector('option[value=' + preset +']').selected=true} catch (err) {};
		try {document.getElementById('goldSwitch').querySelector('option[value="' + goldId +'"]').selected=true} catch (err) {};
		if(grottoDifficulty) document.querySelector('option[value=' + grottoDifficulty +']').selected=true;
		if(workTimeAp) workTimeApSwitch.querySelector('option[value="' + workTimeAp +'"]').selected=true;
		if(workTimeHp) workTimeHpSwitch.querySelector('option[value="' + workTimeHp +'"]').selected=true;
		if(huntLocation) document.getElementById('huntLocationSwitch').querySelector('option[value="' + huntLocation +'"]').selected=true;
		if(pvpMode) document.getElementById('pvpModeSwitch').querySelector('option[value="' + pvpMode +'"]').selected=true;
		if(tooltips != 0) tooltipSwitch.checked = true;
		if(slowLikeHuman == 1) humanSwitch.checked = true;
		if(graveyardMain == 1) graveyardMainSwitch.checked = true;
		if(stayAlive == 1) stayAliveSwitch.checked = true;
		if(huntCount) huntCountInput.value = huntCount;
		if(grottoCount) demonHuntCountInput.value = grottoCount;
		if(goldClan) goldClanInput.value = goldClan;
		if(hopMinHp) hopMinHpInput.value = hopMinHp;
		if(pvpMinHp) pvpMinHpInput.value = pvpMinHp;
		if(graveyardAp) graveyardApInput.value = graveyardAp;
		if(graveyardHp) graveyardHpInput.value = graveyardHp;
		if(pauseAt) pauseAtInput.value = pauseAt;
		if(resumeAt) resumeAtInput.value = resumeAt;
		if(startHealing) startHealingInput.value = startHealing;
		if(stopHealing) stopHealingInput.value = stopHealing;
		if(church) churchInput.value = church;
		
		tooltipSwitch.addEventListener("click", tooltip);
		bfaa_header.addEventListener("click", toggle);
		btnClearLog.addEventListener("click", function(){log('clear')});
		presetSwitch.addEventListener("input", function(){preset = presetSwitch.options[presetSwitch.selectedIndex].value});
		goldSwitch.addEventListener("input", function(){
			goldId = goldSwitch.options[goldSwitch.selectedIndex].value;
			setGoldForm();
		});
		workTimeApSwitch.addEventListener("input", function(){workTimeAp = workTimeApSwitch.options[workTimeApSwitch.selectedIndex].value});
		workTimeHpSwitch.addEventListener("input", function(){workTimeHp = workTimeHpSwitch.options[workTimeHpSwitch.selectedIndex].value});
		huntLocationSwitch.addEventListener("input", setHuntLocation);
		pvpModeSwitch.addEventListener("input", setPvpMode);
		grottoSwitch.addEventListener("input", function(){grottoDifficulty = grottoSwitch.options[grottoSwitch.selectedIndex].value;});
		
		setPvpMode();
		setHuntLocation();
		setWorkTimeText();
		setGoldForm();
		
		whitelistDisplay.addEventListener("input", function(){whitelistPlayers = whitelistDisplay.value.replace(/[^\x20-\x7E]|\s+/g, '').split(',')});
		blacklistDisplay.addEventListener("input", function(){blacklistPlayers = blacklistDisplay.value.replace(/[^\x20-\x7E]|\s+/g, '').split(',')});
		
		whitelistDecisionsDisplay.addEventListener("input", function(){whitelistDecisions = whitelistDecisionsDisplay.value.replace(/[^0-9,]/g, '').split(',')});
		blacklistDecisionsDisplay.addEventListener("input", function(){blacklistDecisions = blacklistDecisionsDisplay.value.replace(/[^0-9,]/g, '').split(',')});
		
		for(i=0; i < updateClick.length; i++) updateClick[i].addEventListener("click", updateSettings);
		for(i=0; i < updateInput.length; i++) updateInput[i].addEventListener("input", updateSettings);
		for(i=0; i < aspectInput.length; i++) aspectInput[i].addEventListener("input", function(){updateAspectInput(this)});
		for(let i=0; i < tabs.length; i++) tabs[i].addEventListener("click", function(){openTab(i)})
		for(let i=0; i < modes.length; i++) modes[i].addEventListener("click", function(){switchMode(i+1)})
		
		document.getElementById('aboutVersion').textContent = 'Version: ' + version;
		document.getElementById('aboutEmail').textContent = 'Email address: ' + localStorage.getItem("email_" + profileId);
		document.getElementById('aboutExpDate').textContent = 'Expiry date: ' + led.toLocaleString('en-GB');
		document.getElementById('aboutProfiles').innerHTML = DOMPurify.sanitize(localStorage.profiles);

		switchMode(Number(localStorage.mode));
		updateSettings();
		updateAspectInput();
		tooltip();
		log();
		
		setInterval(function(){dhm(Number(led)-Number(Date.now()))}, 60*1000);
		dhm(Number(led)-Number(Date.now()));
				
		setInterval(function(){
			if (mode == '0') runFunctionOnPage("/city/adventure/", startAdventure);
		}, 10*1000);
		
		if(!localStorage.grottoEasy || !localStorage.grottoMedium || !localStorage.grottoDifficult) runFunctionOnPage("/city/grotte/", getGrottoDifficultyNames);
	} else selectForm('activationForm');
}

function dhm(ms){
	var days = Math.floor(ms / (24*60*60*1000));
	
	if(days < 5){
		var daysms=ms % (24*60*60*1000);
		var hours = Math.floor((daysms)/(60*60*1000));
		var hoursms=ms % (60*60*1000);
		var minutes = Math.floor((hoursms)/(60*1000));
		
		var str = " - Your license will expire in ";
		
		if (days > 1) str += days + " days ";
		else if (days == 1) str += days + " day ";
		
		if (hours > 1) str += hours + " hours ";
		else if (hours == 1) str += hours + " hour ";
		
		if (days < 1){
			if (minutes > 1) str += minutes + " minutes";
			else if (minutes >= 0) str += minutes + " minute";
			else str = "- Your license has expired";
		}
		
		document.getElementById('license').textContent = str;
	}
}

function openTab(t) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
	sessionStorage.currentTab = t;
    document.getElementById("tab_" + t).style.display = "block";
	tablinks[t].className += " active";
}

function switchMode(x){
	if(mode == x) mode = 0;
	else mode = x;
	sessionStorage.counter = 0;
	localStorage.mode = mode;
	
	btnStory.value = "Start Story";
	btnManHunt.value = "Start Man Hunt";
	btnDemonHunt.value = "Start Grotto";
	btnHop.value = "Start HoP";
	btnPvp.value = "Start PvP";
	
	tabStory.classList.remove("running");
	tabManHunt.classList.remove("running");
	tabDemonHunt.classList.remove("running");
	tabHop.classList.remove("running");
	tabPvp.classList.remove("running");
	
	bfaaConsole("PAUSED");
	
	switch(mode) {
		case 0:
			break;
		case 1:
			btnStory.value = "Pause Story";
			tabStory.className += " running";
			runFunctionOnPage("/city/adventure/", startAdventure);
			break;
		case 2:
			btnManHunt.value = "Stop Man Hunt";
			tabManHunt.className += " running";
			runFunctionOnPage("/city/adventure/cancelquest/", startAdventure);
			break;
		case 3:
			btnDemonHunt.value = "Stop Grotto";
			tabDemonHunt.className += " running";
			runFunctionOnPage("/city/adventure/cancelquest/", startAdventure);
			break;
		case 4:
			btnHop.value = "Stop HoP";
			tabHop.className += " running";
			runFunctionOnPage("/city/adventure/cancelquest/", startAdventure);
			break;
		case 5:
			btnPvp.value = "Stop PvP";
			tabPvp.className += " running";
			runFunctionOnPage("/city/adventure/cancelquest/", startAdventure);
			break;
	}
}

function tooltip(){
	var tooltipTexts = document.getElementsByClassName('aa_tooltiptext');
	if(tooltipSwitch.checked == true) for(i=0; i<tooltipTexts.length; i++) tooltipTexts[i].style.display = "block";
	else for(i=0; i<tooltipTexts.length; i++) tooltipTexts[i].style.display = "none";
}

function updateAspectInput(elem){	
	for(i=0; i<aspectInput.length; i++) aspectInputArray[i] = Number(aspectInput[i].value);
	
	var sumAspect = aspectInputArray.reduce(add, 0);
	
	if (sumAspect > 8000) {
		elem.value = Number(elem.value) + 8000 - sumAspect;
		updateAspectInput(elem);
	} else {
		for(i=0; i<aspectInput.length; i++){
			if((sumAspect == 8000 && aspectInputArray[i] == 0) || aspectInputArray[oppositeOf(i)] > 0) aspectInput[i].disabled = true;
			else aspectInput[i].disabled = false;
			
			if(aspectInput[i].value == '' || aspectInput[i].value < 0) aspectInputArray[i] = 0;
			else aspectInputArray[i] = Number(aspectInput[i].value);
		}
	}
	
}	

function oppositeOf(x){
	if (x < 4) return x + 4;
	else return x - 4;
}

function add(a, b) {
    return a + b;
}

function toggle(){
	if (localStorage.bfaaVisible != 0) {
		bfaa_container.style.display = 'none';
		localStorage.bfaaVisible = 0;
	} else {
		bfaa_container.style.display = 'block';
		localStorage.bfaaVisible = 1;
	}
}

function updateSettings(){
	for(i=0; i<evolveSwitch.length; i++){
		if(evolveSwitch[i].checked == true) evolveArray[i] = 1;
		else evolveArray[i] = 0;
	}
	
	if(graveyardMainSwitch.checked == true) graveyardMain = "1";
	else graveyardMain = "0";
	
	if(tooltipSwitch.checked == true) tooltips = "1";
	else tooltips = "0";
	
	if(humanSwitch.checked == true) slowLikeHuman = "1";
	else slowLikeHuman = "0";
	
	if(stayAliveSwitch.checked == true) stayAlive = "1";
	else stayAlive = "0";
	
	if (huntCountInput.value != "") huntCount = huntCountInput.value;
	
	if (demonHuntCountInput.value != "") grottoCount = demonHuntCountInput.value;
	
	if (goldClanInput.value != "" && !isNaN(Number(goldClanInput.value)) && Number(goldClanInput.value) > 0) goldClan = goldClanInput.value;
	if (hopMinHpInput.value != "" && !isNaN(Number(hopMinHpInput.value))) hopMinHp = hopMinHpInput.value;
	if (pvpMinHpInput.value != "" && !isNaN(Number(pvpMinHpInput.value))) pvpMinHp = pvpMinHpInput.value;
	if (graveyardApInput.value != "" && !isNaN(Number(graveyardApInput.value))) graveyardAp = graveyardApInput.value;
	if (graveyardHpInput.value != "" && !isNaN(Number(graveyardHpInput.value))) graveyardHp = graveyardHpInput.value;
	if (pauseAtInput.value != "" && !isNaN(Number(pauseAtInput.value))) pauseAt = pauseAtInput.value;
	if (resumeAtInput.value != "" && !isNaN(Number(resumeAtInput.value))) resumeAt = resumeAtInput.value;
	if (startHealingInput.value != "" && !isNaN(Number(startHealingInput.value))) startHealing = startHealingInput.value;
	if (stopHealingInput.value != "" && !isNaN(Number(stopHealingInput.value))) stopHealing = stopHealingInput.value;
	if (churchInput.value != "" && !isNaN(Number(churchInput.value))) church = churchInput.value;
	
	if (preset == 'aspects') document.getElementById("aspectsForm").style.display = "block";
	else document.getElementById("aspectsForm").style.display = "none";
}

function updateItems(doc){
	change = [0,0,0,0];
	var items = doc.getElementsByClassName('gold')[0]
	if (items){
		var itemIMG = items.getElementsByTagName('img');
		items = DOMPurify.sanitize(items.innerHTML);
		
		items = items.split('&nbsp;&nbsp;');
		
		for(i=0; i<items.length; i++){
			itemNames[i] = itemIMG[i].alt;
			if(i<5) items[i] = items[i].substring(0, items[i].lastIndexOf("&nbsp;"));
			else items[i] = items[i].substr(items[i].lastIndexOf("&nbsp;")+6);
			if((i == 3) || (i == 4)) {
				items[i] = items[i].split('/');
				items[i][0] = items[i][0].substring(0, items[i][0].lastIndexOf("&nbsp;"));
				items[i][1] = items[i][1].substr(items[i][1].lastIndexOf("&nbsp;")+6);
				items[i][0] = Number(items[i][0].replace(/\./g, ""));
				items[i][1] = Number(items[i][1].replace(/\./g, ""));
			} else items[i] = Number(items[i].replace(/\./g, ""));
		}
		
		var temp = items[4][0] - hp[0];
		if (hp[0] && temp > hp[1]*0.01) {
			change[0] = 1;
			change[2] = temp;
		} else if (hp[0] && temp < 0) {
			change[0] = -1;
			change[2] = temp;
		}
		
		temp = items[0] - gold;
		if (gold && temp > 0) {
			change[1] = 1;
			change[3] = temp;
		}
		
		gold = items[0];
		redStone = items[1];
		blueStone = items[2];
		ap[0] = items[3][0];
		ap[1] = items[3][1];
		hp[0] = items[4][0];
		hp[1] = items[4][1];
		level = items[5];
		
		if (lvl[1] == 'undefined') lvl[1] = items[5];
		hp[2] = ((hp[0]/hp[1])*100).toFixed(0);
		sword = items[6];
		
		if(!sessionStorage.goldName) sessionStorage.goldName = itemNames[0];
		
		var content = '<span id="items">' + gold.toLocaleString();
		if (minPrice > 0 && mode > 0) content += ' (' + ((gold/minPrice)*100).toFixed(0) +'%)';
		content += '&nbsp;<img src="/img/symbols/res2.gif" align="absmiddle">&nbsp;&nbsp;&nbsp;' +
			redStone.toLocaleString() + '&nbsp;<img src="/img/symbols/res3.gif" align="absmiddle">&nbsp;&nbsp;&nbsp;' +
			blueStone.toLocaleString() + '&nbsp;<img src="/img/symbols/res_splinters.png" align="absmiddle">&nbsp;&nbsp;&nbsp;' +
			ap[0] + '/' + ap[1] + '&nbsp;<img src="/img/symbols/ap.gif" align="absmiddle">&nbsp;&nbsp;&nbsp;' +
			hp[0].toLocaleString() + '/' + hp[1].toLocaleString() + ' (' + hp[2] + '%)&nbsp;<img src="/img/symbols/herz.png" align="absmiddle">&nbsp;&nbsp;&nbsp;' +
			lvl[1].toFixed(2) + '&nbsp;<img src="/img/symbols/level.gif" align="absmiddle">&nbsp;&nbsp;&nbsp;' +
			sword.toLocaleString() + '&nbsp;<img src="/img/symbols/fightvalue.gif" align="absmiddle">' +
		'</span>';
		
		document.getElementsByClassName('gold')[0].innerHTML = DOMPurify.sanitize(content);
	}
	checkEvolve();
}

function bfaaConsole(log, task){
	var bfaa_console = document.getElementById('bfaa_console');
	if (task == "add") bfaa_console.innerHTML += DOMPurify.sanitize(" - " + log);
	else bfaa_console.innerHTML = DOMPurify.sanitize("" + log);
}

function createOrder(order){
	if (order == "health") targetPlace = 'mountain';
	else targetPlace = 'forest';
	
	if (order == "gold") var p1 = 2, p2 = 1, p3 = 5, p4 = 6;
	else if (order == "xp") var p1 = 6, p2 = 2, p3 = 1, p4 = 5;
	else if (order == "aspects"){
		var p1 = 7, p2 = 2, p3 = 1, p4 = 6;
		
		//Robin Hood
		for(i=0; i<decisions.length; i++) {
			if(decisions[i][7] > -99 && decisions[i][7] < 99) {
				decisions[i][7] = 0;
				for(j=0; j<aspects.length; j++){
					if (decisions[i][0] == aspects[j][0]){
						for(k=0; k < asp.length; k++){
							var x = aspectInputArray[k] - asp[k];
							if (aspects[j][k+1] < 0){
								if(x > 10) decisions[i][7] -= Math.ceil(x/1000);
								else if(x < -10) decisions[i][7] -= Math.floor(x/1000);
							}
						}
					}
				}
			}
		}			
	} else {
		if (preset == "aspects") var p1 = 7, p2 = 1, p3 = 4, p4 = 2;
		else var p1 = 1, p2 = 4, p3 = 2, p4 = 6;
	}
	
	var k, temp = [];
	
	for (j=0; j<decisions.length; j++){
		k=0;
		
		for (i=0; i<highPriorityDecisions.length; i++){
			if (decisions[j][0] == highPriorityDecisions[i][0]) {
				k++;
				break;
			}
		}
		
		if (k==0) decisions[j][8] = 0;
		
		for (i=0; i<whitelistDecisions.length; i++){
			if (decisions[j][0] == whitelistDecisions[i]) decisions[j][8] = whitelistDecisions.length - i;
		}
		
		for (i=0; i<blacklistDecisions.length; i++){
			if (decisions[j][0] == blacklistDecisions[i]) decisions[j][8] = 0 - (blacklistDecisions.length - i);
		}
		
		if (decisions[j][0] == 55){
			if (localStorage.lastPresetPlace == targetPlace) decisions[j] = [55,100,100,0,0,0,0,0,0];
			else decisions[j] = [55,-100,-100,0,0,0,0,0,0];
		}
		
		k=0;
		
		for (i=0; i<temp.length; i++){
			if (decisions[j][0] == temp[i][0]) k++;
		}
		
		if (k==0) temp.push(decisions[j]);
		
	}
	
	decisions = temp;

	decisions.sort(function(a,b){
		var n = 0;
		n = b[8] - a[8];
		if (n == 0) n = b[p1] - a[p1];
		if (n == 0) n = b[p2] - a[p2];
		if (n == 0) n = b[p3] - a[p3];
		if (n == 0) n = b[p4] - a[p4];

		return n;
	});
}

function getExperience(url, doc){
	var id = url.substr(url.indexOf("decision") + 9);
	var rewards = doc.getElementsByClassName('table-wrap')[0];
	var x, y, a, b;
	
	if (!sessionStorage.xpName) runFunctionOnPage("/profile", getXpName);
	
	for (j=0; j < decisions.length; j++){
		//[0]id, [1]hp_priority, [2]gold_priority, [3]n, [4]average_hp, [5]average_gold, [6]average_xp
		if (decisions[j][0] == id){
			decisions[j][4] = decisions[j][4] * decisions[j][3];
			decisions[j][5] = decisions[j][5] * decisions[j][3];
			decisions[j][6] = decisions[j][6] * decisions[j][3];
			decisions[j][3]++;
	
			try {
				rewards = rewards.getElementsByTagName('td');
				report = '';
				for (i=0; i<rewards.length; i++){
					reward = DOMPurify.sanitize(rewards[i].innerHTML.toString());
					report += reward + '<br>';
					reward = reward.toString();
					reward = reward.split(': ');
					if(reward.length == 2){
						x = reward[0].toString();
						y = reward[1].toString();
						if (y.indexOf('<') > -1) y = y.substring(0, y.indexOf('<'));
						y = Number(y);
						
						if ((!sessionStorage.damageName || !sessionStorage.healingName) && x.indexOf(sessionStorage.goldName) == -1  && x.indexOf(sessionStorage.xpName) == -1  && reward[1].indexOf('+') == -1){
							if (change[2] < 0 && (-y < change[2]*0.9 && -y > change[2]*1.1)) sessionStorage.damageName = x;
							else if (change[2] > 0 && (y > change[2]*0.9 && y < change[2]*1.1)) sessionStorage.healingName = x;
						}
						
						if (sessionStorage.damageName && sessionStorage.healingName && sessionStorage.damageName == sessionStorage.healingName){
							sessionStorage.removeItem("damageName");
							sessionStorage.removeItem("healingName");
						}
						
						if (y){
							if (sessionStorage.healingName && x.indexOf(sessionStorage.healingName) > -1) decisions[j][4] += y;
							else if (sessionStorage.damageName && x.indexOf(sessionStorage.damageName) > -1) decisions[j][4] -= y;
							else if (sessionStorage.goldName && x.indexOf(sessionStorage.goldName) > -1) decisions[j][5] += y;
							else if (sessionStorage.xpName && x.indexOf(sessionStorage.xpName) > -1) decisions[j][6] += y;
						}
					}
				}
				
				log(report);
				
			} catch (error) {
				//console.error(error);
			}
			
			if (decisions[j][3] > 1) {
				decisions[j][4] = Number((decisions[j][4] / decisions[j][3]).toFixed(0));
				decisions[j][5] = Number((decisions[j][5] / decisions[j][3]).toFixed(0));
				decisions[j][6] = Number((decisions[j][6] / decisions[j][3]).toFixed(2));
			}
		}
		
		priorityBounds = [100, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000]; //Ezen javítani kell!
		
		for (i=1; i<10; i++){
			if (decisions[j][4] / priorityBounds[i-1] > 1) decisions[j][1] = decisions[j][2] = i;
			else if (decisions[j][4] / -priorityBounds[i-1] > 1)  decisions[j][1] = -i;
			if (decisions[j][5] / priorityBounds[i-1] > 1) decisions[j][2] = i;
		}
	}
	
	runFunctionOnPage("/city/adventure/", startAdventure);
}

function log(msg, title){
	var maxLength = 50000;
	var str = sessionStorage.getItem("log_" + profileId);
	
	if(title) str += '<br><br>---- ' + formatDate("h:m:s") + ' - ' + title + ' ----<br><br>';
	
	if(msg){
		if(msg == "clear") str = "";
		else str += msg + '<br>';
	}
	
	if(str.length > maxLength) {
		str = str.substr(str.length-maxLength);
		str = str.substring(str.indexOf('---- '));
	}
	
	sessionStorage.setItem("log_" + profileId, str);
		
	logArea.innerHTML = DOMPurify.sanitize(sessionStorage.getItem("log_" + profileId));
	logArea.scrollTop = logArea.scrollHeight;
}

function startAdventure(url, doc){
	updateItems(doc);
	var comment = '';

	if(slowLikeHuman == 1) timeOut = (Math.random() * 2.5)+0.5;
	else timeOut = 0;
	
	if (url.indexOf("decision") > -1) getExperience(url, doc);
	else if(url.indexOf("working") > -1){
		bfaaConsole("PAUSED - You are working in the graveyard. Waiting to finish it...");
		setTimeout(function(){runFunctionOnPage("/city/adventure/", startAdventure)}, 10*1000);
	} else if(graveyardMain == 1 && (ap[0] < Number(graveyardAp) || hp[2] < Number(graveyardHp)) && ((mode == 1 && adventure[0] && adventure[1] && adventure[0]+1 == adventure[1]) || mode > 1)) runFunctionOnPage("/city/adventure/cancelquest/", graveyard);
	else {
		if (mode == 1){
			var criticalStart = hp[1]*Number(pauseAt)/100, criticalEnd = hp[1]*Number(resumeAt)/100;
			var startRegeneration = hp[1]*Number(startHealing)/100, stopRegeneration = hp[1]*Number(stopHealing)/100;
			
			options_btn = doc.getElementsByClassName('btn');
			if (options_btn[0].getAttribute("href") == "/city/adventure/startquest") {
				critical = 0;
				
				if (stayAlive == 1){
					if (ap[0] >= 3 && hp[0] > criticalStart) runFunctionOnPage("/city/adventure/startquest", startAdventure);
					else {
						setTimeout(function(){runFunctionOnPage("/city/adventure/", startAdventure);}, 10*1000);
						if (ap[0] < 3) bfaaConsole("PAUSED - No enough AP to automatically start the story! Waiting for regeneration...");
						else bfaaConsole("PAUSED - No enough HP to automatically start the story! Waiting for regeneration...");
					}
				} else if (window.location.href.indexOf('/city/adventure/') > -1) bfaaConsole("PAUSED - You have to manually start the story!");
				else window.location.href = "/city/adventure/";
			} else {
				elem = DOMPurify.sanitize(doc.getElementsByClassName('wrap-content wrap-right clearfix')[2].getElementsByTagName('h2')[0].innerHTML);
				elem = elem.substring(elem.lastIndexOf(":") + 2, elem.lastIndexOf(")"));
				elem = elem.split('/');
				adventure[0] = Number(elem[0]);
				adventure[1] = Number(elem[1]);
				
				var contentImages = doc.getElementsByClassName('wrap-content')[2].getElementsByTagName('img');
				
				for (i=0; i<contentImages.length; i++) {
					currentPlace = contentImages[i].src;
					if (currentPlace.indexOf('theme') > -1) {
						currentPlace = currentPlace.substring(currentPlace.indexOf('theme')+7, currentPlace.lastIndexOf('/'));
						currentPlace = currentPlace.replace(/_/g, ' ');
						if (currentPlace.indexOf('mountain') > -1) localStorage.lastPresetPlace = "mountain";
						else if (currentPlace.indexOf('forest') > -1) localStorage.lastPresetPlace = "forest";
					}
				}
				
				if (stayAlive == 1){
					if (hp[0] < startRegeneration) sessionStorage.regenerate = 1;
					if (hp[0] < startRegeneration || (sessionStorage.regenerate == 1 && hp[0] < stopRegeneration && ap[0] > ap[1]*0.1 )) {
						createOrder('health');
						comment = "HEALING";
					} else {
						createOrder(preset);
						sessionStorage.regenerate = 0;
					}
					if (hp[0] < criticalStart) runFunctionOnPage("/city/church", pray);
					else if (hp[0] >= criticalEnd) critical = 0;
				} else createOrder(preset);
				
				title = "Story " + adventure[0] + " - " + currentPlace[0].toUpperCase() + currentPlace.slice(1);// + '/' + adventure[1])
				bfaaConsole(title);
				
				if ((critical == 1 && stayAlive == 1) || (adventure[0] == adventure[1] && ap[0] < 3)) {
					if (critical == 1) comment = "PAUSED - Critical HP level! Waiting for regeneration until " + resumeAt + '%';
					else comment = "PAUSED - No enough AP to continue the story! Waiting for regeneration...";
					setTimeout(function(){runFunctionOnPage("/city/adventure/", startAdventure);}, 10*1000);
				} else {
					var pos = 1000;
					options = [];
					if (adventure[0]%5 == 0) runFunctionOnPage("/profile", checkProfile);
					
					var situation_text = DOMPurify.sanitize(doc.getElementsByClassName('wrap-content')[2].getElementsByTagName('h3')[0].innerHTML);
					report =  situation_text + '<br><br>';
					
					for (i=1; i<options_btn.length; i++) options[i-1] = Number(options_btn[i].href.substr(options_btn[i].href.indexOf("decision") + 9));
					
					p = 0;
					
					options:
					for (i=0; i<options.length; i++){
						k = 0;
						
						for (j=0; j<decisions.length; j++){
							if (options[i] == decisions[j][0]){
								k++;
								if (decisions[j][1] > 9 && decisions[j][2] > 9) p++;
								if (decisions[j][3] > 0 && decisions[j][3] < 3) {
									answer = options[i];
									comment = "CALIBRATING";
									break options;
								} else if (j < pos){
									pos=j;
									answer = options[i];
									break;
								}
							} 
						}
						
						if(k == 0 && p == 0) {
							decisions.push([options[i],0,0,0,0,0,0,0,0]);
							answer = options[i];
							break;
						}
					}
					
					for(i=0; i < options.length; i++) {
						if(options[i] == answer) report += '<span class="answer">[' + options[i] + '] ' + DOMPurify.sanitize(options_btn[i+1].innerHTML) +' <<</span><br>';
						else report += '[' + options[i] + '] ' + DOMPurify.sanitize(options_btn[i+1].innerHTML) +'<br>';
					}
					
					//Ha valamelyik több mint 1000-szer volt már, akkor azt és az ahhoz kapcsolódó lehetőségeket resetálja
					if (pos < decisions.length && decisions[pos][3] > 1000 && (decisions[pos][3] != 0 && decisions[pos][3]%10 != 0)) {
						for (i=0; i<options.length; i++){
							for (j=0; j<decisions.length; j++){
								if (options[i] == decisions[j][0]) decisions[j][3] = 0;
							}
						}
					}
					
					setTimeout(function(){runFunctionOnPage("/city/adventure/decision/" + answer, startAdventure)}, timeOut*1000);
					
					log(report, title);
				}
			}
			if (comment) bfaaConsole(comment, "add");
		} else if (mode==2) setTimeout(function(){manHunt(url,doc)}, timeOut*1000);
		else if (mode==3) setTimeout(function(){grotto(url,doc)}, timeOut*1000);	
		else if (mode==4) setTimeout(function(){hop(url,doc)}, timeOut*1000);
		else if (mode==5) setTimeout(pvp, timeOut*1000);
	}
}

function checkProfile(url, doc){
	var xp = DOMPurify.sanitize(doc.getElementsByClassName('fontsmall')[5].innerHTML);
	xp = xp.substring(5, xp.lastIndexOf(")"));
	xp = xp.split(' / ');
	xp[0] = Number(xp[0].replace(/\./g, ""));
	xp[1] = Number(xp[1].replace(/\./g, ""));
	
	if (levelEnd != xp[1]){
		var k = 0, i = 0; levelEnd = 0;
		do {
			i++;
			levelStart = levelEnd;
			if (i%5==0) k += 15;
			else if (i%5==1) k += 5;
			else k += 10;
			levelEnd += k;
		} while (levelEnd < xp[1]);
		lvl[0] = i;
	}
	
	lvl[1] = lvl[0] + ((xp[0] - levelStart) / (xp[1] - levelStart));
	
	server = window.location.hostname;
	var elem = doc.getElementById('character_tab').getElementsByTagName('td');
	
	server = server.substring(0, server.indexOf('.'))
	profileId = DOMPurify.sanitize(elem[5].innerHTML);
	profileName = DOMPurify.sanitize(elem[7].getElementsByTagName('a')[0].innerHTML);
	level = DOMPurify.sanitize(elem[9].innerHTML.replace(/\./g, ""));
	//localStorage.battleValue = elem[11].innerHTML.replace(/\./g, "");
	if (elem[13]) position = DOMPurify.sanitize(elem[13].innerHTML.replace(/\./g, ""));
	else position = 0;
			
	elem = doc.getElementById('userPic').getElementsByTagName('img')[0].src;
	race = elem.substring( elem.lastIndexOf('logo')+5, elem.lastIndexOf('logo')+6);
	if (race == '1') race = 'vampire';
	else race = race = 'werewolf';
	
	profileChecked = 1;
	
	elem = doc.getElementById('aspects_tab').getElementsByClassName('tooltip');
	var val;
	
	for(i=0; i<8; i++){
		val = DOMPurify.sanitize(elem[i].innerHTML);
		val = val.substring(val.indexOf('<br>')+4, val.lastIndexOf('<br>'));
		asp[i] = Number(val);
		document.getElementsByClassName('aspect_value')[i].textContent = asp[i];
	}
	
	updateItems(doc);
}

function checkEvolve(){
	if (goldId == 1) {
		if (evolveArray.reduce(function(a,b){return a + b}, 0) > 0) {
			if (evolveInProgress != 1) {
				if ((gold > minPrice && minPrice > 0) || minPrice == 0 || evolveArray != lastEvolveArray) {
					runFunctionOnPage("/profile", evolve);
					evolveInProgress = 1;
				}
			}
		} else minPrice = 0;
	} else if (goldId == 2 && hasClan == 1){
		minPrice = Number(goldClan)*10000;
		if (gold > minPrice) {
			var formData = new FormData();
			
			formData.append("donation", minPrice);
			formData.append("donate", "Donate");
			
			var xhr = getXMLHttp();
			xhr.open("POST", "/clan/donate/");
			xhr.send(formData);
		}
	} else minPrice = 0;
}

function evolve(url, doc){
	if (url.indexOf('token') > -1) {
		var elem = doc.getElementsByTagName("*");

		for (i=0; i < elem.length; i++) {
			if (elem[i].hasAttribute('href')) {
				token = elem[i].href;
				if (token.indexOf('token') > -1){
					var token = token.substr(token.indexOf("token")+6);
					break;
				}
			}
		}
		
		if (token != '') setTokens(token);
		evolveInProgress = 0;
		checkEvolve();
	} else {
		var minId;
		
		minPrice = 0;
		lastEvolveArray = evolveArray;
		
		for(i=0; i<evolveArray.length; i++){
			if(evolveArray[i] > 0){
				n=(2*i)+1;
				price = DOMPurify.sanitize(doc.getElementsByClassName('tooltip')[n].getElementsByTagName("td")[0].innerHTML);
				price = price.substring(price.lastIndexOf(":") + 2, price.indexOf("<"));
				price = Number(price.replace(/\./g, ""));
				if ((minPrice == 0) || (minPrice > price)) {
					minPrice = price;
					minId = n;
				}
			}
		}
		
		if (minId){
			var skill = doc.getElementsByClassName('triggerTooltip')[minId].getElementsByTagName("a")[0];
			if (mode > 0 && skill != undefined && skill.hasAttribute('href')) {
				runFunctionOnPage(skill.href, evolve);
			} else evolveInProgress = 0;
		}
	}
}

function setTokens(token){
	var elem = document.getElementsByTagName("*");
	
	for (i=0; i < elem.length; i++) {
		if (elem[i].hasAttribute('href')) {
			url = elem[i].href;
			if(url.indexOf('token') > -1) elem[i].href = url.substring(0, url.indexOf("token")+6) + token;
		}
		if (elem[i].hasAttribute('action')) {
			url = elem[i].action;
			if(typeof url == 'string' && url.indexOf('token') > -1) elem[i].action = url.substring(0, url.indexOf("token")+6) + token;
		}
	}
}

function getXMLHttp(){
	try {
		return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
	}
	catch(evt){
		return new XMLHttpRequest();
	}
}

function runFunctionOnPage(url, func){
	var xhr = getXMLHttp();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4){
			if (xhr.status == 200) return func(xhr.responseURL, xhr.response);
			else setTimeout(function(){runFunctionOnPage(url, func)}, 10*1000);
		}
	}
	
	xhr.open("GET", url, true);
	xhr.responseType = "document";
	
	xhr.send(null);
}

function getXpName(url, doc){
	var xpName = DOMPurify.sanitize(doc.getElementsByClassName('fontsmall')[5].parentNode.parentNode.getElementsByTagName('td')[0].innerHTML);
	sessionStorage.xpName = xpName.substring(0, xpName.indexOf(':'));
}

function pray(url, doc){
	var elem = doc.getElementById('church').getElementsByTagName('td');
	var churchAp = DOMPurify.sanitize(elem[0].innerHTML);
	churchAp = churchAp.substr(churchAp.indexOf('%'));
	churchAp = churchAp.match(/\d+/)[0];	
	
	if(Number(churchAp) <= Number(church) && Number(churchAp) <= ap[0]){
		var formData = new FormData();
		formData.append("heal", "Heal");

		var xhr = getXMLHttp();
		xhr.open("POST", "/city/church/");
		xhr.send(formData);
		
	} else critical = 1;
}

function formatDate(sample, date) {
	if (!date) date = new Date();
	
    var d = [];
	
	d[0] = date.getFullYear();
	d[1] = date.getMonth();
	d[2] = date.getDate();
	d[3] = date.getHours();
    d[4] = date.getMinutes();
    d[5] = date.getSeconds();
	
	for (i=0; i<d.length; i++){
		if (d[i] < 10) {
			d[i] = "0" + d[i];
		}
	}
	
	sample = sample.replace("Y", d[0]);
	sample = sample.replace("M", d[1]);
	sample = sample.replace("D", d[2]);
	sample = sample.replace("h", d[3]);
	sample = sample.replace("m", d[4]);
	sample = sample.replace("s", d[5]);
	
	return sample;
}

function setHuntLocation(){
	huntLocation = huntLocationSwitch.options[huntLocationSwitch.selectedIndex].value;
	if (huntLocation == '1' || huntLocation == '2') reqAp = 1;
	else if (huntLocation == '3' || huntLocation == '4') reqAp = 2;
	else reqAp = 3;
}

function manHunt(url, doc){
	var place;
	if (mode == 2){
		if ((Number(huntCount) > Number(sessionStorage.counter)) && hp[0] > 0 && ap[0] >= reqAp){
			bfaaConsole("Human Hunt - Round " + (Number(sessionStorage.counter) + 1));
		
			switch (huntLocation){
				case '1': 
					place = 'a farm';
					break;
				case '2': 
					place = 'a village';
					break;
				case '3': 
					place = 'a small town';
					break;
				case '4': 
					place = 'a city';
					break;
				case '5': 
					place = 'a metropolis';
					break;
			}
			
			var xhr = getXMLHttp();
			xhr.open("POST", "/robbery/humanhunt/" + huntLocation);
			
			xhr.responseType = "document";
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if (xhr.status == 200){
						doc = xhr.response;
						url = xhr.responseURL;
						
						sessionStorage.counter = Number(sessionStorage.counter) + 1;
						
						if (url.indexOf('report') > -1) {
							var result = doc.getElementById('reportResult');
							report = DOMPurify.sanitize(result.getElementsByTagName('h3')[0].innerHTML);
							if(temp = result.getElementsByClassName('gold')[0]) report += "<br>" + DOMPurify.sanitize(temp.innerHTML);
							
							fightReport(url, place, report);
						} else {
							report = DOMPurify.sanitize(doc.getElementById('humanhunt').getElementsByTagName('p')[0].innerHTML);
							report = report.substring(0, report.lastIndexOf('<br><br>'));
							
							fightReport(null, place, report);
						}						
						
						setTimeout(function(){manHunt(url, doc)}, timeOut*1000);
						updateItems(doc);
					}
				}
			}
			
			xhr.send(null);
		} else {
			switchMode(2);
			bfaaConsole("Human Hunt - Finished");
		}
	}
}

function getGrottoDifficultyNames(url, doc){
	var elem = doc.getElementById('grotte');
	if(elem){
		elem = elem.getElementsByTagName('td');
		localStorage.grottoEasy = elem[0].getElementsByTagName("input")[0].value;
		localStorage.grottoMedium = elem[1].getElementsByTagName("input")[0].value;
		localStorage.grottoDifficult = elem[2].getElementsByTagName("input")[0].value;
	}
}

function grotto(url, doc){
	if (mode == 3){
		if ((Number(grottoCount) > Number(sessionStorage.counter)) && hp[0] > 0 && ap[0] > 0) {
			if (url.indexOf('report') > -1) {
				sessionStorage.counter = Number(sessionStorage.counter) + 1;
				bfaaConsole("Grotto - Round " + (sessionStorage.counter));
				
				var opponent = doc.getElementById("fighter_details_defender").getElementsByTagName('h3')[0].textContent;
				
				var result = doc.getElementById('reportResult');
				report = DOMPurify.sanitize(result.getElementsByTagName('h3')[0].innerHTML);
				if(temp = result.getElementsByClassName('gold')[0]) report += "<br>" + DOMPurify.sanitize(temp.innerHTML);
				
				updateItems(doc);
				fightReport(url, opponent, report);
			} 
			
			var formData = new FormData();
			formData.append("difficulty", localStorage.getItem('grotto' + grottoDifficulty));
			
			setTimeout(function(){sendForm("/city/grotte/", formData, grotto)}, timeOut*1000);
		} else {
			switchMode(3);
			bfaaConsole("Grotto - Finished");
		}
	}
}

function hop(url, doc){
	if (mode == 4){
		if (hp[0] > hp[1]*Number(hopMinHp)/100 && ap[0] > 0) {
			var formData = new FormData();
			
			if (doc.getElementsByName("join")[0]) formData.append("join", "register");
			else {
				bfaaConsole("House of Pain - Searching for opponents");
				
				if (url.indexOf('report') > -1) {
					sessionStorage.counter = Number(sessionStorage.counter) + 1;
					
					var opponent = doc.getElementById("fighter_details_defender").getElementsByTagName('a')[0].textContent;
					
					var result = doc.getElementById('reportResult');
					report = DOMPurify.sanitize(result.getElementsByTagName('h3')[0].innerHTML);
					if(temp = result.getElementsByClassName('gold')[0]) report += "<br>" + DOMPurify.sanitize(temp.innerHTML);
					
					updateItems(doc);
					fightReport(url, opponent, report);
				}
				
				formData.append("search", "Go");
			}
			setTimeout(function(){sendForm("/city/arena/", formData, hop)}, timeOut*1000);
		} else {
			bfaaConsole("House of Pain - You don't have enough HP/AP to start a random fight. Waiting for regeneration");
			setTimeout(function(){runFunctionOnPage("/city/arena/", startAdventure)}, 10*1000);
		}
	}
}

function sendForm(url, formData, func){
	var xhr = getXMLHttp();
	xhr.open("POST", url);
	
	xhr.responseType = "document";
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if (xhr.status == 200) return func(xhr.responseURL, xhr.response);
			else setTimeout(function(){sendForm(url, formData, func)}, 10*1000);
		}
	}
	
	xhr.send(formData);
}

function setPvpMode(){
	pvpMode = pvpModeSwitch.options[pvpModeSwitch.selectedIndex].value;
	
	if (pvpMode == '3') {
		document.getElementById("blacklistDiv").style.display = "block";
		document.getElementById("whitelistDiv").style.display = "none";
	} else {
		document.getElementById("blacklistDiv").style.display = "none";
		document.getElementById("whitelistDiv").style.display = "block";
	}
}

function pvp(){
	if (mode == 5){
		if (hp[0] < hp[1]*Number(pvpMinHp)/100) {
			bfaaConsole("Player vs Player - You don't have enough HP to start a fight. Waiting for regeneration");
			setTimeout(function(){runFunctionOnPage("/city/arena/", startAdventure)}, 10*1000);
		} else if(ap[0] == 0){
			bfaaConsole("Player vs Player - You don't have enough AP to start a fight. Waiting for regeneration");
			setTimeout(function(){runFunctionOnPage("/city/arena/", startAdventure)}, 10*1000);
		} else runFunctionOnPage("/robbery/", searchPlayer);
	}
}

function checkWhitelist(opponent){
	if(whitelistPlayers){
		for(i=0; i < whitelistPlayers.length; i++){
			if(whitelistPlayers[i] == opponent) return true;
		}
		return false;
	} else return false;
}

function searchPlayer(url, doc){
	bfaaConsole("Player vs Player - Searching for opponents");
	if(pvpMode == '3'){
		if(blacklistPlayers[0] == '') {
			switchMode(5);
			bfaaConsole("Player vs Player - The blacklist is empty");
		} else {
			var formData = new FormData();
			formData.append(doc.forms[1].getElementsByTagName('input')[0].name, blacklistPlayers[blacklistId]);
			formData.append("namesearch", "Go");
			sendForm("/robbery/", formData, attack);
			
			if (blacklistId < blacklistPlayers.length-1) blacklistId++;
			else blacklistId = 0;
		}
	} else {
		var formData = new FormData();
	
		if (doc.forms[0].action.indexOf('attack') > -1) formData.append(doc.forms[1].getElementsByTagName('input')[0].name, pvpMode);
		else formData.append(doc.forms[0].getElementsByTagName('select')[0].name, pvpMode);
				
		formData.append("totemsearch", "totemsearch");
		formData.append("optionsearch", "Go");
		
		sendForm("/robbery/", formData, attack);
	}
}

function attack(url, doc){
	if (url.indexOf('report') > -1) {
		var opponent = doc.getElementById("fighter_details_defender").getElementsByTagName('a')[0].textContent;
		
		var result = doc.getElementById('reportResult');
		report = DOMPurify.sanitize(result.getElementsByTagName('h3')[0].innerHTML);
		if(temp = result.getElementsByClassName('gold')[0]) report += DOMPurify.sanitize("<br>" + temp.innerHTML);
		
		updateItems(doc);
		fightReport(url, opponent, report);
		runFunctionOnPage("/robbery/", startAdventure);
	} else if (mode == 5){
		var form = doc.forms[0];
		
		if(form.action.indexOf('attack') > -1){
			var formData = new FormData(form);
			
			var elem = doc.getElementsByTagName('h2')[0].textContent.split(' ');
			var opponent = elem[elem.length - 1];
			
			if(pvpMode != '3' && checkWhitelist(opponent)) setTimeout(function(){searchPlayer(url, doc)}, timeOut*1000);
			else {
				sendForm("/robbery/attack", formData, attack);
				bfaaConsole("Player vs Player - Attacked " + opponent);
			}
		} else setTimeout(function(){searchPlayer(url, doc)}, timeOut*1000);
	}
}

function fightReport(url, opponent, result){
	title = 'Attacked ' + opponent;
	report = result + '<br>';
	if(url != null) report += '<br>Detailed report: <a href="'+ url +'">'+ url + '</a><br>';
	log(report, title);
}

function reportLog(url, doc){
	var result = doc.getElementById('reportResult');
	if (result){
		log("-- Round " + sessionStorage.counter + " --<br/>");
		if(temp = result.getElementsByTagName('h3')[0]) log(DOMPurify.sanitize(temp.innerHTML));
		if(temp = result.getElementsByClassName('gold')[0]) log(DOMPurify.sanitize(temp.innerHTML));
		log('Detailed report: <a href="'+ url +'">'+ url + '</a>');
		log('----------------<br/>');
	} else {
		try{
			result = DOMPurify.sanitize(doc.getElementsByClassName('error')[0].innerHTML);
		} catch {
			result = "Error";
		}
		if (result) log(result);
	}
}

function graveyard(){
	if(ap[0] <= Number(graveyardAp)) var workTime = workTimeAp;
	else var workTime = workTimeHp;
	
	var formData = new FormData();
	formData.append("workDuration", workTime);
	
	log(null, "Graveyard - " + workTime + "h");
	setTimeout(function(){sendForm("/city/graveyard/", formData, startAdventure)}, timeOut*1000);
}

function registrate(){
	var name = document.getElementById('reg_name');
	var email = document.getElementById('reg_email');
	
	if(name.value.indexOf(' ') == -1){
		bfaaConsole('Please insert your full name');
		name.value='';
		name.focus();
	} else if(email.value.indexOf("@") == -1 || email.value.indexOf(".") == -1){
		bfaaConsole('Insert a valid email address');
		email.value='';
		email.focus();
	} else {
		chrome.runtime.sendMessage({
			task: "registrate",
			name: name.value,
			email: email.value
		}, function(response) {
			if (response.status == "success") selectForm('loginForm');
			bfaaConsole(response.message);
		});
	}
}

function login(email, pass){	
	if(!email || !pass) {
		email = document.getElementById('email').value;
		pass = document.getElementById('password').value;
	}
	
	document.getElementById("pay_email").value = email;
	
	if(session() && localStorage.getItem("settings_" + profileId)) main(JSON.parse(localStorage.getItem("settings_" + profileId)));
	else if (session() && sessionStorage.getItem("license_" + profileId) == 'expired') selectForm('activationForm');
	else {
		chrome.runtime.sendMessage({
			task: "login",
			email: email,
			password: pass,
			server: server,
			profileId: profileId,
			profileName: profileName,
			race: race,
			level: level,
			position: position
		}, function(response) {
			if(response.message) bfaaConsole(response.message);
			
			if(response.loggedIn == 'true'){
				localStorage.setItem("email_" + profileId, email);
				localStorage.setItem("pass_" + profileId, pass);
				sessionStorage.setItem("license_" + profileId, response.license);
				
				if(response.license == "expired") selectForm('activationForm');
				else {
					sessionStorage.setItem("session_" + profileId, window.btoa(Number(Date.now() + s)));
					localStorage.setItem("settings_" + profileId, JSON.stringify(response.settings));
					profiles(response.profiles);
					selectForm();
					main(response.settings);
				}
			} else if (response.loggedIn == 'false'){
				bfaaConsole(response.message);
				selectForm('loginForm');
			} else {
				bfaaConsole("Error");
				selectForm('loginForm');
			}
		});
	}
}

function logout(){
	localStorage.removeItem("email_" + profileId);
	localStorage.removeItem("pass_" + profileId);
	location.reload();
}

function session(){
	try {
		var s = Number(window.atob(sessionStorage.getItem("session_" + profileId)));
		var n = Number(Date.now());
		if(localStorage.getItem("email_" + profileId) && s-n > 0 && s-n < s) return true;
		else {
			sessionStorage.removeItem("session_" + profileId);
			return false;
		}
	}
	catch(err) {
		return false;
	}
}

function checkExp(){
	try {
		led = new Date(Number(window.atob(sessionStorage.getItem("license_" + profileId)))*1000);
		if(led > Date.now()) return true;
		else return false;
	}
	catch(err) {
		return false;
	}
}

function checkClan(url, doc){
	if(!doc.getElementById("createClan")) hasClan = 1;
}

function profiles(array){
	var str = "Linked profiles (max 10): <br><ol>";
	
	for(i=0; i<array.length; i++) str += "<li>" + array[i][0] + ": " + array[i][1] + "</li>"; 
	
	localStorage.profiles = str + "<ol>";
}

function setWorkTimeText(url, doc){
	if (doc && doc.getElementsByName("workDuration")[0]) {
		var workTimes = [];
		for(i=0; i<8; i++) workTimes[i] = doc.getElementsByName("workDuration")[0].getElementsByTagName("option")[i].text;
		localStorage.workTimes = JSON.stringify(workTimes);
		setWorkTimeText();
	} else if (!doc && !localStorage.workTimes){
		runFunctionOnPage("/city/graveyard/", setWorkTimeText);
	} else if (localStorage.workTimes){
		workTimes = JSON.parse(localStorage.workTimes);
		for(i=0; i<8; i++){
			document.getElementById('workTimeAp').getElementsByTagName("option")[i].text = workTimes[i];
			document.getElementById('workTimeHp').getElementsByTagName("option")[i].text = workTimes[i];
		}
	}
}

function setGoldForm(){
	var skillsForm = document.getElementById("skillsForm");
	var clanForm = document.getElementById("clanForm");
	
	if (goldId == 1){
		skillsForm.style.display = "block";
		clanForm.style.display = "none";
	} else if (goldId == 2){
		skillsForm.style.display = "none";
		clanForm.style.display = "block";
		runFunctionOnPage("/clan/index/", checkClan);
	} else {
		skillsForm.style.display = "none";
		clanForm.style.display = "none";
	}
}