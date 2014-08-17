function Background() {
	$.extend(system, {
		background: {
			numberOfImages: 32,
			opacity: 1
		}
	});
}

Background.prototype = new Structurer('show', 'hide');
Background.prototype.constructor = Background;

modules.background = new Background();