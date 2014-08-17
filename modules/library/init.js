function Library() {
	$.extend(system, {
		library: {
			library: 'allmusic',
			queryLocation: '/php/library.php',
			updateLocation: '/php/updater.php'//,
			//updateInterval: 30,
			//updateIndication: true
		}
	});
}

Library.prototype = new Structurer('loadLibrary', 'makePlaylist', 'unmakePlaylist');
Library.prototype.constructor = Library;

modules.library = new Library();