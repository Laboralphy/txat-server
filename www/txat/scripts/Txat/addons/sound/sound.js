$(window).on('txat.start', function(oEvent, oApplication, oView) {
      
	// Constantes pour l'addon_sound
	var ID_PLAY_SOUND = 'playSound';
	var ID_PLAY_SOUND_OTHER = 'other';
	var URL_SOUND = 'scripts/Txat/addons/sound/sons/';
	var SOUND_DEFAULT = 'default.mp3';
	
	// Array contenant toutes les valeurs possibles
	var SOUND_SETTINGS = {
		'newMessage' 	: { 'label' : 'Nouveau message'		, 'val' : true	, 'sound' : SOUND_DEFAULT},
		'userArrival' 	: { 'label' : 'Nouvel utilisateur'	, 'val' : true},
		'emote'			: { 'label' : 'Emotes'				, 'val' : true}
	};
	
	// Récupère le son personnalisé de l'utilisateur
	var soundPerso = localStorage.getItem('txat_sound') && localStorage.getItem('txat_sound').charAt(0) == '{'?JSON.parse(localStorage.getItem('txat_sound')):SOUND_SETTINGS;
	
	// Active le son par défaut
    var sSoundStatus = 'activé'; 
	
	function _init() {
		// Lance la fonction qui génère la balise audio pour le son par défaut
		addSoundBody(soundPerso.newMessage.sound, ID_PLAY_SOUND, "");
		// Lance la fonction qui génère la balise audio pour gameover
		addSoundBody("game-over.wav", ID_PLAY_SOUND_OTHER);
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
	function addSoundBody(file, idSound, urlSound) {	
		file = typeof file !== 'undefined' ? file : SOUND_DEFAULT;	
		idSound = typeof idSound !== 'undefined' ? idSound : ID_PLAY_SOUND;	
		urlSound = typeof urlSound !== 'undefined' ? urlSound : URL_SOUND;			
		$('body').append('<audio id="' + idSound + '" src="' + urlSound + file + '"></audio>');
	}	
	
	/** 
	 * Fonction qui permet la mise à jour de la balise audio 
	 * 
	 * @param string file : fichier de l'audio
	 * @param string urlSound : url du fichier audio
	 */
	function updateSoundBody(file, idSound, urlSound) {		
		urlSound = typeof urlSound !== 'undefined' ? urlSound : URL_SOUND;	
		idSound = typeof idSound !== 'undefined' ? idSound : ID_PLAY_SOUND;			
		$('#' + idSound).attr('src', urlSound + file);		
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
				$activeSound.append('<div><label><input type="checkbox" name="'+ index +'.val" '+ ( value.val ? 'checked':'') +' /> '+value.label +'</label></div>');
				if (index != 'emote' && index != 'userArrival') {
					$soundprofile.append('<div><label>'+ value.label +'</label><input type="url" placeholder="url" name="'+ index +'.sound" value="'+ (value.sound ? value.sound:'') +'" /></div>');
				}
			});
			
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
		if ($start[0] == "!play") {
			$usermessage.text('Lecture du son :'+$start[1]);
			updateSoundBody("", ID_PLAY_SOUND_OTHER,$start[1]);		   
			playSound(ID_PLAY_SOUND_OTHER);
		}
		if (soundPerso.emote.val) {
			if (message == '!gameover') {
				updateSoundBody("game-over.wav", ID_PLAY_SOUND_OTHER);
				$('body').fadeOut(100).fadeIn(100).fadeOut(500).fadeIn(500).fadeOut(900).fadeIn(900);
				playSound(ID_PLAY_SOUND_OTHER);
			}else if(message == '!starwars') {
				$usermessage.html('<img src="https://media.giphy.com/media/8IZCR0wzEIQms/giphy.gif" alt="Starwars"/>');
				updateSoundBody("star-wars.mp3", ID_PLAY_SOUND_OTHER);
				playSound(ID_PLAY_SOUND_OTHER);
			}else if(message == '!stormtrooper') {
				$usermessage.html('<img src="https://media.giphy.com/media/3oxRmDffqOn2kDWMxy/giphy.gif" alt="Starwars"/>');
				updateSoundBody("star-wars.mp3", ID_PLAY_SOUND_OTHER);
				playSound(ID_PLAY_SOUND_OTHER);
			}else if(message == '!atable') {
				$usermessage.html('<img src="http://static.mmzstatic.com/wp-content/uploads/2013/06/fail.gif" alt="A table !"/>');
				updateSoundBody("atable.wav", ID_PLAY_SOUND_OTHER);		   
				playSound(ID_PLAY_SOUND_OTHER);
			}else if(message == '!apero') {
				$usermessage.html('<img src="http://leblog.info/wp-content/uploads/2014/03/Biere-Femme-6.gif" alt="Binouze !"/>');
				updateSoundBody("un_petit_coup.mp3", ID_PLAY_SOUND_OTHER);		   
				playSound(ID_PLAY_SOUND_OTHER);	
			}else if(message == '!allo') {
				$usermessage.html('<img src="http://lebuzz.eurosport.fr/wp-content/uploads/sites/3/2015/10/tumblr_mov8hm3V181qkwwklo1_500.gif" alt="Allo"/>');
				updateSoundBody("allomcfly.mp3", ID_PLAY_SOUND_OTHER);		   
				playSound(ID_PLAY_SOUND_OTHER);	
			}else if(message == '!nomdezeus') {
				$usermessage.html('<img src="http://blog-cinefute.com/wp-content/uploads/2015/10/giphy3.gif" alt="Nom de zeus"/>');
				updateSoundBody("nomdezeus3.mp3", ID_PLAY_SOUND_OTHER);		   
				playSound(ID_PLAY_SOUND_OTHER);		
			}else if (message == 'wizz') {
				updateSoundBody("wizz.mp3", ID_PLAY_SOUND_OTHER);
				wizz(document.body, 16, 2, 0.95);
				playSound(ID_PLAY_SOUND_OTHER);
			}
			setTimeout(function(){ $usermessage.text(message); }, 5000);
		}
		if ($username != oApplication.sMe && soundPerso.newMessage.val) {
			playSound();
		}
		if (message == '!arrival') {
			$item.remove();
			if (data.avatar.enterSound && soundPerso.userArrival.val) {
				updateSoundBody("", ID_PLAY_SOUND_OTHER,data.avatar.enterSound);		   
				playSound(ID_PLAY_SOUND_OTHER);
			}
		}
	});
		
});
