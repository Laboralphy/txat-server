$(window).on('txat.start', function(oEvent, oApplication, oView) {

	var REC_LOGIN = 'rec_login';
	var REC_PASS = 'rec_pass';
	var RECO_INTERVAL = 1000;

	oApplication.on('disconnect', function() {
		var oInterval;
		
		function reconnect() {
			// console.log('trying to reconnect...');
			$.get(location.href + '?' + Math.random().toString()).success(function() {
				localStorage.setItem(REC_LOGIN, oApplication.sMe);
				localStorage.setItem(REC_PASS, oApplication.sPass);
				console.log('setting login reconnection', oApplication.sMe);
				clearInterval(oInterval);
				setTimeout(function() {
					location.reload();
				}, 200);
			}).fail(function() {
			});
		}
		
		// console.log('disconnected');
		oInterval = setInterval(reconnect, RECO_INTERVAL);
	});
	
	var sLogin = localStorage.getItem(REC_LOGIN);
	// console.log('getting login reconnection', sLogin);
	if (typeof sLogin === 'string' && sLogin !== '') {
		$('#iLogin').val(sLogin);
		$('#iPass').val(localStorage.getItem(REC_PASS));
		localStorage.removeItem(REC_LOGIN);
		localStorage.removeItem(REC_PASS);
		$('#bLogin').trigger('click');
	}
});
