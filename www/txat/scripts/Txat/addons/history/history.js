$(window).on('txat.start', function(oEvent, oApplication, oView) {
   var NS = 'history';
   var TAG_START = '{{' + NS + ' ';
   var TAG_END = '}}';

   var KEY_UP = 38;
   var KEY_DOWN = 40;

   var oInput = $("#input");

   var oHistoryManager = new History.Manager();

   oInput.on('keyup', function(oEvent) {
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
      console.log(data);
      var $item = $(data.o);
      var $usermessage = $('span.usermessage', $item);
      if ($usermessage.length > 0) {
         var sContent = $usermessage.text();
         
      }
   });

   // créer une nouvelle commande /code
   oApplication.defineCommand('history', function() {
      var $pop = oView.getPopup('historyPopup', 'History not yet!');
      if (!$pop.data('history')) { // pour ne pas refaire deux fois le même
         // code
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
O2.createClass('History.Manager', {

   _history : [],
   _current : 0,

   __construct : function() {
      // storing
      var sHistory = localStorage.getItem('history');
      if (sHistory == null) {
         localStorage.setItem('history', JSON.stringify(this._history));
      } else {
         this._history = JSON.parse(sHistory);
      }
   },

   getPrevMessage : function() {
      console.log(this._history);
      if (this._current in this._history) {
         var msg = this._history[this._current];
         this._current++;
         return msg;
      } else {
         return false;
      }
   },

   getNextMessage : function() {
      if (this._current in this._history) {
         var msg = this._history[this._current];
         this._current--;
         return msg;
      } else {
         return false;
      }
   },

   saveMessage : function(msg) {
      this._history.unshift(msg);
      localStorage.setItem('history', JSON.stringify(this._history));
      this._current = 0;
   }

});
