$(window).on('txat.start', function(oEvent, oApplication, oView) {

	var REC_LOGIN = 'rec_login';
	var REC_PASS = 'rec_pass';
	var RECO_INTERVAL = 2222;

	oApplication.on('disconnect', function() {
		var oInterval;
		
		function reconnect() {
			// trying to reconnect
			$.get(location.href + '?' + Math.random().toString()).success(function() {
				// storing identifier / password
				localStorage.setItem(REC_LOGIN, oApplication.sMe);
				localStorage.setItem(REC_PASS, oApplication.sPass);
				// no more reconnection attempt
				clearInterval(oInterval);
				// reload the page after a few milliseconds
				setTimeout(function() {
					location.reload();
				}, 200);
			}).fail(function() {
				// server is not online
			});
		}
		// you have beeen disconnected
		// reconnection attempt every few seconds
		oInterval = setInterval(reconnect, RECO_INTERVAL);
	});
	
	// txat has started, checking resuming login 
	var sLogin = localStorage.getItem(REC_LOGIN);
	if (typeof sLogin === 'string' && sLogin !== '') {
		// we are reconnecting
		$('#iLogin').val(sLogin);
		$('#iPass').val(localStorage.getItem(REC_PASS));
		localStorage.removeItem(REC_LOGIN);
		localStorage.removeItem(REC_PASS);
		$('#bLogin').trigger('click');
	} // else we are not reconnecting : nothing to do
});
