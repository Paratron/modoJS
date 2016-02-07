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

	mceURL = '//cdn.tinymce.com/4/tinymce.min.js';

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	modoCore.setLoadCallback('TinyMCE', function (){
		window.tinymce.baseURL = '//cdn.tinymce.com/4';
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