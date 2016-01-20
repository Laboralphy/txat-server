O2.createClass('TXAT.View', {

	oChatDiv: null,
	oUserDiv: null,
	oChanDiv: null,

	oTabs: null,
	oUsers: null,

	oPopups: null,	// liste des objets popups


	MAX_CHANNEL_MESSAGE_COUNT: 100,

	sTab: '',	// onglet actif
	
	bFocused: true,
	bScrollLock: false,
	sMessageIcon: '✉',
	sTitle: 'WebTxat',

	
	oEvents: null,
	
	/**
	 * Localise les élément stratégique du DOM
	 * Affecte certaines propriétés
	 */
	__construct: function() {
		this.bScrollLock = false;
		this.sTitle = document.title;
		this.oEvents = {};
		this.oUsers = {};
		this.oTabs = {};
		this.oChatDiv = $('#chatZone').get(0);
		this.oUserDiv = $('#userZone').get(0);
		this.oChanDiv = $('#channelZone').get(0);
		this.oPopups = {};
	},
	
	scrollDown: function() {
		if (!this.bScrollLock) {
			var $d = $('div.message:last', this.oChatDiv);
			if ($d.length) {
				var d = $d.get(0);
				d.scrollIntoView();
			}
		}
	},

	setScrollLock: function(b) {
		this.bScrollLock = b;
		this.scrollDown();
	},

	/**
	 * Défini si le chat a le focus
	 */
	setFocus: function(b) {
		this.bFocused = b;
		if (b) {
			document.title = this.sTitle;
		} else {
			
		}
	},
	
	/**
	 * Le chat a le focus oui ou non ?
	 */
	isFocused: function() {
		return this.bFocused;
	},	
	
	/**
	 * Renvoie le nom de l'onglet actuellement sélectionné
	 * @return string
	 */
	getActiveTab: function() {
		return this.sTab;
	},
	
	/**
	 * Transforme les code spéciaux HTML en caractère unicode
	 * Evitant ainsi l'injection de code HTML dans les messages
	 */
	escapeHTMLEntities: function(s) {
		var r = {
			34: 'quot',
			38: 'amp',
			39: 'apos',
			60: 'lt',
			62: 'gt'
		};
		return s.replace(/["&'<>]/gm, function(c) {
			return '&' + r[c.charCodeAt(0)] + ';';
		});
	},
	
	/**
	 * Ajoute un contenu HTML à la fenetre de chat
	 * @param string sContent contenu
	 * @param object oStyle attribut CSS additionels
	 * @param object oData données sup transmise par le client
	 */
	appendChatItem: function(sTab, sContent, oStyle, oData) {
		var $chat = $(this.oChatDiv);
		var $stuff = $('<div class="message">' + sContent + '</div>');
		if (oStyle) {
			$stuff.css(oStyle);
		}
		if (!sTab && sTab !== 0) {
			sTab = this.sTab;
		}
		if (sTab == this.sTab) {
			$chat.append($stuff);
		} else {
			this.setTabClass(sTab, 'highlighted');
		}
		if (!oData) {
			oData = {};
		}
		oData.s = sContent;
		oData.o = $stuff.get(0);
		oData.t = sTab;
		oData.cancel = false;
		this.trigger('chatItemAppended', oData);
		if (!oData.cancel) {
			this.oTabs[sTab].push($stuff.get(0));
		}
		while (this.oTabs[sTab].length > this.MAX_CHANNEL_MESSAGE_COUNT) {
			$(this.oTabs[sTab].shift()).remove();
		}
		this.scrollDown();
		return $stuff;
	},

	/**
	 * Efface la fenetre de chat
	 */
	clearChat: function() {
		$(this.oChatDiv).empty();
	},
	
	/**
	 * Modifie le contenu du chat (changemetn d'onglet) 
	 * @param string sContent nouveau contenu (HTML) (remplace l'ancien)
	 */
	setChatContent: function(aContent) {
		var $chat = $(this.oChatDiv);
		$chat.children().each(function() {
			$(this).detach();
		});
		aContent.forEach(function(o) {
			$chat.append(o);
		});
		this.trigger('chatContentChanged', {o:this.oChatDiv});
		this.scrollDown();
	},
	

	/**
	 * Ajouter une classe css à un onglet (surbrillance, selection)
	 * @param string sTab id de l'onglet
	 * @param string sClass nouvelle classe ajoutée
	 */
	setTabClass: function(sTab, sClass) {
		var $channels = $('div.channel', this.oChanDiv);
		$channels.each(function() {
			var $this = $(this);
			if ($this.data('channel') == sTab) {
				$this.addClass(sClass);
			}
		});
	},
	
	/**
	 * Supprime une classe css des onglets
	 * @param string sClass classe à supprimer
	 */
	unsetTabClass: function(sClass) {
		$('div.channel.' + sClass, this.oChanDiv).removeClass(sClass);
	},
	
	/**
	 * Reconstruction des onglets dans le DOM
	 */
	displayTabs: function() {
		var aTabs = Object.keys(this.oTabs);
		var $channels = $(this.oChanDiv);
		$channels.empty();
		var $channel;
		for (var i = 0; i < aTabs.length; ++i) {
			$channel = $('<div class="channel"><span class="caption">' + aTabs[i] + '</span><span class="close">✖</span></div>');
			$('span.caption', $channel).bind('click', this.tabCaptionClick.bind(this));
			$('span.close', $channel).bind('click', this.tabCloseClick.bind(this));
			$channel.data('channel', aTabs[i]);
			$channels.append($channel);
		}
	},

	/**
	 * Change l'onglet actif
	 * 
	 * @param string sTab nom du nouvel onglet sélectionné
	 */
	selectTab: function(sTab) {
		if (sTab != this.sTab) {
			this.sTab = sTab;
			this.setChatContent(this.oTabs[sTab]);
			this.userList(this.oUsers[sTab]);
			this.unsetTabClass('highlighted');
			this.unsetTabClass('selected');
			this.setTabClass(sTab, 'selected');
			this.trigger('tabChanged', {t: sTab});
		}
	},

	/** 
	 * Evènement interne de cliquage sur un caption d'un onglet
	 */
	tabCaptionClick: function(oEvent) {
		var $tab = $(oEvent.target);
		$tab.css('color', '');
		var sTab = $tab.parent().data('channel');
		this.selectTab(sTab);
	},
	
	/** 
	 * Evènement interne de cliquage sur la croix de fermeture d'un onglet
	 */
	tabCloseClick: function(oEvent) {
		var $tab = $(oEvent.target);
		$tab.css('color', '');
		var sTab = $tab.parent().data('channel');
		this.trigger('tabClosed', {t: sTab});
	},

	
	
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	
	/**
	 * Mini Factory de popup
	 * 
	 * @param string sId identifiant popup (sera placé dan sl'attribut id du div principal)
	 * @param string sTitle titre du popup
	 */
	getPopup: function(sId, sTitle) {
		if (sId in this.oPopups) {
			return this.oPopups[sId];
		}
		var $popup = $('<div class="window popup" style="display: none">' +
		'	<div class="title">' +
		'		' + sTitle +
		'	</div>' +
		'	<div align="right">' +
		'		<span class="close" onclick="$(this).parent().parent().fadeOut(\'fast\');">✖</span>' +
		'	</div>' +
		'	<div class="content"></div>' +
		'</div>');
		$popup.addClass(sId);
		$('body').append($popup);
		return this.oPopups[sId] = $popup;
	},
	
	/**
	 * Afficahge de vue !
	 * Vue de la popup de message de déconnexion
	 * @param string sMsg message de déconnexion
	 */
	viewDisconnect: function() {
		this.viewError('You have been disconnected from the server. Press F5 to reconnect.');
	},
	
	/**
	 * Afficahge de vue !
	 * Vue de la popup de message d'erreur
	 * @param string sMsg message d'erreur
	 */
	viewError: function(sMsg) {
		$('div.popup:visible').hide();
		var $popup = this.getPopup('error', 'System message');
		$popup.addClass('p320');
		var $popupContent = $('div.content', $popup);
		$popupContent.html(sMsg);
		$popup.fadeIn('fast');
	},
	
	/**
	 * Affichage d'un popup d'aide
	 * @param oContext contenu du popup : chaque entrée associe 'nom-de-commande' avec le contenue de l'aide de la commande
	 */
	viewHelp: function(oContext) {
		$('div.popup:visible').hide();
		var $popup = this.getPopup('help', 'Help');
		$popup.addClass('p640');
		var $popupContent = $('div.content', $popup);
		$popupContent.empty();
		var $dl = $('<dl></dl>');
		var $dt, $dd;
		for (var sHelp in oContext) {
			$dt = $('<dt>' + sHelp + '</dt>');
			$dd = $('<dd>' + oContext[sHelp] + '</dd>');
			$dl.append($dt).append($dd);
		}
		$popupContent.append($dl);
		$popup.fadeIn('fast');
	},
	
	/**
	 * Afficahge de vue !
	 * Vue de la liste des canaux créés sur le serveur
	 * @param array aList liste des canaux recu précédement
	 */
	viewChannelList: function(aList) {
		var $popup = this.getPopup('channelList', 'Channels');
		var $popupContent = $('div.content', $popup);
		var sHTML = '';
		aList.forEach(function(i) {
			sHTML += '<div class="channel">' + i + '</div>';
		});
		$popupContent.html(sHTML);
		$popup.fadeIn('fast');
		$('div.channel', $popupContent).bind('click', (function(oEvent) {
			this.trigger('channelSelected', {c: $(oEvent.target).html()});
			$popup.fadeOut('fast');
		}).bind(this));
	},

	/**
	 * Arrivée d'un nouvel utilisateur sur un canal
	 * @param string sUser utilisateur qui arrive sur le canal
	 * @param string sChan nom du canal qui a recu la visite
	 */
	userArrival: function(sUser, sChan) {
		this.oUsers[sChan].push(sUser);
		if (this.getActiveTab() == sChan) {
			this.userList(this.oUsers[sChan]);
		}
		this.appendChatItem(sChan, '<span> + ' + sUser + '</span>', { color: '#060', 'font-weight': 'bold' });
	},
	
	/**
	 * Reception d'une notification de départ d'utilisateur d'un canal
	 * @param string sUser utilisateur qui quitte le canal
	 * @param string sChan canal quitté
	 */
	userDeparture: function(sUser, sChan) {
		var n = this.oUsers[sChan].indexOf(sUser);
		this.oUsers[sChan].splice(n, 1);
		if (this.getActiveTab() == sChan) {
			this.userList(this.oUsers[sChan]);
		}
		this.appendChatItem(sChan, '<span> - ' + sUser + '</span>', { color: '#800', 'font-weight': 'bold' });
	},
	
	/**
	 * Affiche un message d'un utilisateur dans la fenetre de chat
	 * Le pseudo de l'utilisateur apparait.
	 * @param string sUser nom de l'utilisateur ayant rédigé le message
	 * @param string sMessage contenu du message
	 */
	userMessage: function(sTab, sUser, sMessage, data) {
		if (this.isFocused()) {
			document.title = this.sTitle;
		} else {
			document.title = this.sMessageIcon + ' - ' + this.sTitle;
		}
		var s = '<span class="username">' + sUser + '</span><span class="separator">:</span><span class="usermessage">' + this.escapeHTMLEntities(sMessage) + '</span>';
		this.appendChatItem(sTab, s, null, data);
	},

	/**
	 * Modifie le contenu de la liste des users
	 * @param array a nouvelle liste d'utilisateurs
	 * @param string sTab nom de l'onglet associé à cette liste d'utilisateurs
	 */
	userList: function(a, sTab) {
		this.oUsers[sTab] = a;
		var $users = $(this.oUserDiv);
		$users.empty();
		a.forEach(function(i) {
			var $user = $('<div class="user">' + i + '</div>');
			$user.on('click', this.userListClick);
			$users.append($user);
		}, this);
	},
	
	userListClick: function(oEvent) {
		function insertAtCursor(myField, myValue) {
			//IE support
			if (document.selection) {
				myField.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
			}
			//MOZILLA and others
			else if (myField.selectionStart || myField.selectionStart == '0') {
				var startPos = myField.selectionStart;
				var endPos = myField.selectionEnd;
				myField.value = myField.value.substring(0, startPos)
					+ myValue
					+ myField.value.substring(endPos, myField.value.length);
			} else {
				myField.value += myValue;
			}
		}
		var $this = $(oEvent.target);
		insertAtCursor($('#input').get(0), ' ' + $this.text() + ' ');
		$('#input').val($('#input').val().replace(/^ /g, '').replace(/ $/g, ''));
		$('#input').focus();
	},
	
	/**
	 * Ouverture d'un nouvel onglet
	 * @param string sTab nom de l'onglet
	 * @param bool bMove selectionner l'onglet
	 */
	openTab: function(sTab) {
		if (!(sTab in this.oTabs)) {
			this.oUsers[sTab] = [];
			this.oTabs[sTab] = [];
			this.displayTabs();
			this.selectTab(sTab);
		}
	},

	
	/**
	 * Fermeture d'un onglet
	 * @param string sTab nom de l'onglet
	 */
	closeTab: function(sTab) {
		var aTabs = Object.keys(this.oTabs);
		var nTab = aTabs.indexOf(sTab);
		if (nTab >= 0) {
			nTab = Math.max(0, nTab - 1);
			var sNewTab = aTabs[nTab];
			delete this.oUsers[sTab];
			delete this.oTabs[sTab];
			this.displayTabs();
			this.selectTab(sNewTab);
		}
	},

	/**
	 * Fermeture de l'onglet actif
	 */
	closeActiveTab: function() {
		this.closeTab(this.getActiveTab());
	}
});

ClassMagic.castEventHandler(TXAT.View);
