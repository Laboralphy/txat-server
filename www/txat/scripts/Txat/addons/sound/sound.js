$(window).on('txat.start', function(oEvent, oApplication, oView) {
      
	// Constantes pour l'addon_sound
	var ID_PLAY_SOUND = 'playSound';
	var ID_PLAY_SOUND_GAMEOVER = 'gameover';
	var URL_SOUND = 'scripts/Txat/addons/sound/sons/';
	var SOUND_DEFAULT = 'default.mp3';
		
	// Active le son par défaut	
    var sSoundStatus = 'activé'; 	
	
	// Lance la fonction qui génère la balise audio 
	addSoundBody();
	  
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
	function updateSoundBody(file, urlSound) {		
		urlSound = typeof urlSound !== 'undefined' ? urlSound : URL_SOUND;			
		$('#' + ID_PLAY_SOUND).attr('src', urlSound + file);		
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
		// Création du tableau pour les options de la commande
		var aData = [];
		
		// Génère le tableau d'options
		if(typeof data !== 'undefined') {
			var aData = data.split(" ");
		}
		// Exécute l'action demandé en fonction des options
		switch (aData[0]) {
			case 'on':
				sSoundStatus = 'activé'; 
				oView.appendChatItem(null, 'Le son est '+ sSoundStatus, jsonStyle);
				playSound();
			break;
			case 'off':
				sSoundStatus = 'désactivé'; 
				oView.appendChatItem(null, 'Le son est '+ sSoundStatus, jsonStyle);
			break;    
			case 'status':
				oView.appendChatItem(null, 'Le son est '+ sSoundStatus, jsonStyle);
			break;     
			case 'test':
				oView.appendChatItem(null, 'Son testé !', jsonStyle);
				playSound();
			break;
			case 'mario':
				oView.appendChatItem(null, 'Activation de Mario !', jsonStyle);
				updateSoundBody("saut.wav");
				document.querySelector('#' + ID_PLAY_SOUND).play(); 
			break;
			case 'add':
				if (typeof aData[1] === 'undefined') {
					oView.appendChatItem(null, 'Paramètre manquant : url !', jsonStyle);
				} else {
					oView.appendChatItem(null, 'Activation du son personnalisé', jsonStyle);					
					updateSoundBody(aData[1].replace(/'/g, ""), "");
					playSound();
				}							
			break;
			case 'gameover':
				oView.appendChatItem(null, 'Game-Over !', jsonStyle);					
				addSoundBody("game-over.wav", ID_PLAY_SOUND_GAMEOVER);
				playSound(ID_PLAY_SOUND_GAMEOVER);				
			break;
			default:			
				oView.appendChatItem(null, 'Commande /sound [option]{on,off,status,test,add \'url\'}', jsonStyle);
			break;
		}              
	});     
          
	// Intercepte le message pour lancer le son
	oApplication.on('chatMessage', function(data) { 
		if (data.u != oApplication.sMe && sSoundStatus === 'activé') {           
			playSound();     
		}                  
	});                 
});
