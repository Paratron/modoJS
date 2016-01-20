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