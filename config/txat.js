////// FONCTIONS POUR LE FILTRE DE MESSAGES //////
////// FONCTIONS POUR LE FILTRE DE MESSAGES //////
////// FONCTIONS POUR LE FILTRE DE MESSAGES //////

function filter_TIME() {
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	h = h < 10 ? '0' + h.toString() : h;
	m = m < 10 ? '0' + m.toString() : m;
	return h + ':' + m;
}
	
function filter_DATE() {
	var d = new Date();
	var j = d.getDate();
	var m = d.getMonth() + 1;
	var a = d.getFullYear();
	j = j < 10 ? '0' + j.toString() : j;
	m = m < 10 ? '0' + m.toString() : m;
	return j + '/' + m + '/' + a;
}




module.exports = {
	plugins: { // configuration des plugin
		Log: {}, // Système de Log : pas de config
		Filter: { // config du filtre de messages
			words: { // liste des remplacements
				'\\$TIME': filter_TIME, // fonction : voir plus haut
				'\\$DATE': filter_DATE,
				':D': '😃',
				':p': '😋',
				':\\)': '😊',
				':\\(': '😞',
				'arigato' : 'ありがとう'
			}
		},
		Auth: { // Authentification
			superadmin: ['ralphy'], // liste des superadmin
		}		
	},
	channels: { // canaux permanents
		general: { // le premier canal est le canal de base auquel tout utilisateur se connecte
		}
	}
};
