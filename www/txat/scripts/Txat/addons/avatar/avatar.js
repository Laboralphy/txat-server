$(window).on('txat.start', function(oEvent, oApplication, oView) {
	var PATH_IMAGES = "/txat/scripts/Txat/addons/avatar/images/avatar/";
	var PATH_DEFAULT = "/txat/scripts/Txat/addons/avatar/images/128_default/";
	var TAG_START = '{{avatar ';
	var TAG_END = '}}';
//	var $textarea; // dans lequel sera collé le code source
	
	oView.on('chatItemAppended', function(data) {
//		console.log("chatitem", data);
		var $item = $(data.o);
		$item.addClass('avatarMessage')
		var $usermessage = $('span.usermessage', $item);
		if ($usermessage.length > 0) {
			var usernick = $('span.nick', $item).html().replace(':', '');
			$item.append("<br/>");
		}
		
//		if ($usermessage.length > 0) {
//			var sContent = $usermessage.text();
//			if (sContent.substr(0, TAG_START.length) === TAG_START && sContent.substr(-TAG_END.length) === TAG_END) {
//				var sCode = JSON.parse(sContent.substr(TAG_START.length, sContent.length - TAG_START.length - TAG_END.length));
//				var hl = hljs.highlightAuto(sCode);
//				var sCode = hl.value;
//				var sLang = hl.language;				
//				if ('second_best' in hl) {
//					sLang += ', ' + hl.second_best.language;
//				}
//				var $code = $('<pre style="margin: 4px; border: solid thin #555; background-color: #DDD; max-height: 256px; overflow: auto"><code>' + sCode + '<code></pre>');
//				var $commands = $('<span class="codehlcommands"></span>');
//				var $btoggle = $('<button type="button">code : <b>' + sLang + '</b></button>');
//				$btoggle.on('click', function(oEvent) {
//					$code.slideToggle(200);
//				});
//				$commands.append($btoggle);
//				$usermessage.remove();
//				$item.append($commands).append($code);
//			}
//		}
	});
	
	// créer une nouvelle commande /code
	oApplication.defineCommand('avatar', function() {
		var $pop = oView.getPopup('avatarPopup', 'Choose your dirty face !');
		
		if (!$pop.data('avatarPopup')) { // pour ne pas refaire deux fois le même code
			$pop.addClass('p640').addClass('avatarpop');
			var $popcont = $('div.content', $pop); 
			var $html = $("<div>").addClass('proposition');
			var $diapo = $("<div>").addClass('diapo');
			for(i = 1; i <= 10;i++) {
				var $image = $("<img>").addClass('choice').attr('src', PATH_DEFAULT  + i + ".png");
				$diapo.append($image);
 			}
			$html.append($diapo);
			$popcont.append($html);
			$popcont.append($("<p>").html("or choose a different one (png 128/128px)"));
//			$file = $("<input>").attr('type', 'file');
//			$popcont.append($file);
			$popcont.imageLoader({
				load: function(imageCont) {
					$('img.yourchoice').attr('src', imageCont);
				}
			});
			
			$popcont.append($("<p>").html("your (bad) choice:"));
			
			
			
			var $col = $("<p>").html('choose border and text colors');
			
			
			var $example = $('<div class="message avatarMessage">'
				+ '<img src="/txat/scripts/Txat/addons/avatar/images/128_default/default.png" class="avatarItem yourchoice">'
				+'<span class="nick">'+ oApplication.getUserName() + ':</span>'
				+'<span class="usermessage">your message</span><br></div>'
				+'<input id="color" type="text" placeholder="text color"/>'
				+'<input id="colorborder" type="text" placeholder="border color"/>'
				+'<input id="colorbg" type="text" placeholder="background color"/>'
				+'<div id="colordiv"></div>'
				+'<div id="colordivborder"></div>'
				+'<div id="colordivbg"></div>');
			
			$popcont.append($example);
			
			//textcolor
			var $colorTextInput = $("#color", $example);
			var $colorDiv = $("#colordiv", $example);
//			//bordercolor
//			var $colorBorderInput = $("#colorborder", $example);
//			var $colorDivBorder = $("#colordivborder", $example);
//			//bordercolor
//			var $colorBgInput = $("#colorbg", $example);
//			var $colorDivBg = $("#colordivbg", $example);
//			
//			var $ok = $("<button>").html("ok");
//			$popcont.append($ok);
//			//event on choice list
//			$("img.choice").on('click', function() {
//				$yourchoice.attr('src', $(this).attr('src'));
//			});
//			//event on validation
//			$ok.on('click', function(oEvent) {
//				oApplication.command('/upref avatarImage ' + $yourchoice.attr('src'));
//				$pop.fadeOut('fast');
//			});
//			//event on color
//			$colorTextInput.on('click', function(oEvent) {
//				$colorDiv.show();
//			});
//			$colorBorderInput.on('click', function(oEvent) {
//				$colorDivBorder.show();
//			});
//			$colorBgInput.on('click', function(oEvent) {
//				$colorDivBg.show();
//			});
//			$colorDiv.farbtastic('#color', function(color) {
//				$(".avatarMessage").css('color', color);
//				$colorDiv.hide();
//			});
//			$colorDivBorder.farbtastic('#colorborder', function() {
//				$(".avatarMessage").css('border-color', color);
//				$colorDivBorder.hide();
//			});
//			$colorDivBg.farbtastic('#colorbbg', function() {
//				$(".avatarMessage").css('background-color', color);
//				$colorDivBg.hide();
//			});
			
			$pop.data('avatarPopup', true);
		}
		$pop.fadeIn('fast');
	});
	
	
	oApplication.on('channelArrival', function(data) {
		var sUserName = oApplication.getUserName();
//		if (data.u == oApplication.getUserName()) {
//			oView.openTab(data.c);
//		}
//		oView.userArrival(data.u, data.c);
	});
});
