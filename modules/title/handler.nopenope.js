modules.title.register('nopenope', function() {
	var link;

	return {
		init: function() {
			link = $("<link />").attr({
				rel: 'shortcut icon',
				href: '/img/defacover.jpg',
				type: 'image/jpeg'
			})
			.appendTo('head');
		},
		util: function() {
			link.remove();
		}
	};
});