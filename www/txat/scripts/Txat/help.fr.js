O2.createObject('TXAT.HELP.FR', {
	msg: "<i>/msg user message</i> - Envoyer un message privé à un utilisateur.",
	join: "<i>/join channel</i> - Rejoindre un canal de discussion. Si le canal n'existe pas, il est créé.",
	who: "<i>/who user</i> - Obtenir des informations sur un utilisateur connecté au canal de discussion actuel. Permet notament de visualiser le profil de modération de l'utilisateur sur le canal.",
	ban: "<i>/ban user duration reason</i> - Bannir un utilisateur du canal de discussion actuel. On spécifiera le nom de l'utilisateur en question, la durée de bannissement (exemple: 1m = 1 minute, 1h = 1 heure, 1d = 1 jour...), et la raison du bannissement (visible par les autre utilisateurs pour expliquer l'action). L'utilisateur visé n'a pas besoin d'être présent sur le canal.",
	unban: "<i>/unban user</i> - Annule le bannissement d'un utilisateur pour le canal de discussion actuel.",
	promote: "<i>/promote user</i> - Commande réservée aux administrateurs. Permet d'augmenter le niveau de modération d'un utilisateur. Il existe plusieurs niveaux : Utilisateur, Modérateur (peut bannir), Administrateur (peut bannir et changer les niveaux de modération). Un administrateur peut hisser un utilisateur au rang de modérateur, ou un modérateur au rang d'administrateur.",
	demote: "<i>/demote user</i> - Commande réservée aux administrateurs. Fonctionne comme <i>/promote</i>. Permet de baisser le niveau de modération d'un utilisateur.",
	passwd: "<i>/passwd password</i> - Protéger le nom d'utilisateur sur ce serveur en définissant ou re-définissant un mot de passe qui sera demandé à la connexion. Cela empèche d'autres utilisateurs d'usurper l'identité d'un autre utilisateur quand se dernier se déconnecte du serveur.",
	help: "<i>/help</i> - Afficher l'aide concernant les commandes disponibles"
});
