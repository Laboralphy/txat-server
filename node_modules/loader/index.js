/**
 * Ce petit outil permet de charge d'un coup toutes les classe d'un répertoire
 * Les classes ont ensuite rassemblées dans un objets pour une meilleure organisation
 * Les seuls fichiers chargés sont ceux dont le nom commence par une lettre MAJUSCULE
 */

var fs = require('fs');

function loadClasses(sPath) {
	sPath = sPath || '.';
	if (sPath.substr(-1) != '/') {
		sPath += '/';
	}
	var aFiles = fs.readdirSync(sPath);
	var oObjects = {};
	
	aFiles.forEach(function(f) {
		var r = f.match(/^([A-Z].*)\.js$/);
		if (r) {
			var o = require(sPath + f);
			oObjects[r[1]] = o;
		}
	});
	return oObjects;
}

module.exports = loadClasses;
