/**
 * Modo Toggle Button
 * =================
 * This is a normal Modo button with extra functionality - it can be toggled by click, or manually (with the set() function).
 * @extends {modo.Button}
 * @param {Object} params
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

	modoCore.defineElement('ToggleButton', ['togglebutton', 'toggled'], function (params){
		params = params || {};

		modo.Button.call(this, params);

		this.addClass(modo.ToggleButton.classNames[0]);

		this.toggled = false;

		this.locked = false;

		this.on('click', function (){
			if(this.locked){
				return;
			}
			if(this.get()){
				this.set(false);
			} else {
				this.set(true);
			}
		});

		modoCore._stat('ToggleButton');
	})
		.inheritPrototype('Button')
		.extendPrototype({
			/**
			 * Will set the buttons toggle state to toggled or not toggled.
			 * @param truefalse (optional) If not given, the current state will be inverted.
			 */
			set: function (truefalse){
				if(typeof truefalse === 'undefined'){
					truefalse = !this.toggled;
				}
				if(truefalse){
					truefalse = true;
				} else {
					truefalse = false;
				}

				this.toggled = truefalse;

				if(this.toggled){
					this.addClass(modo.ToggleButton.classNames[1]);
					this.trigger('change', true);
				} else {
					this.removeClass(modo.ToggleButton.classNames[1]);
					this.trigger('change', false);
				}

				return this;
			},

			get: function (){
				return this.toggled;
			},

			/**
			 * Call this function to lock the button against user interactions.
			 * It won't be rendered as disabled, but it can't be toggled by user interaction anymore. Click events are fired, tough.
			 */
			lock: function (truefalse){
				if(typeof truefalse === 'undefined'){
					truefalse = true;
				}
				if(truefalse){
					this.locked = true;
				} else {
					this.locked = false;
				}

				return this;
			}
		});


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.ToggleButton;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('ToggleButton', [], function (){
				return modo.ToggleButton;
			});
		}
	}
})();