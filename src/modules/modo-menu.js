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
