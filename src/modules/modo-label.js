/**
 * modo-Label
 * ===========
 * A label is the most basic of all get/set enabled elements.
 * You can use it to display some (html)text.
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
			return modoCore.Label.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Label.classNames[index];
	}

	modoCore.defineElement('Label', ['label'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		var that = this,
			settings = {};

		/**
		 * Binds the element to a Backbone Model.
		 * Previous bindings will be detached.
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
				params.value = model.get(modelKey);

				this.listenTo(model, 'change:' + modelKey, function (){
					that.set(model.get(modelKey));
				});
			}

			if(!noUpdate){
				this.set(settings.value);
			}

			return this;
		};

		if(params.model){
			this.bindToModel(params.model, params.modelKey, (typeof params.value === 'function') ? params.value : null, true);
		}

		this.el.html(typeof params.value !== 'function' ? params.value || '' : '');

		modoCore._stat('Label');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			set: function (value, options){
				var silent;

				options = options || {silent: false};

				silent = options.silent;

				this.el.html(value);
				if(!silent){
					this.trigger('change', value);
				}
				return this;
			},
			get: function (){
				return this.el.html();
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Label;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Label', [], function (){
				return modo.Label;
			});
		}
	}
})();