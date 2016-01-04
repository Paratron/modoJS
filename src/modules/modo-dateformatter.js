/**
 * modo-dateformatter
 * ==================
 * The dateformatter object is no creatable object, but attaches itself to the modo object.
 * It provides methods to convert date objects (and timestamps) into human readable strings.
 */
(function (){
	'use strict';

	var modoCore,
		inUse;

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	function used(){
		if(inUse){
			return;
		}

		inUse = true;
		modoCore._stat('dateFormatter');
	}

	var self;

	modoCore.dateFormatter = self = {
		MONTH_NAMES: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		MONTH_NAMES_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		DAY_NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		DAY_NAMES_SHORT: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		SUFFIX: ['st', 'nd', 'rd', 'th'],
		TODAY: 'today',
		YESTERDAY: 'yesterday',
		LAST: 'last %v',
		FUZZY_SECONDS: 'about a minute ago',
		NEVER: 'never',

		REL_UNITS: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'],
		REL_PAST: '%v %u ago',
		REL_FUTURE: 'in %v %u',
		REL_CURRENT: 'right now',
		DEFAULT_FORMAT: 'F jS, Y',

		LOCAL_TIMEZONE:  -((new Date()).getTimezoneOffset() / 60),
		REMOTE_TIMEZONE: -((new Date()).getTimezoneOffset() / 60),
		normalizeTimezones: true,

		/**
		 * Takes a date or timestamp and converts it to another timezone.
		 * @param inDate Javascript Date Object, or UNIX timestamp to convert from.
		 * @param toOffset New timezone offset from GMT/UTC in hours to convert to.
		 * @param [fromOffset] Optional. The method will take the current browsers offset by default.
		 * @return Date
		 */
		convertTimezone: function (inDate, toOffset, fromOffset){
			var workDate;
			used();

			if(toOffset === fromOffset){
				if(inDate instanceof Date){
					return inDate;
				}

				return new Date(inDate * 1000);
			}

			if(inDate instanceof Date){
				workDate = Math.floor(inDate.getTime());
				if(fromOffset === undefined){
					fromOffset = -(inDate.getTimezoneOffset() / 60);
				}
			} else {
				workDate = inDate * 1000;
			}

			//Normalize input date to UTC
			workDate = workDate - (fromOffset * 3600000);

			workDate += toOffset * 3600000;

			return new Date(workDate);
		},

		/**
		 * Takes a date object or timestamp and will return a "fancy" string representation
		 * which is most pleasant for users to read.
		 *
		 * Example output:
		 *    10 minutes ago
		 *    Today, 11:15
		 *    Yesterday, 22:00
		 *    Last tuesday
		 *
		 *
		 * @param inDate
		 */
		dateToFancyString: function (inDate, dateFormat, options){
			used();

			options = options || {};

			options.normalizeTimezones = options.normalizeTimezones || self.normalizeTimezones;
			options.localTimezone = options.localTimezone === 0 ? options.localTimezone : options.localTimezone || self.LOCAL_TIMEZONE;
			options.remoteTimezone = options.remoteTimezone === null ? undefined : options.remoteTimezone === 0 ? options.remoteTimezone : options.remoteTimezone || self.REMOTE_TIMEZONE;

			if(inDate === 0){
				return this.NEVER;
			}

			if(options.normalizeTimezones){
				inDate = self.convertTimezone(inDate, options.localTimezone, options.remoteTimezone);
			}

			if(!(inDate instanceof Date)){
				inDate = new Date(inDate * 1000);
			}

			if(!dateFormat){
				//October 2nd, 2015
				dateFormat = modoCore.dateFormatter.DEFAULT_FORMAT;
			}

			var diff,
				today;

			today = new Date();
			diff = Math.abs(inDate - today) / 1000;

			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);

			if(diff > 604800){
				return this.dateToString(dateFormat, inDate);
			}

			if(diff < 120){
				return this.FUZZY_SECONDS;
			}

			if(diff < 3600){
				return this.dateToRelativeString(inDate);
			}

			if(inDate > today){
				return this.TODAY + ', ' + this.dateToString('H:i', inDate);
			}

			today.setTime(today.getTime() - 86400000);

			if(inDate > today){
				return this.YESTERDAY + ', ' + this.dateToString('H:i', inDate);
			}

			return this.LAST.replace(/%v/, this.dateToString('l', inDate));
		},

		/**
		 * This creates a "relative" string, as used often in applications and social networks.
		 * Instead of printing out the precise datetime, it comparing the two dates and
		 * produces outputs like "x minutes ago".
		 * Also works into the future.
		 * @TODO: make it more precise
		 * @param datePast
		 * @param dateNow
		 */
		dateToRelativeString: function (datePast, dateNow, options){
			used();

			var toFuture,
				diff,
				unit,
				value;

			options = options || {};

			options.normalizeTimezones = options.normalizeTimezones || self.normalizeTimezones;
			options.localTimezone = options.localTimezone === 0 ? options.localTimezone : options.localTimezone || self.LOCAL_TIMEZONE;
			options.remoteTimezone = options.remoteTimezone === null ? undefined : options.remoteTimezone === 0 ? options.remoteTimezone : options.remoteTimezone || self.REMOTE_TIMEZONE;

			if(!datePast){
				throw new Error('No date given');
			}

			if(options.normalizeTimezones){
				datePast = self.convertTimezone(datePast, options.localTimezone, options.remoteTimezone);
			}

			if(!(datePast instanceof Date)){
				datePast = new Date(datePast * 1000);
			}

			if(!dateNow){
				dateNow = new Date();
			} else {
				if(!(dateNow instanceof Date)){
					dateNow = new Date(dateNow * 1000);
				}
			}

			if(options.normalizeTimezones){
				dateNow = self.convertTimezone(dateNow, options.localTimezone, options.remoteTimezone);
			}

			diff = (dateNow - datePast) / 1000;

			if(diff < 0){
				toFuture = true;
				diff = Math.abs(diff);
			}

			if(diff <= 10){
				return this.REL_CURRENT;
			}

			//Years
			if(diff > 29030400){
				unit = 6;
				value = Math.round(diff / 29030400);
			}

			//Months
			if(diff < 29030400){
				unit = 5;
				value = Math.round(diff / 2419200);
			}

			//Weeks
			if(diff < 2419200){
				unit = 4;
				value = Math.round(diff / 604800);
			}

			//Days
			if(diff < 604800){
				unit = 3;
				value = Math.round(diff / 86400);
			}

			//Hours
			if(diff < 86400){
				unit = 2;
				value = Math.round(diff / 3600);
			}

			//Minutes
			if(diff < 3600){
				unit = 1;
				value = Math.round(diff / 60);
			}

			//Seconds
			if(diff < 60){
				unit = 0;
				value = Math.round(diff);
			}

			if(toFuture){
				return this.REL_FUTURE.replace(/%v/, value).replace(/%u/, this.REL_UNITS[unit]);
			}
			return this.REL_PAST.replace(/%v/, value).replace(/%u/, this.REL_UNITS[unit]);
		},

		/**
		 * This outputs a string with a formatted date and follows the PHP date() specification.
		 * See: http://de2.php.net/manual/en/function.date.php
		 * @param {String} format
		 * @param {Date} inDate (optional)
		 * @returns {String}
		 */
		dateToString: function (format, inDate, options){
			used();

			if(!(inDate instanceof Date)){
				inDate = new Date(inDate * 1000);
			}

			options = options || {};

			options.normalizeTimezones = options.normalizeTimezones || self.normalizeTimezones;
			options.localTimezone = options.localTimezone === 0 ? options.localTimezone : options.localTimezone || self.LOCAL_TIMEZONE;
			options.remoteTimezone = options.remoteTimezone === null ? undefined : options.remoteTimezone === 0 ? options.remoteTimezone : options.remoteTimezone || self.REMOTE_TIMEZONE;

			if(options.normalizeTimezones){
				inDate = self.convertTimezone(inDate, options.localTimezone, options.remoteTimezone);
			}

			var output = '';

			var replacements = {
				'd': (inDate.getDate() < 10) ? '0' + inDate.getDate() : inDate.getDate(),
				'D': this.DAY_NAMES_SHORT[(inDate.getDay() === 0) ? 6 : inDate.getDay() - 1],
				'j': inDate.getDate(),
				'l': this.DAY_NAMES[(inDate.getDay() === 0) ? 6 : inDate.getDay() - 1],
				'N': (inDate.getDay() === 0) ? 7 : inDate.getDay(),
				'S': (inDate.getDate() < 4) ? this.SUFFIX[inDate.getDate() - 1] : this.SUFFIX[3],
				'w': inDate.getDate(),
				'z': (function (inDate){
					var day = 0;
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth(0);
					dte.setYear(inDate.getFullYear());
					while (day < 365) {
						if(dte.getTime() > inDate.getTime()){
							return day;
						}
						dte.setTime(dte.getTime() + 86400000);
						day++;
					}
					return day;
				})(inDate),
				'W': (function (inDate){
					var week = 0;
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth(0);
					dte.setYear(inDate.getFullYear());
					while (week < 52) {
						if(dte.getTime() > inDate.getTime()){
							return week;
						}
						dte.setTime(dte.getTime() + (86400000 * 7));
						week++;
					}
					return week;
				})(inDate),
				'F': this.MONTH_NAMES[inDate.getMonth()],
				'm': (inDate.getMonth() < 9) ? '0' + (inDate.getMonth() + 1) : inDate.getMonth() + 1,
				'M': this.MONTH_NAMES_SHORT[inDate.getMonth()],
				'n': inDate.getMonth() + 1,
				't': (function (inDate){
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth((inDate.getMonth() < 11) ? inDate.getMonth() + 1 : 0);
					dte.setYear((inDate.getMonth() < 11) ? inDate.getFullYear() : inDate.getFullYear() + 1);
					dte.setHours(0);
					dte.setMinutes(0);
					dte.setSeconds(0);
					dte.setMilliseconds(0);
					dte.setTime(dte.getTime() - 1);
					return dte.getDate();
				})(inDate),
				'L': (function (inDate){
					var dte = new Date();
					dte.setDate(1);
					dte.setMonth(2);
					dte.setYear(inDate.getFullYear());
					dte.setHours(0);
					dte.setMinutes(0);
					dte.setSeconds(0);
					dte.setMilliseconds(0);
					dte.setTime(dte.getTime() - 1);
					return (dte.getDate() === 29) ? 1 : 0;
				})(inDate),
				'Y': inDate.getFullYear(),
				'y': String(inDate.getFullYear()).substr(2, 2),
				'H': (inDate.getHours() < 10) ? '0' + inDate.getHours() : inDate.getHours(),
				'i': (inDate.getMinutes() < 10) ? '0' + inDate.getMinutes() : inDate.getMinutes(),
				's': (inDate.getSeconds() < 10) ? '0' + inDate.getSeconds() : inDate.getSeconds(),
				'u': inDate.getMilliseconds()
			};

			var character;

			for (var i = 0; i < format.length; i++) {
				character = format[i];
				if(character === '\\'){
					i += 1;
					continue;
				}
				if(typeof replacements[character] === 'undefined'){
					output += character;
				} else {
					output += replacements[character];
				}
			}

			return output;
		}
	};

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.dateFormatter;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo.dateFormatter', function (){
				return modoCore.dateFormatter;
			});
		}
	}
})();