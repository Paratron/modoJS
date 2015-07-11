/**
 * Modo FormSlot
 * ============
 * The Modo Form Slot is a special kind of container to be used in modoCore.FormContainer elements.
 * The form slot can contain one or more control elements (and other elements) and adds a label to them.
 * Also, the form slot will be treated as multiple elements, when added to a form container.
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

	modoCore.defineElement('FormSlot', ['formslot', 'formslot-label', 'formslot-container'], function (params){
		params = params || {};

		modoCore.Container.call(this, params);

		this.addClass(modoCore.FormSlot.classNames[0]);

		var settings = {
			disabled: false,
			elements: {},
			label: params.label || ''
		};

		var $label = $('<div>' + settings.label + '</div>');
		$label.addClass(modoCore.cssPrefix + modoCore.FormSlot.classNames[1]);

		var $container = $('<div></div>');
		$container.addClass(modoCore.cssPrefix + modoCore.FormSlot.classNames[2]);

		this.el.append($label, $container);


		this.getElements = function (){
			return settings.elements;
		};

		/**
		 * Setter for the elements label text.
		 * @param {String} value
		 */
		this.set = function (value, options){
			var silence;

			options = options || {};

			silence = options.silence;

			settings.label = value;
			$label.html(value);
			if(!silence){
				this.trigger('change', value);
			}
			return this;
		};

		this.get = function (){
			return settings.label;
		};

		/**
		 * Will add a new element to the container.
		 * Keys are not required, but only keyed elements are visible to a modoCore.FormContainer.
		 * Either pass:
		 *
		 * - Modo elements directly
		 * - DOM/jQuery elements directly
		 * - Modo elements encapsulated in a object to add them with keys. Example: {mykey: someCUIelement}
		 *
		 * Modo elements that have been added with a key, can be used by FormContainers to be connected automatically to data sources.
		 */
		this.add = function (){
			var o,
				oo,
				key,
				eobj,
				wasKeyed = false,
				silence,
				events = [];

			function listenFunc(){
			}

			for (var i = 0; i < arguments.length; i++) {
				o = arguments[i];
				if(modoCore.isElement(o)){
					//Modoelement, directly passed.
					//Is it a modoCore.FormSlot element?
					if(o instanceof modoCore.FormSlot){
						oo = o.getElements();
						for (key in oo) {
							if(!modoCore.isGetSetElement(oo[key])){
								throw new Error('Only get/set enabled elements can be added with a data-key.');
							}
							oo[key].parentFormSlot = o;
							settings.elements[key] = oo[key];
							this.listenTo(oo[key], 'change', listenFunc);
						}
					} else {
						this.listenTo(o, 'change', listenFunc);
					}
					$container.append(o.el);
					events.push(o);
					continue;
				}
				//Check if its a keyed collection (object) of Modo elements.
				for (key in o) {
					if(modoCore.isElement(o[key])){
						if(!modoCore.isGetSetElement(o[key])){
							throw new Error('Only get/set enabled elements can be added with a data-key.');
						}
						settings.elements[key] = o[key];
						eobj = {};
						eobj[key] = o[key];
						$container.append(o[key].el);
						events.push(eobj);
						wasKeyed = true;
						if(settings.disabled && typeof o[key].disable === 'function'){
							o[key].disable();
						}
						continue;
					}
					break;
				}
				if(wasKeyed){
					continue;
				}
				if(modoCore.isDOM(o)){
					$container.append(o);
					events.push(o);
				} else {
					silence = o.silence;
				}
			}

			if(!silence){
				for (o = 0; o < events.length; o++) {
					this.trigger('add', events[o]);
				}
			}

			return this;
		};

		/**
		 * Either pass the key of a keyed element here, or directly a unkeyed element.
		 * @param key
		 */
		this.remove = function (key){
			if(typeof settings.elements[key] !== 'undefined'){
				$container.remove(settings.elements[key].el);
				return this;
			}
			if(typeof key.el !== 'undefined'){
				$container.remove(key.el);
			} else {
				$container.remove(key);
			}
			return this;
		};

		this.disable = function (){
			var key;

			settings.disabled = true;

			for (key in settings.elements) {
				if(typeof settings.elements[key].disable === 'function'){
					settings.elements[key].disable();
				}
			}

			this.el.addClass(modo.cssPrefix + 'disabled');
		};

		this.enable = function (){
			var key;

			settings.disabled = false;

			for (key in settings.elements) {
				if(typeof settings.elements[key].enable === 'function'){
					settings.elements[key].enable();
				}
			}

			this.el.removeClass(modo.cssPrefix + 'disabled');
		};

		if(params.disabled){
			this.disable();
		}

		modoCore._stat('FormSlot');
	})
		.inheritPrototype('Container');


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.FormSlot;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('FormSlot', [], function (){
				return modoCore.FormSlot;
			});
		}
	}
})();