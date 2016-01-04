/**
 * Modo Input Text
 * ==============
 * The text input control can be used for different occasions.
 * Use the type parameter to tweak it to any kind of input you need (eg. search, mail, ...).
 * Tip: it provides easy event-names for different keyboard events, like "keydown:enter".
 * @param params
 * @constructor
 */
(function (){
	'use strict';

	var modoCore,
		$;

	$ = jQuery;

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	var placeholderFallback;
	(function (){
		var test = document.createElement('input');
		placeholderFallback = !('placeholder' in test);
	})();


	modoCore.defineElement('InputText', ['inputtext', 'inputtext-', 'placeholded', 'autogrow', 'filled'], function (params){
		params = params || {};

		var settings,
			that,
			keymap,
			lazyFocus;

		settings = {
			type:        params.type || 'text',
			placeholder: params.placeholder || '',
			changeThreshold: (params.changeThreshold !== undefined) ? parseInt(params.changeThreshold, 10) : 500,
			timeout: null,
			lastValue: null,
			value:       params.value || '',
			boundModel: null,
			boundModelKey: null,
			maxlength:   params.maxlength || null,
			autogrow:    params.autogrow || false
		};

		modoCore.Element.call(this, _.extend(params, {el: $(settings.type !== 'textarea' ? '<input type="' + settings.type + '">' : '<textarea></textarea>')}));

		this.addClass(modoCore.InputText.classNames[0]);
		this.addClass(modoCore.InputText.classNames[1] + settings.type);

		if(params.maxlength){
			this.el.attr('maxlength', params.maxlength);
		}

		if(settings.type === 'textarea'){
			this.el.attr('rows', 1);
		}

		that = this;

		/**
		 * Ability to programattically check if the input field currently has cursor focus.
		 * @type {boolean}
		 */
		this.hasFocus = false;

		keymap = {
			13: 'enter',
			27: 'escape',
			18: 'alt',
			17: 'ctrl',
			16: 'shift',
			38: 'up',
			40: 'down',
			37: 'left',
			39: 'right',
			8: 'backspace',
			46: 'del',
			35: 'end',
			36: 'pos1',
			45: 'paste',
			9: 'tab'
		};

		//If you want to select text after a "focus" event,
		//it will fail when the user clicks in the textfield.
		//A click seems to set a focus (at least in chrome).
		//So this debounced function will cause the elements
		//"focus" event to be triggered AFTER the click event.
		//Crazy stuff.
		lazyFocus = _.debounce(function (){
			that.trigger('focus');
		}, 100);

		if(settings.autogrow && settings.type === 'textarea'){
			this.addClass(modoCore.InputText.classNames[3]);

			modoCore.waitForDom(this, function (){
				var $el = that.el;
				var $cloneBox = $('<div></div>');
				$cloneBox.css({
					display: 'none',
					'word-wrap': 'break-word',
					'white-space': 'normal',
					'padding': $el.css('padding'),
					'width': $el.width(),
					'font-family': $el.css('font-family'),
					'font-size': $el.css('font-size'),
					'line-height': $el.css('line-height')
				});
				$el.after($cloneBox);

				$el.on('keyup change', function (){
					if($el[0].value){
						$cloneBox.html(String($el[0].value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />') + '.<br/>.');
						$el.height($cloneBox.height());
						return;
					}
					$el.css('height', 'auto');
				});

				if($el.width() === 0){
					var interval = setInterval(function (){
						var width = $el.width();
						if(width){
							$cloneBox.css('width', width);
							clearInterval(interval);
						}
					}, 500);
				}
			});
		}

		this.el.on('keydown', function (e){
			that.trigger('keydown', e);
			that.trigger('keydown:' + e.keyCode, e);
			if(typeof keymap[e.keyCode] !== 'undefined'){
				that.trigger('keydown:' + keymap[e.keyCode], e);
			}

			if(!that.el.val()){
				that.removeClass(modoCore.InputText.classNames[4]);
				that.trigger('empty');
			} else {
				that.addClass(modoCore.InputText.classNames[4]);
				that.trigger('filled');
			}

			if(settings.timeout){
				clearTimeout(settings.timeout);
			}
			settings.timeout = setTimeout(function (){
				settings.value = that.el.val();
				if(settings.lastValue !== settings.value){
					settings.lastValue = settings.value;
					if(settings.boundModel && settings.boundModelKey){
						settings.boundModel.set(settings.boundModelKey, settings.value);
					}
					that.trigger('change', that.el.val());
				}
			}, settings.changeThreshold);
		}).on('blur', function (){
			that.hasFocus = false;
			if(placeholderFallback && settings.placeholder && !that.el.val()){
				that.el.val(settings.placeholder);
				that.addClass(modoCore.InputText.classNames[2]);
			}
			that.trigger('blur');
		}).on('focus', function (){
			that.hasFocus = true;
			if(placeholderFallback && that.el.val() === settings.placeholder){
				that.el.val('');
				that.removeClass(modoCore.InputText.classNames[2]);
			}
			lazyFocus();
		}).on('click', function (){
			lazyFocus();
		});

		if(settings.placeholder){
			this.el.attr('placeholder', settings.placeholder);
		}

		if(settings.value){
			this.el.val(settings.value);
			settings.lastValue = settings.value;
		}

		if(placeholderFallback && !settings.value && settings.placeholder){
			this.el.val(settings.placeholder);
			this.addClass(modoCore.InputText.classNames[2]);
		}

		this.set = function (value, options){
			var silent;

			options = options || {};

			silent = options.silent;

			settings.value = value;

			if(!value && placeholderFallback && settings.placeholder){
				value = settings.placeholder;
				this.addClass(modoCore.InputText.classNames[2]);
			}

			this.el.val(value);
			if(settings.value !== settings.lastValue){
				settings.lastValue = value;
				if(!silent){
					this.trigger('change', value);
				}
			}

			return this;
		};

		/**
		 * Binds the element to a Backbone Model.
		 * Prevous bindings will be detached.
		 * Heads up: Two-way binding is only possible when giving a modelKey!
		 * @param {Backbone.Model} model
		 * @param {string} [modelKey=null] If not given, give a processing function!
		 * @param {function} [processingFunction] A function that takes `model` as a argument and returns value on every change event.
		 */
		this.bindToModel = function (model, modelKey, processingFunction, noUpdate){
			if(!(model instanceof Backbone.Model)){
				throw new Error('Can only bind to a backbone model.');
			}

			if(settings.boundModel){
				this.stopListening(settings.boundModel);
			}

			settings.boundModel = model;
			settings.boundModelKey = modelKey;

			if(!modelKey){
				if(typeof processingFunction === 'function'){
					this.listenTo(model, 'change', function (){
						that.set(processingFunction.call(that, model));
					});
					settings.value = processingFunction(model);
				} else {
					throw new Error('Trying to bind to model, but no modelKey and no processingFunction given');
				}
			} else {
				settings.value = model.get(modelKey);

				this.listenTo(model, 'change:' + modelKey, function (){
					that.set(model.get(modelKey));
				});
			}

			if(!noUpdate){
				this.set(settings.value);
			}
		};

		if(params.model){
			this.bindToModel(params.model, params.modelKey, (typeof params.value === 'function') ? params.value : null, true);
		}

		if(params.disabled){
			this.disable();
		}

		modoCore._stat('InputText');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * If no value given, the current value will be returned.
			 * If a value is passed, the current value will be overwritten.
			 * @param {String} value
			 * @returns {String}
			 */
			get: function (){
				return this.el.val();
			},

			/**
			 * Will take the keyboard focus from the elements DOM object.
			 */
			blur: function (){
				this.el.blur();
				this.trigger('blur');
				return this;
			},

			/**
			 * Will set the keyboard focus to the elements DOM object.
			 */
			focus: function (){
				this.el.focus();
				this.trigger('focus');
				return this;
			},

			/**
			 * Select a part of the input text.
			 * @param {Integer} start Beginning of the selection in characters from left
			 * @param {Integer} length Length of the selection, or characters from left if values is negative
			 */
			select: function (start, length){
				var value = this.el.val();

				if(start === void 0 && length === void 0){
					this.el[0].select();
					return this;
				}

				if(length === void 0){
					length = 0;
				}

				if(!start){
					start = 0;
				}

				if(length < 0){
					length += value.length;
				} else {
					length += start;
				}

				this.el[0].setSelectionRange(start, length);

				return this;
			},

			disable: function (){
				this.el.attr('disabled', true).addClass(modoCore.cssPrefix + 'disabled');
				this.trigger('disable');
				return this;
			},

			enable: function (){
				this.el.attr('disabled', false).removeClass(modoCore.cssPrefix + 'disabled');
				this.trigger('enable');
				return this;
			}
		});


	modoCore.InputText.SEARCH = 'search';


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.InputText;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.InputText', function (){
				return modoCore.InputText;
			});
		}
	}
})();