function View() {
	$.extend(system, {
		view: {
			moveToCurrent: true,
			moveToCurrentOnPlay: false
		}
	});
}

View.prototype = new Structurer('setView', 'unsetView');
View.prototype.constructor = View;

modules.view = new View();
