modules.keynav.register('default', function() {
	var handlers = {
		0: {
			37: function() { /* prev */
				$("#controls-prev").click();
			},
			39: function() { /* next */
				$("#controls-next").click();
			},
			38: function() { /* volup */
				$("#controls-volslider").val(parseInt($("#controls-volslider").val()) + 3).change();
			},
			40: function() { /* voldown */
				$("#controls-volslider").val(parseInt($("#controls-volslider").val()) - 3).change();
			},
			32: function() { /* Play/pause */
				$("#controls-playback").click();
			},

			72: function() { /* History */
				$("#controls-history").click();
			},
			79: function() { /* Order */
				$("#controls-order").click();
			},
			84: function() { /* Title */
				$("#controls-title").click();
			},
			66: function() { /* Background */
				$("#controls-background").click();
			},
			76: function() { /* Lyrics */
				$("#controls-lyrics").click();
			},
			74: function() { /* Title */
				$("#controls-talkmode").click();
			},

			67: function() { /* Move to current */
				$("#controls-movetocurrent").click();
			},

			86: function() { /* Visibility */
				$("#controls-visibility").click();
			}
		}
	};

	var descr = {
		'Player': {
			'&larr;': 'Previous track',
			'&rarr;': 'Next track',
			'&uarr;': 'Volume up',
			'&darr;': 'Volume down',
			'&lt;space&gt;': 'Play/pause'
		},
		'Change handlers for..': {
			'H': '.. History',
			'O': '.. Order',
			'T': '.. Title',
			'B': '.. Background',
			'L': '.. Lyrics',
			'A': '.. Talkmode'
		},
		'Misc': {
			'C': 'Move to current track',
			'V': 'Toggle controls visibility'
		}
	};

	var keynavDiv, updateHelper = function() {
		keynavDiv.html('');

		for(var type in descr)
		{
			var arr = [];

			for(var k in descr[type])
				arr.push('<div class="keynav-hotkey"><span>' + k + '</span> &mdash; <span>' + descr[type][k] + '</span></div>');

			keynavDiv.append('<div class="keynav-type">' + type + '</div><div class="keynav-hotkeys">' + arr.join('') + '</div>');
		}
	};

	return {
		init: function() {
			$(window).on('keydown.keynav', ':not(:input)', function(e) {
				var level = 0;

				if(e.shiftKey)
					level += 1;
				if(e.ctrlKey)
					level += 2;
				if(e.altKey)
					level += 4;

				if(!handlers.hasOwnProperty(level))
					return;

				if(handlers[level].hasOwnProperty(e.keyCode))
				{
					e.stopImmediatePropagation();
					e.preventDefault();
					handlers[level][e.keyCode]();
				}
			});

			keynavDiv = $("<div />").attr({
				'class': 'full-height'
			}).addClass('container').appendTo('body').resize();

			updateHelper();

			modules.menu.addLink('keynav', 'Hotkeys', keynavDiv);
		},
		util: function() {
			if(keynavDiv)
			{
				modules.menu.removeLink('keynav');
				keynavDiv.remove();
				keynavDiv = null;
			}

			$(window).off('keydown.keynav');
		}
	};
});