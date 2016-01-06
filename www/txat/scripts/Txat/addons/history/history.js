$(window).on('txat.start', function(oEvent, oApplication, oView) {
   var NS = 'history';
   var TAG_START = '{{' + NS + ' ';
   var TAG_END = '}}';

   var KEY_UP = 38;
   var KEY_DOWN = 40;
//   var KEY_SLASH = 16;
//   var KEY_ENTER = 13;

   //la zone de saisie
   var oInput = $("#input");

   //notre gestionnaire d'historique
   var oHistoryManager = new History.Manager();
   
   //définition du man
   oApplication.on('help', function(oCtx) {
      oCtx.history = 'pour définir le nombre de messages à conserver';
   });

   oInput.on('keyup', function(oEvent) {
//      console.log(oEvent.which);
      if (oInput.is(':focus')) {
         switch (oEvent.which) {
            case KEY_UP:
               var msg = oHistoryManager.getPrevMessage();
               if (msg !== false) {
                  oInput.val(msg);
               }
            break;
            case KEY_DOWN:
               var msg = oHistoryManager.getNextMessage();
               if (msg !== false) {
                  oInput.val(msg);
               }
            break;
            default:
            break;
         }
      }
   });

   oView.on('chatItemAppended', function(data) {
      var $item = $(data.o);
      var $usermessage = $('span.usermessage', $item);
      if ($usermessage.length > 0) {
         var sContent = $usermessage.text();
         if(data.history.user == oApplication.getUserName()) {
            oHistoryManager.saveMessage(sContent);
         }
      }
   });
   
   //si command
   oApplication.on('command', function(oContext) {
      var cmd = oContext.c;
      var param = oContext.p;
      if(cmd != 'say') {
         var saveMsg = "/" + cmd;
         if(param && param != "undefined") {
               saveMsg += " " + param;
         }
         oHistoryManager.saveMessage(saveMsg);
      }
   } );

   // créer une nouvelle commande /code
   oApplication.defineCommand('history', function() {
      var $pop = oView.getPopup('historyPopup', 'Rappel de commandes!');
      if (!$pop.data('history')) { // pour ne pas refaire deux fois le même
         // code
         $pop.addClass('p640')
         var $popcont = $('div.content', $pop);
         $popcont.html(
               '<p>taille de l\'historique</p>'
               +'<input type=\'text\' name="sizeHistory"/>'
               +'<br/>'
               +'<button type="button">enregistrer</button>');
         var $size = $("input", $popcont);
         $size.val(oHistoryManager.getSize());
         var $button = $('button', $popcont);
         $button.on('click', function(oEvent) {
            var size = $size.val();
            oHistoryManager.setSize(size);
            oInput.focus();
            $pop.fadeOut('fast');
         });
         $pop.data('history', true);
      }
      $pop.fadeIn('fast');
   });
});
O2.createClass('History.Manager', {

   _history : [],
   _current : 0,
   _size: 20,

   __construct : function() {
      // storing
      var sHistory = localStorage.getItem('history_msg');
      if (sHistory == null) {
         localStorage.setItem('history_msg', JSON.stringify(this._history));
         localStorage.setItem('history_size', this._size);
      } else {
         this._history = JSON.parse(sHistory);
         this._size = localStorage.getItem('history_size');
      }
   },

   getPrevMessage : function() {
      if (this._current in this._history) {
         var msg = this._history[this._current];
         this._current++;
         return msg;
      } else {
         this._current = 0;
         return false;
      }
   },

   getNextMessage : function() {
      this._current--;
      if (this._current in this._history) {
         var msg = this._history[this._current];
         return msg;
      } else {
         this._current = this._history.length - 1;
         return false;
      }
   },

   /**
    * Enregistre les messages persos
    * @params string msg message
    * @return void
    */
   saveMessage : function(msg) {
      //on place le message au début
      this._history.unshift(msg);
      //on supprime les éléments supérieurs à la limite définie
      this._history.splice(this._size, this._history.length - this._size);
      localStorage.setItem('history_msg', JSON.stringify(this._history));
      this._current = 0;
   },
   
   getSize: function() {
      return this._size;
   },
   
   setSize:function(size) {
      this._size = size;
      localStorage.setItem('history_size', this._size);
   }

});
