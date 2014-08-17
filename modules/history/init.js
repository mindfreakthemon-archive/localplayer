function History() {
	$.extend(system, {
		history: {
			viewer: true
		}
	});
}

History.prototype = new Structurer('push', 'unshift', 'current', 'next', 'prev');
History.prototype.constructor = History;

modules.history = new History();

