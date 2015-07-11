/**
 * Modo FlexContainer
 * ========
 * The Flex Container does align its children either horizontally or vertically.
 * @extends modoCore.Container
 * @param {Object} params
 * @return {modoCore.FlexContainer}
 * @constructor
 */
/* global Modernizr:true */
(function (){
	'use strict';

	var modoCore,
		testEl,
		containers;

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	containers = [];

	modoCore.defineElement('FlexContainer', ['flexcontainer', 'flex-', 'flex-fallback', 'flex-js-fallback'], function (params){
		params = params || {};

		modoCore.Container.call(this, params);

		var settings = {
			direction: (params.direction === modoCore.FlexContainer.VERTICAL) ? modoCore.FlexContainer.VERTICAL : modoCore.FlexContainer.HORIZONTAL
		};

		this.addClass(modoCore.FlexContainer.classNames[0]);
		this.addClass(modoCore.FlexContainer.classNames[1] + settings.direction);

		if(modoCore.FlexContainer.fallback){
			this.addClass(modoCore.FlexContainer.classNames[2]);
		}
		if(modoCore.FlexContainer.jsFallback){
			this.addClass(modoCore.FlexContainer.classNames[3]);
		}

		/**
		 * Changes the flex direction of the element.
		 * @param d
		 * @return {*}
		 */
		this.direction = function (d){
			if(d !== modoCore.FlexContainer.HORIZONTAL && d !== modoCore.FlexContainer.VERTICAL){
				throw new Error('Illegal direction value');
			}

			this.removeClass(modoCore.FlexContainer.classNames[1] + settings.direction);
			settings.direction = d;
			this.addClass(modoCore.FlexContainer.classNames[1] + settings.direction);
			return this;
		};

		/**
		 * Call this to re-calculate the children dimensions.
		 * Only necessary
		 */
		this.update = function (){
			var flexClass,
				fixedElements,
				flexibleElements,
				consumed,
				flexSize;

			//mdo-flexible
			flexClass = modoCore.cssPrefix + modoCore.Element.classNames[1];

			fixedElements = [];
			flexibleElements = [];
			consumed = 0;

			_.each(this.el.children(), function (el){
				var $el;
				$el = $(el);

				if($el.hasClass(flexClass)){
					flexibleElements.push($el);
					return;
				}
				fixedElements.push($el);
				if(settings.direction === modoCore.FlexContainer.VERTICAL){
					consumed += $el.outerHeight();
					return;
				}
				consumed += $el.outerWidth();
			});

			if(settings.direction === modoCore.FlexContainer.VERTICAL){
				flexSize = (this.el.height() - consumed) / flexibleElements.length;
			} else {
				flexSize = (this.el.width() - consumed) / flexibleElements.length;
			}

			_.each(flexibleElements, function (el){
				var set;

				if(settings.direction === modoCore.FlexContainer.VERTICAL){
					set = {
						height: flexSize,
						width: '100%'
					};
				} else {
					set = {
						height: '100%',
						width: flexSize
					};
				}
				$(el).css(set);
			});
		};

		containers.push(this);

		if(modoCore.FlexContainer.jsFallback){
			this.update();
		}

		modoCore._stat('FlexContainer');
	})
		.inheritPrototype('Container')
		.extendPrototype({});

	modoCore.FlexContainer.HORIZONTAL = 'horizontal';
	modoCore.FlexContainer.VERTICAL = 'vertical';

	//==================================================================================================================

	/**
	 * Call this function to update all FlexContainer elements in the application.
	 */
	modoCore.FlexContainer.updateAll = function (){
		_.each(containers, function (el){
			el.update();
		});
	};

	modoCore.FlexContainer.jsFallback = false;
	modoCore.FlexContainer.fallback = false;

	//Test, if the current browser supports the recent flexbox spec.
	//If not, add the fallback class to the root element to get flex items rendered with the 2009 spec.
	if(typeof Modernizr !== 'undefined'){
		modoCore.FlexContainer.fallback = !Modernizr.flexbox;
	} else {
		//Sadly, no Modernizr present. Lets make a quick, harsh test.
		testEl = document.createElement('div');

		if(typeof testEl.style.msFlexBasis === 'undefined' && typeof testEl.style.webkitFlexBasis === 'undefined' && typeof testEl.style.mozFlexBasis === 'undefined' && typeof testEl.style.flexBasis === 'undefined'){
			modoCore.FlexContainer.fallback = true;
		}
	}

	if(modoCore.FlexContainer.fallback){
		//We have to test if we need to use the JS fallback, in case of IE, or other oldies!
		testEl = document.createElement('div');
		if(typeof testEl.style.MozBoxFlex === 'undefined' && typeof testEl.style.WebkitBoxFlex === 'undefined' && typeof testEl.style.BoxFlex === 'undefined'){
			modoCore.FlexContainer.jsFallback = true;

			$(window).on('resize', modoCore.FlexContainer.updateAll);

			modoCore.on('init', function (){
				modoCore.FlexContainer.updateAll();
			});
		}
	}
})();