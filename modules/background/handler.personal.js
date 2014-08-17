$.extend(system.background, {
	personal: {
		image: '/img/bg.jpg'
	}
})

/**
 * Default background implementation
 */
modules.background.register('personal', function() {
	var div;

	return {
		init: function() {
			div = $("<div />").attr('id', 'background-img')
				.addClass('img-personal')
				.appendTo('body');

			div.append($("<img />").attr('src', system.background.personal.image).fadeTo('fast', system.background.opacity));
		},
		util: function() {
			div.remove();
		}
	};
});