$(window).on('txat.start', function(oEvent, oApplication, oView) {
	var NS = 'timemessage';
	
	oView.on('chatItemAppended', function(data) {
		var $item = $(data.o);
		var $username = $('span.username', $item);
		if ($username.length > 0) {
			$username.html('<i>[' + data.time.join(':') + ']</i> '  + $username.html());
		}
	});
});
