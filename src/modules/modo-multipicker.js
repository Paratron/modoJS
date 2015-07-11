/**
 * modo-MultiPicker
 * ================
 * The multi-picker lets a user select one or multiple elements from a given pool of options.
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
			return modoCore.MultiPicker.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.MultiPicker.classNames[index];
	}

	modoCore.defineElement('MultiPicker', ['multipicker', 'multipicker-selected', 'multipicker-button', 'multipicker-menu', 'multipicker-menu-container'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this._settings = {
			elements: {},
			selected: params.selected || []
		};

		this.addClass(cn(0, true));

		var that = this;

		this._selectedList = new modoCore.List({
			data:       params.selectedElements || [],
			className: cn(1),
			itemEvents: {
				click: function (e, i){
					e.preventDefault();
					e.stopPropagation();
					that._settings.selected.splice(i, 1);
					that.update();
					that.trigger('change');
				}
			},
			itemRender: function (e, i, m){
				if(that._settings.elements instanceof Backbone.Collection){
					m = that._settings.elements.get(e);
					e = m.toJSON();
				} else {
					e = that._settings.elements[e];
				}

				if(!params.selectedRender){
					return e;
				}
				return params.selectedRender(e, i, m);
			},
			emptyRender: params.emptyRender || undefined
		});

		this._pickButton = new modoCore.Button({
			label: params.buttonLabel || '+',
			className: cn(2)
		});

		function closeMenu(){
			that._pickMenu.hide();
			$(window).off('click', closeMenu);
		}

		this._pickMenu = new modoCore.List({
			className: cn(3),
			data: this._settings.elements,
			collector: function (c, isCollection){
				this._idRelations = null;

				if(!isCollection){
					if(c instanceof Object && !(c instanceof Array)){
						return _.omit(c, that._settings.selected);
					}


					that._pickMenu._idRelations = [];

					return _.filter(c, function (e, i){
						if(_.indexOf(that._settings.selected, i) === -1){
							that._pickMenu._idRelations.push(i);
							return true;
						}
						return false;
					});
				}

				return c.filter(function (e){
					return _.indexOf(that._settings.selected, e.id || e.cid) === -1;
				});
			},
			itemEvents: {
				'click': function (e, i, m){
					if(m instanceof Backbone.Model){
						that._settings.selected.push(m.id || m.cid);
					} else {
						if(that._pickMenu._idRelations){
							i = that._pickMenu._idRelations[i];
						}
						that._settings.selected.push(i);
					}
					that.update();
					that.trigger('change');
					closeMenu();
				}
			},
			itemRender: params.pickMenuRender || undefined,
			emptyRender: params.pickMenuEmptyRender || undefined
		});

		this._pickMenu.hide();

		this._pickButton.on('click', function (){
			that._pickMenu.show();
			setTimeout(function (){
				$(window).one('click', closeMenu);
			}, 10);
		});

		this.el.append(this._selectedList.el, '<div class="' + cn(4) + '"></div>');

		this.el.find('.' + cn(4)).append(this._pickButton.el, this._pickMenu.el);

		if(params.elements){
			this.setElements(params.elements);
		}

		if(params.selected){
			this.set(params.selected, {silent: true});
		}

		modoCore._stat('MultiPicker');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			get: function (){
				return this._settings.selected;
			},
			set: function (elements, options){
				elements = _.clone(elements);

				options = options || {silent: false};

				if(!(elements instanceof Array)){
					if(elements){
						elements = [elements];
					} else {
						elements = [];
					}
				}
				this._settings.selected = elements;
				this.update();

				if(!options.silent){
					this.trigger('change', this.get());
					this.trigger('change:selected', this.get());
				}

				return this;
			},
			setElements: function (elements, options){
				options = options || {silent: false};

				if(elements instanceof Array || elements instanceof Backbone.Collection){
					this._itemCount = elements.length;
				}

				if(elements instanceof Object){
					this._itemCount = _.keys(elements).length;
				}

				if(!elements){
					elements = [];
					this._itemCount = 0;
				}
				this._settings.elements = elements;
				this._pickMenu.set(elements);
				this.update();

				if(!options.silent){
					this.trigger('change', this.getElements());
					this.trigger('change:elements', this.getElements());
				}

				return this;
			},
			getElements: function (){
				return this._settings.elements;
			},
			update: function (){
				this._selectedList.set(this._settings.selected);
				this._selectedList.update();
				this._pickMenu.update();
				if(this._selectedList.length == this._itemCount){
					this._pickButton.disable();
				} else {
					this._pickButton.enable();
				}
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.MultiPicker;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('MultiPicker', [], function (){
				return modoCore.MultiPicker;
			});
		}
	}
})();