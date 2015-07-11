/**
 * modo-notification
 * ===========
 * description
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
			return modoCore.Notification.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Notification.classNames[index];
	}

	modoCore.defineElement('Notification', ['notification'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, false));

		/**
		 * Used as a marker for the modoCore.generate() function.
		 * This states, that this element must not be passed to add() functions.
		 * @type {Boolean}
		 */
		this.noAdd = true;

		this.el.html(params.content);

		this.displayTime = params.duration;

		modoCore._stat('Notification');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			set: function (content){
				this.el.html(content);

				return this;
			},
			hide: function (){
				this.visible = false;

				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Notification;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Notification', [], function (){
				return modo.Notification;
			});
		}
	}
})();