$(window).on('txat.start', function(oEvent, oApplication, oView) {
	var PATH_IMAGES = "/txat/scripts/Txat/addons/avatar/images/avatar/";
	var PATH_DEFAULT = "/txat/scripts/Txat/addons/avatar/images/128_default/";
	var TAG_START = '{{avatar ';
	var TAG_END = '}}';
//	var $textarea; // dans lequel sera collé le code source
	
	oView.on('chatItemAppended', function(data) {
//		console.log("chatitem", data);
		var $item = $(data.o);
		$item.addClass('avatarMessage');
		var $username = $('span.username', $item);
		var $usermessage = $('span.usermessage', $item);
		if ($usermessage.length > 0) {
			//var usernick = $('span.username', $item).html().replace(':', '');
			//$item.append("<br/>");
			var $img = $('<img/>');
			$img.attr('src', data.avatar.image);
			$img.addClass('avatarItem');
			$username.before($img);
			
			$item.css({
				color: data.avatar.color,
				backgroundColor: data.avatar.bg,
				borderColor:data.avatar.border
			});
			oPrefs = data.avatar;
//			console.log($usermessage.val(),CHANGING_MSG,$username.val() ,oApplication.getUserName());
//			if($usermessage.val() == CHANGING_MSG && $username.val() == oApplication.getName()) {
//				avatarPopup();
//			}
		}
	});

	// créer une nouvelle commande /code
	oApplication.defineCommand('avatar', function() {
			avatarPopup();
	});
	
	
	oApplication.on('channelArrival', function(data) {
//		console.log(data);
	});
	
	var avatarPopup = function() {
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
			
			
			var $example = $('<div class="message avatarMessage avatarExample">'
				+ '<img src="/txat/scripts/Txat/addons/avatar/images/128_default/default.png" class="avatarItem yourchoice">'
				+'<span class="nick">'+ oApplication.getUserName() + ':</span>'
				+'<span class="usermessage">your message</span><br></div>'
				+'<input id="color" type="color" title="text color"/>'
				+'<input id="colorborder" type="color" title="border color"/>'
				+'<input id="colorbg" type="color" title="background color"/>'
				);
			
			$popcont.append($example);
			
			var $avatarmessage = $("div.avatarExample");
			
			//textcolor
			var $colorTextInput = $("#color", $pop).val(oPrefs.color);
			
			//bordercolor
			var $colorBorderInput = $("#colorborder", $pop).val(oPrefs.border);
			//bordercolor
			var $colorBgInput = $("#colorbg", $pop).val(oPrefs.bg);
			//image
			var $imgAvatar = $("img.avatarItem", $example).attr("src", oPrefs.image);
			
			var $ok = $("<button>").html("ok");
			$popcont.append($ok);
			//event on choice list
			$("img.choice").on('click', function() {
				$('img.yourchoice').attr('src', $(this).attr('src'));
			});
			//event on validation
			$ok.on('click', function(oEvent) {
				oApplication.command('/upref avatarBorder ' + $colorBorderInput.val());
				oApplication.command('/upref avatarBg ' + $colorBgInput.val());
				oApplication.command('/upref avatarColor ' + $colorTextInput.val());
				oApplication.command('/upref avatarImage ' + $('img.yourchoice', $pop).attr('src'));
				$pop.fadeOut('fast');
			});
			//event on color
			$colorTextInput.on('input', function(oEvent) {
				$avatarmessage.css('color', $(oEvent.target).val());
			});
			$colorBorderInput.on('input', function(oEvent) {
				$avatarmessage.css('border-color', $(oEvent.target).val());
			});
			$colorBgInput.on('input', function(oEvent) {
				$avatarmessage.css('background-color', $(oEvent.target).val());
			});
			
			$pop.data('avatarPopup', true);
		}
		$pop.fadeIn('fast');
	}
});
