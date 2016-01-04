/**
 * Modo Image
 * =========
 * A image object, enhanced by Modo methods.
 * Can - for example - be used inside a modoCore.FormContainer to display user avatars.
 *
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

	modoCore.defineElement('Image', ['image'], function (params){
		params = params || {};

		params.el = $('<img>');

		modoCore.Element.call(this, params);

		this.addClass(modoCore.Image.classNames[0]);

		var settings = {
			value:    params.value || '',
			tooltip:  params.tooltip || '',
			model:    params.model || null,
			modelKey: params.modelKey || null
		};

		var that = this;

		this.width = this.height = 0;

		this.el.on('load', function (e){
			that.width = that.el[0].naturalWidth;
			that.height = that.el[0].naturalHeight;
			that.trigger('load', e);
		});

		if(settings.model instanceof Backbone.Model){
			if(!settings.modelKey){
				if(typeof params.value === 'function'){
					params.model.on('change', function (){
						that.set(params.value.call(that, params.model));
					});
				} else {
					throw new Error('Trying to bind to model, but no modelKey and no valueFunction given');
				}
			}

			settings.value = settings.model.get(settings.modelKey);

			settings.model.on('change:' + settings.modelKey, function (){
				that.set(settings.model.get(settings.modelKey));
			});
		}

		if(settings.value){
			this.el[0].src = settings.value;
		}

		if(settings.tooltip){
			this.el[0].title = settings.tooltip;
		}

		modoCore._stat('Image');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			get: function (){
				return this.el.attr('src');
			},

			/**
			 * Set the image to a transparent pixel.
			 */
			setBlank: function(){
				return this.set('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=');
			},

			set: function (url){
				this.el.attr('src', url);
				this.trigger('change', url);
				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Image;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.Image', function (){
				return modoCore.Image;
			});
		}
	}
})();