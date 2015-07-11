/**
 * modoJS File Uploader
 * ====================
 * This provides a file upload element where the user can pick one or multiple files from his harddrive
 * to get them uploaded to a server.
 * Please note that you need to use serverside scripts to utilize this element.
 */
(function (){
	'use strict';

	var modoCore;

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
			return modoCore.Uploader.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Uploader.classNames[index];
	}

	modoCore.defineElement('Uploader', ['uploader', 'uploader-button', 'uploader-status', 'uploader-uploading', 'uploader-selected'], function (params){
		params = params || {};

		var that = this;

		modoCore.Element.call(this, params);

		this.addClass(cn(0, true));

		this._settings = {
			target: params.target,
			mimeFilter: params.mimeFilter || '',
			autostart:  params.autostart !== undefined ? params.autostart !== false : false,
			ajax:       params.ajax !== undefined ? params.ajax !== false : false,
			multiple:   params.multiple === true
		};

		var html = '<a href="#" class="' + (modoCore.cssPrefix + modoCore.Button.classNames[0]) + ' ' + cn(1) + '">' + (params.label || 'Upload');

		html += '<form action="' + this._settings.target + '" target="ulTarget-' + this.modoId + '" enctype="multipart/form-data" method="post" class="ulForm"><input accept="' + this._settings.mimeFilter + '" class="ulProbe" type="file' + (params.multiple ? '[]' : '') + '" name="file"></form>';

		html += '</a><span class="' + cn(2) + '"></span>';

		this.el.append(html);

		this._status = this.el.find('.' + cn(2));

		if(!this._settings.ajax){
			this.el.append('<iframe name="ulTarget-' + this.modoId + '"></iframe>');
		}

		this.el.find('.ulProbe').on('change', function (){
			if(!$(this).val()){
				return;
			}

			if(that._settings.autostart){
				startUpload();
			}
		});

		function startUpload(){
			if(!that._settings.ajax){
				that.el.find('iframe').one('load', function (){
					var response = $(this.contentWindow.document.body).text();
					that.removeClass(cn(3, true)); //Uploading
					that.el.find('.' + cn(1)).removeClass(modoCore.cssPrefix + modoCore.Element.classNames[2]); //disabled
					that.trigger('upload:finish', response);
					that.el.find('.ulProbe').val('');
				});
				that.el.find('form').submit();
				that.addClass(cn(3, true)); //Uploading
				that.el.find('.' + cn(1)).addClass(modoCore.cssPrefix + modoCore.Element.classNames[2]); //disabled
				that.trigger('upload:start');
			}
		}

		/**
		 * Will start the upload process manually.
		 */
		this.upload = function (){
			if(!this.el.find('.ulProbe').val()){
				return;
			}

			startUpload();
		};
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * Will set the status label to any given HTML or text value.
			 * @param value
			 */
			setStatus: function (value){
				this._status.html(value);
			},

			/**
			 * Changes the target URL of the uploader.
			 * @param url
			 */
			setTarget: function (url){
				this.el.find('iframe').attr('target', url);
				this._settings.target = url;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Uploader;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('Uploader', [], function (){
				return modoCore.Uploader;
			});
		}
	}
})();