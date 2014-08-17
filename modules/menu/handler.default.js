modules.menu.register('default', function() {
	var menuDiv;

	return {
		init: function() {
			menuDiv = $("<div />").attr({
				id: 'menu',
				'class':'no-select padding-width'
			})
			.appendTo('body').resize()
			.on('click', 'a', function() {
				var self = $(this), div = self.data('div');

				div.siblings('div.container').hide();
				div.show();

				self.siblings().removeClass('active');
				self.addClass('active');
			});
		},
		util: function() {
			menuDiv.remove();
		},
		getContainer: function() {
			return menuDiv;
		},
		addLink: function(id, label, div, obj) {
			var link = $("<a />").attr('id', 'menu-' + id).data('div', div).text(label);

			obj = obj || {};

			if(obj.hasOwnProperty('position')) {
				if(obj.position < 1)
					link.prependTo(menuDiv);
				else
				{
					var links = menuDiv.find('a');
					if(links.length - 1 > obj.position)
						links.eq(obj.position).before(link);
					else
						link.appendTo(menuDiv);
				}
			} else
				link.appendTo(menuDiv);

			if(obj.hasOwnProperty('open') && obj.open)
				link.click();
		},
		removeLink: function(id) {
			menuDiv.find('#menu-' + id).remove();
		}
	};
});