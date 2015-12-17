$(window).on('txat.start', function(oEvent, oApplication, oView) {
   var NS = 'history';
   var TAG_START = '{{' + NS + ' ';
   var TAG_END = '}}';
   
   
   var oInput = $("#input");
   
   oView.on('keyup', function(oEvent) {
      if(oInput.is(':focus')) {
         alert('ok');
      }
   });
   oInput.on('keyup', function(oEvent) {
      if(oInput.is(':focus')) {
         alert('ok');
      }
   });
   
   oView.on('chatItemAppended', function(data) {
      var $item = $(data.o);
      var $usermessage = $('span.usermessage', $item);
      if ($usermessage.length > 0) {
         var sContent = $usermessage.text();
      }
   });
   
   // créer une nouvelle commande /code
   oApplication.defineCommand('history', function() {
      var $pop = oView.getPopup('historyPopup', 'History not yet!');
      if (!$pop.data('history')) { // pour ne pas refaire deux fois le même code
         $pop.addClass('p640')
         var $popcont = $('div.content', $pop); 
         $popcont.html('<textarea style="resize: none; font-size: 80%; width: calc(100% - 4px); height: 300px"></textarea><hr/><button type="button">Ok</button>');
         $textarea = $('textarea', $popcont);
         var $button = $('button', $popcont);
         $button.on('click', function(oEvent) {
            oApplication.cmd_say(TAG_START + JSON.stringify($textarea.val()) + TAG_END);
            $pop.fadeOut('fast');
         });

         $pop.data('history', true);
      }
      $pop.fadeIn('fast');
   });
});
