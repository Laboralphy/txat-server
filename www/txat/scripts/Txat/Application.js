/**
 * Classe qui exploite le système de chat
 */

O2.createClass('TXAT.Application', {
	oClientSocket: null,
	oEvents: null,
	
	sMe: '',
	sChannel: '',
	
	__construct: function() {
		this.oEvents = {};
		this.initNetwork();
	},
	
	getUserName: function() {
		return this.sMe;
	},
	
	setActiveChannel: function(sChannel) {
		this.sChannel = sChannel;
	},

	getActiveChannel: function() {
		return this.sChannel;
	},

	
	
	////// NIVEAU RESEAU ////// NIVEAU RESEAU ////// NIVEAU RESEAU ////// NIVEAU RESEAU //////
	////// NIVEAU RESEAU ////// NIVEAU RESEAU ////// NIVEAU RESEAU ////// NIVEAU RESEAU //////
	////// NIVEAU RESEAU ////// NIVEAU RESEAU ////// NIVEAU RESEAU ////// NIVEAU RESEAU //////
	
	initNetwork: function() {
		this.oClientSocket = new TXAT.ClientSocket();
		this.oClientSocket.onNotify = this.trigger.bind(this);
		this.oClientSocket.connect();
	},
	
	/**
	 * Envoie d'un message au serveur Txat
	 * @param string sMessage
	 * @param object data
	 */
	sendTxat: function(sMessage, data) {
		this.oClientSocket.send(sMessage, data);
	},

	// Le client envoie son identification
	identify: function(sMe, sPass) {
		this.sMe = sMe;
		this.oClientSocket.identifyUser(this.sMe, sPass);
	},


	////// NIVEAU INTERPRETATION ////// NIVEAU INTERPRETATION ////// NIVEAU INTERPRETATION //////
	////// NIVEAU INTERPRETATION ////// NIVEAU INTERPRETATION ////// NIVEAU INTERPRETATION //////
	////// NIVEAU INTERPRETATION ////// NIVEAU INTERPRETATION ////// NIVEAU INTERPRETATION //////
	
	doErrorMessage: function(sMessage) {
		this.trigger('errorMessage', {e: sMessage});
	},
	
	defineCommand: function(sCommand, p) {
		var s = 'cmd_' + sCommand.toLowerCase();
		if (s in this) {
			throw new Error('Command ' + sCommand + ' is already defined');
		}
		this[s] = p;
	},

	/**
	 * Interprétation d'une commande saisie au clavier.
	 */
	command: function(sCommand) {
		try {
			if (sCommand.charAt(0) != '/') {
				sCommand = '/say ' + sCommand;
			}
			
			var r = sCommand.match(/^\/([a-zA-Z0-9]+)( +(.*))?$/);
			if (r) {
				sOpcode = r[1].toLowerCase();
				sText = r[3];
				sOpcodeFunction = 'cmd_' + sOpcode;
				if (sOpcodeFunction in this) {
					var oContext = {c: sOpcode, p: sText, cancel: false};
					this.trigger('command', oContext);
					if (!oContext.cancel) {
						this[sOpcodeFunction](sText);
					}
				} else {
					this.doErrorMessage('Unknown command "' + sOpcode +'"');
				}
			}
		} catch (e) {
			this.doErrorMessage('Error: ' + e.message);
		}
	},

	// Message sur canal
	cmd_say: function(sData) {
		this.sendTxat('T_SAY', {c: this.getActiveChannel(), m:sData});
	},

	// Rejoindre canal
	cmd_join: function(sChannel) {
		this.sendTxat('T_JOIN', {c: sChannel});
	},

	// Quitter canal
	cmd_leave: function(sChannel) {
		this.sendTxat('T_LEAVE', {c: this.getActiveChannel()});
	},

	// message privé
	cmd_msg: function(s) {
		var r = s.match(/^([^ ]+) (.*)$/);
		if (r) {
			this.sendTxat('T_MSG', {u: r[1], m: r[2]});
		}
	},
	
	// demander la liste des canaux
	cmd_list: function() {
		this.sendTxat('T_LIST', null);
	},
	
	cmd_who: function(sUser) {
		this.sendTxat('T_WHO', {u: sUser, c: this.getActiveChannel()});
	},
	
	cmd_ban: function(sParams) {
		if (sParams) {
			var aParams = sParams.split(' ');
			var sUser = aParams.shift();
			var sTime = aParams.join(' ');
			var sWhy = '';
			var nTime = 0;
			if (sTime) {
				// exemples de formats de time :
				// /ban user 1d  bannissement pendant 1 jour
				// /ban user 1h  bannissement pendant 1 heure
				// /ban user 5m  bannissement pendant 5 minutes
				// /ban user 3d 6h  bannissement pendant 3 jours et 6 heures
				var aTime = {
					d: 0,
					h: 0,
					m: 0
				};
				var aRegs = sTime.match(/([0-9]+)([dhm])/g)
				if (aRegs) {
					aRegs = aRegs.map(function(s) { return s.match(/^([0-9]+)([dhm])$/); });
				}
				if (aRegs) {
					aRegs.forEach(function(s) {
						aTime[s[2]] = s[1] | 0;
					});
					nTime = aTime.d * 24 * 60 + aTime.h * 60 + aTime.m;
					sWhy = sTime.replace(/[0-9]+[dhm]/g, '').replace(/^ +/g, '');
				} else {
					sWhy = sTime;
				}
			}
			this.sendTxat('T_BAN', {u: sUser, c: this.getActiveChannel(), t: nTime, m: sWhy});
		} else {
			this.sendTxat('T_BAN', {c: this.getActiveChannel()});
		}
	},
	
	cmd_unban: function(sUser) {
		this.sendTxat('T_UNBAN', {u: sUser, c: this.getActiveChannel()});
	},

	cmd_promote: function(sUser) {
		this.sendTxat('T_PROMOTE', {u: sUser, c: this.getActiveChannel()});
	},

	cmd_demote: function(sUser) {
		this.sendTxat('T_DEMOTE', {u: sUser, c: this.getActiveChannel()});
	},
	
	cmd_upref: function(sParams) {
		var r = sParams.match(/^([^ ]+) +(.+)$/);
		if (r) {
			var sVariable = r[1];
			var sValue = r[2];
			this.sendTxat('T_UPREF', {v: sVariable, w: sValue});
		}
	},
	
	cmd_passwd: function(sParam) {
		this.sendTxat('T_PASSWD', {p: sParam});
	},
	
	cmd_help: function(sParam) {
		var oHelpContext = {};
		for (var h in TXAT.HELP.FR) {
			oHelpContext[h] = TXAT.HELP.FR[h];
		}
		this.trigger('help', oHelpContext);
		this.trigger('viewHelp', oHelpContext);
	}
});

ClassMagic.castEventHandler(TXAT.Application);
