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