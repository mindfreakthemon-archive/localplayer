$(function() {
	var title = modules.title;

	/**
	 * State restoration
	 */
	var state = title.getState();

	if(state.handler)
		title.set(state.handler);

	/**
	 * UI Applying
	 */
	$("<div />").attr({
		id: 'controls-title',
		'class': 'persistent-button ' + title.get()
	}).appendTo('#controls-structures');

	/**
	 * State saving
	 */
	title.setStateSaver(function() {
		return {
			handler: title.get()
		};
	});
});