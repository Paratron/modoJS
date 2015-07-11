/**
 * Modo List
 * ========
 * A Modo List generates lists from data sets.
 * It can be either used by passing an array of objects as the data parameter, or a Backbone.Collection.
 * The data_renderer function is used to create the single list items html code.
 * The collector function (optional) is used to break down/filter the data set from the collection if you don't want to use the full collection.
 * updateOn holds an array of event names emitted by the Backbone.Collection on which you want to automatically re-draw the list.
 * itemEvents attaches listeners to the item elements itself, or their sub-elements.
 * @extends modo.Container
 * @param {Object} params
 * @constructor
 */
/* jshint loopfunc:true */
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

	/*var params = {
	 data: Backbone.Collection,
	 collector: function(collection){ return collection.filter(function(){return true;}) },
	 updateOn: ['add', 'change', 'remove', 'sort'],
	 itemRender: function(data){ return html; },
	 itemEvents: {
	 "click": function(e){},
	 "click .element": function(e){}
	 }
	 };*/
	modoCore.defineElement('List', ['list', 'list-item', 'list-empty-element', 'list-focus'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(modoCore.List.classNames[0]);

		var settings = {
			data: params.data,
			collector:          params.collector || function (c, isCollection){
				if(isCollection){
					return c.filter(function (){
						return true;
					});
				}
				return c;
			},
			updateOn:           params.updateOn || ['add', 'change', 'remove', 'sort', 'reset'],
			itemRender:         params.itemRender || function (d){
				if(!d){
					return;
				}
				if(typeof d === 'string' || typeof d === 'number'){
					return '<div>' + d + '</div>';
				}
				for (var key in d) {
					if(key === '_m'){
						continue;
					}
					break;
				}
				return '<div>' + d[key].toString() + '</div>';
			},
			searchStringRender: params.searchStringRender || function (d){
				if(!d){
					return;
				}
				var result;

				if(typeof d === 'string' || typeof d === 'number'){
					result = d;
				} else {
					for (var key in d) {
						if(key === '_m'){
							continue;
						}
						break;
					}
					result = d[key].toString();
				}
				return result.toLowerCase().replace(/ /gm, '');
			},
			itemEvents:         params.itemEvents || {},
			emptyRender:        params.emptyRender || function (){
				return '';
			},
			keyboard:           params.keyboard || false,
			keyboardInput: '',
			keyboardSearchStrings: null,
			focusIndex: null
		};

		//==========================================================

		var reactTimeout;

		function focusItem(){
			var foundDomElement,
				listItemClassName,
				focusClassName;

			if(settings.focusIndex === null){
				return;
			}

			listItemClassName = modoCore.cssPrefix + modoCore.List.classNames[1];
			focusClassName = modoCore.cssPrefix + modoCore.List.classNames[3];

			foundDomElement = $(that.el.find('.' + listItemClassName).eq(settings.focusIndex));
			that.el.find('.' + focusClassName).removeClass(focusClassName);
			foundDomElement.addClass(focusClassName);

			that.el.scrollTop(foundDomElement.offset().top -
							  (that.el.offset().top - that.el.scrollTop()) -
							  foundDomElement.height()
			);
		}

		function keyReact(e, key){
			if(key === 'down'){
				if(settings.focusIndex === null){
					settings.focusIndex = -1;
				}
				settings.focusIndex++;

				if(settings.focusIndex >= searchStrings.length){
					settings.focusIndex = 0;
				}

				focusItem();
				return;
			}

			if(key === 'up'){
				if(settings.focusIndex === null){
					settings.focusIndex = searchStrings.length;
				}
				settings.focusIndex--;

				if(settings.focusIndex < 0){
					settings.focusIndex = searchStrings.length - 1;
				}

				focusItem();
				return;
			}

			if(key.length > 1){
				return;
			}

			clearTimeout(reactTimeout);

			settings.keyboardInput += key;

			var result,
				i = 0,
				input,
				inputLen;

			input = settings.keyboardInput;
			inputLen = input.length;

			result = _.find(searchStrings, function (sString){
				i++;
				return sString.substr(0, inputLen) === input;
			});

			if(result){
				settings.focusIndex = i - 1;
				focusItem();
			}

			reactTimeout = setTimeout(function (){
				settings.keyboardInput = '';
			}, 1000);
		}

		//==========================================================

		//All contains a jQuery element list of all list elements.
		//This is used to get the index of a clicked element and fetching its Backbone model (when possible).
		var all;

		//This contains the Backbone Model IDs (cids) of all models in the order they are rendered.
		var ids;

		var dataset;

		var searchStrings;

		var that = this;

		var listItemClass = modoCore.cssPrefix + modoCore.List.classNames[1];

		/**
		 * Provides access to the number of elements being rendered by the list.
		 * @type {Number}
		 */
		this.length = 0;

		/**
		 * Will update the rendered output.
		 */
		this.update = function (options){
			var html = '',
				arrayMode = false,
				silent,
				i,
				result,
				searchResult,
				searchEnabled,
				renderData,
				modoElements = [];

			options = options || {};

			silent = options.silent;

			searchEnabled = settings.keyboard && typeof settings.searchStringRender === 'function';

			if(searchEnabled){
				searchStrings = [];
			}

			dataset = settings.collector(settings.data, settings.data instanceof Backbone.Collection);

			ids = [];
			if(typeof params.data === 'function'){
				settings.data = params.data();
			}
			if(dataset instanceof Backbone.Collection){
				dataset.each(function (e){
					ids.push(e.id || e.cid);
				});
			} else {
				if(dataset instanceof Array){
					arrayMode = true;
				} else {
					var newDataset = [];
					_.each(dataset, function (value, index){
						ids.push(index);
						newDataset.push(value);
					});
					dataset = newDataset;
				}
			}

			if(dataset && dataset.length){
				this.length = dataset.length;
				for (i = 0; i < dataset.length; i++) {
					searchResult = '';

					if(dataset[i] instanceof Backbone.Model){
						renderData = _.extend(dataset[i].toJSON(), {_m: dataset[i]});
						result = settings.itemRender.call(this, renderData, i);
						if(searchEnabled){
							searchStrings.push(settings.searchStringRender.call(this, renderData, i));
						}
					} else {
						result = settings.itemRender.call(this, dataset[i], i, (!arrayMode) ? ids[i] : undefined);
						if(searchEnabled){
							searchStrings.push(settings.searchStringRender.call(this, dataset[i], i, (!arrayMode) ? ids[i] : undefined));
						}
					}
					if(modoCore.isElement(result)){
						modoElements.push([result, i]);
						html += '<div></div>';
					} else {
						if(result.substr(0, 1) !== '<'){
							html += '<div>' + result + '</div>';
						} else {
							html += result;
						}
					}
				}
			} else {
				this.length = 0;
				result = settings.emptyRender();
				if(result.substr(0, 1) !== '<'){
					result = '<div>' + result + '</div>';
				}
				html += result;
			}

			this.el.html(html);

			all = this.el.children('*');
			all.addClass(listItemClass);
			if(!dataset || !dataset.length){
				this.el.children(':first').addClass(modoCore.cssPrefix + modoCore.List.classNames[2]);
			}

			/**
			 * Insert generated Modo Elements into the list.
			 */
			all = this.el.find('.' + modoCore.cssPrefix + modoCore.List.classNames[1]);
			for (i = 0; i < modoElements.length; i++) {
				all.eq(modoElements[i][1]).append(modoElements[i][0].el);
			}

			focusItem();

			if(!silent){
				this.trigger('update');
			}

			return this;
		};

		/**
		 * This returns the DOM element for a specific data key.
		 * @param {*} key The data-key of the DOM element you want to fetch.
		 * @return jQuery
		 */
		this.getItemByKey = function (key){
			var index;

			if(dataset instanceof Array){
				if(typeof key !== 'number'){
					throw new Error('You can only pass numeric keys to select items from arrays');
				}
				index = key;
			} else {
				index = _.indexOf(ids, key);
				if(index === -1){
					throw new Error('Element key not in dataset');
				}
			}

			return this.el.find('.' + modoCore.cssPrefix + modoCore.List.classNames[1]).eq(index);
		};

		/**
		 * This returns the lists filtered dataset in the same format as Backbones getJSON() function.
		 * @param {Integer} [limit] Set this to limit the amount of returned entries.
		 */
		this.get = function (limit){
			var jsonFormatted = [],
				i;

			if(settings.data instanceof Backbone.Collection){
				//dataset = settings.collector(settings.data);
				for (i = 0; i < dataset.length; i++) {
					jsonFormatted.push(dataset[i].toJSON());
					if(limit){
						if(jsonFormatted.length === limit){
							return jsonFormatted;
						}
					}
				}
				return jsonFormatted;
			} else {
				if(!limit){
					return dataset;
				}
				return dataset.slice(0, limit);
			}
		};

		/**
		 * Returns the index of the currently focused item, if any.
		 * @returns {null}
		 */
		this.getFocusedIndex = function (){
			if(ids.length){
				return ids[settings.focusIndex];
			}
			return settings.focusIndex;
		};

		/**
		 * This replaces the current dataset of the element and triggers a update.
		 * @return this
		 */
		this.set = function (dataset, options){
			settings.data = dataset;

			this.stopListening();
			if(settings.data instanceof Backbone.Collection){
				that.listenTo(settings.data, settings.updateOn.join(' '), function (){
					that.update();
				});
			}

			this.update(options);

			return this;
		};

		if(settings.data instanceof Backbone.Collection){
			that.listenTo(settings.data, settings.updateOn.join(' '), function (){
				that.update();
			});
		}

		for (var evt in settings.itemEvents) {
			var chain = evt.split(' ');
			this.el.on(chain.shift(), '.' + listItemClass + ' ' + chain.join(' '), (function (evt){
				return function (e){
					var $this = $(this),
						listElement,
						clickedIndex,
						index = 0,
						data;

					//Don't capture events on empty list placeholders.
					if($this.hasClass(modoCore.cssPrefix + modoCore.List.classNames[2])){
						return;
					}

					if($this.hasClass(listItemClass)){
						listElement = $this;
					} else {
						listElement = $this.parents('.' + listItemClass);
					}

					clickedIndex = -1;
					$.each(all, function (){
						if($(this).is(listElement)){
							clickedIndex = index;
							return false;
						}
						index++;
					});

					if(clickedIndex === -1){
						throw new Error('Weird. I could not find the matching element. Please report this!');
					}

					if(dataset instanceof Backbone.Collection){
						index = ids[clickedIndex];
						data = settings.data.get(ids[clickedIndex]);
					} else {
						if(ids.length){
							index = ids[clickedIndex];
						} else {
							index = clickedIndex;
						}
						data = dataset[clickedIndex];
					}
					if(typeof settings.itemEvents[evt] === 'function'){
						settings.itemEvents[evt].call(this, e, index, data, that);
					} else {
						that.trigger('item:' + settings.itemEvents[evt], e, index, data);
					}
				};
			})(evt));
		}

		this.focus = function (){
			if(!settings.keyboard){
				return;
			}
			modoCore.keyListener.enable();
			modoCore.keyListener.setScope(that);
			modoCore.keyListener.onScoped(that, 'keydown', keyReact);
		};

		this.blur = function (){
			if(!settings.keyboard){
				return;
			}
			modoCore.keyListener.offScoped(that, 'keydown', keyReact);
			modoCore.keyListener.releaseScope(that);
			settings.keyboardInput = '';
			settings.focusIndex = null;
			that.el.find('.' + modoCore.cssPrefix + modoCore.List.classNames[3]).removeClass(modoCore.cssPrefix + modoCore.List.classNames[3]);
		};

		if(params.data !== void 0){
			this.update();
		}

		modoCore._stat('List');
	})
		.inheritPrototype('Element');
})();