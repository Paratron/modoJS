/**
 * Modo Dropdown
 * ============
 * Modo Dropdown enables the user to select an item from an Array or a Backbone Collection.
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

	modoCore.defineElement('DropDown', ['dropdown', 'dropdown-button', 'dropdown-list', 'dropdown-dropped', 'dropdown-selected'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(modoCore.DropDown.classNames[0]);

		var $button = $('<button></button>');
		$button.addClass(modoCore.cssPrefix + modoCore.DropDown.classNames[1]);

		if(params.tooltip){
			$button.attr('title', params.tooltip);
		}

		this.el.append($button);

		var settings = {
			data: params.data,
			buttonRender: params.buttonRender || function (d){
				if(typeof d === 'string' || typeof d === 'number'){
					return d;
				}
				for (var key in d) {
					if(key === '_m'){
						continue;
					}
					break;
				}
				return d[key].toString();
			},
			selectedItem: params.selectedItem !== undefined ? params.selectedItem : null,
			selectedData: null,
			placeholder:  params.placeholder || '',
			keyboard:     params.keyboard || true
		};

		if(params.keyboard){
			if(!modo.keyListener){
				throw new Error('keyListener missing');
			}
			modo.keyListener.enable();
		}

		if(typeof params.data === 'function'){
			settings.data = params.data();
		}

		params.className = modoCore.cssPrefix + modoCore.DropDown.classNames[2];

		var that = this;

		params.itemEvents = {
			'click': function (e, i){
				that.set(i);
			}
		};

		params.keyboard = settings.keyboard;

		var dropList = new modoCore.List(params);


		$button.on('click', function (e){
			if(that.disabled){
				return;
			}
			that.el.addClass(modoCore.cssPrefix + modoCore.DropDown.classNames[3]);
			if(settings.keyboard){
				dropList.focus();
			}
			e.stopPropagation();

			function clearFunc(e, key){
				e.preventDefault();
				e.stopPropagation();

				if(key === 'enter'){
					var selected = dropList.getFocusedIndex();
					if(!selected){
						return;
					}
					that.set(selected);
				}

				that.el.removeClass(modoCore.cssPrefix + modoCore.DropDown.classNames[3]);
				modo.keyListener.offScoped(dropList, 'escape', clearFunc);
				dropList.el.scrollTop(0);
				$('html').off('click', clearFunc);
				dropList.blur();
			}

			modo.keyListener.onceScoped(dropList, 'escape', clearFunc);
			modo.keyListener.onScoped(dropList, 'enter', clearFunc);
			$('html').one('click', clearFunc);
		});

		this.el.append(dropList.el);

		this.selectedItem = settings.selectedItem;
		this.selectedData = null;
		this.length = dropList.length;

		/**
		 * This will set the dropdown to a specific item from the dataset.
		 * If you passed a array as data, pass an array index as item.
		 * If you passed a object as data, pass the key as item.
		 * If you passed a Backbone Collection as data, pass a data id or cid.
		 * @param {Integer|String} item
		 */
		this.set = function (item, options){
			var silent,
				prevItem;

			options = options || {};

			silent = options.silent;

			prevItem = this.selectedItem;
			this.selectedItem = item;

			if(item === null){
				this.selectedData = null;
				$button.html(settings.buttonRender(settings.placeholder));
				this.trigger('change', null, null);
				return;
			}

			if(settings.data instanceof Backbone.Collection){
				if(!settings.data.get(item)){
					this.selectedItem = prevItem;
					throw new Error('Object not found');
				}

				this.selectedData = settings.data.get(item);
				$button.html(settings.buttonRender(_.extend(this.selectedData.toJSON(), {'_m': this.selectedData}), this.selectedData));
			} else {
				if(typeof settings.data[item] === 'undefined'){
					this.selectedItem = prevItem;
					throw new Error('Element "' + item + '" not found in dataset');
				}
				this.selectedData = settings.data[item];

				if(this.selectedData instanceof Backbone.Model){
					$button.html(settings.buttonRender(_.extend(this.selectedData.toJSON(), {'_m' : this.selectedData})));
				} else {
					$button.html(settings.buttonRender(this.selectedData));
				}
			}

			if(!silent){
				this.trigger('change', this.selectedItem, this.selectedData);
			}

			return this;
		};

		this.setDataset = function (dataset, options){
			settings.data = dataset;
			dropList.set(dataset, options);
			this.set(this.selectedItem, {silent: true});
			this.length = dropList.length;

			return this;
		};

		this.get = function (){
			return this.selectedItem;
		};

		this.getData = function (){
			return this.selectedData;
		};

		this.set(settings.selectedItem, {silent: true});

		modoCore._stat('DropDown');
	})
		.inheritPrototype('Element');

	modoCore.DropDown.prototype.disable = modoCore.Button.prototype.disable;
	modoCore.DropDown.prototype.enable = modoCore.Button.prototype.enable;
})();