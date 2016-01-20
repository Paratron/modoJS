/**
* modoJS 1.1.3
* =========================
* (c) 2013-2015 Christian Engel - wearekiss.com
* modoJS may be freely distributed under the MIT license.
* Documentation under http://docs.modojs.com*/
(function (root){
	'use strict';

	var modo,
		modoRollback,
		internals,
		$;

	modo = {};
	$ = jQuery;

	modoRollback = root.modo;

	modo.VERSION = '1.0.0';

	/**
	 * This is the CSS-Prefix, used by EVERY Modo element you create.
	 * @type {String}
	 */
	modo.cssPrefix = 'mdo-';

	internals = {
		count: 0,
		domRoot: null,
		/**
		 * Will return a new and unique modo element id.
		 */
		getId: function (){
			this.count += 1;
			return modo.cssPrefix + this.count;
		}
	};


	/**
	 * Use this function to add basic CUI classes to your root app element.
	 * Leave the element empty, to use the document body.
	 * @param {Object} domTarget The DOM-Node to be used as application container. Optional. If omitted, the BODY tag is used.
	 * @param {modo.*} rootElement Any Modo Element to be used as core element.
	 */
	modo.init = function (domTarget, rootElement){
		var $domRoot;

		if(rootElement === undefined){
			$domRoot = $('body');
			rootElement = domTarget;
		} else {
			if(domTarget instanceof $){
				$domRoot = domTarget;
			} else {
				$domRoot = $(domTarget);
			}
		}

		$domRoot.addClass(modo.cssPrefix + 'root');
		internals.domRoot = $domRoot;
		if(modo.isElement(rootElement)){
			$domRoot.append(rootElement.el);
		} else {
			throw new Error('Root element no modo element');
		}
		modo.trigger('init');
		return this;
	};

	/**
	 * Object used by modoJS to keep track of required external libraries.
	 * @type {{}}
	 * @private
	 */
	modo._libraries = {};

	/**
	 * Object used by modoJS to keep track of which modo elements have been created in the current application.
	 * @type {{}}
	 * @private
	 */
	modo._stats = {};

	/**
	 * Called by element constructors to generate creation statistics.
	 * @param objName
	 * @private
	 */
	modo._stat = function (objName){
		if(modo._stats[objName]){
			modo._stats[objName]++;
			return;
		}
		modo._stats[objName] = 1;
	};

	/**
	 * If your element requires external libraries to be functional, you can
	 * make certain functions inside your element be enabled after the library has
	 * been loaded.
	 *
	 * Additional libraries may be pulled on element definition.
	 */
	modo.setLoadCallback = function (element, callback){
		var l,
			name;

		if(modo.isElement(element)){
			name = element.constructor.elementName;
		} else {
			name = element;
		}

		if(modo._libraries[name]){
			l = modo._libraries[name];
		} else {
			l = modo._libraries[name] = {
				u: [], //urls
				l: 0,   //loaded
				c: []   //callbacks
			};
		}

		if(l.l === true){
			return callback();
		}

		l.c.push(callback);
	};


	/**
	 * This method defines a new modo element on the modoJS library.
	 * @param {String} name
	 * @param {Array} classNames
	 * @param {Function} Constructor
	 * @return Object;
	 */
	modo.defineElement = function (name, classNames, Constructor){
		if(typeof this[name] !== 'undefined'){
			throw new Error('Cannot define modo element "' + name + '". Its already defined');
		}

		Constructor.elementName = name;
		Constructor.classNames = classNames;

		this[name] = Constructor;

		return {
			/**
			 * This method inherits the prototype object of another modo element.
			 * @param {String} targetName
			 * @param {String} sourceName
			 * @return this;
			 */
			inheritPrototype: function (){
				var key,
					protos;

				protos = [];

				for (key = 0; key < arguments.length; key++) {
					protos.push(modo[arguments[key]].prototype);
				}

				_.extend.apply(window, [Constructor.prototype].concat(protos));

				return this;
			},
			/**
			 * Extend the elements prototype with custom methods.
			 * @param ext
			 * @returns this
			 */
			extendPrototype: function (ext){
				_.extend(Constructor.prototype, ext);
				return this;
			},
			/**
			 * Requires modoJS to load an external library for the element to be functional.
			 * Libraries to be loaded come in this format:
			 *
			 * [
			 *  [url, checkObject, directLoad],
			 *  ...
			 * ]
			 *
			 * CheckObject is to be checked if its defined before the url gets loaded.
			 * This way, developers may load the required libraries beforehand from local sources.
			 * @param {array} urls
			 * @returns this
			 */
			requireLibrary: function (urls){
				var toBeLoaded = [];

				if(!_.isArray(urls)){
					throw new Error('Invalid call');
				}

				if(!_.isArray(urls[0])){
					urls = [urls];
				}

				var l,
					loadCallback;

				if(modo._libraries[name]){
					l = modo._libraries[name];
					l.u = _.pluck(urls, 0);
				} else {
					l = modo._libraries[name] = {
						u: _.pluck(urls, 0), //urls
						l: 0,   //loaded
						c: []   //callbacks
					};
				}

				loadCallback = function (){
					l.l++;

					if(l.l >= l.u.length){
						l.l = true;
						_.each(l.c, function (cb){
							cb();
						});
					}
				};

				_.each(urls, function (uObj){
					if(_.isUndefined(uObj[1])){
						toBeLoaded.push(uObj[0]);
					}
				});

				if(!toBeLoaded.length){
					l.l = l.u.length;
					loadCallback();
					return this;
				}

				if(window.require !== undefined){
					l.l = l.u.length;
					window.require(toBeLoaded, loadCallback);
				} else {
					_.each(toBeLoaded, function (url){
						var s = document.createElement('script');
						s.onload = loadCallback;
						document.head.appendChild(s);
						s.src = url;
					});
				}

				return this;
			}
		};
	};

	/**
	 * The callback will be called automatically when the given element
	 * has been added to the DOM.
	 * @param {modo.Element} element
	 * @param {function} callback
	 * @returns modoCore
	 */
	modo.waitForDom = function (element, callback){
		if(modo.isInDom(element)){
			if(element._waitForDom){
				clearInterval(element._waitForDom);
				delete element._waitForDom;
			}
			return callback();
		}

		if(element._waitForDom){
			return this;
		}

		element._waitForDom = setInterval(function (){
			modo.waitForDom(element, callback, true);
		}, 100);

		return this;
	};

	/**
	 * Unsetting the global modoJS object to avoid namespace collisions.
	 */
	modo.noConflict = function (){
		root.modo = modoRollback;
	};

	/**
	 * Checks if the passed element is a modoJS element.
	 * @param {Object} element
	 * @return {Boolean}
	 */
	modo.isElement = function (element){
		if(typeof element !== 'object' || !element){
			return false;
		}
		return (element.modoId !== undefined && element.el !== undefined);
	};

	/**
	 * Checks if the passed element is a get/set enabled modoJS element.
	 * @param element
	 * @return {Boolean}
	 */
	modo.isGetSetElement = function (element){
		if(!this.isElement(element)){
			return false;
		}
		return (typeof element.get === 'function' && typeof element.set === 'function');
	};

	/**
	 * Checks if the given element is a DOM node, or a jQuery object.
	 * @param element
	 * @return {Boolean}
	 */
	modo.isDOM = function (element){
		if(typeof element === 'undefined'){
			return false;
		}
		return ((element.nodeName !== undefined) || (element instanceof $));
	};

	/**
	 * Checks if the DOM element of the given modoJS Object is currently part of the DOM, or not.
	 * @param element
	 * @return {Boolean}
	 */
	modo.isInDom = function (element){
		return $.contains(document.documentElement, element.el[0]);
	};

	/**
	 * Returns the root DOM Element, defined in modo.init().
	 */
	modo.getRootElement = function (){
		if(internals.domRoot){
			return internals.domRoot;
		}
		return $('body');
	};

	/**
	 * This will reset modos state.
	 * * sets the object creation counter to zero.
	 * * clears the root element
	 * * resets the css-prefix to "mdo-"
	 * Make sure to remove all previously created modo elements to avoid ID collisions!
	 */
	modo.reset = function (){
		internals.count = 0;
		internals.domRoot = null;
		modo.cssPrefix = 'mdo-';
	};

	/**
	 * Used by modo.generate().
	 * Copies the reference keys over, from nested generate() calls.
	 * @param source
	 * @param refs
	 */
	function copyRefs(source, refs){
		var key;

		for (key in source) {
			if(typeof refs[key] !== 'undefined'){
				throw new Error('Duplicated reference key "' + key + '"');
			}
			refs[key] = source[key];
		}
	}

	/**
	 * Used by modo.generate().
	 * Used to filter out all non-addable objects before applying an add() to containers.
	 * @param o
	 * @returns {boolean}
	 */
	function filterFunction(o){
		return (typeof o.noAdd === 'undefined');
	}

	/**
	 * This will generate a tree of nested Modo elements.
	 * Use it to create complex, nested User Interfaces with one function call.
	 * @param {Array|Object} struct Your UI definition structure.
	 * @return {Object} A object with the Modo elements, you wanted references to.
	 */
	modo.generate = function (){
		var struct = arguments[0],
			subcall = arguments[1],
			generated = [],
			refs = {},
			o,
			result,
			mobj,
			i,
			j,
			keyed,
			opt = {silent: true},
			singleObj = false;

		//Enable to pass one definition object directly, instead of encapsulating it in an array.
		if(!(struct instanceof Array)){
			struct = [struct];
			singleObj = true;
		}

		for (i = 0; i < struct.length; i++) {
			o = struct[i];

			if(modo.isElement(o)){
				//Getting a pre-compiled element here - maybe a UI module.
				generated.push(o);
				continue;
			}

			if(o instanceof Object){
				//Check if this is a keyed, pre-compiled element - maybe for a Viewstack.
				result = false;
				for (j in o) {
					if(o.hasOwnProperty(j)){
						if(modo.isElement(o[j])){
							generated.push(o);
							result = true;
							break;
						}
						break;
					}
				}
				if(result){
					continue;
				}
			}

			if(modo[o.type] === undefined){
				throw new Error('Unknown modo element "' + o.type + '"');
			}

			mobj = new modo[o.type](o.params);
			generated.push(mobj);

			//Reference flag - user wants a reference to that element.
			if(o.ref !== undefined){
				singleObj = false;
				if(refs[o.ref] !== undefined){
					throw new Error('Duplicated reference key "' + o.ref + '"');
				}
				refs[o.ref] = mobj;
			}

			//Flexible flag - has only effect inside a FlexContainer.
			if(o.flexible){
				mobj.setFlexible();
			}

			//Event flag - automatically attach some events.
			if(o.on){
				for (j in o.on) {
					if(o.on.hasOwnProperty(j)){
						mobj.on(j, o.on[j]);
					}
				}
			}

			//One-Time Event flag - automatically attach events that are only responded to, once.
			if(o.once){
				for (j in o.once) {
					if(o.once.hasOwnProperty(j)){
						mobj.once(j, o.once[j]);
					}
				}
			}

			//Hidden flag - for making objects invisible upon creation.
			if(o.hidden){
				mobj.hide();
			}

			//Disabled flag - works on some elements like buttons and will disable them upon creation.
			if(o.disabled){
				if(typeof mobj.disable === 'function'){
					mobj.disable();
				}
			}

			//Attach children to a container element.
			if(o.children instanceof Array && o.children.length){
				if(typeof mobj.add !== 'function'){
					throw new Error('Element of type "' + o.type + '" doesn\'t support the addition of children');
				}
				result = modo.generate(o.children, true);
				if(typeof mobj.getElements === 'function'){
					//Okay, this function exists on elements which want to have keyed elements added.
					//Lets look for keys.
					for (j = 0; j < o.children.length; j++) {
						if(typeof result[0][j].noAdd !== 'undefined'){
							continue;
						}
						if(typeof o.children[j].key !== 'undefined'){
							keyed = {};
							keyed[o.children[j].key] = result[0][j];
							mobj.add.call(mobj, keyed, opt);
						} else {
							mobj.add.call(mobj, result[0][j], opt);
						}
					}
				} else {
					result[0].push(opt);
					mobj.add.apply(mobj, _.filter(result[0], filterFunction));
				}
				if(result[1].length){
					singleObj = false;
				}
				copyRefs(result[1], refs);
			}

			//Like the above block, but children are defined in a {key:value} format
			//Thats an easier definition for some container types that require keyed children.
			if(o.children instanceof Object && !(o.children instanceof Array)){
				if(typeof mobj.add !== 'function'){
					throw new Error('Element of type "' + o.type + '" doesn\'t support the addition of children');
				}

				if(typeof mobj.getElements !== 'function'){
					throw new Error('Element of type "' + o.type + '" doesn\'t support keyed children.');
				}

				struct = [];
				keyed = [];
				for (j in o.children) {
					if(o.children.hasOwnProperty(j)){
						struct.push(o.children[j]);
						keyed.push(j);
					}
				}

				result = modo.generate(struct, true);
				for (j = 0; j < keyed.length; j++) {
					struct = {};
					struct[keyed[j]] = result[0][j];
					mobj.add.call(mobj, struct, opt);
				}
				copyRefs(result[1], refs);
			}

			if(singleObj){
				return mobj;
			}
		}

		if(subcall){
			return [generated, refs];
		}

		return refs;
	};

	//=============================================================================

	/**
	 * Modo Element
	 * ===========
	 * This is a basic Modo element, which does not have any enhancements.
	 * Basically create any Modo related element based on this object. You can pass in a DOM Element into the params - if not, a DIV is created.
	 * @param {Object} params
	 * @constructor
	 */
	modo.Element = function (params){
		params = params || {};

		var key,
			settings = {
				className:      params.className || '',
				dataAttributes: params.dataAttributes || {}
			};

		this.el = params.el || $('<div></div>');

		this.el.addClass(modo.cssPrefix + modo.Element.classNames[0]);

		this.modoId = internals.getId();

		this.visible = true;

		this.showEffect = params.showEffect || null;

		this.hideEffect = params.hideEffect || null;

		//Apply globally accessible options to the element.
		//This may be used by elements who want to extend other elements or react to them.
		if(params._options){
			this._options = params._options;
		}

		if(settings.className){
			this.el.addClass(settings.className);
		}

		this.el.attr('id', this.modoId);

		for (key in settings.dataAttributes) {
			if(settings.dataAttributes.hasOwnProperty(key)){
				this.el.attr('data-' + key, settings.dataAttributes[key]);
			}
		}

		modo._stat('Element');
	};

	modo.Element.classNames = ['element', 'flexible', 'disabled'];

	_.extend(modo.Element.prototype, Backbone.Events, {

		/**
		 * Define whether a container should be flexible inside a flex layout, or not.
		 * @param value (optional) default = true
		 * @return {modo.*}
		 */
		setFlexible: function (value){
			if(typeof value === 'undefined'){
				value = true;
			}

			if(value){
				this.el.addClass(modo.cssPrefix + modo.Element.classNames[1]);
			} else {
				this.el.removeClass(modo.cssPrefix + modo.Element.classNames[1]);
			}
			return this;
		},

		/**
		 * This will make the connected DOM element visible.
		 * @return {modo.*}
		 */
		show: function (options){
			var silent;

			options = options || {};

			silent = options.silent;

			if(this.visible){
				return this;
			}

			if(options.effect){
				this.el[options.effect].apply(this.el, options.effectArgs || []);
			} else {
				if(this.showEffect){
					this.el[this.showEffect.effect].apply(this.el, this.showEffect.effectArgs || []);
				} else {
					this.el.show();
				}
			}

			this.visible = true;
			if(!silent){
				this.trigger('show');
			}
			return this;
		},

		/**
		 * This will hide the connected DOM element.
		 * @return modo.*
		 */
		hide: function (options){
			var silent;

			options = options || {};

			silent = options.silent;

			if(!this.visible){
				return this;
			}

			if(options.effect){
				this.el[options.effect].apply(this.el, options.effectArgs || []);
			} else {
				if(this.hideEffect){
					this.el[this.hideEffect.effect].apply(this.el, this.hideEffect.effectArgs || []);
				} else {
					this.el.hide();
				}
			}

			this.visible = false;
			if(!silent){
				this.trigger('hide');
			}
			return this;
		},

		/**
		 * Will add another class name to the DOM element.
		 * The class name will be automatically prefixed.
		 * @param {String} classname
		 * @return {modo.*}
		 */
		addClass: function (classname, doPrefix){
			if(doPrefix === undefined){
				doPrefix = true;
			}

			classname = classname.split(' ');

			if(doPrefix){
				classname = _.map(classname, function (classname){
					return modo.cssPrefix + classname;
				});
			}
			this.el.addClass(classname.join(' '));
			return this;
		},

		/**
		 * Will remove a class name from the DOM element.
		 * The class name will be automatically prefixed
		 * @param {String} classname
		 * @returns {modo.*}
		 */
		removeClass: function (classname, doPrefix){
			if(doPrefix === undefined){
				doPrefix = true;
			}

			classname = classname.split(' ');

			if(doPrefix){
				classname = _.map(classname, function (classname){
					return modo.cssPrefix + classname;
				});
			}
			this.el.removeClass(classname.join(' '));
			return this;
		},

		/**
		 * Adds (a) classname(s) for the given amount of milliseconds.
		 * @param {String} classname
		 * @param {Integer} timeout
		 */
		addClassTemporary: function (classname, timeout, doPrefix){
			var that = this;
			this.addClass(classname, doPrefix);
			setTimeout(function (){
				that.removeClass(classname, doPrefix);
			}, timeout);
			return this;
		}
	});

	_.extend(modo, Backbone.Events);

	if(typeof define === 'function' && define.amd){
		define('modo', function (){
			return modo;
		});
	}

	root.modo = modo;
})(this);
/**
 * Modo Button
 * ================
 * This creates a simple button, which is extended by Backbone.Events.
 * It also brings enable() and disable() functions to handle user accessibility.
 * @extends modo.Element
 * @param {Object} params
 * @return {modo.Button}
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

	modoCore.defineElement('Button', ['button'], function (params){
		params = params || {};

		var settings = {
			label:   params.label || '',
			tooltip: params.tooltip || ''
		};

		/**
		 * A helper function to return css classnames for this element.
		 * @param index
		 * @param prefixed
		 * @returns {*}
		 */
		function cn(index, prefixed){
			if(prefixed){
				return modo.cssPrefix + modo.Button.classNames[index];
			}
			return modo.Button.classNames[index];
		}

		modoCore.Element.call(this, _.extend(params, {el: $('<button title="' + settings.tooltip + '">' + settings.label + '</button>')}));

		this.addClass(cn(0));

		this.disabled = false;

		var that = this;
		this.el.on('click', function (e){
			if(this.disabled){
				return;
			}
			that.trigger('click', e);
		});

		if(params.disabled){
			this.disable({silent: true});
		}

		modoCore._stat('Button');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * Will re-set the buttons label and tooltip
			 * @param label
			 */
			setLabel: function (label, tooltip){
				if(label !== undefined && label !== null){
					this.el.html(label);
				}

				if(tooltip !== undefined){
					this.el.attr('title', tooltip);
				}

				this.trigger('update');

				return this;
			},

			/**
			 * This will enable the button for user interaction.
			 */
			enable: function (){
				this.removeClass(modo.Element.classNames[2]);
				this.el.attr('disabled', false);
				this.disabled = false;
				this.trigger('enabled');

				return this;
			},

			/**
			 * This will disable the button for user interaction.
			 */
			disable: function (){
				this.addClass(modo.Element.classNames[2]);
				this.el.attr('disabled', true);
				this.disabled = true;
				this.trigger('disabled');

				return this;
			},

			focus: function (){
				this.el.focus();
			},

			blur: function (){
				this.el.blur();
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Button;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.Button', function (){
				return modoCore.Button;
			});
		}
	}
})();
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
/**
 * Modo Input Text
 * ==============
 * The text input control can be used for different occasions.
 * Use the type parameter to tweak it to any kind of input you need (eg. search, mail, ...).
 * Tip: it provides easy event-names for different keyboard events, like "keydown:enter".
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

	var placeholderFallback;
	(function (){
		var test = document.createElement('input');
		placeholderFallback = !('placeholder' in test);
	})();


	modoCore.defineElement('InputText', ['inputtext', 'inputtext-', 'placeholded', 'autogrow', 'filled'], function (params){
		params = params || {};

		var settings,
			that,
			keymap,
			lazyFocus;

		settings = {
			type:        params.type || 'text',
			placeholder: params.placeholder || '',
			changeThreshold: (params.changeThreshold !== undefined) ? parseInt(params.changeThreshold, 10) : 500,
			timeout: null,
			lastValue: null,
			value:       params.value || '',
			boundModel: null,
			boundModelKey: null,
			maxlength:   params.maxlength || null,
			autogrow:    params.autogrow || false
		};

		modoCore.Element.call(this, _.extend(params, {el: $(settings.type !== 'textarea' ? '<input type="' + settings.type + '">' : '<textarea></textarea>')}));

		this.addClass(modoCore.InputText.classNames[0]);
		this.addClass(modoCore.InputText.classNames[1] + settings.type);

		if(params.maxlength){
			this.el.attr('maxlength', params.maxlength);
		}

		if(settings.type === 'textarea'){
			this.el.attr('rows', 1);
		}

		that = this;

		/**
		 * Ability to programattically check if the input field currently has cursor focus.
		 * @type {boolean}
		 */
		this.hasFocus = false;

		keymap = {
			13: 'enter',
			27: 'escape',
			18: 'alt',
			17: 'ctrl',
			16: 'shift',
			38: 'up',
			40: 'down',
			37: 'left',
			39: 'right',
			8: 'backspace',
			46: 'del',
			35: 'end',
			36: 'pos1',
			45: 'paste',
			9: 'tab'
		};

		//If you want to select text after a "focus" event,
		//it will fail when the user clicks in the textfield.
		//A click seems to set a focus (at least in chrome).
		//So this debounced function will cause the elements
		//"focus" event to be triggered AFTER the click event.
		//Crazy stuff.
		lazyFocus = _.debounce(function (){
			that.trigger('focus');
		}, 100);

		if(settings.autogrow && settings.type === 'textarea'){
			this.addClass(modoCore.InputText.classNames[3]);

			modoCore.waitForDom(this, function (){
				var $el = that.el;
				var $cloneBox = $('<div></div>');
				$cloneBox.css({
					display: 'none',
					'word-wrap': 'break-word',
					'white-space': 'normal',
					'padding': $el.css('padding'),
					'width': $el.width(),
					'font-family': $el.css('font-family'),
					'font-size': $el.css('font-size'),
					'line-height': $el.css('line-height')
				});
				$el.after($cloneBox);

				$el.on('keyup change', function (){
					if($el[0].value){
						$cloneBox.html(String($el[0].value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />') + '.<br/>.');
						$el.height($cloneBox.height());
						return;
					}
					$el.css('height', 'auto');
				});

				if($el.width() === 0){
					var interval = setInterval(function (){
						var width = $el.width();
						if(width){
							$cloneBox.css('width', width);
							clearInterval(interval);
						}
					}, 500);
				}
			});
		}

		this.el.on('keydown', function (e){
			that.trigger('keydown', e);
			that.trigger('keydown:' + e.keyCode, e);
			if(typeof keymap[e.keyCode] !== 'undefined'){
				that.trigger('keydown:' + keymap[e.keyCode], e);
			}

			if(!that.el.val()){
				that.removeClass(modoCore.InputText.classNames[4]);
				that.trigger('empty');
			} else {
				that.addClass(modoCore.InputText.classNames[4]);
				that.trigger('filled');
			}

			if(settings.timeout){
				clearTimeout(settings.timeout);
			}
			settings.timeout = setTimeout(function (){
				settings.value = that.el.val();
				if(settings.lastValue !== settings.value){
					settings.lastValue = settings.value;
					if(settings.boundModel && settings.boundModelKey){
						settings.boundModel.set(settings.boundModelKey, settings.value);
					}
					that.trigger('change', that.el.val());
				}
			}, settings.changeThreshold);
		}).on('blur', function (){
			that.hasFocus = false;
			if(placeholderFallback && settings.placeholder && !that.el.val()){
				that.el.val(settings.placeholder);
				that.addClass(modoCore.InputText.classNames[2]);
			}
			that.trigger('blur');
		}).on('focus', function (){
			that.hasFocus = true;
			if(placeholderFallback && that.el.val() === settings.placeholder){
				that.el.val('');
				that.removeClass(modoCore.InputText.classNames[2]);
			}
			lazyFocus();
		}).on('click', function (){
			lazyFocus();
		});

		if(settings.placeholder){
			this.el.attr('placeholder', settings.placeholder);
		}

		if(settings.value){
			this.el.val(settings.value);
			settings.lastValue = settings.value;
		}

		if(placeholderFallback && !settings.value && settings.placeholder){
			this.el.val(settings.placeholder);
			this.addClass(modoCore.InputText.classNames[2]);
		}

		this.set = function (value, options){
			var silent;

			options = options || {};

			silent = options.silent;

			settings.value = value;

			if(!value && placeholderFallback && settings.placeholder){
				value = settings.placeholder;
				this.addClass(modoCore.InputText.classNames[2]);
			}

			this.el.val(value);
			if(settings.value !== settings.lastValue){
				settings.lastValue = value;
				if(!silent){
					this.trigger('change', value);
				}
			}

			return this;
		};

		/**
		 * Binds the element to a Backbone Model.
		 * Prevous bindings will be detached.
		 * Heads up: Two-way binding is only possible when giving a modelKey!
		 * @param {Backbone.Model} model
		 * @param {string} [modelKey=null] If not given, give a processing function!
		 * @param {function} [processingFunction] A function that takes `model` as a argument and returns value on every change event.
		 */
		this.bindToModel = function (model, modelKey, processingFunction, noUpdate){
			if(!(model instanceof Backbone.Model)){
				throw new Error('Can only bind to a backbone model.');
			}

			if(settings.boundModel){
				this.stopListening(settings.boundModel);
			}

			settings.boundModel = model;
			settings.boundModelKey = modelKey;

			if(!modelKey){
				if(typeof processingFunction === 'function'){
					this.listenTo(model, 'change', function (){
						that.set(processingFunction.call(that, model));
					});
					settings.value = processingFunction(model);
				} else {
					throw new Error('Trying to bind to model, but no modelKey and no processingFunction given');
				}
			} else {
				settings.value = model.get(modelKey);

				this.listenTo(model, 'change:' + modelKey, function (){
					that.set(model.get(modelKey));
				});
			}

			if(!noUpdate){
				this.set(settings.value);
			}
		};

		if(params.model){
			this.bindToModel(params.model, params.modelKey, (typeof params.value === 'function') ? params.value : null, true);
		}

		if(params.disabled){
			this.disable();
		}

		modoCore._stat('InputText');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * If no value given, the current value will be returned.
			 * If a value is passed, the current value will be overwritten.
			 * @param {String} value
			 * @returns {String}
			 */
			get: function (){
				return this.el.val();
			},

			/**
			 * Will take the keyboard focus from the elements DOM object.
			 */
			blur: function (){
				this.el.blur();
				this.trigger('blur');
				return this;
			},

			/**
			 * Will set the keyboard focus to the elements DOM object.
			 */
			focus: function (){
				this.el.focus();
				this.trigger('focus');
				return this;
			},

			/**
			 * Select a part of the input text.
			 * @param {Integer} start Beginning of the selection in characters from left
			 * @param {Integer} length Length of the selection, or characters from left if values is negative
			 */
			select: function (start, length){
				var value = this.el.val();

				if(start === void 0 && length === void 0){
					this.el[0].select();
					return this;
				}

				if(length === void 0){
					length = 0;
				}

				if(!start){
					start = 0;
				}

				if(length < 0){
					length += value.length;
				} else {
					length += start;
				}

				this.el[0].setSelectionRange(start, length);

				return this;
			},

			disable: function (){
				this.el.attr('disabled', true).addClass(modoCore.cssPrefix + 'disabled');
				this.trigger('disable');
				return this;
			},

			enable: function (){
				this.el.attr('disabled', false).removeClass(modoCore.cssPrefix + 'disabled');
				this.trigger('enable');
				return this;
			}
		});


	modoCore.InputText.SEARCH = 'search';


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.InputText;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.InputText', function (){
				return modoCore.InputText;
			});
		}
	}
})();
/**
 * modo-Label
 * ===========
 * A label is the most basic of all get/set enabled elements.
 * You can use it to display some (html)text.
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
			return modoCore.Label.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Label.classNames[index];
	}

	modoCore.defineElement('Label', ['label'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		var that = this,
			settings = {};

		/**
		 * Binds the element to a Backbone Model.
		 * Previous bindings will be detached.
		 * @param {Backbone.Model} model
		 * @param {string} [modelKey=null] If not given, give a processing function!
		 * @param {function} [processingFunction] A function that takes `model` as a argument and returns value on every change event.
		 */
		this.bindToModel = function (model, modelKey, processingFunction, noUpdate){
			if(!(model instanceof Backbone.Model)){
				throw new Error('Can only bind to a backbone model.');
			}

			if(settings.boundModel){
				this.stopListening(settings.boundModel);
			}

			settings.boundModel = model;
			settings.boundModelKey = modelKey;

			if(!modelKey){
				if(typeof processingFunction === 'function'){
					this.listenTo(model, 'change', function (){
						that.set(processingFunction.call(that, model));
					});
					settings.value = processingFunction(model);
				} else {
					throw new Error('Trying to bind to model, but no modelKey and no processingFunction given');
				}
			} else {
				params.value = model.get(modelKey);

				this.listenTo(model, 'change:' + modelKey, function (){
					that.set(model.get(modelKey));
				});
			}

			if(!noUpdate){
				this.set(settings.value);
			}

			return this;
		};

		if(params.model){
			this.bindToModel(params.model, params.modelKey, (typeof params.value === 'function') ? params.value : null);
		}

		this.el.html(typeof params.value !== 'function' ? params.value || '' : '');

		modoCore._stat('Label');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			set: function (value, options){
				var silent;

				options = options || {silent: false};

				silent = options.silent;

				this.el.html(value);
				if(!silent){
					this.trigger('change', value);
				}
				return this;
			},
			get: function (){
				return this.el.html();
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Label;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Label', [], function (){
				return modo.Label;
			});
		}
	}
})();
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
/**
 * Modo Toggle Button
 * =================
 * This is a normal Modo button with extra functionality - it can be toggled by click, or manually (with the set() function).
 * @extends {modo.Button}
 * @param {Object} params
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

	modoCore.defineElement('ToggleButton', ['togglebutton', 'toggled'], function (params){
		params = params || {};

		modo.Button.call(this, params);

		this.addClass(modo.ToggleButton.classNames[0]);

		this.toggled = false;

		this.locked = false;

		this.on('click', function (){
			if(this.locked){
				return;
			}
			if(this.get()){
				this.set(false);
			} else {
				this.set(true);
			}
		});

		modoCore._stat('ToggleButton');
	})
		.inheritPrototype('Button')
		.extendPrototype({
			/**
			 * Will set the buttons toggle state to toggled or not toggled.
			 * @param truefalse (optional) If not given, the current state will be inverted.
			 */
			set: function (truefalse){
				if(typeof truefalse === 'undefined'){
					truefalse = !this.toggled;
				}
				if(truefalse){
					truefalse = true;
				} else {
					truefalse = false;
				}

				this.toggled = truefalse;

				if(this.toggled){
					this.addClass(modo.ToggleButton.classNames[1]);
					this.trigger('change', true);
				} else {
					this.removeClass(modo.ToggleButton.classNames[1]);
					this.trigger('change', false);
				}

				return this;
			},

			get: function (){
				return this.toggled;
			},

			/**
			 * Call this function to lock the button against user interactions.
			 * It won't be rendered as disabled, but it can't be toggled by user interaction anymore. Click events are fired, tough.
			 */
			lock: function (truefalse){
				if(typeof truefalse === 'undefined'){
					truefalse = true;
				}
				if(truefalse){
					this.locked = true;
				} else {
					this.locked = false;
				}

				return this;
			}
		});


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.ToggleButton;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('ToggleButton', [], function (){
				return modo.ToggleButton;
			});
		}
	}
})();
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
					if(!(e instanceof modo.ToggleButton)){
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
			define('modo.ToggleGroup', function (){
				return modoCore.ToggleGroup;
			});
		}
	}
})();
/**
 * modo-Viewstack
 * ===========
 * description
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
            return modoCore.ViewStack.classNames[index];
        }
        return modoCore.cssPrefix + modoCore.ViewStack.classNames[index];
    }

    modoCore.defineElement('ViewStack', ['viewstack'], function (params){
        params = params || {};

        modoCore.Container.call(this, params);

        var pAdd,
            pRemove;

        this.addClass(cn(0, true));

        pAdd = modoCore.ViewStack.prototype.add;
        pRemove = modoCore.ViewStack.prototype.remove;

        this.elements = {};
        this.count = 0;
        this.displaying = 0;
        this.switchMethod = params.switchMethod;

        /**
         * The behaviour of this add() function is different to the behaviour of the modoCore.Container's add() function.
         * You have to add a key/value object here, where the value is a modo element.
         * Example:
         * {
         *   "test": new modoCore.Button()
         * }
         *
         * So you can show this element by calling display('test');
         * @param object
         */
        this.add = function (object, options){
            var key,
                silent;

            if(modoCore.isElement(object) || modoCore.isDOM(object)){
                throw new Error('Do not pass modo.* or DOM elements here, directly');
            }

            options = options || {};

            silent = options.silent;

            for (key in object) {
                this.elements[key] = object[key];

                this.count++;
                if(this.count === 1){
                    object[key].show();
                    this.displaying = key;
                    this.trigger('display', key); //in here for legacy reasons. Will be @deprecated
                    this.trigger('change', key);
                } else {
                    object[key].hide();
                }

                pAdd.call(this, object[key], {silent: true});
                var eobj = {};
                eobj[key] = object[key];
                if(!silent){
                    this.trigger('add', eobj);
                }
            }

            return this;
        };

        /**
         * Pass in a key, to remove the specified object from the viewStack.
         * @param {String} key
         */
        this.remove = function (key, options){
            var eobj,
                inKey,
                silent;

            options = options || {};

            silent = options.silent;

            if(typeof this.elements[key] === 'undefined'){
                throw new Error('Object not part of this Container');
            }
            pRemove.call(this, this.elements[key], {silent: true});
            eobj = {};
            eobj[key] = this.elements[key];
            delete this.elements[key];
            this.count--;
            if(!silent){
                this.trigger('remove', eobj);
            }

            if(this.displaying === key){
                this.displaying = null;
                if(!this.count){
                    return;
                }
                for (inKey in eobj.elements) {
                    this.display(inKey);
                    return;
                }
            }

            return this;
        };

        this.getElements = function (){
            return this.elements;
        };

        modoCore._stat('ViewStack');
    })
        .inheritPrototype('Container')
        .extendPrototype({
            /**
             * This will show the specified element and hide all others.
             * @param {String} key
             */
            set: function (key){
                var showElement,
                    hideElement,
                    inKey;

                if(typeof this.elements[key] === 'undefined'){
                    throw new Error('Object not part of this Container');
                }

                showElement = this.getElementByKey(key);
                if(this.displaying){
                    hideElement = this.getElementByKey(this.displaying);
                }

                if(typeof this.switchMethod === 'function'){
                    this.switchMethod(hideElement, showElement);
                } else {
                    if(hideElement){
                        hideElement.hide();
                    }
                    showElement.show();
                }

                this.displaying = key;
                this.trigger('display', key); //In here for legacy reasons. Will be @deprecated
                this.trigger('change', key);

                return this;
            },

            get: function(){
                return this.displaying;
            },

            /**
             * Returns the Element with the given key.
             * @param key
             * @returns {*}
             */
            getElementByKey: function(key){
                if(this.elements[key] === undefined){
                    throw new Error('Element does not exist');
                }
                return this.elements[key];
            }
        });

    if(typeof exports !== 'undefined'){
        //commonJS modularization
        exports = modoCore.ViewStack;
    } else {
        if(typeof define === 'function'){
            //AMD modularization
            define('ViewStack', [], function (){
                return modoCore.ViewStack;
            });
        }
    }
})();
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
			internal.mask.fadeIn();
			internal.maskOwner = [modal, settings];
		},
		hideMask: function (){
			internal.maskOwner = null;
			if(internal.maskOwnerStack.length){
				internal.maskOwner = internal.maskOwnerStack.pop();
				internal.mask[0].style.zIndex = internal.maskOwner[0].el[0].style.zIndex - 1;
			} else {
				internal.mask.fadeOut();
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
/**
 * Modo Image
 * =========
 * A image object, enhanced by Modo methods.
 * Can - for example - be used inside a modoCore.FormContainer to display user avatars.
 *
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

	modoCore.defineElement('Image', ['image'], function (params){
		params = params || {};

		params.el = $('<img>');

		modoCore.Element.call(this, params);

		this.addClass(modoCore.Image.classNames[0]);

		var settings = {
			value:    params.value || '',
			tooltip:  params.tooltip || '',
			model:    params.model || null,
			modelKey: params.modelKey || null
		};

		var that = this;

		this.width = this.height = 0;

		this.el.on('load', function (e){
			that.width = that.el[0].naturalWidth;
			that.height = that.el[0].naturalHeight;
			that.trigger('load', e);
		});

		if(settings.model instanceof Backbone.Model){
			if(!settings.modelKey){
				if(typeof params.value === 'function'){
					params.model.on('change', function (){
						that.set(params.value.call(that, params.model));
					});
				} else {
					throw new Error('Trying to bind to model, but no modelKey and no valueFunction given');
				}
			}

			settings.value = settings.model.get(settings.modelKey);

			settings.model.on('change:' + settings.modelKey, function (){
				that.set(settings.model.get(settings.modelKey));
			});
		}

		if(settings.value){
			this.el[0].src = settings.value;
		}

		if(settings.tooltip){
			this.el[0].title = settings.tooltip;
		}

		modoCore._stat('Image');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			get: function (){
				return this.el.attr('src');
			},

			/**
			 * Set the image to a transparent pixel.
			 */
			setBlank: function(){
				return this.set('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=');
			},

			set: function (url){
				this.el.attr('src', url);
				this.trigger('change', url);
				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Image;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.Image', function (){
				return modoCore.Image;
			});
		}
	}
})();
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
(function () {
	'use strict';

	var modoCore,
		$;

	$ = jQuery;

	//commonJS and AMD modularization - try to reach the core.
	if (typeof modo !== 'undefined') {
		modoCore = modo;
	} else {
		if (typeof require === 'function') {
			modoCore = require('modo');
		}
	}

	//====================================================================

	/**
	 * This calculates the position of the Bubble and places it there.
	 * @param settings The Objects internal settings.
	 */
	function calculatePosition(obj, settings) {
		var target = settings.attachTo;
		if (modoCore.isElement(target)) {
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
					top: targetPos.y - obj.el.outerHeight(),
					left: targetPos.x + (targetPos.w / 2)
				};
				break;
			case 'tc':
				pos = {
					top: targetPos.y - obj.el.outerHeight(),
					left: targetPos.x - (obj.el.outerWidth() / 2 - targetPos.w / 2)
				};
				break;
			case 'tl':
				pos = {
					top: targetPos.y - obj.el.outerHeight(),
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
					top: targetPos.y - (obj.el.outerHeight() / 2 - targetPos.h / 2),
					left: targetPos.x - obj.el.outerWidth()
				};
				break;
			case 'lb':
				pos = {
					top: targetPos.y + targetPos.h - obj.el.outerHeight(),
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
					top: targetPos.y - (obj.el.outerHeight() / 2 - targetPos.h / 2),
					left: targetPos.x + targetPos.w
				};
				break;
			case 'rb':
				pos = {
					top: targetPos.y + targetPos.h - obj.el.outerHeight(),
					left: targetPos.x + targetPos.w
				};
				break;

			case 'br':
				pos = {
					top: targetPos.y + targetPos.h,
					left: targetPos.x + (targetPos.w / 2)
				};
				break;
			case 'bc':
				pos = {
					top: targetPos.y + targetPos.h,
					left: targetPos.x - (obj.el.outerWidth() / 2 - targetPos.w / 2)
				};
				break;
			case 'bl':
				pos = {
					top: targetPos.y + targetPos.h,
					left: targetPos.x - (obj.el.outerWidth() - targetPos.w / 2)
				};
				break;
		}

		obj.el.css(pos);
	}

	modoCore.defineElement('PopUpBubble', ['popupbubble', 'popupbubble-attach-'], function (params) {
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

		var closer = function () {
			_this.close();
		};

		var possiblePositions = ['tl', 'tc', 'tr', 'lt', 'lc', 'lb', 'rt', 'rc', 'rb', 'bl', 'bc', 'br'];

		/**
		 * Attaches the PopUp Bubble to a element.
		 * @param {modoCore.*} element
		 * @param {String} position
		 */
		this.attach = function (element, position) {
			if (_.indexOf(possiblePositions, position) === -1) {
				throw new Error('Illegal position');
			}

			settings.attachTo = element;
			settings.attachAt = position;

			if (_this.isOpen()) {
				calculatePosition(_this, settings);
			}

			for (var i = 0; i < possiblePositions.length; i++) {
				this.el.removeClass(modoCore.cssPrefix + modoCore.PopUpBubble.classNames + possiblePositions[i]);
			}

			this.el.addClass(modoCore.cssPrefix + modoCore.PopUpBubble.classNames[1] + position);

			return this;
		};

		if (typeof params.attachTo !== 'undefined') {
			//TODO: Intelligently find out best attachment position based on Bubble dimensions and target location.
			this.attach(params.attachTo, params.attachAt || modoCore.PopUpBubble.BOTTOM);
		}

		this.on('open', function () {
			if (this.el.parent() != modoCore.getRootElement()) {
				modoCore.getRootElement().append(this.el);
			}
			calculatePosition(_this, settings);
			setTimeout(function () {
				if (settings.autoHide) {
					_this.el.on('click', function (e) {
						e.stopPropagation();
					});
					$(window).on('click', closer);
				}
			}, 1);
		});

		this.on('close', function () {
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


	if (typeof exports !== 'undefined') {
		//commonJS modularization
		exports = modoCore.PopUpBubble;
	} else {
		if (typeof define === 'function') {
			//AMD modularization
			define('PopUpBubble', [], function () {
				return modoCore.PopUpBubble;
			});
		}
	}
})();
/**
 * Modo Calendar
 * ============
 * A simple calendar widget with the following features:
 * - Month selection
 * - Day selection
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

	modoCore.defineElement('Calendar', [
		'calendar',             //0
		'calendar-selector',
		'calendar-field',
		'calendar-prev',
		'calendar-next',
		'calendar-label',       //5
		'calendar-field-row',
		'calendar-field-day-names',
		'calendar-day',
		'calendar-day-disabled',
		'calendar-day-today',   //10
		'calendar-day-selected'
	], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		var cn = [];
		for (var i = 0; i < modoCore.Calendar.classNames.length; i++) {
			cn.push(modoCore.cssPrefix + modoCore.Calendar.classNames[i]);
		}

		var settings = {
			minDate: (params.minDate instanceof Date) ? params.minDate : null,
			maxDate: (params.maxDate instanceof Date) ? params.maxDate : null,
			monthLabelFormat: params.monthLabelFormat || 'F Y',
			date: (typeof params.date !== 'undefined') ? new Date(params.date) : null,
			selectable:       params.selectable || true,
			seekDate: null
		};
		settings.seekDate = settings.date;
		if(!(settings.seekDate instanceof Date)){
			settings.seekDate = new Date();
		}
		settings.seekDate.setDate(1);
		settings.seekDate.setHours(0);
		settings.seekDate.setMinutes(0);
		settings.seekDate.setSeconds(0);
		settings.seekDate.setMilliseconds(0);

		this.addClass(modoCore.Calendar.classNames[0]);

		this.el.html('<div class="' + cn[1] + '"></div>');

		var $calendarField = $('<div class="' + cn[2] + '"></div>');
		this.el.append($calendarField);

		//Previous/Next buttons.
		var btnPrev = new modoCore.Button({
			label: modoCore.Calendar.PREVIOUS,
			className: cn[3]
		});
		var btnNext = new modoCore.Button({
			label: modoCore.Calendar.NEXT,
			className: cn[4]
		});

		if(settings.minDate !== null && settings.date !== null && settings.date.getTime() < settings.minDate.getTime()){
			if(params.date){
				throw new Error('Given default date previous to given minimal date.');
			} else {
				settings.date = settings.seekDate = settings.minDate;
				settings.seekDate.setDate(1);
			}
		}

		if(settings.maxDate !== null && settings.date !== null && settings.date.getTime() > settings.maxDate.getTime()){
			if(params.date){
				throw new Error('Given default date after given maximal date.');
			} else {
				settings.date = settings.seekDate = settings.maxDate;
				settings.seekDate.setDate(1);
			}
		}

		btnPrev.on('click', function (e){
			e.preventDefault();
			e.stopPropagation();
			settings.seekDate.setMonth(settings.seekDate.getMonth() - 1);
			render();
			_this.trigger('seek');
		});

		btnNext.on('click', function (e){
			e.preventDefault();
			e.stopPropagation();
			settings.seekDate.setMonth(settings.seekDate.getMonth() + 1);
			render();
			_this.trigger('seek');
		});

		var $monthLabel = $('<div class="' + cn[5] + '"></div>');

		$('.' + cn[1], this.el).append(btnPrev.el, $monthLabel, btnNext.el);

		var _this = this;

		function render(){
			var html,
				dayCount = 0;

			$monthLabel.text(_this.dateToString(settings.monthLabelFormat, settings.seekDate));
			if(settings.minDate !== null && settings.seekDate.getMonth() === settings.minDate.getMonth() && settings.seekDate.getYear() === settings.minDate.getYear()){
				btnPrev.disable();
			} else {
				btnPrev.enable();
			}

			if(settings.maxDate !== null && settings.seekDate.getMonth() === settings.maxDate.getMonth() && settings.seekDate.getYear() === settings.maxDate.getYear()){
				btnNext.disable();
			} else {
				btnNext.enable();
			}

			var seek = new Date(settings.seekDate);
			var currentSeekMonth = seek.getMonth();

			var sub;
			if(seek.getDay() === 0){
				sub = 518400000;
			} else {
				sub = (seek.getDay() - 1) * 86400000;
			}
			seek.setTime(seek.getTime() - sub);


			html = '<div class="' + cn[6] + ' ' + cn[7] + '"><div class="' + cn[8] + '">';
			html += modoCore.Calendar.DAY_NAMES_SHORT.join('</div><div class="' + cn[8] + '">') + '</div></div>';

			var rowOpen = false,
				dayClasses,
				today = new Date(),
				cssKeys,
				cssKey;
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);

			while (dayCount < 42) {
				if(!rowOpen){
					html += '<div class="' + cn[6] + '">';
					rowOpen = true;
				}
				dayClasses = {};
				if(seek.getMonth() !== currentSeekMonth){
					dayClasses[cn[9]] = true;
				}
				if(seek.getTime() === today.getTime()){
					dayClasses[cn[10]] = true;
				}

				//Days before minDate and after_max date are blocked.
				if(settings.minDate !== null && settings.minDate.getTime() > seek.getTime()){
					dayClasses[cn[9]] = true;
				}
				if(settings.maxDate !== null && settings.maxDate.getTime() < seek.getTime()){
					dayClasses[cn[9]] = true;
				}

				if(settings.date !== null && seek.getDate() === settings.date.getDate() && seek.getMonth() === settings.date.getMonth() && seek.getFullYear() === settings.date.getFullYear()){
					dayClasses[cn[11]] = true;
				}

				cssKeys = [];

				for (cssKey in dayClasses) {
					if(dayClasses[cssKey]){
						cssKeys.push(cssKey);
					}
				}

				dayClasses = cssKeys.join(' ');

				html += '<div class="' + cn[8] + ' ' + dayClasses + '">' + seek.getDate() + '</div>';
				seek.setTime(seek.getTime() + 86400000);
				dayCount++;
				if((dayCount % 7) === 0){
					html += '</div>';
					rowOpen = false;
				}
			}
			html += '</div>';

			seek.setMonth(currentSeekMonth);
			seek.setDate(1);
			seek.setHours(0);
			seek.setMinutes(0);
			seek.setSeconds(0);
			seek.setMilliseconds(0);


			$calendarField.html(html);
		}

		if(settings.selectable){
			$calendarField.on('click', '.' + cn[8], function (e){
				e.preventDefault();
				e.stopPropagation();

				var $this = $(this);
				if($this.hasClass(cn[9])){
					return;
				}
				$('.' + cn[8], _this.el).removeClass(cn[11]);
				$this.addClass(cn[11]);
				var selectedDate = new Date(settings.seekDate);
				selectedDate.setDate(parseInt($this.text(), 10));
				settings.date = selectedDate;
				_this.trigger('change', selectedDate);
			});
		}

		render();

		/**
		 * Returns the Date object, currently used by the calendar.
		 */
		this.get = function (){
			return settings.date;
		};

		this.set = function (inDate){
			settings.date = new Date(inDate);
			render();
			this.trigger('seek');
			this.trigger('change', settings.date);

			return this;
		};

		modoCore._stat('Calendar');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * This outputs a string with a formatted date and follows roughly the PHP date() specification.
			 * See: http://de2.php.net/manual/en/function.date.php
			 * @param {String} format
			 * @param {Date} inDate (optional)
			 * @returns {String}
			 */
			dateToString: function (format, inDate){
				if(typeof inDate === 'undefined'){
					if(!this){ //Direct prototype call?
						return null;
					}
					inDate = this.get();
				}

				return modoCore.dateFormatter.dateToString(format, inDate);
			}
		});

	modoCore.Calendar.PREVIOUS = '◀';
	modoCore.Calendar.NEXT = '▶';
})();

/**
 * Modo Dropdown
 * ============
 * Modo Dropdown enables the user to select an item from an Array or a Backbone Collection.
 * @param params
 * @constructor
 */
(function () {
	'use strict';

	var modoCore,
			$;

	$ = jQuery;

	//commonJS and AMD modularization - try to reach the core.
	if (typeof modo !== 'undefined') {
		modoCore = modo;
	} else {
		if (typeof require === 'function') {
			modoCore = require('modo');
		}
	}

	modoCore.defineElement('DropDown', ['dropdown', 'dropdown-button', 'dropdown-list', 'dropdown-dropped', 'dropdown-selected'], function (params) {
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(modoCore.DropDown.classNames[0]);

		var $button = $('<button></button>');
		$button.addClass(modoCore.cssPrefix + modoCore.DropDown.classNames[1]);

		if (params.tooltip) {
			$button.attr('title', params.tooltip);
		}

		this.el.append($button);

		var settings = {
			data: params.data,
			buttonRender: params.buttonRender || function (d) {
				if (typeof d === 'string' || typeof d === 'number') {
					return d;
				}
				for (var key in d) {
					if (key === '_m') {
						continue;
					}
					break;
				}
				return d[key].toString();
			},
			selectedItem: params.selectedItem !== undefined ? params.selectedItem : null,
			selectedData: null,
			placeholder: params.placeholder || '',
			keyboard: params.keyboard || true
		};

		if (params.keyboard) {
			if (!modo.keyListener) {
				throw new Error('keyListener missing');
			}
			modo.keyListener.enable();
		}

		if (typeof params.data === 'function') {
			settings.data = params.data();
		}

		params.className = modoCore.cssPrefix + modoCore.DropDown.classNames[2];

		var that = this;

		params.itemEvents = {
			'click': function (e, i, d) {
				if (d instanceof Backbone.Model) {
					that.set(d.id);
					return;
				}
				that.set(i);
			}
		};

		params.keyboard = settings.keyboard;

		var dropList = new modoCore.List(params);


		$button.on('click', function (e) {
			if (that.disabled) {
				return;
			}
			that.el.addClass(modoCore.cssPrefix + modoCore.DropDown.classNames[3]);
			if (settings.keyboard) {
				dropList.focus();
			}
			e.stopPropagation();

			function clearFunc(e, key) {
				e.preventDefault();
				e.stopPropagation();

				if (key === 'enter') {
					var selected = dropList.getFocusedIndex();
					if (!selected) {
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

		this.update = function(){
			dropList.update();
		};

		/**
		 * This will set the dropdown to a specific item from the dataset.
		 * If you passed a array as data, pass an array index as item.
		 * If you passed a object as data, pass the key as item.
		 * If you passed a Backbone Collection as data, pass a data id or cid.
		 * @param {Integer|String} item
		 */
		this.set = function (item, options) {
			var silent,
					prevItem;

			options = options || {};

			silent = options.silent;

			prevItem = this.selectedItem;
			this.selectedItem = item;

			if (item === null) {
				this.selectedData = null;
				$button.html(settings.buttonRender(settings.placeholder));
				this.trigger('change', null, null);
				return;
			}

			if (settings.data instanceof Backbone.Collection) {
				if (!settings.data.get(item)) {
					this.selectedItem = prevItem;
					throw new Error('Object not found');
				}

				this.selectedData = settings.data.get(item);
				$button.html(settings.buttonRender(_.extend(this.selectedData.toJSON(), {'_m': this.selectedData}), this.selectedData));
			} else {
				if (typeof settings.data[item] === 'undefined') {
					this.selectedItem = prevItem;
					throw new Error('Element "' + item + '" not found in dataset');
				}
				this.selectedData = settings.data[item];

				if (this.selectedData instanceof Backbone.Model) {
					$button.html(settings.buttonRender(_.extend(this.selectedData.toJSON(), {'_m': this.selectedData})));
				} else {
					$button.html(settings.buttonRender(this.selectedData));
				}
			}

			if (!silent) {
				this.trigger('change', this.selectedItem, this.selectedData);
			}

			return this;
		};

		this.setDataset = function (dataset, options) {
			settings.data = dataset;
			dropList.set(dataset, options);
			this.set(this.selectedItem, {silent: true});
			this.length = dropList.length;

			return this;
		};

		this.get = function () {
			return this.selectedItem;
		};

		this.getData = function () {
			return this.selectedData;
		};

		this.set(settings.selectedItem, {silent: true});

		modoCore._stat('DropDown');
	})
			.inheritPrototype('Element');

	modoCore.DropDown.prototype.disable = modoCore.Button.prototype.disable;
	modoCore.DropDown.prototype.enable = modoCore.Button.prototype.enable;
})();
/**
 * Modo Grid
 * =========
 * Use this element to present information in a tabular structure.
 * Unlike the modoCore.List element, data is separated into single columns in the grid element.
 * You can specify renderers or presentor elements for every column separately.
 * The Modo Grid supports arrays and Backbone.Collection as datasources.
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

	modoCore.defineElement('Grid', ['grid', 'grid-header', 'grid-row', 'grid-cell', 'grid-column-'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(modoCore.Grid.classNames[0]);

		/*var params = {
		 columns: [
		 {
		 key: 'some_key',            //The key to use from the datasource.
		 title: 'The column header', //HTML possible
		 render: function(d){
		 return d.toString();    //HTML, or a Modo Element is expected. Will be wrapped into a additional DIV.
		 },
		 required: false             //Decide if this column can be user-selected or must be shown.
		 }
		 ],
		 */
		/**
		 * The prepare function is called before each column render.
		 * You can make up own columns out of data which is generated dynamically upon table creation.
		 * @param d
		 * @return {*}
		 */
		/*
		 prepare: function(d){
		 return d;
		 },
		 visibleColumns: ['key_a', 'key_b'], //Predefined column selection
		 rowTag: 'div',
		 cellTag: 'div'
		 };*/

		var settings,
			that,
			ids;

		settings = {
			data: null,
			collector:      params.collector || function (c){
				return c.filter(function (){
					return true;
				});
			},
			updateOn:       params.updateOn || ['add', 'change', 'remove', 'sort'],
			columns: params.columns,
			prepare:        params.prepare || function (d){
				if(d instanceof Backbone.Model){
					return d.toJSON();
				}
				return d;
			},
			visibleColumns: params.visibleColumns || null,
			rowTag:         params.rowTag || 'div',
			cellTag:        params.cellTag || 'div'
		};

		that = this;

		//Prevent undefined values.
		function prepareColumns(){
			//Remove all previously attached event listeners.
			that.el.off('.itemEvent', '**');

			_.each(settings.columns, function (c){
					var chain,
						columnClassName;

					if(typeof c.render === 'undefined'){
						c.render = function (d){
							return d.toString();
						};
						c.title = c.title || '';
					}

					if(c.itemEvents){
						for (var evt in c.itemEvents) {
							chain = evt.split(' ');
							columnClassName = modoCore.cssPrefix + modoCore.Grid.classNames[4] + c.key;

							that.el.on(chain.shift() + '.itemEvent', '.' + columnClassName + ' ' + chain.join(' '), (function (columnData, evt){
								return function (e){
									var $this = $(this),
										tableRowElement,
										clickedIndex,
										index = 0,
										data,
										cellData,
										all;

									tableRowElement = $this.parents('.' + modoCore.cssPrefix + modoCore.Grid.classNames[2]);
									all = that.el.find('.' + modoCore.cssPrefix + modoCore.Grid.classNames[2]).not('.' + modoCore.cssPrefix + modoCore.Grid.classNames[1]);

									//Loop through all created table rows to find ours.
									clickedIndex = -1;
									_.every(all, function (e){
										if($(e).is(tableRowElement)){
											clickedIndex = index;
											return false;
										}
										index++;
										return true;
									});

									if(clickedIndex === -1){
										throw new Error('Weird. I could not find the matching row. Please report this!');
									}

									if(settings.data instanceof Backbone.Collection){
										index = ids[clickedIndex];
										data = settings.data.get(index);
									} else {
										if(settings.data instanceof Array){
											index = clickedIndex;
											data = settings.data[clickedIndex];
										} else {
											throw new Error('Not implemented.');
										}
									}

									if(data instanceof Backbone.Model){
										cellData = data.get(columnData.key);
									} else {
										cellData = data[columnData.key];
									}

									if(typeof columnData.itemEvents[evt] === 'function'){
										columnData.itemEvents[evt].call(that, e, index, cellData, data, columnData.key);
									} else {
										that.trigger('item:' + columnData.itemEvents[evt], e, index, cellData, data, columnData.key);
									}
								};
							})(c, evt));
						}
					}
				}
			)
			;
		}

		prepareColumns();

		/**
		 * Set up new column data for the grid.
		 * @param columnData
		 */
		this.setColumns = function (columnData){
			settings.columns = columnData;
			prepareColumns();
			this.update();
			return this;
		};

		this.set = function (data, options){
			var that;

			that = this;

			if(!(data instanceof Backbone.Collection) && !(data instanceof Array)){
				throw new Error('Only data type Array or Backbone.Collection allowed. Yours is: ' + typeof settings.data);
			}

			settings.data = data;
			this.stopListening();

			if(data instanceof Backbone.Collection){
				this.listenTo(data, settings.updateOn.join(' '), function (){
					that.update(options);
				});
			}

			this.update();
		};

		/**
		 * Will trigger a re-render of the grid.
		 * @param options
		 */
		this.update = function (options){
			var html = '',
				rowHtml = '',
				rowData,
				dataset,
				columnPack = [],
				silent,
				i,
				c,
				result,
				cellCount = 0,
				$cells,
				that = this,
				modoElements = [],
				cH = modoCore.cssPrefix + modoCore.Grid.classNames[1],
				cR = modoCore.cssPrefix + modoCore.Grid.classNames[2],
				cC = modoCore.cssPrefix + modoCore.Grid.classNames[3],
				cClm = modoCore.cssPrefix + modoCore.Grid.classNames[4];

			options = options || {};

			silent = options.silent;

			ids = [];

			function makeRow(content, isHeader){
				return '<' + settings.rowTag + ' class="' + cR + (isHeader ? ' ' + cH : '') + '">' + content + '</' + settings.rowTag + '>';
			}

			function makeCell(content, column){
				cellCount++;
				return '<' + settings.cellTag + ' class="' + cC + ' ' + cClm + column + '">' + content + '</' + settings.cellTag + '>';
			}

			if(settings.visibleColumns === null){
				columnPack = settings.columns;
			} else {
				for (i = 0; i < settings.columns.length; i++) {
					if(_.indexOf(settings.visibleColumns, settings.columns[i].key) !== -1){
						columnPack.push(settings.columns[i]);
					}
				}
			}

			_.each(columnPack, function (c){
				rowHtml += makeCell(c.title, c.key);
			});
			html = makeRow(rowHtml, true);

			dataset = settings.collector(settings.data);

			_.each(dataset, function (e, index){
				var key;

				ids.push(e.id || e.cid || index);
				rowHtml = '';
				rowData = settings.prepare(e);
				for (i = 0; i < columnPack.length; i++) {
					c = columnPack[i];
					if(c.key !== null && c.key !== undefined){
						if(typeof rowData[c.key] === 'undefined'){
							throw new Error('Undefined field "' + c.key + '" in row data.');
						}
						result = c.render(rowData[c.key], rowData);
					} else {
						result = c.render(undefined, rowData);
					}
					if(modoCore.isElement(result)){
						c.isModo = true;
						modoElements.push([cellCount, result]);
						if(typeof c.events !== 'undefined'){
							for (key in c.events) {
								if(!c.events.hasOwnProperty(key)){
									continue;
								}
								that.listenTo(result, key, function (e, v){
									c.events[key].call(this, e, v, rowData);
								});
							}
						}
						result = '';
					}
					rowHtml += makeCell(result, c.key);
				}
				html += makeRow(rowHtml);
			});

			this.el.html(html);

			$cells = this.el.find('.' + modoCore.cssPrefix + modoCore.Grid.classNames[3]);
			for (i = 0; i < modoElements.length; i++) {
				$cells.eq(modoElements[i][0]).append(modoElements[i][1].el);
			}

			if(!silent){
				this.trigger('update');
			}

			return this;
		};

		this.set(params.data, {silent: true});

		modoCore._stat('Grid');
	})
		.inheritPrototype('Element');


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Grid;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.Grid', function (){
				return modoCore.Grid;
			});
		}
	}
})();
/**
 * modo-Checkbox
 * ===========
 * A CheckBox Element. It can either have a label, or not.
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
			return modoCore.Checkbox.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Checkbox.classNames[index];
	}

	modoCore.defineElement('Checkbox', ['checkbox', 'checkbox-label', 'checked'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		if(!params.custom){
			this.$checkbox = $('<input type="checkbox">');
			this.$checkbox[0].checked = params.value;
			this.$checkbox.on('click', function (e){
				e.preventDefault();
				e.stopPropagation();
				that.set(!that.value);
				//I hate to be doing this, but otherwise, the checkbox just won't behave -.-
				setTimeout(function (){
					that.$checkbox[0].checked = that.value;
				}, 0);
			});
		} else {
			this.$checkbox = $('<span class="' + cn(0) + '"></span>');
		}

        this.$label = $('<span class="' + cn(1) + '">' + (params.label || '') + '</span>');

		this.el.append(this.$checkbox, this.$label);

		this.value = false;

		var that = this;

		if(params.tooltip){
			this.el.attr('title', params.tooltip);
		}

		this.el.on('click', function (e){
			if(e.target.nodeName == 'A'){
				return;
			}

			e.preventDefault();
			e.stopPropagation();
			that.set(!that.value);
		});

		if(params.model){
			if(!params.modelKey){
				throw new Error('Trying to bind to model, but no model key given');
			} else {
				params.value = params.model.get(params.modelKey);

				params.model.on('change:' + params.modelKey, function (){
					that.set(params.model.get(params.modelKey));
				});
			}
		}

		this.set = function (value, options){
			var silent;

			options = options || {};

			silent = options.silent;

			if(value){
				this.value = true;
			}
			else {
				this.value = false;
			}

			if(!params.custom){
				that.$checkbox[0].checked = this.value;
			}

			this.el.toggleClass(cn(2), this.value);

			if(params.model && params.modelKey){
				params.model.set(params.modelKey, this.value);
			}

			if(!silent){
				this.trigger('change', this.value);
			}

			return this;
		};

		if(params.value !== undefined){
			this.set(params.value, {silent: true});
		}

		if(params.disabled === true){
			this.disable();
		}

		modoCore._stat('Checkbox');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			enable: function (options){
				var silent;

				options = options || {};

				silent = options.silent;

				this.removeClass(modo.Element.classNames[2]);
				this.$checkbox.prop('disabled', false);

				if(!silent){
					this.trigger('enabled');
				}

				return this;
			},
			disable: function (options){
				var silent;

				options = options || {};

				silent = options.silent;

				this.addClass(modo.Element.classNames[2]);
				this.$checkbox.prop('disabled', true);

				if(!silent){
					this.trigger('disabled');
				}

				return this;
			},
			get: function (){
				return this.value;
			},
            setLabel: function(newLabel){
                this.$label.html(newLabel);
            }
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Checkbox;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Checkbox', [], function (){
				return modo.Checkbox;
			});
		}
	}
})();
/**
 * modo-Toolbar
 * ============
 * The modo toolbar can keep multiple buttons that can be clicked or toggled.
 * The toolbar is treated as ONE element that fires events upon user interaction.
 * Child elements are only created in the DOM and don't have any modo interface.
 *
 * A toolbar can have containers to group buttons together.
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

	modoCore.defineElement('Toolbar', ['toolbar', 'toolbar-container', 'toolbar-container-empty', 'toolbar-item', 'toolbar-item-group-', 'toolbar-item-toggled'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(modoCore.Toolbar.classNames[0]);

		var settings = {
			elements: params.elements || []
		};

		var that = this,
			keys = [];

		/**
		 * Returns the element object with the given key.
		 * @param {String} key
		 * @returns {Object|null}
		 */
		function findElement(inKey, sub){
			var result;

			if(!sub){
				sub = settings.elements;
			}

			for (var key in sub) {
				if(sub[key] instanceof Array){
					result = findElement(inKey, sub[key]);
					if(result){
						return result;
					}
				}

				if(sub[key].key === inKey){
					return sub[key];
				}
			}

			return null;
		}

		/**
		 * Returns all objects that belong to a given group.
		 * @param {String} group
		 * @returns {Array}
		 */
		function findElementsByGroup(group, sub){
			var result;

			result = [];

			if(!sub){
				sub = settings.elements;
			}

			for (var key in sub) {
				if(sub[key] instanceof Array){
					result = result.concat(findElementsByGroup(group, sub[key]));
				}

				if(sub[key].group === group){
					result.push(sub[key]);
				}
			}

			return result;
		}

		/**
		 * Returns all elements in the container with the given index.
		 * Returns an empty array, if the container was not found, or empty.
		 * @param index
		 * @returns Array
		 */
		function findElementsInContainer(index){
			var checkIndex,
				i;

			checkIndex = 0;

			for (i = 0; i < settings.elements.length; i++) {
				if(settings.elements[i] instanceof Array){
					if(checkIndex === index){
						return settings.elements[i];
					}
					checkIndex++;
				}
			}
			return [];
		}

		function render(root, sublevel){
			var html = '',
				i,
				o,
				key,
				cAttrs;

			if(sublevel){

				html += '<div class="' + modoCore.cssPrefix + modoCore.Toolbar.classNames[1];
				if(!root.length){
					html += ' ' + modoCore.cssPrefix + modoCore.Toolbar.classNames[2];
				}
				html += '">';
			} else {
				keys = [];
			}

			for (i = 0; i < root.length; i++) {
				o = root[i];
				if(o instanceof Array){
					if(sublevel){
						throw new Error('You cannot stack containers in a toolbar');
					}
					html += render(o, true);
					continue;
				}

				if(!o.key){
					throw new Error('No element key given');
				}

				if(_.indexOf(keys, o.key) !== -1){
					throw new Error('Duplicate key: ' + o.key);
				}
				keys.push(o.key);

				cAttrs = [];
				if(o.data){
					for (key in o.data) {
						if(o.data.hasOwnProperty(key)){
							cAttrs.push(' data-' + key + '="' + o.data[key] + '"');
						}
					}
				}

				html += '<button class="' +
						modoCore.cssPrefix + modoCore.Toolbar.classNames[3] + ' ' +
						modoCore.cssPrefix + modoCore.Toolbar.classNames[3] + '-' + o.key +
						((o.group) ? ' ' + modoCore.cssPrefix + modoCore.Toolbar.classNames[4] + o.group : '') +
						((o.disabled) ? ' ' + modoCore.cssPrefix + modoCore.Element.classNames[2] : '') +
						((o.className) ? ' ' + o.className : '') +
						((o.toggle) ? ' ' + modoCore.cssPrefix + modoCore.Toolbar.classNames[5] : '') +
						'" data-key="' + o.key + '"' + cAttrs.join('') + ' title="' + (o.tooltip || '') + '">' + (o.label || '') + '</button>';
			}

			if(sublevel){
				html += '</div>';
				return html;
			}

			that.el.html(html);
		}

		/**
		 * Returns a jQuery enhanced reference to the DOM element of the button with the given key.
		 * @param key
		 * @return {*|jQuery|HTMLElement}
		 */
		this.getElementByKey = function (key){
			if(_.indexOf(keys, key) === -1){
				throw new Error('Unknown key');
			}
			return $('.' + modoCore.cssPrefix + modoCore.Toolbar.classNames[3] + '-' + key, this.el);
		};

		/**
		 * Adds a new element to the element list.
		 * @param key
		 * @param className
		 * @param tooltip
		 */
		this.add = function (obj){
			settings.elements.push(obj);
			render(settings.elements);

			return this;
		};

		/**
		 * Adds a new element to the container with the given index.
		 */
		this.addToContainer = function (containerIndex, obj){
			var i,
				cnt;

			i = 0;

			_.each(settings.elements, function (elm){
				if(elm instanceof Array){
					i++
					if(i - 1 === containerIndex){
						elm.push(obj);
						return false;
					}
				}
			});

			render(settings.elements);

			return this;
		}

		/**
		 * Removes the button with the given key.
		 */
		this.remove = function (key, sub){
			var i,
				e,
				that,
				success;

			that = this;

			for (i = 0; i < settings.elements.length; i++) {
				e = settings.elements[i];

				if(e instanceof Array){
					if(that.remove(key, true)){
						success = true;
						break;
					}
				}

				if(e.key === key){
					settings.elements.splice(i, 1);
					success = true;
					break;
				}
			}

			if(!sub && !success){
				throw new Error('Element not found');
			}

			if(sub){
				return success;
			}

			return this;
		}

		/**
		 * Removes the given container.
		 */
		this.removeContainer = function (index){
			var i,
				e,
				containerIndex;

			containerIndex = 0;

			for (i = 0; i < settings.elements.length; i++) {
				e = settings.elements[i];

				if(e instanceof Array){
					if(index === containerIndex){
						settings.elements.splice(i, 1);
						return this;
					} else {
						containerIndex++;
					}
				}
			}

			throw new Error('Element not found');
		}

		/**
		 * Enables a toolbar button for user interaction.
		 * @param key
		 */
		this.enableButton = function (key){
			findElement(key).disabled = false;
			render(settings.elements);
			return this;
		};

		/**
		 * Disables a toolbar button for user interaction.
		 * @param key
		 */
		this.disableButton = function (key){
			findElement(key).disabled = true;
			render(settings.elements);
			return this;
		}

		/**
		 * Enables all buttons of the given logical group.
		 * @param name
		 */
		this.enableGroup = function (name, inverted){
			var groupButtons,
				i;

			groupButtons = findElementsByGroup(name);

			for (i = 0; i < groupButtons.length; i++) {
				groupButtons[i].disabled = !!inverted;
			}
			render(settings.elements);
			return this;
		};

		/**
		 * Disables all buttons of the given logical group.
		 * @param name
		 */
		this.disableGroup = function (name){
			return this.enableGroup(name, false);
		};

		/**
		 * Enables all buttons inside the container with the given index.
		 * @param index
		 */
		this.enableContainer = function (index, inverted){
			var buttons,
				i;

			buttons = findElementsInContainer(index);

			for (i = 0; i < buttons.length; i++) {
				buttons[i].disabled = !!inverted;
			}

			render(settings.elements);

			return this;
		};

		/**
		 * Disables all buttons inside the container with the given index.
		 * @param index
		 */
		this.disableContainer = function (index){
			return this.enableContainer(index, false);
		};

		/**
		 * Toggles a button in a group programmatically.
		 */
		this.toggleButton = function (key){
			var o,
				groupElements,
				previousKey;

			o = findElement(key);

			if(!o.group){
				throw new Error('Can only toggle grouped buttons');
			}

			groupElements = findElementsByGroup(o.group);
			for (key in groupElements) {
				if(groupElements[key].toggle && groupElements[key].key !== o.key){
					previousKey = groupElements[key].key;
					this.trigger('untoggle:' + groupElements[key].key);
					groupElements[key].toggle = false;
					break;
				}
			}
			o.toggle = true;
			this.trigger('toggle:' + o.key);
			this.trigger('grouptoggle:' + o.group, o.key, previousKey);
			render(settings.elements);
			return this;
		}

		this.el.on('click', '.' + modoCore.cssPrefix + modoCore.Toolbar.classNames[3], function (e){
			var $this = $(this),
				o,
				groupElements,
				key;

			o = findElement($this.attr('data-key'));

			if(!o){
				throw new Error('No element found for this key');
			}

			if($this.hasClass(modoCore.cssPrefix + modoCore.Element.classNames[3])){
				e.preventDefault();
				e.stopPropagation();
				return;
			}

			if(o.group && !o.toggle){
				that.toggleButton(o.key);
			}

			that.trigger('click:' + $this.attr('data-key'));
			that.trigger('click', e, $this.attr('data-key'));
		});

		render(settings.elements);

		modoCore._stat('Toolbar');
	})
		.inheritPrototype('Element');
})();
/**
 * modo-Menu
 * =========
 * The Modo Menu Element provides you drop down style menus known
 * from virtually any kind of desktop application.
 *
 * Menu items support display of:
 *
 * - Icons
 * - Hotkeys
 * - Sub-Menus
 * - Quick-Access keys
 * - Checkboxes
 * - Radio buttons
 * - Separators
 *
 * Menus can be either navigated by mouse, or keyboard.
 * Menus can be either rendered with a base level (first level
 * of the menu is rendered as horizontal list), or as a single
 * list that can be spawned anywhere.
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

	function cn(index, noPrefix){
		if(noPrefix){
			return modoCore.Menu.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Menu.classNames[index];
	}

	function render(obj, settings){
		var html = '',
			key,
			e,
			re,
			keys = [],
			callbacks = [];


		for (key in settings.elements) {
			e = settings.elements[key];

			if(!e.label){
				html += '<div class="' + cn(11) + '"></div>';
				continue;
			}

			keys.push(e.ref);
			callbacks.push(e.callback);

			if(e.hotkey){
				re = new RegExp('(' + e.hotkey.toLowerCase() + '|' + e.hotkey.toUpperCase() + ')');
				e.label = e.label.replace(re, '<span class="' + cn(9) + '">$1</span>');
			}

			html += '<div class="' + cn(5) + (e.disabled ? ' ' + modoCore.cssPrefix + modoCore.Element.classNames[2] : '') + (e.children && e.children.length ? ' ' + cn(2) : '') + '">' +
					'<div class="' + cn(7) + (e.icon ? ' ' + cn(4, true) + e.icon : '') + '"></div>' +
					'<div class="' + cn(6) + '">' + e.label + (e.info ? '<div class="' + cn(8) + '">' + e.info + '</div>' : '') + '</div>' +
					'</div>';
		}

		settings.keys = keys;
		settings.callbacks = callbacks;

		obj.el.html(html);
	}

	modoCore.defineElement('Menu', [
		'menu',
		'menu-dropdown',
		'menu-has-children',
		'menu-baseline',
		'icon-',
		'menu-item',
		'menu-item-label',
		'menu-item-field',
		'menu-item-info',
		'hotkey',
		'selected',
		'divider',
		'first-sublevel',
		'child'
	], function (params){
		params = params || {};

		var key,
			sub;

		modoCore.Element.call(this, params);

		this.addClass(modoCore.Menu.classNames[0]);

		/*var data = [
		 {
		 label: 'File',                  //Obvious
		 hotkey: 'F',                    //Hit "F" on the keyboard to mark this item.
		 info: 'STRG+Q',                 //Displays an additional info label at the end of the element. Can be used to
		 show action key-strokes.
		 icon: 'name',                   //Adds class 'mdo-icon-name'
		 disabled: false,                //Should the element be rendered as disabled?
		 ref: 'my-id',                   //Set a unique identifier here to access this item.
		 checkbox: true,                 //Checkbox beats Icon.
		 radio: true,                    //Radio beats Checkbox beats Icon.
		 radio_group: 'groupname',       //Only one radio element per group can be selected.
		 radio_value: '',                //Value will be returned in select events.
		 children: []                    //Add another layer to the menu
		 },
		 {
		 label: '' //Makes a separator, ignores other stuff
		 }
		 ];*/

		var settings = {
			elements: params.elements,
			autoHotkey: params.autoHotkey || false,
			baseLevel:  params.baseLevel || false,
			keys: [],
			callbacks: [],
			selectedIndex: null,
			all: null,
			oldFocus: null,
			children: [],
			subMenuTimeout: null,
			hideTimeout: null,
			willOpen: null,
			openSubMenu: null
		};

		var that = this;

		var hidefunc = function (){
			that.hide();
		};

		if(settings.baseLevel){
			this.addClass(modoCore.Menu.classNames[3]);
		} else {
			this.addClass(modoCore.Menu.classNames[1]);
		}

		render(this, settings);

		for (key in settings.elements) {
			if(settings.elements[key].children){
				sub = new modoCore.Menu({
					elements: settings.elements[key].children
				});
				if(settings.baseLevel){
					sub.addClass(cn(12, true));
				}
				settings.children.push(sub);
			} else {
				settings.children.push(null);
			}
		}

		settings.all = this.el.find('.' + cn(5));

		this.el.on('mousemove', '.' + cn(5), function (){ //menu-item
			//Get the selected items index.
			var index = settings.all.index(this),
				that = this;

			if(this.className.match('disabled')){
				settings.selectedIndex = null;
				settings.all.removeClass(cn(10));
				return;
			}

			if(settings.selectedIndex === index){
				return;
			}

			settings.selectedIndex = index;

			if(settings.openSubMenu !== null && settings.openSubMenu !== index){
				settings.hideTimeout = setTimeout(function (){
					if(!settings.children[settings.openSubMenu]){
						return;
					}
					settings.children[settings.openSubMenu].hide();
					settings.openSubMenu = null;
				}, 500);
			}

			if(settings.children[index]){
				clearTimeout(settings.subMenuTimeout);
				if(settings.openSubMenu === index){
					clearTimeout(settings.hideTimeout);
				}

				if(settings.willOpen !== index){
					settings.subMenuTimeout = setTimeout(function (){
						settings.openSubMenu = index;
						settings.children[index]
							.showAtElement(that, settings.baseLevel ? modo.Menu.BOTTOM : modo.Menu.RIGHT)
							.one('select', hidefunc)
							.focus()
							.el.addClass(cn(13, true));
					}, 500);
					settings.willOpen = index;
				}
			} else {
				if(settings.willOpen){
					clearTimeout(settings.subMenuTimeout);
				}
			}

			settings.all.removeClass(cn(10)); //selected
			$(this).addClass(cn(10));
		});

		this.el.on('mouseout', function (){
			settings.selectedIndex = null;
			settings.all.removeClass(cn(10));
		});

		this.el.on('click', '.' + cn(5), function (e){
			var i;
			e.stopPropagation();
			e.preventDefault();

			i = settings.selectedIndex;

			if(i === null){
				return;
			}

			if(settings.children[i]){
				settings.children[i]
					.showAtElement(this, settings.baseLevel ? modo.Menu.BOTTOM : modo.Menu.RIGHT)
					.one('select', hidefunc)
					.focus()
					.el.addClass(cn(13, true));
				return;
			}

			that.trigger('select', settings.keys[i]);

			var c = settings.callbacks[i];
			if(typeof c === 'function'){
				c.call(this);
			}

			if(!settings.baseLevel){
				that.hide();
			}
		});

		if(!settings.baseLevel){
			this.hide();
		}

		var keycapture = function (e, key){
			/*e.stopPropagation();
			 e.preventDefault();
			 switch (key) {
			 case 'up':
			 if(settings.selectedIndex === null){
			 settings.selectedIndex = 0;
			 } else {
			 settings.selectedIndex--;
			 if(settings.selectedIndex < 0){
			 settings.selectedIndex = settings.all.size() - 1;
			 }
			 }
			 settings.all.removeClass(cn(9));
			 settings.all.eq(settings.selectedIndex).addClass(cn(9));
			 break;

			 case 'down':
			 if(settings.selectedIndex === null){
			 settings.selectedIndex = 0;
			 } else {
			 settings.selectedIndex++;
			 if(settings.selectedIndex > settings.all.size() - 1){
			 settings.selectedIndex = 0;
			 }
			 }
			 settings.all.removeClass(cn(9));
			 settings.all.eq(settings.selectedIndex).addClass(cn(9));
			 break;

			 case 'escape':
			 that.hide();
			 $(window).off('click', hidefunc);
			 break;
			 }*/
		};

		this.on('show', function (){
			settings.oldFocus = document.activeElement;

			settings.oldFocus.blur();

			setTimeout(function (){
				$(window).one('click', hidefunc);
			}, 1);

			modoCore.keyListener.on('keyPress', keycapture);
		});

		this.on('hide', function (){
			if(settings.oldFocus){
				settings.oldFocus.focus();
			}
			settings.oldFocus = null;

			settings.all.removeClass(cn(9));
			settings.selectedIndex = null;
			modoCore.keyListener.off('keyPress', keycapture);
			$(window).off('click', hidefunc);
			if(settings.openSubMenu){
				settings.children[settings.openSubMenu].hide();
			}
		});

		modoCore.keyListener.enable();

		if(!settings.baseLevel){
			modoCore.getRootElement().append(this.el);
		}

		modoCore._stat('Menu');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * Position the menu object at another modo- or DOM-Element and display it.
			 * @param {modo.Element} element
			 * @param {Integer} [position=modoCore.Menu.Right]
			 */
			showAtElement: function (element, position){
				var el,
					pX,
					pY;

				if(position === undefined){
					position = 0;
				}

				if(modoCore.isElement(element)){
					el = element.el;
				} else {
					if(modoCore.isDOM(element)){
						el = $(element);
					}
				}
				if(!el){
					throw new Error('Illegal element');
				}

				var offs = el.offset();

				pX = pY = 0;

				switch (position) {
				case 0:
					pY = -this.el.outerHeight();
					break;
				case 1:
					pY = el.outerHeight();
					break;
				case 2:
					pX = -el.outerWidth();
					break;
				case 3:
					pX = this.el.outerWidth();
				}

				this.el.css({
					top:  offs.top + pY,
					left: offs.left + pX
				});
				this.show();

				return this;
			},
			/**
			 * Position the menu at the current mouse position and display it.
			 */
			showAtCursor: function (){
				this.el.css({
					top: modoCore.mousePosition.y,
					left: modoCore.mousePosition.x
				});
				this.show();
				return this;
			},

			focus: function (){

				return this;
			}
		});

	modoCore.Menu.TOP = 0;
	modoCore.Menu.BOTTOM = 1;
	modoCore.Menu.LEFT = 2;
	modoCore.Menu.RIGHT = 3;

	/**
	 * Observe the global (inside the mdo-root) cursor position and store it.
	 * Note: might become obsolete with some coming-soon module.
	 */
	modoCore.once('init', function (){
		modoCore.getRootElement().on('mousemove', function (e){
			var $this = $(this),
				$window = $(window),
				offs = $this.offset(),
				pos = {
					x: (e.pageX - offs.left) + $window.scrollLeft(),
					y: (e.pageY - offs.top) + $window.scrollTop()
				};
			modoCore.mousePosition = pos;
		});
	});
})();

/**
 * modo-keylistener
 * ================
 * The keylistener object is no creatable element, but attaches itself to the modo object.
 * Once enabled with modoCore.keyListener.enable(), it observes any keystroke made and emits
 * events according to it.
 *
 * Its possible to submit a scope to the key-listener, to make it possible to forward
 * key events to only a single element temporarily.
 *
 * @TODO: Check english keymap
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


	var enabled,
		disabled,
		scopes,
		pressed;

	enabled = false;
	disabled = false;
	scopes = [];
	pressed = {};

	modoCore.keyListener = {
		keymap: {
			en: {
				8: 'backspace',
				9: 'tab',
				13: 'enter',
				16: 'shift',
				17: 'ctrl',
				18: 'alt',
				19: 'pause',
				20: 'capslock',
				27: 'escape',
				32: 'space',
				33: 'pageup',
				34: 'pagedown',
				35: 'end',
				36: 'home',
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down',
				45: 'insert',
				46: 'delete',

				48: '0',
				49: '1',
				50: '2',
				51: '3',
				52: '4',
				53: '5',
				54: '6',
				55: '7',
				56: '8',
				57: '9',

				65: 'a',
				66: 'b',
				67: 'c',
				68: 'd',
				69: 'e',
				70: 'f',
				71: 'g',
				72: 'h',
				73: 'i',
				74: 'j',
				75: 'k',
				76: 'l',
				77: 'm',
				78: 'n',
				79: 'o',
				80: 'p',
				81: 'q',
				82: 'r',
				83: 's',
				84: 't',
				85: 'u',
				86: 'v',
				87: 'w',
				88: 'x',
				89: 'y',
				90: 'z',

				91: 'win',

				96: '0',
				97: '1',
				98: '2',
				99: '3',
				100: '4',
				101: '5',
				102: '6',
				103: '7',
				104: '8',
				105: '9',
				106: '*',
				107: '+',
				109: '-',

				111: '/',
				112: 'f1',
				113: 'f2',
				114: 'f3',
				115: 'f4',
				116: 'f5',
				117: 'f6',
				118: 'f7',
				119: 'f8',
				120: 'f9',
				121: 'f10',
				122: 'f11',
				123: 'f12',
				144: 'numlock',
				145: 'scrolllock',
				186: ';',
				187: '+',
				188: ',',
				189: '-',
				190: '.',
				191: '/',
				192: '`',
				219: '(',
				220: '^',
				221: '´',
				222: '`',
				226: '\\'
			},
			de: {
				8: 'backspace',
				9: 'tab',
				13: 'enter',
				16: 'shift',
				17: 'ctrl',
				18: 'alt',
				19: 'pause',
				20: 'capslock',
				27: 'escape',
				32: 'space',
				33: 'pageup',
				34: 'pagedown',
				35: 'end',
				36: 'home',
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down',
				45: 'insert',
				46: 'delete',

				48: '0',
				49: '1',
				50: '2',
				51: '3',
				52: '4',
				53: '5',
				54: '6',
				55: '7',
				56: '8',
				57: '9',

				65: 'a',
				66: 'b',
				67: 'c',
				68: 'd',
				69: 'e',
				70: 'f',
				71: 'g',
				72: 'h',
				73: 'i',
				74: 'j',
				75: 'k',
				76: 'l',
				77: 'm',
				78: 'n',
				79: 'o',
				80: 'p',
				81: 'q',
				82: 'r',
				83: 's',
				84: 't',
				85: 'u',
				86: 'v',
				87: 'w',
				88: 'x',
				89: 'y',
				90: 'z',

				91: 'win',

				96: '0',
				97: '1',
				98: '2',
				99: '3',
				100: '4',
				101: '5',
				102: '6',
				103: '7',
				104: '8',
				105: '9',
				106: '*',
				107: '+',
				109: '-',

				111: '/',
				112: 'f1',
				113: 'f2',
				114: 'f3',
				115: 'f4',
				116: 'f5',
				117: 'f6',
				118: 'f7',
				119: 'f8',
				120: 'f9',
				121: 'f10',
				122: 'f11',
				123: 'f12',
				144: 'numlock',
				145: 'scrolllock',
				186: 'ü',
				187: '+',
				188: ',',
				189: '-',
				190: '.',
				191: '#',
				192: 'ö',
				219: 'ß',
				220: '^',
				221: '´',
				222: 'ä',
				226: '<'
			}
		},
		lastKey: null,
		isScoped: false,
		/**
		 * Enables the key listening.
		 * options = {
         *  repetitive: false //Decide if holding a key fires the same event all the time.
         * }
		 * @param options
		 */
		enable: function (options){
			if(enabled){
				enabled = false;
				return;
			}

			modoCore._stat('keyListener');

			options = options || {};
			disabled = false;

			$(window).on('keydown', function (e){
				if(disabled){
					return;
				}

				var altKey = e.altKey,
					shiftKey = e.shiftKey,
					ctrlKey = e.ctrlKey,
					metaKey = e.metaKey,
					key = e.keyCode,
					originalKeyname,
					keyname,
					strokename,
					scope;

				if(scopes.length){
					scope = scopes[scopes.length - 1];
				}

				keyname = keymap[key] || '';

				strokename = ctrlKey ? 'ctrl' : '';

				if(shiftKey){
					if(strokename){
						strokename += '+';
					}
					strokename += 'shift';
				}
				if(altKey){
					if(strokename){
						strokename += '+';
					}
					strokename += 'alt';
				}
				if(strokename){
					strokename += '+';
				}
				strokename += keyname;

				if((shiftKey || ctrlKey || altKey || metaKey) && keyname !== 'shift' && keyname !== 'ctrl' && keyname !== 'alt'){
					if(scope){
						strokename += '~' + scope;
					}
					modoCore.keyListener.trigger('stroke', e, strokename);
				}

				if(keyname){
					pressed[keyname] = true;

					originalKeyname = keyname;
					if(scope){
						keyname += '~' + scope;
						pressed[keyname] = true;
					}

					modoCore.keyListener.lastKey = keyname;

					modoCore.keyListener.trigger(keyname, e, originalKeyname);
					modoCore.keyListener.trigger('keydown' + (scope ? '~' + scope : ''), e, originalKeyname);
				}
			}).on('keyup', function (e){
				var key,
					keyname,
					originalKeyname,
					scope;

				key = e.keyCode;
				keyname = keymap[key] || '';
				if(scopes.length){
					scope = scopes[scopes.length - 1];
				}

				delete pressed[keyname];

				originalKeyname = keyname;
				if(scope){
					keyname += '~' + scope;
					delete pressed[keyname];
				}

				modoCore.keyListener.trigger('keyup' + (scope ? '~' + scope : ''), e, originalKeyname);
			}).focus();
			enabled = true;
		},
		/**
		 * Use this method to disable the keyListener after it has been enabled.
		 */
		disable: function (){
			disabled = true;
		},

		/**
		 * Will shift the current event scope to the submitted namespace.
		 * Can be called multiple times - if a later scope is being released, the scope switches back to the
		 * previous state until no more scopes are active.
		 * @param {modoCore.Element|String} newScope
		 */
		setScope: function (newScope){
			scopes.push(newScope.modoId || newScope);
			this.isScoped = true;
		},

		/**
		 * Returns true, when the given key is currently pressed.
		 * @param {String|Integer} keyName Either the keys name, or its key index.
		 * @returns {boolean}
		 */
		isPressed: function (keyName){
			if(typeof keyName === 'number'){
				keyName = keymap[keyName];
			}
			return pressed[keyName] === true;
		},

		/**
		 * Removes a scope from the scopes list.
		 * If it was the last submitted scope, the scope pointer will switch back to the previously submitted scope.
		 * @param {modoCore.Element|String} oldScope
		 */
		releaseScope: function (oldScope){
			var scopeIndex;

			scopeIndex = _.indexOf(scopes, oldScope.modoId || oldScope);

			if(scopeIndex !== -1){
				scopes.splice(scopeIndex, 1);
			}

			if(!scopes.length){
				this.isScoped = false;
			}
		},

		/**
		 * Wrapper function for the "on" method, to bind to scoped events.
		 * Read more: http://backbonejs.org/#Events-on
		 * @param {modoCore.Element|String} scope
		 * @param {String} eventName
		 * @param {Function} callback
		 * @param {Object} [context]
		 * @param {Bool} [once=false]
		 */
		onScoped: function (scope, eventName, callback, context, once){
			var scopeName,
				i;

			scopeName = scope.modoId || scope;

			eventName = eventName.split(' ');
			for (i = 0; i < eventName.length; i++) {
				eventName[i] = eventName[i] + '~' + scopeName;
			}
			eventName = eventName.join(' ');

			if(once){
				this.once(eventName, callback, context);
			}

			this.on(eventName, callback, context);
		},

		/**
		 * Shortcut/convenience method for listening to scoped events only once.
		 * Can also be achieved by passing true for the "once" parameter of the onScoped() method.grunt
		 * @param scope
		 * @param eventName
		 * @param callback
		 * @param [context]
		 */
		onceScoped: function (scope, eventName, callback, context){
			this.onScoped(scope, eventName, callback, context, true);
		},

		/**
		 * Removes a previously bound callback from a scoped event.
		 * Read more: http://backbonejs.org/#Events-off
		 * @param {modoCore.Element|String} scope
		 * @param {String} eventName
		 * @param {Function} [callback]
		 * @param {Object} [context]
		 */
		offScoped: function (scope, eventName, callback, context){
			var scopeName,
				i;

			scopeName = scope.modoId || scope;

			eventName = eventName.split(' ');
			for (i = 0; i < eventName.length; i++) {
				eventName[i] = eventName[i] + '~' + scopeName;
			}
			eventName = eventName.join(' ');

			this.off(eventName, callback, context);
		}
	};

	var keymap;
	if(typeof modoCore.keyListener.keymap[navigator.language] !== 'undefined'){
		keymap = modoCore.keyListener.keymap[navigator.language];
	} else {
		keymap = modoCore.keyListener.keymap.en;
	}

	_.extend(modoCore.keyListener, Backbone.Events);

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.keyListener;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.keyListener', function (){
				return modoCore.keyListener;
			});
		}
	}
})();

/**
 * modo-dateformatter
 * ==================
 * The dateformatter object is no creatable object, but attaches itself to the modo object.
 * It provides methods to convert date objects (and timestamps) into human readable strings.
 */
(function (){
	'use strict';

	var modoCore,
		inUse;

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	function used(){
		if(inUse){
			return;
		}

		inUse = true;
		modoCore._stat('dateFormatter');
	}

	var self;

	modoCore.dateFormatter = self = {
		MONTH_NAMES: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		MONTH_NAMES_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		DAY_NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		DAY_NAMES_SHORT: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		SUFFIX: ['st', 'nd', 'rd', 'th'],
		TODAY: 'today',
		YESTERDAY: 'yesterday',
		LAST: 'last %v',
		FUZZY_SECONDS: 'about a minute ago',
		NEVER: 'never',

		REL_UNITS: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'],
		REL_PAST: '%v %u ago',
		REL_FUTURE: 'in %v %u',
		REL_CURRENT: 'right now',
		DEFAULT_FORMAT: 'F jS, Y',

		LOCAL_TIMEZONE:  -((new Date()).getTimezoneOffset() / 60),
		REMOTE_TIMEZONE: -((new Date()).getTimezoneOffset() / 60),
		normalizeTimezones: true,

		/**
		 * Takes a date or timestamp and converts it to another timezone.
		 * @param inDate Javascript Date Object, or UNIX timestamp to convert from.
		 * @param toOffset New timezone offset from GMT/UTC in hours to convert to.
		 * @param [fromOffset] Optional. The method will take the current browsers offset by default.
		 * @return Date
		 */
		convertTimezone: function (inDate, toOffset, fromOffset){
			var workDate;
			used();

			if(toOffset === fromOffset){
				if(inDate instanceof Date){
					return inDate;
				}

				return new Date(inDate * 1000);
			}

			if(inDate instanceof Date){
				workDate = Math.floor(inDate.getTime());
				if(fromOffset === undefined){
					fromOffset = -(inDate.getTimezoneOffset() / 60);
				}
			} else {
				workDate = inDate * 1000;
			}

			//Normalize input date to UTC
			workDate = workDate - (fromOffset * 3600000);

			workDate += toOffset * 3600000;

			return new Date(workDate);
		},

		/**
		 * Takes a date object or timestamp and will return a "fancy" string representation
		 * which is most pleasant for users to read.
		 *
		 * Example output:
		 *    10 minutes ago
		 *    Today, 11:15
		 *    Yesterday, 22:00
		 *    Last tuesday
		 *
		 *
		 * @param inDate
		 */
		dateToFancyString: function (inDate, dateFormat, options){
			used();

			options = options || {};

			options.normalizeTimezones = options.normalizeTimezones || self.normalizeTimezones;
			options.localTimezone = options.localTimezone === 0 ? options.localTimezone : options.localTimezone || self.LOCAL_TIMEZONE;
			options.remoteTimezone = options.remoteTimezone === null ? undefined : options.remoteTimezone === 0 ? options.remoteTimezone : options.remoteTimezone || self.REMOTE_TIMEZONE;

			if(inDate === 0){
				return this.NEVER;
			}

			if(options.normalizeTimezones){
				inDate = self.convertTimezone(inDate, options.localTimezone, options.remoteTimezone);
			}

			if(!(inDate instanceof Date)){
				inDate = new Date(inDate * 1000);
			}

			if(!dateFormat){
				//October 2nd, 2015
				dateFormat = modoCore.dateFormatter.DEFAULT_FORMAT;
			}

			var diff,
				today;

			today = new Date();
			diff = Math.abs(inDate - today) / 1000;

			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);

			if(diff > 604800){
				return this.dateToString(dateFormat, inDate);
			}

			if(diff < 120){
				return this.FUZZY_SECONDS;
			}

			if(diff < 3600){
				return this.dateToRelativeString(inDate);
			}

			if(inDate > today){
				return this.TODAY + ', ' + this.dateToString('H:i', inDate);
			}

			today.setTime(today.getTime() - 86400000);

			if(inDate > today){
				return this.YESTERDAY + ', ' + this.dateToString('H:i', inDate);
			}

			return this.LAST.replace(/%v/, this.dateToString('l', inDate));
		},

		/**
		 * This creates a "relative" string, as used often in applications and social networks.
		 * Instead of printing out the precise datetime, it comparing the two dates and
		 * produces outputs like "x minutes ago".
		 * Also works into the future.
		 * @TODO: make it more precise
		 * @param datePast
		 * @param dateNow
		 */
		dateToRelativeString: function (datePast, dateNow, options){
			used();

			var toFuture,
				diff,
				unit,
				value;

			options = options || {};

			options.normalizeTimezones = options.normalizeTimezones || self.normalizeTimezones;
			options.localTimezone = options.localTimezone === 0 ? options.localTimezone : options.localTimezone || self.LOCAL_TIMEZONE;
			options.remoteTimezone = options.remoteTimezone === null ? undefined : options.remoteTimezone === 0 ? options.remoteTimezone : options.remoteTimezone || self.REMOTE_TIMEZONE;

			if(!datePast){
				throw new Error('No date given');
			}

			if(options.normalizeTimezones){
				datePast = self.convertTimezone(datePast, options.localTimezone, options.remoteTimezone);
			}

			if(!(datePast instanceof Date)){
				datePast = new Date(datePast * 1000);
			}

			if(!dateNow){
				dateNow = new Date();
			} else {
				if(!(dateNow instanceof Date)){
					dateNow = new Date(dateNow * 1000);
				}
			}

			if(options.normalizeTimezones){
				dateNow = self.convertTimezone(dateNow, options.localTimezone, options.remoteTimezone);
			}

			diff = (dateNow - datePast) / 1000;

			if(diff < 0){
				toFuture = true;
				diff = Math.abs(diff);
			}

			if(diff <= 10){
				return this.REL_CURRENT;
			}

			//Years
			if(diff > 29030400){
				unit = 6;
				value = Math.round(diff / 29030400);
			}

			//Months
			if(diff < 29030400){
				unit = 5;
				value = Math.round(diff / 2419200);
			}

			//Weeks
			if(diff < 2419200){
				unit = 4;
				value = Math.round(diff / 604800);
			}

			//Days
			if(diff < 604800){
				unit = 3;
				value = Math.round(diff / 86400);
			}

			//Hours
			if(diff < 86400){
				unit = 2;
				value = Math.round(diff / 3600);
			}

			//Minutes
			if(diff < 3600){
				unit = 1;
				value = Math.round(diff / 60);
			}

			//Seconds
			if(diff < 60){
				unit = 0;
				value = Math.round(diff);
			}

			if(toFuture){
				return this.REL_FUTURE.replace(/%v/, value).replace(/%u/, this.REL_UNITS[unit]);
			}
			return this.REL_PAST.replace(/%v/, value).replace(/%u/, this.REL_UNITS[unit]);
		},

		/**
		 * This outputs a string with a formatted date and follows the PHP date() specification.
		 * See: http://de2.php.net/manual/en/function.date.php
		 * @param {String} format
		 * @param {Date} inDate (optional)
		 * @returns {String}
		 */
		dateToString: function (format, inDate, options){
			used();

			if(!(inDate instanceof Date)){
				inDate = new Date(inDate * 1000);
			}

			options = options || {};

			options.normalizeTimezones = options.normalizeTimezones || self.normalizeTimezones;
			options.localTimezone = options.localTimezone === 0 ? options.localTimezone : options.localTimezone || self.LOCAL_TIMEZONE;
			options.remoteTimezone = options.remoteTimezone === null ? undefined : options.remoteTimezone === 0 ? options.remoteTimezone : options.remoteTimezone || self.REMOTE_TIMEZONE;

			if(options.normalizeTimezones){
				inDate = self.convertTimezone(inDate, options.localTimezone, options.remoteTimezone);
			}

			var output = '';

			var replacements = {
				'd': (inDate.getDate() < 10) ? '0' + inDate.getDate() : inDate.getDate(),
				'D': this.DAY_NAMES_SHORT[(inDate.getDay() === 0) ? 6 : inDate.getDay() - 1],
				'j': inDate.getDate(),
				'l': this.DAY_NAMES[(inDate.getDay() === 0) ? 6 : inDate.getDay() - 1],
				'N': (inDate.getDay() === 0) ? 7 : inDate.getDay(),
				'S': (inDate.getDate() < 4) ? this.SUFFIX[inDate.getDate() - 1] : this.SUFFIX[3],
				'w': inDate.getDate(),
				'z': (function (inDate){
					var day = 0;
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth(0);
					dte.setYear(inDate.getFullYear());
					while (day < 365) {
						if(dte.getTime() > inDate.getTime()){
							return day;
						}
						dte.setTime(dte.getTime() + 86400000);
						day++;
					}
					return day;
				})(inDate),
				'W': (function (inDate){
					var week = 0;
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth(0);
					dte.setYear(inDate.getFullYear());
					while (week < 52) {
						if(dte.getTime() > inDate.getTime()){
							return week;
						}
						dte.setTime(dte.getTime() + (86400000 * 7));
						week++;
					}
					return week;
				})(inDate),
				'F': this.MONTH_NAMES[inDate.getMonth()],
				'm': (inDate.getMonth() < 9) ? '0' + (inDate.getMonth() + 1) : inDate.getMonth() + 1,
				'M': this.MONTH_NAMES_SHORT[inDate.getMonth()],
				'n': inDate.getMonth() + 1,
				't': (function (inDate){
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth((inDate.getMonth() < 11) ? inDate.getMonth() + 1 : 0);
					dte.setYear((inDate.getMonth() < 11) ? inDate.getFullYear() : inDate.getFullYear() + 1);
					dte.setHours(0);
					dte.setMinutes(0);
					dte.setSeconds(0);
					dte.setMilliseconds(0);
					dte.setTime(dte.getTime() - 1);
					return dte.getDate();
				})(inDate),
				'L': (function (inDate){
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth(2);
					dte.setYear(inDate.getFullYear());
					dte.setHours(0);
					dte.setMinutes(0);
					dte.setSeconds(0);
					dte.setMilliseconds(0);
					dte.setTime(dte.getTime() - 1);
					return (dte.getDate() === 29) ? 1 : 0;
				})(inDate),
				'Y': inDate.getFullYear(),
				'y': String(inDate.getFullYear()).substr(2, 2),
				'H': (inDate.getHours() < 10) ? '0' + inDate.getHours() : inDate.getHours(),
				'i': (inDate.getMinutes() < 10) ? '0' + inDate.getMinutes() : inDate.getMinutes(),
				's': (inDate.getSeconds() < 10) ? '0' + inDate.getSeconds() : inDate.getSeconds(),
				'u': inDate.getMilliseconds()
			};

			var character;

			for (var i = 0; i < format.length; i++) {
				character = format[i];
				if(character === '\\'){
					i += 1;
					continue;
				}
				if(typeof replacements[character] === 'undefined'){
					output += character;
				} else {
					output += replacements[character];
				}
			}

			return output;
		}
	};

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.dateFormatter;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.dateFormatter', function (){
				return modoCore.dateFormatter;
			});
		}
	}
})();
/**
 * Template
 * ===========
 * The template element is a element that renders custom HTML parts of your interface, like static
 * descriptions or decoration.
 * You can still hook up a Backbone.Model to the template element to replace certain placeholders in the template
 * automatically.
 */
/* global modo:true */
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
			return modoCore.Template.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Template.classNames[index];
	}

	function render(el, tpl, data){
		el.html(tpl(data));
	}

	modoCore.defineElement('Template', ['mdo-template'], function (params){
		var that;

		params = params || {};
		that = this;

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		if(typeof params.template !== 'function'){
			params.template = _.template(params.template);
		}

		//TODO: Clean that shit up.
		this.set = function (data){
			this.stopListening();

			if(data instanceof Backbone.Model){
				this.listenTo(data, 'change', function (){
					render(that.el, params.template, data.getJSON());
					that.trigger('update');
				});
				render(this.el, params.template, data.getJSON());
			} else {
				render(this.el, params.template, data);
			}

			this.trigger('update');

			return this;
		};

		if(params.data){
			this.set(params.data);
		} else {
			render(this.el, params.template, {});
		}

		modoCore._stat('Template');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/* PROTOTYPE FUNCTIONS HERE */
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Template;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Template', [], function (){
				return modo.Template;
			});
		}
	}
})();
/**
 * modo-notification
 * ===========
 * description
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
			return modoCore.Notification.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Notification.classNames[index];
	}

	modoCore.defineElement('Notification', ['notification'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, false));

		/**
		 * Used as a marker for the modoCore.generate() function.
		 * This states, that this element must not be passed to add() functions.
		 * @type {Boolean}
		 */
		this.noAdd = true;

		this.el.html(params.content);

		this.displayTime = params.duration;

		modoCore._stat('Notification');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			set: function (content){
				this.el.html(content);

				return this;
			},
			hide: function (){
				this.visible = false;

				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.Notification;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Notification', [], function (){
				return modo.Notification;
			});
		}
	}
})();
/**
 * modo-NotificationContainer
 * ===========
 * description
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
			return modoCore.NotificationContainer.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.NotificationContainer.classNames[index];
	}

	modoCore.defineElement('NotificationContainer', ['notificationcontainer', 'pos-', 'append-'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, false));

		if(!params.position){
			params.position = 'top-right';
		}

		this.addClass(cn(1, false) + params.position);

		if(params.append !== 'before'){
			params.append = 'after';
		}

		this.addClass(cn(2, false) + params.append);

		var queue,
			active,
			maxActive,
			maxTime,
			that,
			showEffect,
			hideEffect;

		that = this;
		queue = [];
		active = [];
		maxActive = params.showLimit || Number.POSITIVE_INFINITY;
		maxTime = params.displayTime || 5000;
		showEffect = params.showEffect || function (elm){
			elm.slideDown();
		};
		hideEffect = params.hideEffect || function (elm){
			elm.slideUp();
		};

		modoCore.getRootElement().append(this.el);

		/**
		 * Used as a marker for the modoCore.generate() function.
		 * This states, that this element must not be passed to add() functions.
		 * @type {Boolean}
		 */
		this.noAdd = true;

		function update(){
			var n,
				i,
				now,
				removed;

			now = Date.now();
			removed = 0;

			while (queue.length && active.length < maxActive) {
				n = queue.shift();
				n.displayedAt = now;
				if(n.displayTime === undefined){
					n.displayTime = maxTime;
				}
				n.el.hide();
				if(params.append === 'before'){
					that.el.prepend(n.el);
				} else {
					that.el.append(n.el);
				}
				showEffect(n.el);
				n.trigger('show');
				active.push(n);
			}

			for (i = 0; i < active.length; i++) {
				n = active[i];
				if(n.displayTime || !n.visible){
					if(n.displayedAt + n.displayTime < now || !n.visible){
						hideEffect(n.el);
						n.trigger('hide');
						that.trigger('remove', n);
						active.splice(i, 1);
						removed++;
						i--;
					}
				}
			}

			if(removed){
				update();
				return;
			}

			if(active.length || queue.length){
				setTimeout(update, 500);
			}

			if(!active.length && !queue.length){
				that.trigger('queueEmpty');
			}
		}

		/**
		 * This method adds a new notification to the notifications stack.
		 * @param elm
		 */
		this.add = function (elm){
			if(!(elm instanceof modoCore.Notification)){
				throw new Error('You can only add elements of type modo.Notification');
			}
			queue.push(elm);

			that.trigger('add', elm);

			update();
		};

		modoCore._stat('NotificationContainer');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			createNotification: function (params){
				var n;

				n = new modoCore.Notification(params);

				this.add(n);

				return n;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modo.NotificationContainer;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('NotificationContainer', [], function (){
				return modo.NotificationContainer;
			});
		}
	}
})();
/**
 * Modo Slider
 * ===========
 * The slider element can be used to set up numeric values.
 * It has a horizontal and vertical direction.
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
			return modoCore.Slider.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Slider.classNames[index];
	}

	modoCore.defineElement('Slider', ['slider', 'slider-vertical', 'slider-range', 'slider-value', 'slider-plug1', 'slider-plug2'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		var that,
			settings,
			$uiValue,
			$uiPlug1,
			$uiPlug2,
			draggedPlug;

		that = this;
		settings = {
			direction: _.indexOf(['horizontal', 'vertical'], params.direction) !== -1 ? params.direction : 'horizontal',
			range: params.range ? true : false,
			minValue: params.minValue || 0,
			maxValue: params.maxValue || 100,
			value1:   params.value || params.value1 || 0,
			value2:   params.value2 || 0,
			step:     params.step || 1
		};

		if(params.model){
			if(settings.range){
				params.modelKey = params.modelKey1;
			} else {
				params.value1 = params.value;
			}

			if(!params.modelKey){
				if(typeof params.value1 === 'function'){
					params.model.on('change', function (){
						that.set(params.value1.call(that, params.model));
					});
				} else {
					throw new Error('Trying to bind to model, but no modelKey and no valueFunction given');
				}
			} else {
				params.value1 = params.model.get(params.modelKey);

				params.model.on('change:' + params.modelKey, function (){
					that.set(params.model.get(params.modelKey));
				});
			}

			if(settings.range){
				if(!params.modelKey2){
					if(typeof params.value2 === 'function'){
						params.model.on('change', function (){
							that.set(params.value2.call(that, params.model));
						});
					} else {
						throw new Error('Trying to bind to model, but no modelKey and no valueFunction given');
					}
				} else {
					params.value2 = params.model.get(params.modelKey2);

					params.model.on('change:' + params.modelKey2, function (){
						that.set(params.model.get(params.modelKey2));
					});
				}
			}

		}

		$uiValue = $('<div class="' + cn(3) + '"></div>');
		$uiPlug1 = $('<div class="' + cn(4) + '"></div>');

		this.el.append($uiValue, $uiPlug1);

		this.disabled = false;

		this.addClass(cn(0, false));
		if(settings.direction === 'vertical'){
			this.addClass(cn(1, false));
		}

		if(settings.range){
			this.addClass(cn(2, false));
			$uiPlug2 = $('<div class="' + cn(5) + '"></div>');
			this.el.append($uiPlug2);
		}

		this.get = function (){
			if(settings.range){
				return [settings.value1, settings.value2];
			}
			return settings.value1;
		};

		this.set = function (values, options){
			options = options || {silent: false};

			if(settings.range){
				values.sort();
				settings.value1 = values[0];
				settings.value2 = values[1];
				return;
			}
			settings.value1 = values;

			update(options.silent);

			return this;
		};

		this.setMin = function (value){
			settings.minValue = value;

			return this;
		};

		this.setMax = function (value){
			settings.maxValue = value;

			return this;
		};

		/**
		 * Updates the elements DOM nodes.
		 */
		function update(silent){
			var p1Percent,
				p2Percent,
				vPercent,
				vPos,
				vert;

			vert = settings.direction === 'vertical';

			p1Percent = (settings.value1 - settings.minValue) / ((settings.maxValue - settings.minValue) / 100);

			if(settings.range){
				p2Percent = (settings.value2 - settings.minValue) / ((settings.maxValue - settings.minValue) / 100);

				vPos = p1Percent;
				vPercent = p2Percent - p1Percent;
				if(!vert){
					$uiPlug2.css({
						left: p2Percent + '%'
					});
				} else {
					$uiPlug2.css({
						bottom: p2Percent + '%'
					});
				}
				if(!silent){
					that.trigger('change', [settings.value1, settings.value2]);
				}
				if(params.model){
					if(params.modelKey){
						params.model.set(params.modelKey, settings.value1);
					}
					if(params.modelKey2){
						params.model.set(params.modelKey2, settings.value2);
					}
				}
			} else {
				vPos = 0;
				vPercent = p1Percent;
				if(!silent){
					that.trigger('change', settings.value1);
				}
				if(params.model){
					if(params.modelKey){
						params.model.set(params.modelKey, settings.value1);
					}
				}
			}

			if(!vert){
				$uiValue.css({
					left:  vPos + '%',
					width: vPercent + '%'
				});
				$uiPlug1.css({
					left: p1Percent + '%'
				});
			} else {
				$uiValue.css({
					bottom: vPos + '%',
					height: vPercent + '%'
				});
				$uiPlug1.css({
					bottom: p1Percent + '%'
				});
			}
		}

		update(true);

		function updateValue(plugNr, pos){
			var begin,
				end,
				v,
				vX,
				s;

			v = settings['value' + plugNr];

			if(settings.direction === 'horizontal'){
				begin = that.el.offset().left;
				end = that.el.width();
			} else {
				begin = that.el.offset().top;
				end = that.el.height();
			}

			if(pos < begin){
				pos = begin;
			}
			if(pos > end + begin){
				pos = end + begin;
			}

			if(settings.direction === 'vertical'){
				pos = (begin + end) - (pos - begin);
			}

			v = settings.minValue + ((pos - begin) / (end / 100)) * ((settings.maxValue - settings.minValue) / 100);

			v = Math.floor(v / settings.step) * settings.step;

			//Weird attempt to "fix" misbehaving floating point numbers.
			s = settings.step.toString().split('.');
			if(s.length > 1){
				vX = v.toString().split('.');
				if(vX.length > 1 && vX[1].length > s[1].length){
					v = Number(vX[0] + '.' + vX[1].substr(0, s[1].length));
				}
			}

			if(v < settings.minValue){
				v = settings.minValue;
			}
			if(v > settings.maxValue){
				v = settings.maxValue;
			}

			if(settings.range){
				if(plugNr === 1 && settings.value2 < v){
					vX = settings.value2;
					settings.value2 = v;
					settings.value1 = vX;
					draggedPlug = plugNr = 2;
				}

				if(plugNr === 2 && settings.value1 > v){
					vX = settings.value1;
					settings.value1 = v;
					settings.value2 = vX;
					draggedPlug = plugNr = 1;
				}
			}

			settings['value' + plugNr] = v;

			update();
		}

		function mouseMove(e){
			stop(e);
			updateValue(draggedPlug, settings.direction === 'horizontal' ? e.clientX : e.clientY);
		}

		function mouseUp(){
			$(document).off('mousemove', mouseMove).off('mouseup', mouseUp);
		}

		function stop(e){
			e.preventDefault();
			e.stopPropagation();
		}

		this.el.on('mousedown', '.' + cn(4) + ',.' + cn(5), function (e){
			var $this;

			stop(e);

			if(that.disabled){
				return;
			}

			$this = $(this);

			$(document).on('mousemove', mouseMove).on('mouseup', mouseUp);

			draggedPlug = $this.hasClass(cn(4)) ? 1 : 2;
		});

		modoCore._stat('Slider');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/* PROTOTYPE FUNCTIONS HERE */
			disable: function (){
				this.addClass(modo.Element.classNames[2]);
				this.disabled = true;
				this.trigger('disabled');
				return this;
			},

			enable: function (){
				this.removeClass(modo.Element.classNames[2]);
				this.disabled = false;
				this.trigger('enabled');
				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Slider;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo-slider', [], function (){
				return modoCore.Slider;
			});
		}
	}
})();
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
/**
 * modo-TinyMCE
 * ============
 * A modo element wrapper for the TinyMCE text editor.
 * This element definition will automatically try to load the tinyMCE sources from MaxCDN.
 * Make sure to include the tinyMCE source manually before loading this module if you want to use a local
 * copy of tinyMCE, instead of a hosted one.
 *
 * @version: 2 August 11th, 2014
 */
(function (){
	'use strict';

	var modoCore,
		mceURL;

	mceURL = '//tinymce.cachefly.net/4.1/tinymce.min.js';

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	modoCore.setLoadCallback('TinyMCE', function (){
		window.tinymce.baseURL = '//tinymce.cachefly.net/4.1/';
	});

	function cn(index, prefixed){
		if(prefixed !== undefined){
			return modoCore.TinyMCE.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.TinyMCE.classNames[index];
	}

	modoCore.defineElement('TinyMCE', ['tinymce', 'textarea'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		this._instanceIdentifier = this.modoId + '-' + cn(1, true);
		this.el.append('<textarea id="' + this._instanceIdentifier + '" class="' + this._instanceIdentifier + '"></textarea>');

		this._tinyMCE = null;
		this._textarea = this.el.find('textarea');
		this._waitForDom = null;

		params.config = params.config || {};

		params.config.selector = 'textarea.' + this._instanceIdentifier;
		params.config.setup = function (ed){
			ed.on('change', function (){
				ed.save();
				that.trigger('change', ed.getContent());
			});
			that._tinyMCE = ed;
		};

		params.config.init_instance_callback = function (ed){
			ed.setContent($(that._textarea).val());
		};

		var that = this;

		modoCore.setLoadCallback(this, function (){
			modoCore.waitForDom(that, function (){
				window.tinymce.init(params.config);
			});
		});

		modoCore._stat('TinyMCE');
	})
		.requireLibrary([mceURL, window.tinymce])
		.inheritPrototype('Element')
		.extendPrototype({
			get: function (){
				if(this._tinyMCE){
					return this._tinyMCE.getContent();
				}
				return $(this._textarea).val();
			},
			set: function (dta, options){
				options = options || {};

				if(this._tinyMCE){
					this._tinyMCE.setContent(dta);
					if(!options.silent){
						this.trigger('change', dta);
					}
					return this;
				}
				$(this._textarea).val(dta);
				if(!options.silent){
					this.trigger('change', dta);
				}
				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.TinyMCE;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('TinyMCE', [], function (){
				return modoCore.TinyMCE;
			});
		}
	}
})();
/**
 * modo-AceEditor
 * ============
 * A modo element wrapper for the Ace text editor from http://ace.c9.io/
 * This element definition will automatically try to load the Ace sources from MaxCDN.
 * Make sure to include the Ace source manually before loading this module if you want to use a local
 * copy of Ace, instead of a hosted one.
 *
 * @version: 1 August 11th, 2014
 */
(function (){
	'use strict';

	var modoCore,
		aceURL;

	aceURL = '//oss.maxcdn.com/ace/1.1.7/min/ace.js';

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
			return modoCore.AceEditor.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.AceEditor.classNames[index];
	}

	modoCore.defineElement('AceEditor', ['aceEditor'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		var that = this;

		this._params = params;
		this._editor = null;
		this._textarea = $('<textarea></textarea>');
		this.el.append(this._textarea);

		this._textarea.val(params.value || '');


		modoCore.setLoadCallback(this, function (){
			modoCore.waitForDom(that, function (){
				that._editor = window.ace.edit(that.el[0]);
				that._editor.setValue(that._textarea.val());
				that._textarea.remove();
				that._editor.setTheme('ace/theme/' + (that._params.theme || 'chrome'));
				that._editor.getSession().setMode('ace/mode/' + (that._params.mode || 'html'));
				that._editor.getSession().setUseWrapMode(true);
				that._editor.setShowPrintMargin(false);
				that._editor.on('change', function(){
					that.trigger('change');
				});

				that.on('show', function (){
					that._editor.resize(true);
				});

				that.on('hide', function (){
					that._editor.resize(false);
				});
			});
		});

		modoCore._stat('AceEditor');
	})
		.requireLibrary([aceURL, window.ace])
		.inheritPrototype('Element')
		.extendPrototype({
			setMode: function (mode, options){
				options = options || {};

				//If the editor is already initialized, apply mode.
				if(this._editor){
					this._editor.getSession().setMode('ace/mode/' + mode);
					if(!options.silent){
						this.trigger('changeMode', mode);
					}
					return this;
				}
				this._params.mode = mode;
				if(!options.silent){
					this.trigger('changeMode', mode);
				}
				return this;
			},
			get: function (){
				if(this._editor){
					return this._editor.getValue();
				}
				return $(this._textarea).val();
			},
			set: function (dta, options){
				options = options || {};

				if(this._editor){
					this._editor.setValue(dta);
					if(options.navigateFileStart !== false){
						this._editor.navigateFileStart();
					}
					if(!options.silent){
						this.trigger('change', dta);
					}
					return this;
				}
				$(this._textarea).val(dta);
				if(!options.silent){
					this.trigger('change', dta);
				}
				return this;
			},
			resize: function (){
				if(!this._editor){
					return;
				}
				this._editor.resize();
				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.AceEditor;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('AceEditor', [], function (){
				return modoCore.AceEditor;
			});
		}
	}
})();
/**
 * modo-popBox
 * ===========
 * Implements replacements for alert(), confirm() and prompt() that are translateable and styleable
 * and also make use of jQuery's promises.
 *
 * Depends on:
 * mdo-popup
 * mdo-label
 * mdo-button
 * mdo-inputtext
 *
 * And jQuery > 1.5 with promises.
 */
(function (){

	'use strict';

	var modoCore,
		popBox;

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	function getUI(){
		var ui = modo.generate([
			{
				type: 'PopUp',
				ref: 'window',
				params: {
					modal: true,
					className: 'mdo-popbox',
					closeOnBackdrop: false
				},
				children: [
					{
						type: 'Container',
						params: {
							className: 'tme-header'
						},
						children: [
							{
								type: 'Label',
								ref: 'lblTitle',
								params: {
									className: 'tme-title'
								}
							}
						]
					},

					{
						type: 'Container',
						params: {
							className: 'tme-content'
						},
						children: [
							{
								type: 'Label',
								ref: 'lblMessage',
								params: {
									className: 'tme-infobox'
								}
							},
							{
								type: 'InputText',
								hidden: true,
								ref: 'txtInput',
								on: {
									'keydown:enter': function (){
										ui.deferred.resolve(this.get());
										ui.window.close();
									}
								}
							}
						]
					},

					{
						type: 'Container',
						params: {
							className: 'tme-footer'
						},
						children: [
							{
								type: 'Button',
								ref: 'btnCancel',
								on: {
									click: function (){
										ui.deferred.reject();
										ui.window.close();
									}
								}
							},
							{
								type: 'Button',
								ref: 'btnConfirm',
								params: {
									className: ''
								},
								on: {
									click: function (){
										if(ui.txtInput.visible){
											ui.deferred.resolve(ui.txtInput.get());
											ui.window.close();
											return;
										}

										ui.deferred.resolve();
										ui.window.close();
									}
								}
							}
						]
					}
				]
			}
		]);

		return ui;
	}

	function open(ui, params, inDeferred){
		var btnSuccess,
			btnCancel;

		btnSuccess = popBox.CONFIRM_BUTTON;
		btnCancel = popBox.CANCEL_BUTTON;

		ui.deferred = inDeferred;

		ui.lblTitle.set(params.title);
		ui.lblMessage.set(!params.message ? params : params.message.replace(/\n/g, '<br>'));
		ui.btnConfirm.setLabel(params.btnConfirm || btnSuccess);
		ui.btnCancel.setLabel(params.btnCancel || btnCancel).focus();
		ui.window.open();

		ui.window.on('close', function (){
			if(inDeferred.state() !== 'resolved'){
				inDeferred.reject();
			}
			ui.window.el.remove();
		});
	}

	modoCore.popBox = popBox = {
		ALERT_TITLE: 'Heads up!',
		CONFIRM_TITLE: 'Are you sure?',
		PROMPT_TITLE: 'Heads up!',
		CONFIRM_BUTTON: 'Okay',
		CANCEL_BUTTON: 'Cancel',

		alert: function (params){
			var defer = jQuery.Deferred(),
				ui = getUI();


			if(typeof params !== 'object'){
				params = {
					title: popBox.ALERT_TITLE,
					message: params
				};
			}

			params.title = params.title || popBox.ALERT_TITLE;

			ui.btnCancel.hide();
			ui.txtInput.hide();

			open(ui, params, defer);

			ui.btnConfirm.focus();

			return defer.promise();
		},
		confirm: function (params){
			var defer = jQuery.Deferred(),
				ui = getUI();

			if(typeof params !== 'object'){
				params = {
					title: popBox.CONFIRM_TITLE,
					message: params
				};
			}

			params.title = params.title || popBox.CONFIRM_TITLE;
			ui.btnCancel.show();
			ui.txtInput.hide();

			open(ui, params, defer);

			ui.btnCancel.focus();

			return defer.promise();
		},
		prompt: function (params){
			var defer = jQuery.Deferred(),
				ui = getUI();

			if(typeof params !== 'object'){
				params = {
					title: popBox.PROMPT_TITLE,
					message: params
				};
			}

			params.title = params.title || popBox.PROMPT_TITLE;

			ui.txtInput.el[0].type = params.type || 'text';
			ui.txtInput.el[0].placeholder = params.placeholder || '';
			ui.txtInput.set(params.value || '');

			ui.btnCancel.show();
			ui.txtInput.show().set('');

			open(ui, params, defer);

			ui.txtInput.focus();

			return defer.promise();
		}
	};

	modoCore.alert = popBox.alert;
	modoCore.confirm = popBox.confirm;
	modoCore.prompt = popBox.prompt;
	modoCore.popBox = popBox;

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = popBox;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('test', [], function (){
				return popBox;
			});
		}
	}
})();
/**
 * modoJS File Uploader
 * ====================
 * This provides a file upload element where the user can pick one or multiple files from his harddrive
 * to get them uploaded to a server.
 * Please note that you need to use serverside scripts to utilize this element.
 */
(function () {
	'use strict';

	var modoCore;

	//commonJS and AMD modularization - try to reach the core.
	if (typeof modo !== 'undefined') {
		modoCore = modo;
	} else {
		if (typeof require === 'function') {
			modoCore = require('modo');
		}
	}

	function cn(index, prefixed) {
		if (prefixed !== undefined) {
			return modoCore.Uploader.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Uploader.classNames[index];
	}

	modoCore.defineElement('Uploader', ['uploader', 'uploader-button', 'uploader-status', 'uploader-uploading', 'uploader-selected'], function (params) {
		params = params || {};

		var that = this;

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		if (!window.FormData) {
			params.ajax = false;
		}

		this._settings = {
			target: params.target,
			mimeFilter: params.mimeFilter || '',
			autostart: params.autostart !== undefined ? params.autostart !== false : false,
			ajax: params.ajax !== undefined ? params.ajax !== false : false,
			multiple: params.multiple === true
		};

		this.enabled = true;

		var html = '<a href="#ulTarget-' + this.modoId + '" class="' + (modoCore.cssPrefix + modoCore.Button.classNames[0]) + ' ' + cn(1) + '">' + (params.label || 'Upload');

		html += '<form action="" ' + (params.multiple ? 'multiple ' : '') + 'target="ulTarget-' + this.modoId + '" enctype="multipart/form-data" method="post" class="ulForm"><input accept="' + this._settings.mimeFilter + '" class="ulProbe" type="file" name="file""></form>';

		html += '</a><span class="' + cn(2) + '"></span>';

		this.el.append(html);

		this._status = this.el.find('.' + cn(2));

		if (!this._settings.ajax) {
			this.el.append('<iframe name="ulTarget-' + this.modoId + '"></iframe>');
		}

		this.el.find('.ulProbe').on('change', function () {
			if (!$(this).val()) {
				$(this).removeClass(cn(4, true));
				return;
			}
			$(this).addClass(cn(4, true));

			if (that._settings.autostart) {
				startUpload();
			}

			that.trigger('change', that.el.find('.ulProbe')[0].files);
		});

		function startUpload() {
			if(!that.enabled){
				return;
			}

            var url = that._settings.target;

            if(typeof url === 'function'){
                url = url();
            }

			if (!that._settings.ajax) {
                that.el.find('form').attr('action', url);
				that.el.find('iframe').one('load', function () {
					var response = $(this.contentWindow.document.body).text();
					that.removeClass(cn(3, true)); //Uploading
					that.el.find('.' + cn(1)).removeClass(modoCore.cssPrefix + modoCore.Element.classNames[2]); //disabled
					that.trigger('upload:finish', response);
					that.clear({silent: true});
				});
				that.el.find('form').attr('action', that._settings.target).submit();
				that.addClass(cn(3, true)); //Uploading
				that.el.find('.' + cn(1)).addClass(modoCore.cssPrefix + modoCore.Element.classNames[2]); //disabled
				that.trigger('upload:start');
			} else {
				/**
				 * Uploading via AJAX
				 */
				var files = that.el.find('.ulProbe')[0].files;
				var formData = new FormData();
				for (var i = 0; i < files.length; i++) {
					formData.append('file[]', files[i], files[i].name);
				}
				var xhr = new XMLHttpRequest();
				xhr.upload.addEventListener('progress', function (e) {
					that.trigger('upload:progress', {
						total: e.total,
						loaded: e.loaded,
						percent: (e.loaded / e.total) * 100
					});
				}, false);
				xhr.addEventListener('load', function (e) {
					that.removeClass(cn(3, true)); //Uploading
					that.el.find('.' + cn(1)).removeClass(modoCore.cssPrefix + modoCore.Element.classNames[2]); //disabled
					that.clear({silent: true});
					that.trigger('upload:finish', e.target.responseText);

				}, false);
				xhr.addEventListener('error', function (e) {
					that.removeClass(cn(3, true)); //Uploading
					that.el.find('.' + cn(1)).removeClass(modoCore.cssPrefix + modoCore.Element.classNames[2]); //disabled
					that.clear({silent: true});
					that.trigger('upload:error', e.target.responseText);
				});
				xhr.open('POST', url, true);
				xhr.send(formData);
				that.addClass(cn(3, true)); //Uploading
				that.el.find('.' + cn(1)).addClass(modoCore.cssPrefix + modoCore.Element.classNames[2]); //disabled
				that.trigger('upload:start');
			}
		}

		/**
		 * Will start the upload process manually.
		 */
		this.upload = function () {
			if (!this.el.find('.ulProbe').val()) {
				return this;
			}

			startUpload();

			return this;
		};

		/**
		 * Will clear a previously made file selection of the user.
		 * @returns {*}
		 */
		this.clear = function(options){
			options = options || {};
			that.el.find('.ulProbe').val('');

			if(!options.silent){
				that.trigger('clear');
			}

			return this;
		};

		/**
		 * Returns a previously made file selection of the user.
		 * @returns {*}
		 */
		this.getFiles = function(){
			return that.el.find('.ulProbe').val();
		};
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * Will set the status label to any given HTML or text value.
			 * @param value
			 */
			setStatus: function (value) {
				this._status.html(value);
				return this;
			},

			/**
			 * Changes the target URL of the uploader.
			 * @param url
			 */
			setTarget: function (url) {
				this._settings.target = url;
				return this;
			},
			/**
			 * Enables the element for user interaction.
			 */
			enable: function () {
				this.removeClass(modo.Element.classNames[2]);
				this.enabled = true;
				this.el.find('.ulProbe').show();
				return this;
			},
			/**
			 * Disables the element for user interaction.
			 */
			disable: function () {
				this.addClass(modo.Element.classNames[2]);
				this.enabled = false;
				this.el.find('.ulProbe').hide();
				return this;
			}
		});

	if (typeof exports !== 'undefined') {
		//commonJS modularization
		exports = modoCore.Uploader;
	} else {
		if (typeof define === 'function') {
			//AMD modularization
			define('Uploader', [], function () {
				return modoCore.Uploader;
			});
		}
	}
})();