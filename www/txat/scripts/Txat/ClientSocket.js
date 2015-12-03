O2.extendClass('TXAT.ClientSocket', WSC.ClientSocketAbstract, {
	
	onNotify: null,
	
	connect: function() {
		__inherited();
		this.setSocketHandlers({
			'connect': this.scconnect.bind(this),
			'connect_error': this.scconnect_error.bind(this),
			'disconnect': this.scdisconnect.bind(this),
			'T_HI': this.scHI.bind(this),
			'T_DN': this.scDN.bind(this),
			'T_CM': this.scCM.bind(this),
			'T_CL': this.scCL.bind(this),
			'T_CA': this.scCA.bind(this),
			'T_CD': this.scCD.bind(this),
			'T_UM': this.scUM.bind(this),
			'T_LS': this.scLS.bind(this),
			'T_ER': this.scER.bind(this),
			'T_IM': this.scIM.bind(this)
		});
	},
	
	doNotify: function(sMessage, xData) {
		if (this.onNotify) {
			this.onNotify(sMessage, xData);
		}
	},

	// Le client envoie son identification
	identifyUser: function(sUserName, sPassword) {
		if (sUserName.length < 3) {
			throw new Error('User name must be 3 or more character length');
		}
		if (sUserName.indexOf(' ') >= 0) {
			throw new Error('Spaces are not allowed in user name');
		}
		var ctx = {u: sUserName};
		if (sPassword !== '' || sPassword !== undefined) {
			ctx.p = sPassword;
		}
		this.send('T_LOGIN', ctx);
	},


	// Le serveur a validé la connexion
	scconnect: function() {
		this.doNotify('connect');
	},

	// Le serveur a retourné une erreur lors de la connexion
	scconnect_error: function() {
		this.disconnect();
		this.doNotify('connectError');
	},

	// Le serveur a coupé la connexion
	scdisconnect: function() {
		this.disconnect();
		this.doNotify('disconnect');
	},


	// Le serveur à accepté l'identification du client
	scHI: function(xData) {
		this.doNotify('userAccepted');
	},

	// Le serveur refuse le client : le motif est spécifié en data
	scDN: function(xData) {
		this.doNotify('userRejected', {m: xData.e});
	},
	
	// chat message
	scCM: function(xData) {
		this.doNotify('chatMessage', xData);
	},
	
	// liste des utilisateurs du canal
	scCL: function(xData) {
		this.doNotify('userList', xData);
	},
	
	// channel arrival
	scCA: function(xData) {
		this.doNotify('channelArrival', xData);	
	},

	// channel departure
	scCD: function(xData) {
		this.doNotify('channelDeparture', xData);		
	},
	
	// user message
	scUM: function(xData) {
		this.doNotify('userMessage', xData);
	},
	
	// channel list
	scLS: function(xData) {
		this.doNotify('channelList', xData);
	},
	
	// MEssage d'erreur
	scER: function(xData) {
		this.doNotify('errorMessage', xData);
	},
	
	// Message informatif
	scIM: function(xData) {
		this.doNotify('infoMessage', xData);
	}
});

