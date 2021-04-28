//
// Support functions for SSO.
//
// Copyright (c) 2014 KEMP Technologies
//
//ident "$Id: lm_sso.js 14186 2016-11-23 12:32:03Z phil $ phil"
//
function errmsg(x) {
	var tmp = document.getElementById("badmsg");
	if (!tmp) {
		alert("missing badmsg");
		return;
	}
	switch (x) {
		case 0:
			return;
		case 1:
			tmp.innerHTML = xx_msg10;
			break;
		case 2:
			tmp.innerHTML = xx_msg11;
			break;
	}
}

function save_username(username, pubpriv) {
	pub = 1;
	if (pubpriv[0].checked) {
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		pub = 0;
	}
	else
		document.cookie = "username=" + username.value;
	document.cookie = "pubpriv=" + pub;
	return true;
}

function save_usernames_dfa(dusername, username, pubpriv) {
	pub = 1;
	if (pubpriv[0].checked) {
		document.cookie = "dusername=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		pub = 0;
	}
	else {
		document.cookie = "dusername=" + dusername.value;
		document.cookie = "username=" + username.value;
	}
	document.cookie = "pubpriv=" + pub;
	return true;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');

	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}

function loadvalues(dopub) {
	var tmp;

	if (!dopub) {
		tmp = document.getElementById("nopub");
		tmp.style.display = "none";
		for (i = 1; i < 10; i++) {
			tmp = document.getElementById("nopub" + i);
			if (!tmp)
				break;
			tmp.style.display = "none";
		}
		document.cookie = "dusername=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		document.cookie = "pubpriv=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		return;
	}
	var pub = getCookie("pubpriv");
	if (pub != 0) {
		tmp = document.getElementById("pubp");
		tmp.checked = true;

		var user = getCookie("username");
		if (user != "") {
			tmp = document.getElementById("username");
			tmp.value = user;
		}

		var duser = getCookie("dusername");
		if (duser != "") {
			tmp = document.getElementById("dusername");
			tmp.value = duser;
		}
	}
}

function no_password_form() {
	tmp = document.getElementById("passid");
	tmp.style.display = "none";
	tmp = document.getElementById("password");
	tmp.required = false;
	tmp.value = "nopass";
}

function sso_setup(curl, curlid, ssomsg, curlmode, pubpriv, dispass) {
	var tmp;
	
	tmp = document.getElementById("curl");
	tmp.value = curl;

	tmp = document.getElementById("curlid");
	tmp.value = curlid;

	tmp = document.getElementById("curlmode");
	tmp.value = curlmode;

	curlmode &= 0xf;
	if (curlmode == 12) {
		tmp = document.getElementById("reset_pass");
		if (tmp) {
			tmp.style.display = "";
			var ca = ssomsg.split("|@|");
			tmp = document.getElementById("reset_msg");
			tmp.innerHTML = ca[0];
			tmp = document.getElementById("reset_link");
			tmp.href = ca[1];
			tmp = document.getElementById("ssomsg");
			tmp.innerHTML = ca[2];
		}
		else
			curlmode = 2;
	}
	else {
		tmp = document.getElementById("ssomsg");
		tmp.innerHTML = ssomsg;
	}


	switch (curlmode) {
		case 0:
			if (dispass == 1)
				no_password_form();
			break;
		case 1:
		case 2:
			if (dispass == 1)
				no_password_form();
			errmsg(curlmode);
			break;
		case 4:
		case 5:
		case 6:
		case 7:
			pubpriv = 0;
			if (curlmode == 4 || curlmode == 5) {
				tmp = document.getElementById("pascid");
				tmp.style.display = "";
				if (curlmode == 5) {
					tmp = document.getElementById("passlabel");
					tmp.innerHTML = xx_msg15;
				}
				tmp = document.getElementById("passphrase");
				tmp.required = true;
			}
			else {
				tmp = document.getElementById("pinid");
				tmp.style.display = "";
				if (curlmode == 7) {
					tmp = document.getElementById("pinlabel");
					tmp.innerHTML = xx_msg17;
				}
				tmp = document.getElementById("pin");
				tmp.required = true;
			}
			tmp = document.getElementById("userid");
			tmp.style.display = "none";
			tmp = document.getElementById("passid");
			tmp.style.display = "none";
			tmp = document.getElementById("password");
			tmp.required = false;
			break;
		default:
			break;
	}
	loadvalues(pubpriv);
	lmdata_fix();
}

function lmdata_fix() {
	var cookieList = (document.cookie) ? document.cookie.split(';') : [];
	for (var i = 0, n = cookieList.length; i != n; ++i) {
		var cookie = cookieList[i];
		var f = cookie.indexOf('=');
		if (f >= 0) {
			var cookieName = cookie.substring(0, f).trim();
			if (cookieName.indexOf("lmdata") === 0) {
				document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
				break;
			}
		}
	}
}
