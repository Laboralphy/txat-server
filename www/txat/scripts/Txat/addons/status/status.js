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
		console.log();
		left = oMenu.outerWidth() * 2 + e.pageX < e.screenX ? e.pageX : e.pageX - oMenu.outerWidth();
		oMenu.css({top:e.pageY,left:left});
		oMenu.click(function(){ $(this).remove(); });
	} else {
		console.log('Un objet event est requis pour utiliser cette fonction !');
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
				$('.user[name="'+key+'"]','#userZone').removeClass().addClass('user '+ value);
				STATUS[key] = value;
			});
			$item.remove();
		}
		
		// Formatage des utilisateurs
		var userList = [];
		$('.user','#userZone').each(function() {
			userList.push($(this).text());
		});
		console.log(userList);
		regex = new RegExp('\\b'+userList.join('|')+'\\b', 'gi');
		message = message.replace(regex,function upper(st) {
			return '<span class="u">'+st+'</span>';
		});
		$usermessage.html(message);
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
	$('#userZone').on("DOMSubtreeModified", function() {
		$('.user:not([name])',this).each(function() {
			$(this).attr('name',$(this).text());
		});
	});
	$(document).on("contextmenu",'#userZone .user',function(e){
		var $item = $(this);
		var $username = $item.text();
		if ($username == oApplication.getUserName()) {
			createContextMenu({'title':'status','class':'status','list':STATUSDISPO},e);
		} else {
			curuser = $(this).text();
			createContextMenu({'title':'Admini','class':'admin','list':CDTADMIN},e);
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
