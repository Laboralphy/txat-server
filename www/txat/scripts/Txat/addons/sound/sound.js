$(window).on('txat.start', function(oEvent, oApplication, oView) {
      
	// Constantes pour l'addon_sound
	var ID_PLAY_SOUND = 'playSound';
	var ID_PLAY_SOUND_OTHER = 'other';
	var URL_SOUND = 'scripts/Txat/addons/sound/sons/';
	var SOUND_DEFAULT = 'default.mp3';
	
	// Array contenant toutes les valeurs possibles
	var SOUND_SETTINGS = {
		'newMessage' 	: { 'label' : 'Nouveau message'		, 'val' : true	, 'sound' : SOUND_DEFAULT},
		'userArrival' 	: { 'label' : 'Son d\'arrivée'		, 'val' : true  , 'sound' : 'saut.mp3'},
		'emote'			: { 'label' : 'Emotes'				, 'val' : true}
	};
	var SOUND_LISTING = ['allomcfly.mp3','atable.wav','default.mp3','game-over.wav','nomdezeus3.mp3','saut.wav','star-wars.mp3','un_petit_coup.mp3','wizz.mp3'];
	// Récupère le son personnalisé de l'utilisateur
	var soundPerso = localStorage.getItem('txat_sound') && localStorage.getItem('txat_sound').charAt(0) == '{'?JSON.parse(localStorage.getItem('txat_sound')):SOUND_SETTINGS;
	
	// Active le son par défaut
    var sSoundStatus = 'activé'; 
	
	function _init() {
		// Lance la fonction qui génère la balise audio pour le son par défaut
		addSoundBody(soundPerso.newMessage.sound, ID_PLAY_SOUND);
		// Lance la fonction qui génère la balise audio pour gameover
		addSoundBody("game-over.wav", ID_PLAY_SOUND_OTHER);
		var otherplayer = document.querySelector('#' + ID_PLAY_SOUND_OTHER);
		$('#chatWindow .chat .input').parent('td').after('<td><button class="otherController">►</button></td>');
		otherplayer.addEventListener('play',function() {
			$('.otherController').text("█ █")
		});
		otherplayer.addEventListener('pause',function() {
			$('.otherController').text(" ► ")
		});
		$(document).on('click','.otherController',function() {
			if (otherplayer.paused) {
				otherplayer.play();
			} else {
				otherplayer.pause();
			}
		});
		// Ajout le bouton son au document
		$soundButton = $('<button>').html('&#9835;').addClass('soundMenu').on('click', function(oEvent) {
			oApplication.command('/sound');
		});
		$('#requestList').before($soundButton);
	}
	_init();


	
	/** 
	 * Fonction qui permet d'ajouter la balise audio à la fin du body
	 * 
	 * @param string file : fichier de l'audio
	 * @param string idSound : nom de l'attribut id
	 * @param string urlSound : url du fichier audio
	 */
	function addSoundBody(file, idSound) {
		file = typeof file !== 'undefined' ? file : SOUND_DEFAULT; 
		file = file.substring(0,4) == 'http' ? file : URL_SOUND + file;
		idSound = typeof idSound !== 'undefined' ? idSound : ID_PLAY_SOUND;
		$('body').append('<audio id="' + idSound + '" src="' + file + '"></audio>');
	}	
	
	/** 
	 * Fonction qui permet la mise à jour de la balise audio 
	 * 
	 * @param string file : fichier de l'audio
	 * @param string urlSound : url du fichier audio
	 */
	function updateSoundBody(file, idSound) {
		file = file.substring(0,4) == 'http' ? file : URL_SOUND + file;
		idSound = typeof idSound !== 'undefined' ? idSound : ID_PLAY_SOUND;	
		$('#' + idSound).attr('src', file);		
	}
	
	/** 
	 * Fonction qui permet la lecture de la balise audio 
	 * 
	 * @param string idSound : nom de l'attribut id de la balise à lire
	 */	
	function playSound(idSound) {
		idSound = typeof idSound !== 'undefined' ? idSound : ID_PLAY_SOUND;
		document.querySelector('#' + idSound).play();
	}
	
	/** 
	 * Fonction qui stoppe la lecture de la balise audio 
	 * 
	 * @param string idSound : nom de l'attribut id de la balise à lire
	 */	
	function stopSound(idSound) {
		idSound = typeof idSound !== 'undefined' ? idSound : ID_PLAY_SOUND;
		document.querySelector('#' + idSound).pause();
	}

	/* ********************************************************** *
	 * Création de la commande /sound avec gestions des options : *
	 *                                                            *
	 * 			on / off  : Active ou désactive le son            *
	 *			test      : Permet de tester le son               *
	 *			add       : Permet d'ajouter un son personnalisé  *
	 *			mario     : Active le son mario                   *
	 *			gameover  : Lance un gameover                     *
     *                                                            *
	 * 		(Par défaut : liste les commandes disponibles)        *
	 * ********************************************************** */
	oApplication.defineCommand('sound', function(data) {
		var aData = [];
		if(typeof data !== 'undefined') {
			aData = data.split(" ");
		}
		if (aData[0] == 'play') {
			updateSoundBody("", ID_PLAY_SOUND_OTHER,aData[1]);
			playSound(ID_PLAY_SOUND_OTHER);
		} else {
			soundPopup();
		}
	});
	var soundPopup = function() {
		var $pop = oView.getPopup('soundPopup', 'Sound settings');
		var $popcont = $('div.content', $pop);
		if ($popcont.html() == "") {
		   $pop.addClass('p640');
		   var $popcont = $('div.content', $pop);
		   // Choix des sons actifs
		   $activeSound = $('<div>').addClass('activeSound');
		   $soundprofile = $('<div>').addClass('soundProfile');
		   $popcont.append('<h3>Active sound</h3>').append($activeSound);
		   $popcont.append('<h3>Sound profile</h3>').append($soundprofile);
		   $.each(soundPerso, function( index, value ) {
				$activeSound.append('<div><label><input type="checkbox" name="'+ index +'.val" '+ ( value.val ? 'checked':'') +' /> '+ SOUND_SETTINGS[index].label +'</label></div>');
				if (index != 'emote') {
					$soundprofile.append('<div><label>'+ SOUND_SETTINGS[index].label +'</label><input type="text" placeholder="url ou fichier" name="'+ index +'.sound" value="'+ (value.sound ? value.sound:'') +'" list="urllist" /><button class="otherController">►</button></div>');
				}
			});
			var datalist = '<datalist id="urllist">';
			$.each(SOUND_LISTING,function(index, value) {
			   datalist += '<option value="'+value+'">'
		   });
		   $soundprofile.append(datalist+'</datalist>');
		   var $ok = $("<button>").html("save").addClass('submitPopup');
		   $popcont.append($ok);
		   // event on validation
		   $ok.on('click', function(oEvent) {
			   $('input','.soundPopup').each(function () {
				   values = $(this).attr('name').split('.');
				   if ($(this).is('[type="checkbox"]')) {
						if ($(this).prop('checked')) {
							val = true;
						} else {
							val = false;
						}
					} else {
						val = $(this).val();
					}
				   if (soundPerso[values[0]][values[1]] != val) {
						soundPerso[values[0]][values[1]] = val;
						if (values[1] == 'sound') {
							updateSoundBody(val, ID_PLAY_SOUND, "");
						}
					}
			   });
				localStorage.setItem("txat_sound", JSON.stringify(soundPerso));
				$pop.fadeOut('fast');
		   });
		   $('button',$soundprofile).click(function() {
				url = $(this).prev('input').val();
				updateSoundBody(url, ID_PLAY_SOUND_OTHER);
			});
		}
		$pop.fadeIn('fast');
	 }

	
	/**
	 * Animation : Secoue l'élément HTML spécifié
	 * @param oObject élément du DOM à secouer
	 * @param nAmp amplitude en pixels
	 * @param fPuls vitesse 
	 * @param fDim Amortissement de la pulsation (1 = pas d'amorti);
	 */
	function wizz(oObject, nAmp, fPuls, fDim) {
		var oTimer;
		var nTimer = 0;
		fDim = Math.min(0.99, Math.max(0, fDim));

		function littleAnimation() {
			var x = nAmp * Math.sin(fPuls * nTimer);
			nAmp = (fDim * nAmp) | 0;
			oObject.style.transform = 'translateX(' + x.toString() + 'px)';
			++nTimer;
			if (nAmp === 0) {
				clearInterval(oTimer);
				oObject.style.transform = '';
			}
		}
		oTimer = setInterval(littleAnimation, 32);
		oObject.parentNode.style.overflow = 'hidden';
	}
          
	oView.on('chatItemAppended', function(data) {
		var $item = $(data.o);
		var $username = $('span.username', $item).text();
		var $usermessage = $('span.usermessage', $item);
		var message = $usermessage.text();
		$start = message.split(' ');
		if (soundPerso.emote.val) {
			var audio;
			switch (message) {
				case '!gameover':
					audio = "game-over.wav";
					$('body').fadeOut(100).fadeIn(100).fadeOut(500).fadeIn(500).fadeOut(900).fadeIn(900);
					break;
				case '!starwars':
					audio = "star-wars.mp3";
					$usermessage.html('<img src="https://media.giphy.com/media/8IZCR0wzEIQms/giphy.gif" alt="Starwars"/>');
					break;
				case '!stormtrooper':
					audio = "star-wars.mp3";
					$usermessage.html('<img src="https://media.giphy.com/media/3oxRmDffqOn2kDWMxy/giphy.gif" alt="Starwars"/>');
					break;
				case '!atable':
					audio = "atable.wav";
					$usermessage.html('<img src="http://static.mmzstatic.com/wp-content/uploads/2013/06/fail.gif" alt="A table !"/>');
					break;
				case '!apero':
					audio = "un_petit_coup.mp3";
					$usermessage.html('<img src="http://leblog.info/wp-content/uploads/2014/03/Biere-Femme-6.gif" alt="Binouze !"/>');
					break;
				case '!allo':
					audio = "allomcfly.mp3";
					$usermessage.html('<img src="http://lebuzz.eurosport.fr/wp-content/uploads/sites/3/2015/10/tumblr_mov8hm3V181qkwwklo1_500.gif" alt="Allo"/>');
					break;
				case '!nomdezeus':
					audio = "nomdezeus3.mp3";
					$usermessage.html('<img src="http://blog-cinefute.com/wp-content/uploads/2015/10/giphy3.gif" alt="Nom de zeus"/>');
					break;
				case '!gendarmerie':
					audio = "http://lasonotheque.org/telecharger.php?format=mp3&id=0886&button=GO%3E";
					$usermessage.html('<img src="http://i.skyrock.net/5557/78675557/pics/3098856709_1_3_Zq8poiCg.gif" alt="Gendarmerie !"/>');
					break;
				case 'wizz':
					audio = "wizz.mp3";
					wizz(document.body, 16, 2, 0.95);
					break;
				}
				if (audio) {
					$('img',$usermessage).on('load',function() {
						oView.scrollDown();
					});
					updateSoundBody(audio, ID_PLAY_SOUND_OTHER);
					playSound(ID_PLAY_SOUND_OTHER);
					setTimeout(function(){
						$usermessage.text(message);
						stopSound(ID_PLAY_SOUND_OTHER);
					}, 6000);
				}
		}
		if (!audio) {
			switch($start[0]) {
				case "!play":
					$usermessage.html('Lecture du son : <audio controls '+ (soundPerso.emote.val?'autoplay':'') +'><source src="'+$start[1]+'" type="audio/mpeg">Your browser does not support the audio element.</audio> (<a href="'+$start[1]+'">'+$start[1]+'</a>)');
					break;
				case "!arrival":
					$item.remove();
					if ($start[1] && soundPerso.userArrival.val) {
						updateSoundBody($start[1], ID_PLAY_SOUND_OTHER);		   
						playSound(ID_PLAY_SOUND_OTHER);
					}
					break;
				default:
					if (soundPerso.newMessage.val) playSound();
					break;
			}
		}
	});
	oApplication.on('channelArrival', function(data) {
		 // Lance le son lors de l'arrivée du client
		if (data.u == oApplication.getUserName() && soundPerso.userArrival.sound) {
			oApplication.command('/say !arrival '+ soundPerso.userArrival.sound);
		};
	});
});
