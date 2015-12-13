$(window).on('txat.start', function(oEvent, oApplication, oView) {
        
    var sSoundStatus = 'activé'; 
	var $playSound = document.querySelector('#playSound');	
	
	addSoundBody("default.mp3");
	  
	function addSoundBody($file) {		
		$('body').append('<audio id="playSound" src="scripts/Txat/addons/sound/sons/' + $file + '"></audio>');
	}	
	
	function updateSoundBody($file) {
		$('#playSound').attr('src', 'scripts/Txat/addons/sound/sons/' + $file);		
	}
			
		
	// Création de la commande /sound avec des paramètres
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
            
           switch (data) {
                case 'on':
                    sSoundStatus = 'activé'; 
                    oView.appendChatItem(null, 'Le son est '+ sSoundStatus, jsonStyle);
					playSound.play(); 
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
					playSound.play(); 
				break;
				case 'mario':
					oView.appendChatItem(null, 'Activation de Mario !', jsonStyle);
					updateSoundBody("saut.wav");
					playSound.play(); 
				break;
				case 'gameover':
					oView.appendChatItem(null, 'Game-Over !', jsonStyle);
					updateSoundBody("game-over.wav");
					playSound.play();
					setTimeout(function(){ 						
						oView.appendChatItem(null, 'Activation de Mario !', jsonStyle);
						updateSoundBody("saut.wav");
						playSound.play();						
					}, 3500);
				break;
                default:
                    oView.appendChatItem(null, 'Commande /sound [option]{on,off,status,test}', jsonStyle);
                break;
           }              
	});     
          
	// Intercepte le message pour lancer le son
	oApplication.on('chatMessage', function(data) { 
		if (data.u != oApplication.sMe && sSoundStatus === 'activé') {           
			playSound.play();      
		}                  
	});    

	
              
});
