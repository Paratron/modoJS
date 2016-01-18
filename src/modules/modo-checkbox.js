/**
 * modo-Checkbox
 * ===========
 * A CheckBox Element. It can either have a label, or not.
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

	function cn(index, prefixed){
		if(prefixed !== undefined){
			return modoCore.Checkbox.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Checkbox.classNames[index];
	}

	modoCore.defineElement('Checkbox', ['checkbox', 'checkbox-label', 'checked'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		if(!params.custom){
			this.$checkbox = $('<input type="checkbox">');
			this.$checkbox[0].checked = params.value;
			this.$checkbox.on('click', function (e){
				e.preventDefault();
				e.stopPropagation();
				that.set(!that.value);
				//I hate to be doing this, but otherwise, the checkbox just won't behave -.-
				setTimeout(function (){
					that.$checkbox[0].checked = that.value;
				}, 0);
			});
		} else {
			this.$checkbox = $('<span class="' + cn(0) + '"></span>');
		}

        this.$label = $('<span class="' + cn(1) + '">' + (params.label || '') + '</span>');

		this.el.append(this.$checkbox, this.$label);

		this.value = false;

		var that = this;

		if(params.tooltip){
			this.el.attr('title', params.tooltip);
		}

		this.el.on('click', function (e){
			if(e.target.nodeName == 'A'){
				return;
			}

			e.preventDefault();
			e.stopPropagation();
			that.set(!that.value);
		});

		if(params.model){
			if(!params.modelKey){
				throw new Error('Trying to bind to model, but no model key given');
			} else {
				params.value = params.model.get(params.modelKey);

				params.model.on('change:' + params.modelKey, function (){
					that.set(params.model.get(params.modelKey));
				});
			}
		}

		this.set = function (value, options){
			var silent;

			options = options || {};

			silent = options.silent;

			if(value){
				this.value = true;
			}
			else {
				this.value = false;
			}

			if(!params.custom){
				that.$checkbox[0].checked = this.value;
			}

			this.el.toggleClass(cn(2), this.value);

			if(params.model && params.modelKey){
				params.model.set(params.modelKey, this.value);
			}

			if(!silent){
				this.trigger('change', this.value);
			}

			return this;
		};

		if(params.value !== undefined){
			this.set(params.value, {silent: true});
		}

		if(params.disabled === true){
			this.disable();
		}

		modoCore._stat('Checkbox');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			enable: function (options){
				var silent;

				options = options || {};

				silent = options.silent;

				this.removeClass(modo.Element.classNames[2]);
				this.$checkbox.prop('disabled', false);

				if(!silent){
					this.trigger('enabled');
				}

				return this;
			},
			disable: function (options){
				var silent;

				options = options || {};

				silent = options.silent;

				this.addClass(modo.Element.classNames[2]);
				this.$checkbox.prop('disabled', true);

				if(!silent){
					this.trigger('disabled');
				}

				return this;
			},
			get: function (){
				return this.value;
			},
            setLabel: function(newLabel){
                this.$label.html(newLabel);
            }
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Checkbox;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Checkbox', [], function (){
				return modo.Checkbox;
			});
		}
	}
})();