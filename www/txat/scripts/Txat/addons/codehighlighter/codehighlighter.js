$(window).on('txat.start', function(oEvent, oApplication, oView) {
	var NS = 'codehighlighter';
	var TAG_START = '{{' + NS + ' ';
	var TAG_END = '}}';
	var $textarea; // dans lequel sera collé le code source
	
	var DEFAULT_HEIGHT = 256;
	
	function showhideClick(oEvent) {
		var sDataVar = NS + '_hidden';
		var $button = $(oEvent.target);
		var $code = $button.parents('span.' + NS + '.commands').next();
		if ($code.data(sDataVar)) {
			$code.data(sDataVar, false);
			$code.animate({
				opacity: 1,
				'max-height': DEFAULT_HEIGHT + 'px',
			}, 200);
		} else {
			$code.data(sDataVar, true);
			$code.animate({
				opacity: 0,
				'max-height': 0,
			}, 200);
		}
	}
	
	function openNewTabClick(oEvent) {
		var sHost = location.hostname;
		var sPort = location.port;
		var sProto = location.protocol;
		var $button = $(oEvent.target);
		var $code = $button.parents('span.' + NS + '.commands').next();
		var oNewTab = window.open('', '_blank');
		oNewTab.document.write('<!DOCTYPE html>');
		oNewTab.document.write('<html>');
		oNewTab.document.write('<head>');
		oNewTab.document.write('<meta charset="utf-8" />');
		oNewTab.document.write('<link rel="stylesheet" href="' + sProto + '//' + sHost + ':' + sPort + '/txat/scripts/Txat/addons/codehighlighter/highlight/styles/default.css' + '" />');
		oNewTab.document.write('</head>');
		oNewTab.document.write('<body>');
		oNewTab.document.write('<pre><code>' + $code.html() + '</code></pre>');
		oNewTab.document.write('</body>');
	}
	
	oView.on('chatItemAppended', function(data) {
		var $item = $(data.o);
		var $usermessage = $('span.usermessage', $item);
		if ($usermessage.length > 0) {
			var sContent = $usermessage.text();
			if (sContent.substr(0, TAG_START.length) === TAG_START && sContent.substr(-TAG_END.length) === TAG_END) {
				var sCode = JSON.parse(sContent.substr(TAG_START.length, sContent.length - TAG_START.length - TAG_END.length));
				var hl = hljs.highlightAuto(sCode);
				var sCode = hl.value;
				var sLang = hl.language;				
				if ('second_best' in hl) {
					sLang += ', ' + hl.second_best.language;
				}
				var $code = $('<pre style="margin: 4px; border: solid thin #555; background-color: #DDD; max-height: ' + DEFAULT_HEIGHT + 'px; overflow: auto"><code>' + sCode + '<code></pre>');
				var $commands = $('<span class="' + NS + ' commands"></span>');
				// show hide
				var $btoggle = $('<button class="' + NS + ' showhide"type="button" title="Show or hide the source code window">Show/hide</button>');
				$btoggle.on('click', showhideClick);
				$commands.append($btoggle);
				// export new tab
				var $bexport = $('<button class="' + NS + ' export"type="button" title="Open this source code in a new tab"></button>');
				$bexport.on('click', openNewTabClick);
				$commands.append($bexport);
				
				$usermessage.remove();
				$item.append($commands).append($code);
			}
		}
	});
	
	// créer une nouvelle commande /code
	oApplication.defineCommand('code', function() {
		var $pop = oView.getPopup('codehighlighterPopup', 'Paste source code here !');
		if (!$pop.data('codehighlighter')) { // pour ne pas refaire deux fois le même code
			$pop.addClass('p640')
			var $popcont = $('div.content', $pop); 
			$popcont.html('<textarea style="resize: none; font-size: 80%; width: calc(100% - 4px); height: 300px"></textarea><hr/><button type="button">Ok</button>');
			$textarea = $('textarea', $popcont);
			var $button = $('button', $popcont);
			$button.on('click', function(oEvent) {
				oApplication.cmd_say(TAG_START + JSON.stringify($textarea.val()) + TAG_END);
				$pop.fadeOut('fast');
			});

			$pop.data('codehighlighter', true);
		}
		$pop.fadeIn('fast');
	});
});
