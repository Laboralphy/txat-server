$(window)
		.on(
				'txat.start',
				function(oEvent, oApplication, oView) {
					var PATH_IMAGES = "/txat/scripts/Txat/addons/avatar/images/avatar/";
					var PATH_DEFAULT = "/txat/scripts/Txat/addons/avatar/images/128_default/";
					var TAG_START = '{{avatar ';
					var TAG_END = '}}';
					// var $textarea; // dans lequel sera collé le code source

					var storeItem = localStorage.getItem("avatar");
					if (!storeItem) {
						var oConfig = {
							image : PATH_DEFAULT + "default.png",
							color : "#000000",
							bg : "#ffffff",
							border : "#000000"
						};
						localStorage.setItem("avatar", JSON.stringify(oConfig));
					} else {
						var oConfig = JSON.parse(storeItem);
					}

					var store = function(p, v) {
						if (v) {
							// insertion
							oConfig[p] = v;
							localStorage.setItem("avatar", JSON
									.stringify(oConfig));
						} else {
							return oConfig[p][v];
						}
					}

					oView.on('chatItemAppended', function(data) {
						console.log("chatitem", data);
						var $item = $(data.o);
						var $usermessage = $('span.usermessage', $item);
						if ($usermessage.length > 0) {
							$item.addClass('avatarMessage');
							var $username = $('span.username', $item);
							var $img = $('<img/>');
							$img.attr('src', data.avatar.image);
							$img.addClass('avatarItem');
							$username.before($img);

							$item.css({
								color : data.avatar.color,
								backgroundColor : data.avatar.bg,
								borderColor : data.avatar.border
							});
							if (store('color') != data.avatar.color) {
								store('color', data.avatar.color);
							}
							if (store('bg') != data.avatar.bg) {
								store('bg', data.avatar.bg);
							}
							if (store('border') != data.avatar.border) {
								store('border', data.avatar.border);
							}
							if (store('image') != data.avatar.image) {
								store('image', data.avatar.image);
							}
						}
					});

					// créer une nouvelle commande /code
					oApplication.defineCommand('avatar', function() {
						avatarPopup();
					});

					var avatarPopup = function() {
						var $pop = oView.getPopup('avatarPopup',
								'Choose your dirty face !');
						if (!$pop.data('avatarPopup')) { // pour ne pas
															// refaire deux fois
															// le même code
							$pop.addClass('p640').addClass('avatarpop');
							var $popcont = $('div.content', $pop);
							var $html = $("<div>").addClass('proposition');
							var $diapo = $("<div>").addClass('diapo');
							for (i = 1; i <= 10; i++) {
								var $image = $("<img>").addClass('choice')
										.attr('src', PATH_DEFAULT + i + ".png");
								$diapo.append($image);
							}
							$html.append($diapo);
							$popcont.append($html);
							$popcont
									.append($("<p>")
											.html(
													"or choose a different one (png 128/128px)"));
							// $file = $("<input>").attr('type', 'file');
							// $popcont.append($file);
							$popcont.imageLoader({
								load : function(imageCont) {
									$('img.yourchoice').attr('src', imageCont);
								}
							});

							$popcont
									.append($("<p>").html("your (bad) choice:"));

							var $col = $("<p>").html(
									'choose border and text colors');

							var $example = $('<div class="message avatarMessage avatarExample">'
									+ '<img class="avatarItem yourchoice">'
									+ '<span class="nick">'
									+ oApplication.getUserName()
									+ ':</span>'
									+ '<span class="usermessage">your message</span><br></div>'
									+ '<input id="color" type="color" title="text color"/>'
									+ '<input id="colorborder" type="color" title="border color"/>'
									+ '<input id="colorbg" type="color" title="background color"/>');

							$popcont.append($example);

							var $avatarmessage = $("div.avatarExample");
							$avatarmessage.css({
								color : oConfig.color,
								borderColor : oConfig.border,
								backgroundColor : oConfig.bg
							});
							// textcolor
							var $colorTextInput = $("#color", $pop).val(
									oConfig.color);

							// bordercolor
							var $colorBorderInput = $("#colorborder", $pop)
									.val(oConfig.border);
							// bordercolor
							var $colorBgInput = $("#colorbg", $pop).val(
									oConfig.bg);
							// image
							var $imgAvatar = $("img.avatarItem", $example)
									.attr("src", oConfig.image);

							var $ok = $("<button>").html("ok");
							$popcont.append($ok);
							// event on choice list
							$("img.choice").on(
									'click',
									function() {
										$('img.yourchoice').attr('src',
												$(this).attr('src'));
									});
							// event on validation
							$ok.on('click', function(oEvent) {
								oApplication.command('/upref avatarBorder '
										+ $colorBorderInput.val());
								store('border', $colorBorderInput.val());
								oApplication.command('/upref avatarBg '
										+ $colorBgInput.val());
								store('bg', $colorBgInput.val());
								oApplication.command('/upref avatarColor '
										+ $colorTextInput.val());
								store('color', $colorTextInput.val());
								oApplication
										.command('/upref avatarImage '
												+ $('img.yourchoice', $pop)
														.attr('src'));
								store('image', $('img.yourchoice', $pop).attr(
										'src'));
								$pop.fadeOut('fast');
							});
							// event on color
							$colorTextInput.on('input', function(oEvent) {
								$avatarmessage.css('color', $(oEvent.target)
										.val());
							});
							$colorBorderInput.on('input', function(oEvent) {
								$avatarmessage.css('border-color', $(
										oEvent.target).val());
							});
							$colorBgInput.on('input', function(oEvent) {
								$avatarmessage.css('background-color', $(
										oEvent.target).val());
							});

							$pop.data('avatarPopup', true);
						}
						$pop.fadeIn('fast');
					}
				});
