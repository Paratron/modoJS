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