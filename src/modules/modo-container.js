/**
 * Modo Container
 * =============
 * A Modo container can contain child elements.
 * It brings functions for quickly adding/removing other CUI Element based objects.
 * @extends: modo.Element
 * @param {Object} params
 * @return {modo.Container}
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

	modoCore.defineElement('Container', ['container', 'container-layout-'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		var layouts = ['normal', 'inline', 'block'];

		var settings = {
			layout: params.layout || layouts[0]
		};

		if(_.indexOf(layouts, settings.layout) === -1){
			settings.layout = layouts[0];
		}

		this.addClass(modoCore.Container.classNames[0]);

		this.addClass(modoCore.Container.classNames[1] + settings.layout);

		modoCore._stat('Container');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * Will add one or more children to this element.
			 */
			add: function (){
				var o,
					i,
					_this = this,
					silent = false,
					events = [];

				for (i = 0; i < arguments.length; i++) {
					o = arguments[i];
					if(modo.isElement(o)){
						if(o.modoId === this.modoId){
							throw new Error('You can\'t add a container to itself');
						}
						_this.el.append(o.el);
						events.push(o);
					} else {
						if(modo.isDOM(o)){
							this.el.append(o);
							events.push(o);

						} else {
							//Consider to be a option object.
							if(typeof o === 'undefined'){
								throw new Error('Illegal object passed');
							}
							silent = o.silent;
						}
					}
				}

				if(!silent){
					for (i = 0; i < events.length; i++) {
						this.trigger('add', events[i]);
					}
				}

				return this;
			},

			/**
			 * This will remove one, or more children from this element.
			 */
			remove: function (){
				var o,
					i,
					events = [],
					silent = false;

				for (i = 0; i < arguments.length; i++) {
					o = arguments[i];
					if(modo.isElement(o)){
						$('#' + o.modoId, this.el).remove();
						events.push(o);
					} else {
						if(modo.isDOM(o)){
							$(o, this.el).remove();
							events.push(o);
						} else {
							silent = o.silent;
						}
					}
				}

				if(!silent){
					for (i = 0; i < events.length; i++) {
						this.trigger('remove', events[i]);
					}
				}

				return this;
			}
		});

	modoCore.Container.INLINE = 'inline';
	modoCore.Container.NORMAL = 'normal';
	modoCore.Container.BLOCK = 'block';

    if(typeof module !== 'undefined'){
        //commonJS modularization
        module.exports = modo.Container;
    } else {
        if(typeof define === 'function'){
            //AMD modularization
            define('modo.Container', function (){
                return modo.Container;
            });
        }
    }
})();