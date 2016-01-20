// main
var W

function main() {
	// load addons
	$.get('/txat-addons', function(data) {
		$('head').append(data);
		startTxatApplication();
	});
}

function startTxatApplication() {
	var $window = $(window);
	var PRIVATE_CHANNEL_CHAR = '@';
	var oApplication = new TXAT.Application();
	var oView = new TXAT.View();
	$window.data({
		TXAT_APPLICATION: oApplication,
		TXAT_VIEW: oView
	});

	/**
	 * Identification utilisateur
	 * 
	 */
	var identifyUser = function() {
		try {
			var $input = $('#iLogin');
			var $pass = $('#iPassw');
			var sLogin = $input.val();
			var sPass = $pass.val();
			oApplication.identify(sLogin, sPass);
			$input.val('');
			$pass.val('');
			$input.focus();
		} catch (e) {
			$('#loginError').html(e);
		}
	};

	// lorsque la zone de saisie des message de discussion
	// recois un code de touche ENTREE on envoie le contenu
	// au système de discussion.
	$('#input').on('keydown', function(oEvent) {
		var $t = $(oEvent.target);
		switch (oEvent.which) {
			case 13:
				oApplication.command($t.val());
				$t.val('');
				$t.focus();
			break;
		}
	});
	
	$window.on('keydown', function(oEvent) {
		switch (oEvent.which) {
			case 145: // scroll-lock
				oView.setScrollLock(!oView.bScrollLock);
			break;
		}
	});

	// lorsqu'on clique sur le bouton de la liste des
	// canaux on envoie une requete /list
	$('#requestList').on('click', function(oEvent) {
		oApplication.command('/list');
	});

	// Bouton CONNECT
	$('#bLogin').on('click', function(oEvent) {
		identifyUser();
	});

	// Zone de saisie de login
	$('#iLogin, #iPassw').on('keydown', function(oEvent) {
		if (oEvent.which == 13) {
			identifyUser();
		}
	});

	// petit diaporamma
	var oLCD = new LCDTimer();
	oLCD.setDiv($('#logoWindow div.title'));
	oLCD.run();

	$('#iLogin').focus();

	/**
	 * Lorsque nous entrons un commande, cette fonction est appelée et 
	 * il est possible d'intercepter la commande pour modifier son
	 * comportement en fonction de l'état dans lequel se trouve l'interface
	 * 
	 * Concrètement ici dans ce cas ; les commandes /leave /msg et /say
	 * vont agir différement selon si notre canal actif est un canal
	 * public ou un canal privé.
	 * 
	 * data.c : commande
	 * data.p : paramètres tapés après les commande.
	 */
	oApplication.on('command', function(data) {
		var command = data.c;
		var param = data.p;
		switch (command) {
			case 'leave':
				if (oView.getActiveTab().charAt(0) == PRIVATE_CHANNEL_CHAR) {
					// on est sur un canal privé
					// on ferme juste l'onglet
					oView.closeTab(oView.getActiveTab());
					data.cancel = true; // annulation du reste de la commande
				}
			break;
			
			case 'msg':
				// récupérer le nom de l'utilisateur et le message
				var r = param.match(/^([^ ]+) (.*)$/);
				if (r) {
					var sUser = r[1]; // nom de l'utilisateur
					var sMessage = r[2]; // message
					var sTab = PRIVATE_CHANNEL_CHAR + sUser;
					oView.openTab(sTab); // ouverture d'un onglet de discussion privée
					// envoie du message à nous même 
					// car le serveur ne revoie pas le message privé à l'expéditeur.
					oView.userMessage(sTab, oApplication.getUserName(), sMessage);
				}
			break;
			
			case 'say':
				// si on est dans un canal privé alors la commande est transformée en /msg
				if (oView.getActiveTab().charAt(0) == PRIVATE_CHANNEL_CHAR) {
					oApplication.command('/msg ' + oView.getActiveTab().substr(1) + ' ' + param);
					data.cancel = true; // annulation du reste de la commande
				}
			break;
		}
	});

	oApplication.on('connect_error', function(data) {
		console.error('error', data);
	});
	
	/**
	 *  Client déconnecté : Le serveur a fermé la connexion d'un serveur
	 *  Cela est du à une erreur du serveur principalement
	 */
	oApplication.on('disconnect', function() {
		oView.viewDisconnect();
	});
	
	/**
	 * Utilisateur accepté : le serveur nous accepte dans le système
	 */
	oApplication.on('userAccepted', function() {
		oLCD.stop();
		$('#logoWindow').fadeOut('fast', function() {
			$('#chatWindow').fadeIn('fast', function() {
				$('#input').focus();
			});
		});
	});

	/** 
	 * Utilisateur rejeté : le serveur refuse de nous intégrer
	 * dans le système (pseudo invalide ou déja pris ou autre raison...)
	 * 
	 * data.m contient le message d'erreur
	 */
	oApplication.on('userRejected', function(data) {
		$('#loginError').html(data.m);
	});
	
	/** 
	 * Message de discussion : un message de discussion est relayé 
	 * sur un des canaux que nous avons rejoint
	 * 
	 * data.c : canal sur lequel est diffusé le message
	 * data.u : utilisateur ayant rédigé le message
	 * data.m : contenu du message
	 */
	oApplication.on('chatMessage', function(data) {
		oView.userMessage(data.c, data.u, data.m, data.d);
	});

	/**
	 * Liste des utilisateurs : le serveur à fournit la liste des 
	 * utilisateurs d'un canal. il le fait automatiquement chaque fois
	 * que nous rejoignons un canal.
	 * 
	 * data.u : liste des utilisateur (array of string)
	 * data.c : nom du canal concerné par la liste
	 */
	oApplication.on('userList', function(data) {
		oView.userList(data.u, data.c);
	});

	/**
	 * Arrivée d'un utilisateur sur un canal : Le serveur notifie 
	 * l'arrivée d'un utilisateur sur un des canaux que nous avons rejoint.
	 * 
	 * data.c : Canal concerné
	 * data.u : Nom de l'utilisateur nouvellement arrivé
	 */
	oApplication.on('channelArrival', function(data) {
		if (data.u == oApplication.getUserName()) {
			oView.openTab(data.c);
		}
		oView.userArrival(data.u, data.c);
	});

	/**
	 * Départ d'un utilisateur d'un canal : Le serveur notifie le départ
	 * d'un utilisateur d'un des canaux que nous avons rejoint.
	 * 
	 * data.c : Canal concerné
	 * data.u : Nom de l'utilisateur qui part
	 */ 
	oApplication.on('channelDeparture', function(data) {
		if (data.u == oApplication.getUserName()) {
			oView.closeTab(data.c);
		} else {
			oView.userDeparture(data.u, data.c);
		}
	});
	
	/**
	 * Réception d'un message privé
	 * 
	 * data.u : nom de l'expediteur du message
	 * data.m : contenu du message
	 */
	oApplication.on('userMessage', function(data) {
		var sFromUser = data.u;
		var sMessage = data.m;
		var sTab = PRIVATE_CHANNEL_CHAR + sFromUser;
		oView.openTab(sTab);
		oView.userMessage(sTab, sFromUser, sMessage, data.d);
	});
	
	/**
	 * Réception d'un message d'erreur : le serveur nous notifie d'un
	 * message d'erreur.
	 * 
	 * data.e : contenu du message d'erreur
	 */
	oApplication.on('errorMessage', function(data) {
		oView.viewError(data.e);
	});
	
	/**
	 * Liste des canaux : Le serveur nous envoie la liste des canaux 
	 * auquels nous avons accès.
	 * 
	 * data.c : liste des canaux (array of string)
	 */
	oApplication.on('channelList', function(data) {
		oView.viewChannelList(data.c);
	});
	
	/**
	 * Message d'information : Le serveur nous envoie un message
	 * d'information relative à un canal. Il est judicieux d'afficher
	 * ce message dans le canals de discussion auquel il se rapporte.
	 * Il s'agit par exemple d'une information concernant le changement
	 * d'administrateur du canal.
	 * 
	 * data.c : nom du canal concerné par ce message
	 * data.m : contenu du message
	 */
	oApplication.on('infoMessage', function(data) {
		oView.appendChatItem(data.c, data.m, {'font-style': 'italic', 'color': '#008'});
	});

	oApplication.on('viewHelp', function(data) {
		oView.viewHelp(data);
	});


	/**
	 * On a changé d'onglet. Cela signifie qu'il faut changer le
	 * canal actif du chat.
	 * note : de nombreuse commandes de txat agisse sur le canal
	 * actif (il ne peux y avoir qu'un seul canal actif et c'est celui
	 * qui est actuellement affiché).
	 * 
	 * data.t identifiant de l'onglet
	 */
	oView.on('tabChanged', function(data) {
		oApplication.setActiveChannel(data.t);
	});

	/**
	 * On a fermé un onglet en cliquant sur la croix de l'onglet.
	 * 
	 * data.t identifiant de l'onglet
	 */
	oView.on('tabClosed', function(data) {
		oView.selectTab(data.t);
		oApplication.command('/leave');
	});
	
	/**
	 * On a sélectionné un canal dans la liste des canaux du serveur
	 * Cette liste contient tous les canaux public qui ont été créés sur
	 * le serveur.
	 * 
	 * data.c : Liste des canaux (array of string)
	 */
	oView.on('channelSelected', function(data) {
		oApplication.command('/join ' + data.c);
		
	});

	$window.on('focus', function(oEvent) {
		oView.setFocus(true);
	});
	
	$window.on('blur', function(oEvent) {
		oView.setFocus(false);
	});

	$window.trigger('txat.start', [oApplication, oView]);
}

$(window).on('load', main);
