/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var baseURL = 'http://www.ximiodev.com/whereismycar/apiContenidos.php';
var devuuid;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		try {
			console.log('Received Device Ready Event');
			console.log('calling setup push');
			var admobid = {};
			
			if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
				admobid = {
					banner: 'ca-app-pub-4910383278905451/9199602365', // or DFP format "/6253334/dfp_example_ad"
					interstitial: 'cca-app-pub-4910383278905451/5078872411'
				};
			} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
				admobid = {
					banner: 'ca-app-pub-4910383278905451/3855447740', // or DFP format "/6253334/dfp_example_ad"
					interstitial: 'ca-app-pub-4910383278905451/2897589292'
				};
			}
			if(AdMob) 
				AdMob.createBanner({
					adId: admobid.banner,
					position: AdMob.AD_POSITION.TOP_CENTER,
					autoShow: true 
				});
			devuuid = device.uuid;
			  
			setTimeout(regitrartoken, 3000);
		} catch(e) {
			alert(e);
		}
    }
};


function regitrartoken() {
	if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { 
		window.FirebasePlugin.grantPermission();
	}
	window.FirebasePlugin.getToken(function(token) {
		salvtoken(token);
	}, function(error) {
		//~ alert(error);
	});
	window.FirebasePlugin.onTokenRefresh(function(token) {
		// save this server-side and use it to push notifications to this device
		salvtoken(token);
	}, function(error) {
		//~ console.error(error);
	});
	window.FirebasePlugin.onNotificationOpen(function(notification) {
		alert(notification.body,notification.title);
	}, function(error) {
		alert(error);
	});
	window.FirebasePlugin.setBadgeNumber(0);
}

function salvtoken(token) {
	var user_platform = device.platform;
	alert('registration event: ' + token);
	var datos = {
		'accion':'registrarDev',
		'user_platform': user_platform,
		'registrationId': token,
		'devuuid': devuuid
	}
	$.ajax({
		type: 'POST',
		data: datos,
		dataType: 'json',
		url: baseURL,
		success: function (data) {
			if(data.res) {
				alert(data.res);
			}
		},
		error      : function(xhr, ajaxOptions, thrownError) {
			alert("error 216");
		}
		
	});
	var oldRegId = localStorage.getItem('registrationId');
	if (oldRegId !==token) {
		// Save new registration ID
		localStorage.setItem('registrationId', token);
		// Post registrationId to your app server as the value has changed
	}

	var parentElement = document.getElementById('registration');
	var listeningElement = parentElement.querySelector('.waiting');
	var receivedElement = parentElement.querySelector('.received');

	listeningElement.setAttribute('style', 'display:none;');
	receivedElement.setAttribute('style', 'display:block;');
}
