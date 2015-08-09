/**
 * Modo Toggle Group
 * ================
 * The Toggle Group is a special type of container which can only contain elements of type modo.ToggleButton.
 * There can only be one toggled Button in a Toggle Group. If you toggle another (by script or user-interaction),
 * the previously toggled button gets un-toggled.
 * @extends: modo.Container
 * @param params
 * @return {modo.ToggleGroup}
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

	modoCore.defineElement('ToggleGroup', ['togglegroup'], function (params){
		params = params || {};

		params.layout = modo.Container.INLINE;

		modo.Container.call(this, params);

		this.removeClass(modo.Container.classNames[0]).addClass(modo.ToggleGroup.classNames[0]);

		this.elements = {};

		/**
		 * Can the element be untoggled again? Means: having no value.
		 * @type {*|boolean}
		 * @private
		 */
		this._untoggle = params.untoggle || false;

		//Keep the parents add and remove functions.
		var pAdd = modo.ToggleGroup.prototype.add;
		var pRemove = modo.ToggleGroup.prototype.remove;

		var _this = this;

		var selectedKey;

		function toggleListener(){
			//Note: "this" is the togglebutton that has been clicked.
			/*jshint validthis:true */
			var doUntoggle;

			_this.trigger('click', selectedKey);
			if(this.toggled){
				if(!_this._untoggle){
					return;
				}
				doUntoggle = true;
				selectedKey = null;
			}

			for (var key in _this.elements) {
				if(_this.elements[key].modoId === this.modoId && !doUntoggle){
					selectedKey = key;
				}
				if(_this.elements[key].toggled){
					_this.elements[key].set(false);
				}
			}

			if(!doUntoggle){
				this.set(true);
			}
			_this.trigger('change', selectedKey);
		}

		/**
		 * This will add one or more new buttons to the end of the toggle group.
		 * Just pass a key/value object, or a object of type modo.ToggleButton there.
		 * @param elements
		 */
		this.add = function (elements, options){
			var e,
				silent;

			options = options || {};

			silent = options.silent;

			for (var key in elements) {
				e = elements[key];

				if(modo.isElement(e)){
					if(!e instanceof modo.ToggleButton){
						throw new Error('Only Modo elements of type ToggleButton can be added to a ToggleGroup.');
					} else {
						e.lock();
						this.elements[key] = e;
						e.on('click', toggleListener);
						pAdd.call(this, e, options);
						if(typeof selectedKey === 'undefined'){
							this.set(key);
						}
						if(!silent){
							this.trigger('add', e);
						}
						continue;
					}
				}

				if(typeof elements[key] !== 'string'){
					throw new Error('Please pass key/value pairs with string values to this element.');
				}
				this.elements[key] = new modo.ToggleButton({
					label: elements[key]
				});
				this.elements[key].lock();
				this.elements[key].on('click', toggleListener);
				if(selectedKey === undefined && !this._untoggle){
					this.set(key);
				}
				pAdd.call(this, this.elements[key], options);
				if(!silent){
					this.trigger('add', this.elements[key]);
				}
			}
		};

		/**
		 * Pass either a key (string), or an array of keys to remove.
		 * Pass nothing to remove all elements.
		 * @param elements
		 */
		this.remove = function (elements, options){
			options = options || {};

			if(elements === undefined){
				elements = [];
				_.each(this.elements, function (v, k){
					elements.push(k);
				});
			}

			if(elements instanceof Array){
				_.each(elements, function (el){
					_this.remove(el, options);
				});
				return;
			}

			if(typeof elements === 'string'){
				if(typeof this.elements[elements] !== 'undefined'){
					pRemove.call(this, this.elements[elements], options);
					this.elements[elements].off('click', toggleListener);
					delete this.elements[elements];
					if(!options.silent){
						this.trigger('remove', elements);
					}
				}
			} else {
				pRemove.call(this, elements, options);
			}
		};

		/**
		 * Disables the element to not accept user input anymore.
		 */
		this.disable = function (){
			_.each(this.elements, function (el){
				if(el instanceof modoCore.ToggleButton){
					el.disable();
				}
			});
		};

		/**
		 * Enables the element to accept user input.
		 * Be careful - single previously disabled buttons inside the group will be enabled as well.
		 */
		this.enable = function (){
			_.each(this.elements, function (el){
				if(el instanceof modoCore.ToggleButton){
					el.enable();
				}
			});
		};

		/**
		 * Toggle the button with the given key programmatically.
		 * @param {String} key
		 * @param {object} options
		 * @param {boolean} options.silent Prevent any event triggering.
		 * @returns this
		 */
		this.set = function (key, options){
			var silent;

			options = options || {};

			silent = options.silent;

			if(typeof key === 'number'){
				key = String(key);
			}

			if(key === null && this._untoggle){
				if(selectedKey){
					this.elements[selectedKey].set(false);
				}
				selectedKey = key;
				if(!silent){
					this.trigger('change', key);
				}
				return this;
			}

			if(typeof this.elements[key] === 'undefined'){
				throw new Error('Object not in this group');
			}

			if(this.elements[key].get()){
				return this;
			}

			for (var inKey in this.elements) {
				this.elements[inKey].set((inKey === key));
			}

			selectedKey = key;

			if(!silent){
				this.trigger('change', key);
			}
			return this;
		};

		/**
		 * Returns the key of the currently toggled button.
		 * @returns {*}
		 */
		this.get = function (){
			return selectedKey;
		};


		if(params.elements !== undefined){
			this.add(params.elements);
		}

		if(params.selectedItem !== undefined){
			this.set(params.selectedItem);
		}


		function fetchCollection(){
			params.elements = {};
			_this.el.html('');
			var key, m, dta = {};

			for (key in params.collection.models) {
				m = params.collection.models[key];
				dta[(m.id || m.cid)] = m.get(params.pluck);
			}

			_this.add(dta);
			if(selectedKey){
				_this.set(selectedKey, {silent: true});
			}
		}


		if(params.collection !== undefined){

			fetchCollection();

			params.collection.on(params.updateOn ? params.updateOn.join(' ') : 'add change remove sort', function (){
				fetchCollection();
			});
		}

		modoCore._stat('ToggleGroup');
	})
		.inheritPrototype('Container')
		.extendPrototype({
			/**
			 * Returns the object that contains references to all contained elements.
			 * @returns object
			 */
			getElements: function (){
				return this.elements;
			},
			/**
			 * Returns the element by given key - if it exists.
			 * @param key
			 * @returns {*}
			 */
			getElementByKey: function (key){
				return this.elements[key];
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.ToggleGroup;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define(function (){
				return modoCore.ToggleGroup;
			});
		}
	}
})();