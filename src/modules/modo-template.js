/**
 * Template
 * ===========
 * The template element is a element that renders custom HTML parts of your interface, like static
 * descriptions or decoration.
 * You can still hook up a Backbone.Model to the template element to replace certain placeholders in the template
 * automatically.
 */
/* global modo:true */
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
			return modoCore.Template.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Template.classNames[index];
	}

	function render(el, tpl, data){
		el.html(tpl(data));
	}

	modoCore.defineElement('Template', ['mdo-template'], function (params){
		var that;

		params = params || {};
		that = this;

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		if(typeof params.template !== 'function'){
			params.template = _.template(params.template);
		}

		//TODO: Clean that shit up.
		this.set = function (data){
			this.stopListening();

			if(data instanceof Backbone.Model){
				this.listenTo(data, 'change', function (){
					render(that.el, params.template, data.getJSON());
					that.trigger('update');
				});
				render(this.el, params.template, data.getJSON());
			} else {
				render(this.el, params.template, data);
			}

			this.trigger('update');

			return this;
		};

		if(params.data){
			this.set(params.data);
		} else {
			render(this.el, params.template, {});
		}

		modoCore._stat('Template');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/* PROTOTYPE FUNCTIONS HERE */
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Template;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Template', [], function (){
				return modo.Template;
			});
		}
	}
})();