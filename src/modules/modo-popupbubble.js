/**
 * Modo PopUp Bubble
 * ================
 * A PopUp Bubble behaves a bit like a tooltip. It looks like a balloon, or a speech bubble and can be attached to
 * Modo elements or fixed positions on the screen.
 *
 * When opened, the PopUp Bubble will appear and can close itself when the user clicks somewhere on the screen.
 *
 * The most useful feature of the PopUp Bubble is its capability to attach itself relatively to another Modo element.
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

	//====================================================================

	/**
	 * This calculates the position of the Bubble and places it there.
	 * @param settings The Objects internal settings.
	 */
	function calculatePosition(obj, settings){
		var target = settings.attachTo;
		if(modoCore.isElement(target)){
			target = target.el;
		}

		var targetPos = {
			x: target.offset().left,
			y: target.offset().top,
			w: target.outerWidth(),
			h: target.outerHeight()
		};

		var pos;

		switch (settings.attachAt) {
		case 'tr':
			pos = {
				top:  targetPos.y - obj.el.outerHeight(),
				left: targetPos.x + (targetPos.w / 2)
			};
			break;
		case 'tc':
			pos = {
				top:  targetPos.y - obj.el.outerHeight(),
				left: targetPos.x - (obj.el.outerWidth() / 2 - targetPos.w / 2)
			};
			break;
		case 'tl':
			pos = {
				top:  targetPos.y - obj.el.outerHeight(),
				left: targetPos.x - (obj.el.outerWidth() - targetPos.w / 2)
			};
			break;

		case 'lt':
			pos = {
				top: targetPos.y,
				left: targetPos.x - obj.el.outerWidth()
			};
			break;
		case 'lc':
			pos = {
				top:  targetPos.y - (obj.el.outerHeight() / 2 - targetPos.h / 2),
				left: targetPos.x - obj.el.outerWidth()
			};
			break;
		case 'lb':
			pos = {
				top:  targetPos.y + targetPos.h - obj.el.outerHeight(),
				left: targetPos.x - obj.el.outerWidth()
			};
			break;

		case 'rt':
			pos = {
				top: targetPos.y,
				left: targetPos.x + targetPos.w
			};
			break;
		case 'rc':
			pos = {
				top:  targetPos.y - (obj.el.outerHeight() / 2 - targetPos.h / 2),
				left: targetPos.x + targetPos.w
			};
			break;
		case 'rb':
			pos = {
				top:  targetPos.y + targetPos.h - obj.el.outerHeight(),
				left: targetPos.x + targetPos.w
			};
			break;

		case 'br':
			pos = {
				top:  targetPos.y + targetPos.h,
				left: targetPos.x + (targetPos.w / 2)
			};
			break;
		case 'bc':
			pos = {
				top:  targetPos.y + targetPos.h,
				left: targetPos.x - (obj.el.outerWidth() / 2 - targetPos.w / 2)
			};
			break;
		case 'bl':
			pos = {
				top:  targetPos.y + targetPos.h,
				left: targetPos.x - (obj.el.outerWidth() - targetPos.w / 2)
			};
			break;
		}

		obj.el.css(pos);
	}

	modoCore.defineElement('PopUpBubble', ['popupbubble', 'popupbubble-attach-'], function (params){
		params = params || {};

		params.modal = false;

		modoCore.PopUp.call(this, params);

		this.addClass(modoCore.PopUpBubble.classNames[0]);

		var settings = {
			attachTo: null,
			attachAt: null,
			visible: false,
			autoHide: params.autoHide || true
		};

		var _this = this;

		var closer = function (){
			_this.close();
		};

		var possiblePositions = ['tl', 'tc', 'tr', 'lt', 'lc', 'lb', 'rt', 'rc', 'rb', 'bl', 'bc', 'br'];

		/**
		 * Attaches the PopUp Bubble to a element.
		 * @param {modoCore.*} element
		 * @param {String} position
		 */
		this.attach = function (element, position){
			if(_.indexOf(possiblePositions, position) === -1){
				throw new Error('Illegal position');
			}

			settings.attachTo = element;
			settings.attachAt = position;

			if(_this.isOpen()){
				calculatePosition(_this, settings);
			}

			for (var i = 0; i < possiblePositions.length; i++) {
				this.el.removeClass(modoCore.cssPrefix + modoCore.PopUpBubble.classNames + possiblePositions[i]);
			}

			this.el.addClass(modoCore.cssPrefix + modoCore.PopUpBubble.classNames[1] + position);

			return this;
		};

		if(typeof params.attachTo !== 'undefined'){
			//TODO: Intelligently find out best attachment position based on Bubble dimensions and target location.
			this.attach(params.attachTo, params.attachAt || modoCore.PopUpBubble.BOTTOM);
		}

		this.on('open', function (){
			if(this.el.parent() != modoCore.getRootElement()){
				modoCore.getRootElement().append(this.el);
			}
			calculatePosition(_this, settings);
			setTimeout(function (){
				if(settings.autoHide){
					$(window).one('click', closer);
				}
			}, 1);
		});

		this.on('close', function (){
			$(window).off('click', closer);
		});

		modoCore._stat('PopUpBubble');
	})
		.inheritPrototype('PopUp');

	modoCore.PopUpBubble.TOP = 'tc';
	modoCore.PopUpBubble.TOPLEFT = 'tl';
	modoCore.PopUpBubble.TOPRIGHT = 'tr';
	modoCore.PopUpBubble.LEFT = 'lc';
	modoCore.PopUpBubble.LEFTTOP = 'lt';
	modoCore.PopUpBubble.LEFTBOTTOM = 'lb';
	modoCore.PopUpBubble.RIGHT = 'rc';
	modoCore.PopUpBubble.RIGHTTOP = 'rt';
	modoCore.PopUpBubble.RIGHTBOTTOM = 'rb';
	modoCore.PopUpBubble.BOTTOM = 'bc';
	modoCore.PopUpBubble.BOTTOMLEFT = 'bl';
	modoCore.PopUpBubble.BOTTOMRIGHT = 'br';


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.PopUpBubble;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('PopUpBubble', [], function (){
				return modoCore.PopUpBubble;
			});
		}
	}
})();