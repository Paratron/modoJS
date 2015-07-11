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