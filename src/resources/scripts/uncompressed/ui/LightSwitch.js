(function($) {


/**
 * Light Switch
 */
blx.ui.LightSwitch = blx.Base.extend({

	settings: null,
	$outerContainer: null,
	$innerContainer: null,
	$input: null,
	on: null,
	dragger: null,

	dragStartMargin: null,

	init: function(outerContainer, settings)
	{
		this.$outerContainer = $(outerContainer);

		// Is this already a switch?
		if (this.$outerContainer.data('lightswitch'))
		{
			blx.log('Double-instantiating a switch on an element');
			this.$outerContainer.data('lightswitch').destroy();
		}

		this.$outerContainer.data('lightswitch', this);

		this.setSettings(settings, blx.ui.LightSwitch.defaults);

		this.$innerContainer = this.$outerContainer.find('.container:first');
		this.$input = this.$outerContainer.find('input:first');

		this.on = this.$outerContainer.hasClass('on');

		blx.utils.preventOutlineOnMouseFocus(this.$outerContainer);
		this.addListener(this.$innerContainer, 'mousedown', '_onMouseDown');
		this.addListener(this.$outerContainer, 'keydown', '_onKeyDown');

		this.dragger = new blx.ui.DragCore(this.$innerContainer, {
			axis: 'x',
			ignoreButtons: false,
			onDragStart: $.proxy(this, '_onDragStart'),
			onDrag:      $.proxy(this, '_onDrag'),
			onDragStop:  $.proxy(this, '_onDragStop')
		});
	},

	turnOn: function()
	{
		this.$innerContainer.stop().animate({marginLeft: 0}, 'fast');
		this.$input.val('y');
		this.on = true;
		this.settings.onChange();
	},

	turnOff: function()
	{
		this.$innerContainer.stop().animate({marginLeft: blx.ui.LightSwitch.offMargin}, 'fast');
		this.$input.val('');
		this.on = false;
		this.settings.onChange();
	},

	toggle: function(event)
	{
		if (!this.on)
			this.turnOn();
		else
			this.turnOff();
	},

	_onMouseDown: function()
	{
		this.addListener(blx.$document, 'mouseup', '_onMouseUp')
	},

	_onMouseUp: function()
	{
		this.removeListener(blx.$document, 'mouseup');

		// Was this a click?
		if (!this.dragger.dragging)
			this.toggle();
	},

	_onKeyDown: function(event)
	{
		switch (event.keyCode)
		{
			case blx.SPACE_KEY:
				this.toggle();
				event.preventDefault();
				break;
			case blx.RIGHT_KEY:
				this.turnOn();
				event.preventDefault();
				break;
			case blx.LEFT_KEY:
				this.turnOff();
				event.preventDefault();
				break;
		}
	},

	_getMargin: function()
	{
		return parseInt(this.$innerContainer.css('marginLeft'))
	},

	_onDragStart: function()
	{
		this.dragStartMargin = this._getMargin();
	},

	_onDrag: function()
	{
		var margin = this.dragStartMargin + this.dragger.mouseDistX;

		if (margin < blx.ui.LightSwitch.offMargin)
			margin = blx.ui.LightSwitch.offMargin;
		else if (margin > 0)
			margin = 0;

		this.$innerContainer.css('marginLeft', margin);
	},

	_onDragStop: function()
	{
		var margin = this._getMargin();

		if (margin > -16)
			this.turnOn();
		else
			this.turnOff();
	},

	destroy: function()
	{
		this.base();
		this.dragger.destroy();
	}

}, {
	offMargin: -31,
	defaults: {
		onChange: function(){}
	}
});


$.fn.lightswitch = function(settings, settingName, settingValue)
{
	if (settings == 'settings')
	{
		if (typeof settingName == 'string')
		{
			settings = {};
			settings[settingName] = settingValue;
		}
		else
			settings = settingName;

		return this.each(function()
		{
			var obj = $.data(this, 'lightswitch');
			if (obj)
				obj.setSettings(settings);
		});
	}

	return this.each(function()
	{
		if (!$.data(this, 'lightswitch'))
			new blx.ui.LightSwitch(this, settings);
	});
};

blx.$document.ready(function()
{
	$('#body .lightswitch').lightswitch();
});


})(jQuery);
