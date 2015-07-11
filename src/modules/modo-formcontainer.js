/**
 * Modo FormContainer
 * =================
 * Use this container to create edit forms for your data.
 * You can add different editing controls to it (eg. Textfields, ToggleButtons, Dropdowns...) and assign each
 * control to a specific value of a object or Backbone Model.
 * When you pass a object or Backbone Model to the FormContainer, each value is provided to the connected editing control.
 * You can call one method of the FormContainer to retrieve all data from all attached controls assigned back to the original object/model structure.
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

	modoCore.defineElement('FormContainer', ['formcontainer'], function (params){
		params = params || {};

		modoCore.Container.call(this, params);


		this.addClass(modoCore.FormContainer.classNames[0]);

		//Keep the original add/remove functions.
		var pAdd = modoCore.FormContainer.prototype.add,
			pRemove = modoCore.FormContainer.prototype.remove;

		var that = this;

		var settings = {
			elements: {},
			autosave:     params.autosave || false,
			autosync: params.autosync,
			data: null,
			preparedData: null,
			csrf:         params.csrf || null,
			/**
			 * Prepare functions are used to convert data from the data source to the specified element.
			 * Example:
			 * function(dataValue){
                 *  return convertedValue;
                 * }
			 * @type {Object}
			 */
			prepare:      params.prepare || function (d){
				return d;
			},
			/**
			 * Clean Functions are used to convert data from the specified element to the data source.
			 * Example:
			 * function(elementValue){
                 *   return convertedValue;
                 * }
			 * Note: If the function returns no value, then nothing will be assigned to the data source (original will be kept).
			 * @type {Object}
			 */
			clean:        params.clean || function (d){
				return d;
			},
			/**
			 * This function is called, AFTER all prepare functions for the specified elements have been run.
			 * The complete prepared dataset can be manipulated and extended before its finally distributed to the single elements.
			 * May be necessary to feed multiple multiple control elements from one data value.
			 * @type {Function}
			 * @returns {Object}
			 */
			finalPrepare: params.finalPrepare || function (d){
				return d;
			},
			/**
			 * This function is called, AFTER all clean functions for the data source have been run.
			 * The complete prepared data set can be manipulated, before its copied to the originally passed object / Backbone Model.
			 * May be necessary to set one data value from multiple control elements, or remove temporary data fields.
			 * @type {Function}
			 * @returns {Object}
			 */
			finalClean:   params.finalClean || function (d){
				return d;
			},
			changeNotifier: function (/*elm, v*/){
				that.dirty = true;
				if(settings.autosave){
					that.save();
				}
				that.trigger('change');
			}
		};

		/**
		 * The blank data object will be used as form data when the set() function is called with no data.
		 * Useful for setting default values for new data objects.
		 * @type {Object}
		 */
		this.defaultData = params.defaultData || {};

		/**
		 * This flag will be set to true when one of the contained, keyed set/get enabled elements fire a change event.
		 * It will be set back to false, after a set() or save() call.
		 * ___Note:___ This will never switch to false in a autosave enabled FormContainer!
		 * @type {Boolean}
		 */
		this.dirty = false;

		/**
		 * Will add a new element to the container.
		 * Keys are not required, but only keyed elements are used to edit data from a data source.
		 * Either pass:
		 *
		 * - Modoelements directly
		 * - modoCore.FormSlot elements directly. Their internally added Modoelements (with keys) will be considered.
		 * - DOM/jQuery elements directly
		 * - Modoelements encapsulated in a object to add them with keys. Example: {mykey: someCUIelement}
		 *
		 * Modoelements that have been added with a key, can be used by FormContainers to be connected automatically to data sources.
		 */
		this.add = function (){
			var o,
				oo,
				key,
				eobj,
				silent,
				events = [],
				wasKeyed = false;

			function listenFunc(v){
				settings.changeNotifier(this, v);
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
					pAdd.call(this, o.el);
					events.push(o);
					continue;
				}
				//Check if its a keyed collection (object) of Modoelements.
				wasKeyed = false;
				for (key in o) {
					if(modoCore.isElement(o[key])){
						if(!modoCore.isGetSetElement(o[key])){
							throw new Error('Only get/set enabled elements can be added with a data-key.');
						}
						settings.elements[key] = o[key];
						eobj = {};
						eobj[key] = o[key];
						pAdd.call(this, o[key].el);
						events.push(eobj);
						wasKeyed = true;
						continue;
					}
					break;
				}
				if(wasKeyed){
					this.listenTo(o[key], 'change', function (v){
						settings.changeNotifier(this, v);
					});
					continue;
				}
				pAdd.call(this, o);
				if(!silent){
					events.push(o);
				}
			}

			if(!silent){
				for (key in events) {
					this.trigger('add', events[key]);
				}
			}

			return this;
		};

		/**
		 * Removes a previously added element from the FormContainer.
		 * @param {string} key Key of the element to be removed. If its inside a FormSlot, set force to true.
		 * @param {bool} [force=false] If you try to remove an element inside a FormSlot, an error will be thrown. Pass true, to forcefully dump the whole FormSlot. Be careful, this might remove other elements as well!
		 * @returns {*}
		 */
		this.remove = function (key, force){
			if(settings.elements[key] === undefined){
				throw new Error('No element with that key found');
			}

			if(settings.elements[key].parentFormSlot !== undefined){
				if(!force){
					throw new Error('Element with that key is part of a FormSlot. Call remove() with force=true to dump the FormSlot along.');
				}

				pRemove.call(this, settings.elements[key].parentFormSlot);

				_.each(settings.elements[key].parentFormSlot.getElements(), function (el, key){
					delete settings.elements[key];
				});
			}

			pRemove.call(this, settings.elements[key]);
			delete settings.elements[key];

			return this;
		};

		/**
		 * Destroys all elements inside the FormContainer.
		 */
		this.removeAll = function (){
			delete settings.elements;
			settings.elements = {};
			this.el.html('');
			return this;
		};

		/**
		 * Will pass a new dataset into the container and will populate all children with a set() function and a given key
		 * with its matching data.
		 * @param data
		 * @param options
		 */
		this.set = function (data, options){
			var key,
				silent,
				that;

			options = options || {silent: false};

			silent = options.silent;

			if(data === undefined){
				data = this.defaultData;
			}

			this.stopListening();

			settings.data = data;
			if(data instanceof Backbone.Model){
				settings.preparedData = data.toJSON();
			} else {
				settings.preparedData = data;
			}

			for (key in settings.preparedData) {
				if(typeof settings.prepare[key] === 'function'){
					settings.preparedData[key] = settings.prepare[key](settings.preparedData[key]);
				}
			}

			settings.preparedData = settings.finalPrepare(settings.preparedData);

			for (key in settings.preparedData) {
				if(typeof settings.elements[key] !== 'undefined'){
					if(typeof settings.elements[key].set === 'function'){
						settings.elements[key].set(settings.preparedData[key], options);
					}
				}
			}

			if(!silent){
				this.trigger('change', settings.preparedData);
			}

			that = this;
			_.each(this.getElements(), function (e){
				that.listenTo(e, 'change', function (v){
					settings.changeNotifier(this, v);
				});
			});

			return this;
		};

		/**
		 * Convenience method to reset the form fields.
		 */
		this.reset = function (options){
			return this.set(undefined, options);
		};

		/**
		 * Will return a getJSON()-like formatted object with all current values from all elements with a get()
		 * method and a populated key.
		 * @return {Object}
		 */
		this.get = function (){
			var out = {},
				key;
			for (key in settings.elements) {
				out[key] = settings.elements[key].get();
			}
			return out;
		};

		/**
		 * Returns an array of all added elements.
		 * @return []
		 */
		this.getElements = function (){
			return settings.elements;
		};

		/**
		 * Writes all changed data back to the given dataset.
		 * @param options
		 */
		this.save = function (options){
			var silent,
				data,
				key;

			options = options || {};

			silent = options.silent;

			data = this.get();

			for (key in data) {
				if(typeof settings.clean[key] === 'function'){
					data[key] = settings.clean[key](data[key]);
				}
			}

			data = settings.finalClean(data);

			if(settings.data instanceof Backbone.Model){
				settings.data.set(data);
			} else {
				settings.data = data;
			}

			this.dirty = false;

			if(!silent){
				this.trigger('save');
			}

			if(settings.autosync){
				if(settings.data instanceof Backbone.Model){
					settings.data.save();
				}
			}

			return this;
		};

		/**
		 * Offers a functionality like a normal HTML form provides and will send the data like if it would have been
		 * sent through a HTML form element.
		 * @param {Object} params
		 * @param {String} params.target URL which should receive the data.
		 * @param {String} params.method HTTP method (optional) default = POST
		 * @param {Boolean} params.ajax Should the data be sent through a AJAX call, or with traditional form submission? (optional) default = true
		 * @param {function} params.callback A function to be called after the data has been sent. Will receive an argument with the response string.
		 */
		this.send = function (params){
			params = params || {};

			var inSet = {
				target:   params.target || '',
				method:   params.method || 'POST',
				ajax: (typeof params.ajax !== 'undefined') ? params.ajax : true,
				callback: params.callback || function (){
				}
			};

			var dta = this.get();

			if(settings.csrf){
				dta.csrfToken = settings.csrf;
			}

			if(inSet.ajax){
				$.ajax(inSet.target, {
					data: dta,
					type: inSet.method
				}).always(inSet.callback);
				return this;
			}

			var form = document.createElement('form');
			form.setAttribute('method', inSet.method);
			form.setAttribute('action', inSet.target);
			var elm;
			for (var key in dta) {
				elm = document.createElement('input');
				elm.setAttribute('type', 'hidden');
				elm.setAttribute('name', key);
				elm.setAttribute('value', dta[key]);
				form.appendChild(elm);
			}
			document.body.appendChild(form);
			form.submit();
			return this;
		};

		/**
		 * Will try and set the input focus to the first element.
		 */
		this.focus = function (){
			var key;

			for (key in settings.elements) {
				if(typeof settings.elements[key].focus === 'function'){
					settings.elements[key].focus();
					return;
				}
			}

			return this;
		};

		this.disable = function (){
			var key;

			for (key in settings.elements) {
				if(typeof settings.elements[key].disable === 'function'){
					settings.elements[key].disable();
					return;
				}
			}

			this.el.attr('disabled', true).addClass(modoCore.cssPrefix + 'disabled');
			this.trigger('disable');
			return this;
		};

		this.enable = function (){
			var key;

			for (key in settings.elements) {
				if(typeof settings.elements[key].enable === 'function'){
					settings.elements[key].enable();
					return;
				}
			}

			this.el.attr('disabled', false).removeClass(modoCore.cssPrefix + 'disabled');
			this.trigger('enable');
			return this;
		};

		modoCore._stat('FormContainer');
	})
		.inheritPrototype('Container');

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.FormContainer;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('FormContainer', [], function (){
				return modoCore.FormContainer;
			});
		}
	}
})();