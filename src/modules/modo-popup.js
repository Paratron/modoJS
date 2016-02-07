/**
 * Modo PopUp
 * =========
 * A PopUp Element can be used to display content on top of any other content in the application.
 * Its easy to emulate "windows" or dialogs in your application with the PopUp Element.
 *
 * A Modo PopUp can be placed anywhere on the screen - it don't has to be added to a specific container or element.
 *
 * You can display a Modo PopUp either in normal, or modal mode (this displays a mask that blocks access to underlying elements).
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

	/**
	 * "Global" object shared between all popups. Needed to manage z-index depth and sharing of the modal mask.
	 * @type {Object}
	 */
	var internal = {
		openStack: [],
		modal: [],
		nonModal: [],
		mask: null,
		zIndex: 0,
		maskOwnerStack: [],
		maskOwner: null,
		showMask: function (modal, settings){
			if(internal.mask === null){
				internal.mask = $('<div></div>').hide();
				internal.mask.addClass(modoCore.cssPrefix + modoCore.PopUp.classNames[1]);
				if(settings.className){
					internal.mask.addClass(settings.className + '-mask');
				}
				modoCore.getRootElement().append(internal.mask);
				internal.mask.on('click', function (e){
					e.preventDefault();
					e.stopPropagation();
					if(internal.maskOwner === null){
						return;
					}
					if(internal.maskOwner[1].closeOnBackdrop){
						internal.maskOwner[0].close();
					}
				});
			}

			if(internal.maskOwner !== null){
				internal.maskOwnerStack.push(internal.maskOwner);
			}
			internal.mask[0].style.zIndex = modal.el[0].style.zIndex - 1;
			internal.mask.stop().fadeIn();
			internal.maskOwner = [modal, settings];
		},
		hideMask: function (){
			internal.maskOwner = null;
			if(internal.maskOwnerStack.length){
				internal.maskOwner = internal.maskOwnerStack.pop();
				internal.mask[0].style.zIndex = internal.maskOwner[0].el[0].style.zIndex - 1;
			} else {
				internal.mask.stop().fadeOut();
			}
		},
		getDepth: function (){
			internal.zIndex += 2;
			return 9000 + internal.zIndex - 2;
		}
	};

	modoCore.once('init', function (){
		modoCore.getRootElement().on('keydown', function (e){
			if(e.keyCode !== 27 || internal.openStack.length === 0){
				return;
			}

			var lastOpen = internal.openStack[internal.openStack.length - 1];

			if(lastOpen._settings.keyboard){
				lastOpen.close();
			}
		});
	});

	modoCore.defineElement('PopUp', ['popup', 'popup-mask', 'popup-level-'], function (params){
		params = params || {};

		modoCore.Container.call(this, params);

		this.classNames = modoCore.PopUp.classNames;

		this.addClass(this.classNames[0]);

		/**
		 * Used as a marker for the modoCore.generate() function.
		 * This states, that this element must not be passed to add() functions.
		 * @type {Boolean}
		 */
		this.noAdd = true;

		var _this = this;

		var settings = this._settings = {
			className: params.className, //Stored to be accessable for the mask element
			modal:      params.modal || false,
			keyboard:   params.keyboard || true,
			closeOnBackdrop: (typeof params.closeOnBackdrop !== 'undefined') ? params.closeOnBackdrop : true,
			attached: false,
			visible: false,
			animate:    params.animate || false,
			showEffect: params.showEffect || null,
			hideEffect: params.hideEffect || null
		};

		this.el.hide();

		this.open = function (){
			if(this.isOpen()){
				return;
			}

			if(!settings.attached){
				modoCore.getRootElement().append(this.el);
			}
			if(!settings.animate){
				this.el.show();
			} else {
				if(params.showEffect){
					params.showEffect(this.el);
				} else {
					this.el.fadeIn('slow');
				}
			}

			this.el[0].style.zIndex = internal.getDepth();
			settings.visible = true;
			if(settings.modal){
				internal.showMask(this, settings);
			}
			this.trigger('open');

			internal.openStack.push(this);

			this.addClass(this.classNames[2] + internal.openStack.length);
			this._myStackHeight = internal.openStack.length;

			return this;
		};

		this.close = function (){
			if(!this.isOpen()){
				return;
			}

			if(!settings.animate){
				this.el.hide();
			} else {
				if(params.hideEffect){
					params.hideEffect(this.el);
				} else {
					this.el.fadeOut('slow');
				}
			}
			settings.visible = false;
			if(settings.modal){
				internal.hideMask();
			}
			this.trigger('close');

			this.removeClass(this.classNames[2] + this._myStackHeight);

			internal.openStack = _.without(internal.openStack, this);

			return this;
		};

		this.move = function (x, y){
			if(y === undefined && typeof x === 'object'){
				y = x.y;
				x = x.x;
			}

			_this.el.css({
				top: y,
				left: x
			});

			_this.trigger('move', x, y);

			return this;
		};

		this.isOpen = function (){
			return settings.visible;
		};

		if(typeof params.x !== 'undefined'){
			this.el.css('left', params.x);
		}
		if(typeof params.y !== 'undefined'){
			this.el.css('top', params.y);
		}

		modoCore._stat('PopUp');
	}).inheritPrototype('Container');

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.PopUp;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('PopUp', [], function (){
				return modoCore.PopUp;
			});
		}
	}
})();