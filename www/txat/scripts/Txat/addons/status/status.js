function createContextMenu(options,e) {
	if(e) {
		var oMenu = $('<div class="contextMenu">');
		var oListMenu = $('<ul>');
		
		if (options.title) oMenu.append('<strong>'+ options.title +'</strong>');
		if (options.class) oMenu.addClass(options.class);
		$.each(options.list, function(key, value) {
			oListMenu.append('<li class="'+ key +'">'+ value +'</li>');
		});
		oMenu.append(oListMenu);
		$('body').append(oMenu);
		left = oMenu.outerWidth() * 2 + e.pageX < $(document).outerWidth() ? e.pageX : e.pageX - oMenu.outerWidth();
		oMenu.css({top:e.pageY,left:left});
		oMenu.click(function(){ $(this).remove(); });
	} else {
		console.log('Un objet event est requis pour utiliser createContextMenu() !');
	}
}
$(document).on('mousedown',function(e){
	if (!$(e.target).parents('.contextMenu')[0]) {
		$('.contextMenu').remove();
	}
});

$(window).on('txat.start', function(oEvent, oApplication, oView) {
	var STATUS = {};
	var STATUSDISPO = {"online":"En ligne","busy":"Occupé","coffee":"Café !","beer":"Bière !"};
	
	var CDTADMIN = {"ban 1m kick 1 minute!":"Kicker (1m)","ban":"Bannir","promote":"Promouvoir","demote":"Déchoir"};
	var curuser;
	
	var jsonStyle =  {
			'font-style'         : 'italic', 
			'color'              : '#008', 
			'border'             : 'none', 
			'box-shadow'         : '0 0 0', 
			'-webkit-box-shadow' : '0 0 0', 
			'-o-box-shadow'      : '0 0 0',
			'padding'            : '10px',
			'min-height'         : '0',
			'height'             : '5px'
		 };	
	
	function updateStatus() {
		var listUser = $('.user','#userZone');
		listUser.each(function() {
			$(this).removeClass().addClass('user '+ STATUS[$(this).text()]);
		});
	}
	// Gestion des échanges de données
	oView.on('chatItemAppended', function(data) {
		var $item = $(data.o);
		var $username = $('span.username', $item).text();
		var $usermessage = $('span.usermessage', $item);
		var message = $usermessage.text();
		
		$start = message.split(' ');
		
		// Réception d'une liste de status
		if ($start[0] == "!status") {
			json = JSON.parse($start[1]);
			$.each(json, function(key, value) {
				STATUS[key] = value;
				message = key +' est maintenant ['+ STATUSDISPO[value] +']';
			});
			updateStatus();
			data.cancel = true;
			if (Object.keys(json).length == 1) oView.appendChatItem(data.t, message, jsonStyle);
		}
	});
	
	// Information du nouvel arrivant des status actuels
	oApplication.on('channelArrival', function(data) {
		if (data.u == oApplication.getUserName()) {
			oApplication.command('/say !status {"'+ data.u +'":"online"}');
		};
		var listUser = $('.user','#userZone');
		if (listUser.length > 1 && listUser.first().text() == oApplication.getUserName()) {
			oApplication.command('/say !status '+ JSON.stringify(STATUS));
		}
	});
	oView.on('tabChanged',function() { updateStatus(); });
	oApplication.on('channelDeparture',function() { updateStatus(); });

	$(document).on("contextmenu",'#userZone .user',function(e){
		var $item = $(this);
		var $username = $item.text();
		if ($username == oApplication.getUserName()) {
			createContextMenu({'title':'status','class':'status','list':STATUSDISPO},e);
		} else {
			curuser = $(this).text();
			createContextMenu({'title':'Admin','class':'admin','list':CDTADMIN},e);
		}
		e.preventDefault();
	});
	$(document).on('click','.status ul li',function() {
		oApplication.command('/say !status {"'+ oApplication.getUserName() +'":"'+ $(this).attr('class') +'"}');
	});
	$(document).on('click','.admin ul li',function() {
		classe = $(this).attr('class').split(' ');
		cmd = classe[0];
		classe.splice(0,1);
		param = classe.join(' ');
		oApplication.command('/'+ cmd +' '+ curuser +(param?' '+ param:''));
	});
});
//~ localStorage.setItem("txat_sound", JSON.stringify(soundPerso));
//~ JSON.parse(localStorage.getItem('txat_sound'));
