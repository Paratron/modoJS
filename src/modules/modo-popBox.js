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