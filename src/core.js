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