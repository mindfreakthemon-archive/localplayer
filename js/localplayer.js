soundManager.url = '/swf/';
soundManager.flashVersion = 9;
soundManager.audioFormats.mp4.required = false;
soundManager.audioFormats.ogg.required = false;
soundManager.audioFormats.wav.required = false;
//soundManager.useHTML5Audio = true;
///soundManager.preferFlash = false;
soundManager.useFlashBlock = false;

system = {
	lastfm: {
		key: '367aaf54d68cd7433739b0469abf1bc4'
	},
	library: {
		library: 'allmusic',
		queryLocation: '/php/library.php',
		updateLocation: '/php/updater.php'//,
		//updateInterval: 30,
		//updateIndication: true
	}
};

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.random = function() {
	return this[Math.floor(this.length * Math.random())];
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {
		return a.indexOf(i) == -1;
	});
};

$.fn.random = function() {
	return this.eq(Math.floor(this.length * Math.random()));
};

$(function() {
	$(window).on({
		resize: function() {
			var self = $(window);
			$(".padding-width").width(self.width() - 20);
			$(".full-height").height(self.height());
		}
	}).triggerHandler('resize');
});
