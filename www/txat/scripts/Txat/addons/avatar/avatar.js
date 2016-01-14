$(window).on(
      'txat.start',
      function(oEvent, oApplication, oView) {
         var PATH_IMAGES = "/txat/scripts/Txat/addons/avatar/images/avatars/";
         var PATH_DEFAULT = "/txat/scripts/Txat/addons/avatar/images/128_default/";
         var TAG_START = '{{avatar ';
         var TAG_END = '}}';

         var VERSION = 1;

         /**
          * Enregistre les prefs
          * 
          * @param string
          *           sParam
          * @param string
          *           sValue
          * @return mixed value if get param, object oConfig if no param, set
          *         value if value specified and return true
          */
         var _store = function(sParam, sValue) {
            var oConfig = JSON.parse(localStorage.getItem("avatar"));
            if (!sValue) {
               if (!sParam) {
                  return oConfig;
               }
               return oConfig[sParam];
            } else {
               oConfig[sParam] = sValue;
               _saveConfig(oConfig);
               return true;
            }
         };

         /**
          * sauvegarde de la config
          * 
          * @param object
          *           oConfig
          */
         var _saveConfig = function(oConfig) {
            localStorage.setItem("avatar", JSON.stringify(oConfig));
         };

         var _reset = function() {
            var oConfig = {
               image : 0,
               extension : "png",
               color : "#000000",
               bg : "#ffffff",
               border : "#000000",
               user : oApplication.getUserName(),
               version : VERSION
            };
            _saveConfig(oConfig);
         }

         /**
          * Initialize config
          */
         var _init = function() {
            var oConfig = _store();
            if (!oConfig || !('version' in oConfig)) {
               _reset();
            }
         }
         _init();

         oView.on('chatItemAppended', function(data) {
            var a = data.avatar;
            var $item = $(data.o);
            var $usermessage = $('span.usermessage', $item);
            if ($usermessage.length > 0) {
               $item.addClass('avatarMessage');
               var $username = $('span.username', $item);
               var $img = $('<img/>');
               var src = PATH_IMAGES + a.user + "/" + a.image + "." + a.extension;
               $img.attr('src', src);
               $img.addClass('avatarItem');
               $username.before($img);
               $item.css({
                  color : a.color,
                  backgroundColor : a.bg,
                  borderColor : a.border
               });
               // s'il s'agit de nous on stocke les value
               if (a.user == oApplication.getUserName()) {
                  var oConfig = _store();
                  if (oConfig.color != a.color) {
                     _store('color', a.color);
                  }
                  if (oConfig.bg != a.bg) {
                     _store('bg', a.bg);
                  }
                  if (oConfig.border != a.border) {
                     _store('border', a.border);
                  }
                  if (oConfig.image != a.image) {
                     _store('image', a.image);
                  }
                  if (oConfig.extension != a.extension) {
                     _store('extension', a.extension);
                  }
<<<<<<< HEAD
=======
                  console.log("test", _store());
>>>>>>> origin/feat-reco
               }
            }
         });

<<<<<<< HEAD

=======
>>>>>>> origin/feat-reco
         // créer une nouvelle commande /code
         oApplication.defineCommand('avatar', function() {
            avatarPopup();
         });

         var avatarPopup = function() {
            var oConfig = _store();
            var $pop = oView.getPopup('avatarPopup', 'Choose your dirty face !');
            if (!$pop.data('avatarPopup')) { // pour ne pas
               // refaire deux fois
               // le même code
               $pop.addClass('p640').addClass('avatarpop');
               var $popcont = $('div.content', $pop);
               var $html = $("<div>").addClass('proposition');
               var $diapo = $("<div>").addClass('diapo');
               for (i = 1; i <= 10; i++) {
                  var $image = $("<img>").addClass('choice').attr('src', PATH_DEFAULT + i + ".png");
                  $diapo.append($image);
               }
               $html.append($diapo);
               $html.append($("<p>").html("or choose one in your history"));
               var $diapo2 = $("<div>").addClass('diapo');
               for (i = 0; i <= oConfig.image; i++) {
                  var $image = $("<img>").addClass('choice').attr('src', PATH_IMAGES + oApplication.getUserName() + "/" + i + ".png").on('error', function() { $(this).remove(); });
                  $diapo2.append($image);
               }
               $html.append($diapo2);
               $popcont.append($html);
               $popcont.append($("<p>").html("or choose a different one (png 128/128px)"));
               $popcont.imageLoader({
                  load : function(imageCont) {
                     var bPersonalImage = true;
                     var imgAvatar = $('img.yourchoice');
                     imgAvatar.attr('src', imageCont);
                     imgAvatar.on('load', function() {
                        if (bPersonalImage) {
                           // canvas for resizing and convert png
                           var c1 = $("<canvas width='128' height='128' >");
                           var ctx1 = c1[0].getContext("2d");
                           ctx1.drawImage(imgAvatar[0], 0, 0, 128, 128);
                           var data = c1[0].toDataURL('image/png', 1.0);
                           oConfig.image = parseInt(oConfig.image + 1);
                           oConfig.extension = 'png';
                           oConfig.data = data;
                        }
                     });

                  }
               });

               $popcont.append($("<p>").html("your (bad) choice:"));
<<<<<<< HEAD
=======

>>>>>>> origin/feat-reco
               var $col = $("<p>").html('choose border and text colors');

               var $example = $('<div class="message avatarMessage avatarExample">' 
                     + '<img class="avatarItem yourchoice">' + '<span class="nick">' + oApplication.getUserName() + ':</span>'
                     + '<span class="usermessage">your message</span><br></div>' 
                     + '<input id="color" type="color" title="text color"/>'
                     + '<input id="colorborder" type="color" title="border color"/>' 
                     + '<input id="colorbg" type="color" title="background color"/>'
                     + '<br/>'
                     + '<p class="labelcolor">text</p><p class="labelcolor">border</p><p class="labelcolor">background</p><br/>'
                     );

               $popcont.append($example);

               var $avatarmessage = $("div.avatarExample");
               $avatarmessage.css({
                  color : oConfig.color,
                  borderColor : oConfig.border,
                  backgroundColor : oConfig.bg
               });
               // textcolor
               var $colorTextInput = $("#color", $pop).val(oConfig.color);
<<<<<<< HEAD
=======

>>>>>>> origin/feat-reco
               // bordercolor
               var $colorBorderInput = $("#colorborder", $pop).val(oConfig.border);
               // bordercolor
               var $colorBgInput = $("#colorbg", $pop).val(oConfig.bg);
               // image
               var src = PATH_IMAGES + oApplication.getUserName() + "/" + oConfig.image + "." + oConfig.extension;
               var $imgAvatar = $("img.avatarItem", $example).attr("src", src);

               var $ok = $("<button>").html("save").addClass('validAvatar');
               $popcont.append($ok);
               // event on choice list
               $("img.choice").on('click', function() {
                  var src = $(this).attr('src');
                  $('img.yourchoice').attr('src', src);
                  oConfig.image = parseInt(oConfig.image + 1);
                  oConfig.data = src;
                  // var sFilename = src.split('/').pop();
                  // var sExtension = sFilename.split('.').pop();
                  oConfig.extension = 'png';
               });
               // event on validation
               $ok.on('click', function(oEvent) {
                  oConfig.color = $colorTextInput.val();
                  oConfig.border = $colorBorderInput.val();
                  oConfig.bg = $colorBgInput.val();
                  sConfig = JSON.stringify(oConfig);
                  // envoi serveur
                  oApplication.command('/upref avatar ' + sConfig);
                  $pop.fadeOut('fast');
                  $("#input").focus();
               });
               // event on color
               $colorTextInput.on('input', function(oEvent) {
                  $avatarmessage.css('color', $(oEvent.target).val());
               });
               $colorBorderInput.on('input', function(oEvent) {
                  $avatarmessage.css('border-color', $(oEvent.target).val());
               });
               $colorBgInput.on('input', function(oEvent) {
                  $avatarmessage.css('background-color', $(oEvent.target).val());
               });

               $pop.data('avatarPopup', true);
            }
            $pop.fadeIn('fast');
         }
      });
