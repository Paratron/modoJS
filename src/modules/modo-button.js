/**
 * Modo Button
 * ================
 * This creates a simple button, which is extended by Backbone.Events.
 * It also brings enable() and disable() functions to handle user accessibility.
 * @extends modo.Element
 * @param {Object} params
 * @return {modo.Button}
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

	modoCore.defineElement('Button', ['button'], function (params){
		params = params || {};

		var settings = {
			label:   params.label || '',
			tooltip: params.tooltip || ''
		};

		/**
		 * A helper function to return css classnames for this element.
		 * @param index
		 * @param prefixed
		 * @returns {*}
		 */
		function cn(index, prefixed){
			if(prefixed){
				return modo.cssPrefix + modo.Button.classNames[index];
			}
			return modo.Button.classNames[index];
		}

		modoCore.Element.call(this, _.extend(params, {el: $('<button title="' + settings.tooltip + '">' + settings.label + '</button>')}));

		this.addClass(cn(0));

		this.disabled = false;

		var that = this;
		this.el.on('click', function (e){
			if(this.disabled){
				return;
			}
			that.trigger('click', e);
		});

		if(params.disabled){
			this.disable({silent: true});
		}

		modoCore._stat('Button');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * Will re-set the buttons label and tooltip
			 * @param label
			 */
			setLabel: function (label, tooltip){
				if(label !== undefined && label !== null){
					this.el.html(label);
				}

				if(tooltip !== undefined){
					this.el.attr('title', tooltip);
				}

				this.trigger('update');

				return this;
			},

			/**
			 * This will enable the button for user interaction.
			 */
			enable: function (){
				this.removeClass(modo.Element.classNames[2]);
				this.el.attr('disabled', false);
				this.disabled = false;
				this.trigger('enabled');

				return this;
			},

			/**
			 * This will disable the button for user interaction.
			 */
			disable: function (){
				this.addClass(modo.Element.classNames[2]);
				this.el.attr('disabled', true);
				this.disabled = true;
				this.trigger('disabled');

				return this;
			},

			focus: function (){
				this.el.focus();
			},

			blur: function (){
				this.el.blur();
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Button;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.Button', function (){
				return modoCore.Button;
			});
		}
	}
})();