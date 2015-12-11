$(window).on('txat.start', function(oEvent, oApplication, oView) {
        
        var sSoundStatus = 'activé';        
        
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
                                'min-height'         : '0'
                             };
            
           switch (data) {
                case 'on':
                    sSoundStatus = 'activé'; 
                    oView.appendChatItem(null, 'Le son est '+ sSoundStatus, jsonStyle);
                break;
                case 'off':
                    sSoundStatus = 'désactivé'; 
                    oView.appendChatItem(null, 'Le son est '+ sSoundStatus, jsonStyle);
                break;    
                case 'status':
                    oView.appendChatItem(null, 'Le son est '+ sSoundStatus, jsonStyle);
                break;                
                default:
                    oView.appendChatItem(null, 'Paramètre inconnu !', jsonStyle);
                break;
           }              
	});     
          
        // Intercepte le message pour lancer le son
        oApplication.on('chatMessage', function(data) {   

            if (data.u != oApplication.sMe) { 

                if (sSoundStatus === 'activé') {                            
                    if (!$('#player')[0]) { 
                            $('body').append('<audio id="player" src="scripts/Txat/addons/sound/sons/default.mp3"></audio>'); 
                    } 
                    document.querySelector('#player').play(); 
                }
            }                  
        });     
              
});
