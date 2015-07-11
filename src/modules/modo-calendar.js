/**
 * Modo Calendar
 * ============
 * A simple calendar widget with the following features:
 * - Month selection
 * - Day selection
 * @param params
 * @constructor
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

	modoCore.defineElement('Calendar', [
		'calendar',             //0
		'calendar-selector',
		'calendar-field',
		'calendar-prev',
		'calendar-next',
		'calendar-label',       //5
		'calendar-field-row',
		'calendar-field-day-names',
		'calendar-day',
		'calendar-day-disabled',
		'calendar-day-today',   //10
		'calendar-day-selected'
	], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		var cn = [];
		for (var i = 0; i < modoCore.Calendar.classNames.length; i++) {
			cn.push(modoCore.cssPrefix + modoCore.Calendar.classNames[i]);
		}

		var settings = {
			minDate: (params.minDate instanceof Date) ? params.minDate : null,
			maxDate: (params.maxDate instanceof Date) ? params.maxDate : null,
			monthLabelFormat: params.monthLabelFormat || 'F Y',
			date: (typeof params.date !== 'undefined') ? new Date(params.date) : null,
			selectable:       params.selectable || true,
			seekDate: null
		};
		settings.seekDate = settings.date;
		if(!(settings.seekDate instanceof Date)){
			settings.seekDate = new Date();
		}
		settings.seekDate.setDate(1);
		settings.seekDate.setHours(0);
		settings.seekDate.setMinutes(0);
		settings.seekDate.setSeconds(0);
		settings.seekDate.setMilliseconds(0);

		this.addClass(modoCore.Calendar.classNames[0]);

		this.el.html('<div class="' + cn[1] + '"></div>');

		var $calendarField = $('<div class="' + cn[2] + '"></div>');
		this.el.append($calendarField);

		//Previous/Next buttons.
		var btnPrev = new modoCore.Button({
			label: modoCore.Calendar.PREVIOUS,
			className: cn[3]
		});
		var btnNext = new modoCore.Button({
			label: modoCore.Calendar.NEXT,
			className: cn[4]
		});

		if(settings.minDate !== null && settings.date !== null && settings.date.getTime() < settings.minDate.getTime()){
			if(params.date){
				throw new Error('Given default date previous to given minimal date.');
			} else {
				settings.date = settings.seekDate = settings.minDate;
				settings.seekDate.setDate(1);
			}
		}

		if(settings.maxDate !== null && settings.date !== null && settings.date.getTime() > settings.maxDate.getTime()){
			if(params.date){
				throw new Error('Given default date after given maximal date.');
			} else {
				settings.date = settings.seekDate = settings.maxDate;
				settings.seekDate.setDate(1);
			}
		}

		btnPrev.on('click', function (e){
			e.preventDefault();
			e.stopPropagation();
			settings.seekDate.setMonth(settings.seekDate.getMonth() - 1);
			render();
			_this.trigger('seek');
		});

		btnNext.on('click', function (e){
			e.preventDefault();
			e.stopPropagation();
			settings.seekDate.setMonth(settings.seekDate.getMonth() + 1);
			render();
			_this.trigger('seek');
		});

		var $monthLabel = $('<div class="' + cn[5] + '"></div>');

		$('.' + cn[1], this.el).append(btnPrev.el, $monthLabel, btnNext.el);

		var _this = this;

		function render(){
			var html,
				dayCount = 0;

			$monthLabel.text(_this.dateToString(settings.monthLabelFormat, settings.seekDate));
			if(settings.minDate !== null && settings.seekDate.getMonth() === settings.minDate.getMonth() && settings.seekDate.getYear() === settings.minDate.getYear()){
				btnPrev.disable();
			} else {
				btnPrev.enable();
			}

			if(settings.maxDate !== null && settings.seekDate.getMonth() === settings.maxDate.getMonth() && settings.seekDate.getYear() === settings.maxDate.getYear()){
				btnNext.disable();
			} else {
				btnNext.enable();
			}

			var seek = new Date(settings.seekDate);
			var currentSeekMonth = seek.getMonth();

			var sub;
			if(seek.getDay() === 0){
				sub = 518400000;
			} else {
				sub = (seek.getDay() - 1) * 86400000;
			}
			seek.setTime(seek.getTime() - sub);


			html = '<div class="' + cn[6] + ' ' + cn[7] + '"><div class="' + cn[8] + '">';
			html += modoCore.Calendar.DAY_NAMES_SHORT.join('</div><div class="' + cn[8] + '">') + '</div></div>';

			var rowOpen = false,
				dayClasses,
				today = new Date(),
				cssKeys,
				cssKey;
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);

			while (dayCount < 42) {
				if(!rowOpen){
					html += '<div class="' + cn[6] + '">';
					rowOpen = true;
				}
				dayClasses = {};
				if(seek.getMonth() !== currentSeekMonth){
					dayClasses[cn[9]] = true;
				}
				if(seek.getTime() === today.getTime()){
					dayClasses[cn[10]] = true;
				}

				//Days before minDate and after_max date are blocked.
				if(settings.minDate !== null && settings.minDate.getTime() > seek.getTime()){
					dayClasses[cn[9]] = true;
				}
				if(settings.maxDate !== null && settings.maxDate.getTime() < seek.getTime()){
					dayClasses[cn[9]] = true;
				}

				if(settings.date !== null && seek.getDate() === settings.date.getDate() && seek.getMonth() === settings.date.getMonth() && seek.getFullYear() === settings.date.getFullYear()){
					dayClasses[cn[11]] = true;
				}

				cssKeys = [];

				for (cssKey in dayClasses) {
					if(dayClasses[cssKey]){
						cssKeys.push(cssKey);
					}
				}

				dayClasses = cssKeys.join(' ');

				html += '<div class="' + cn[8] + ' ' + dayClasses + '">' + seek.getDate() + '</div>';
				seek.setTime(seek.getTime() + 86400000);
				dayCount++;
				if((dayCount % 7) === 0){
					html += '</div>';
					rowOpen = false;
				}
			}
			html += '</div>';

			seek.setMonth(currentSeekMonth);
			seek.setDate(1);
			seek.setHours(0);
			seek.setMinutes(0);
			seek.setSeconds(0);
			seek.setMilliseconds(0);


			$calendarField.html(html);
		}

		if(settings.selectable){
			$calendarField.on('click', '.' + cn[8], function (e){
				e.preventDefault();
				e.stopPropagation();

				var $this = $(this);
				if($this.hasClass(cn[9])){
					return;
				}
				$('.' + cn[8], _this.el).removeClass(cn[11]);
				$this.addClass(cn[11]);
				var selectedDate = new Date(settings.seekDate);
				selectedDate.setDate(parseInt($this.text(), 10));
				settings.date = selectedDate;
				_this.trigger('change', selectedDate);
			});
		}

		render();

		/**
		 * Returns the Date object, currently used by the calendar.
		 */
		this.get = function (){
			return settings.date;
		};

		this.set = function (inDate){
			settings.date = new Date(inDate);
			render();
			this.trigger('seek');
			this.trigger('change', settings.date);

			return this;
		};

		modoCore._stat('Calendar');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/**
			 * This outputs a string with a formatted date and follows roughly the PHP date() specification.
			 * See: http://de2.php.net/manual/en/function.date.php
			 * @param {String} format
			 * @param {Date} inDate (optional)
			 * @returns {String}
			 */
			dateToString: function (format, inDate){
				if(typeof inDate === 'undefined'){
					if(!this){ //Direct prototype call?
						return null;
					}
					inDate = this.get();
				}

				return modoCore.dateFormatter.dateToString(format, inDate);
			}
		});

	modoCore.Calendar.PREVIOUS = '◀';
	modoCore.Calendar.NEXT = '▶';
})();
