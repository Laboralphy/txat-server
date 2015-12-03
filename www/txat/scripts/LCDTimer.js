/**
 * Cette classe sert a faire un petit diaporama textuel
 * TEXTUEL avec un T comme Texte !
 */
O2.createClass('LCDTimer', {
	nInterval: 5000,
	$div: null,
	
	aText: null,
	
	nIndex: 0,
	
	__construct: function() {
		this.aText = [''];
		$.get('scripts/data/wcs.txt', null, this.setText.bind(this));
	},
	
	setText: function(a) {
		this.aText = a.split('\n');
	},

	setDiv: function(oDiv) {
		this.$div = oDiv;
	},
	
	time: function() {
		this.$div.fadeOut(this.newText.bind(this));
	},
	
	newText: function() {
		this.$div.html(this.aText[this.nIndex]).fadeIn();
		this.nIndex = (this.nIndex + 1) % this.aText.length;
	},
	
	stop: function() {
		if (this.oTimer) {
			clearInterval(this.oTimer);
		}
	},
	
	run: function() {
		this.stop();
		this.oTimer = setInterval(this.time.bind(this), this.nInterval);
	}
});

