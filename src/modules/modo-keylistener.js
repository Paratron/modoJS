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
