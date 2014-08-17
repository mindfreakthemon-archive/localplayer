modules.history.register('default', function() {
	var storage = [], position = -1, historyDiv;

	var updateViewer = function() {
		if(!historyDiv)
			return;

		var div, info, i, l;

		historyDiv.html('');

		for(i = 0, l = storage.length; i < l; i++)
		{
			info = storage[i];

			div = $("<div />").data('position', i).addClass('history' + (position == i ? ' active' : ''))
				.text(sprintf('%s \u2014 %s \u2014 %s', info.title, info.album, info.artist))

			historyDiv.append(div);
		}
	};

	return {
		init: function() {
			/**
			* History Viewer
			*/
			if(system.history.viewer)
			{
				historyDiv = $("<div />").attr({
					'class': 'full-height container'
				}).on('click', 'div.history', function() {
					position = $(this).data('position');
					player.select(storage[position]);
					updateViewer();
				}).appendTo('body').resize();
				
				modules.menu.addLink('history', 'History', historyDiv);
			}

			if(player.isPlaying())
				this.push(player.data), updateViewer();
		},
		util: function() {
			if(historyDiv)
			{
				modules.menu.removeLink('history');
				historyDiv.remove();
				historyDiv = null;
			}
		},
		push: function(track) {
			if(position < (storage.length - 1))
				storage.length = position + 1;

			if(storage.length && storage[storage.length - 1].hash == track.hash)
				return;

			position = storage.push(track) - 1;
			updateViewer();
		},
		unshift: function(track) {
			position = 0;
			storage.unshift(track);
			updateViewer();
		},
		current: function() {
			var current = storage[position];

			if(!current)
				return false;

			return current;
		},
		prev: function() {
			if(position > 0)
			{
				--position, updateViewer();
				return storage[position];
			}

			return false;
		},
		next: function() {
			if(position < (storage.length - 1))
			{
				++position, updateViewer();
				return storage[position];
			}

			return false;
		},
		clear: function() {
			storage.length = 0;
			position = -1;
			updateViewer();
		}
	};
});
