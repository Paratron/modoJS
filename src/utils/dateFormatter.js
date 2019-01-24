export let LOCALIZATION = {
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
	SUNDAY_FIRST_DAY_OF_THE_WEEK: true,

	REL_UNITS: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'],
	REL_PAST: '%v %u ago',
	REL_FUTURE: 'in %v %u',
	REL_CURRENT: 'right now',
	DEFAULT_FORMAT: 'F jS, Y',
};

export function setLocalization(newLocalization){
	LOCALIZATION = newLocalization;
};

const replacements = {
	'd': (inDate) => inDate.getDate() < 10 ? '0' + inDate.getDate() : inDate.getDate(),
	'D': (inDate) => LOCALIZATION.DAY_NAMES_SHORT[(inDate.getDay() === 0) ? 6 : inDate.getDay() - 1],
	'j': (inDate) => inDate.getDate(),
	'l': (inDate) => LOCALIZATION.DAY_NAMES[(inDate.getDay() === 0) ? 6 : inDate.getDay() - 1],
	'N': (inDate) => inDate.getDay() === 0 ? 7 : inDate.getDay(),
	'S': (inDate) => inDate.getDate() < 4 ? LOCALIZATION.SUFFIX[inDate.getDate() - 1] : LOCALIZATION.SUFFIX[3],
	'w': (inDate) => inDate.getDate(),
	'z': (inDate) => {
		let day = 0;
		let dte = new Date();
		dte.setDate(1);
		dte.setMonth(0);
		dte.setFullYear(inDate.getFullYear());
		while (day < 365) {
			if (dte.getTime() > inDate.getTime()) {
				return day;
			}
			dte.setTime(dte.getTime() + 86400000);
			day++;
		}
		return day;
	},
	'W': (inDate) => {
		let week = 0;
		let dte = new Date();
		dte.setDate(1);
		dte.setMonth(0);
		dte.setFullYear(inDate.getFullYear());
		while (week < 52) {
			if (dte.getTime() > inDate.getTime()) {
				return week;
			}
			dte.setTime(dte.getTime() + (86400000 * 7));
			week++;
		}
		return week;
	},
	'F': (inDate) => LOCALIZATION.MONTH_NAMES[inDate.getMonth()],
	'm': (inDate) => inDate.getMonth() < 9 ? '0' + (inDate.getMonth() + 1) : inDate.getMonth() + 1,
	'M': (inDate) => LOCALIZATION.MONTH_NAMES_SHORT[inDate.getMonth()],
	'n': (inDate) => inDate.getMonth() + 1,
	't': (inDate) => {
		const dte = new Date();
		dte.setDate(1);
		dte.setMonth((inDate.getMonth() < 11) ? inDate.getMonth() + 1 : 0);
		dte.setFullYear((inDate.getMonth() < 11) ? inDate.getFullYear() : inDate.getFullYear() + 1);
		dte.setHours(0);
		dte.setMinutes(0);
		dte.setSeconds(0);
		dte.setMilliseconds(0);
		dte.setTime(dte.getTime() - 1);
		return dte.getDate();
	},
	'L': (inDate) => {
		const dte = new Date();
		dte.setDate(1);
		dte.setMonth(2);
		dte.setFullYear(inDate.getFullYear());
		dte.setHours(0);
		dte.setMinutes(0);
		dte.setSeconds(0);
		dte.setMilliseconds(0);
		dte.setTime(dte.getTime() - 1);
		return (dte.getDate() === 29) ? 1 : 0;
	},
	'Y': (inDate) => inDate.getFullYear(),
	'y': (inDate) => String(inDate.getFullYear()).substr(2, 2),
	'H': (inDate) => inDate.getHours() < 10 ? '0' + inDate.getHours() : inDate.getHours(),
	'i': (inDate) => inDate.getMinutes() < 10 ? '0' + inDate.getMinutes() : inDate.getMinutes(),
	's': (inDate) => inDate.getSeconds() < 10 ? '0' + inDate.getSeconds() : inDate.getSeconds(),
	'u': (inDate) => inDate.getMilliseconds()
};

/**
 * This outputs a string with a formatted date and follows the PHP date() specification.
 * See: http://de2.php.net/manual/en/function.date.php
 * @param {String} format
 * @param {Date|Number} [inDate=now] Date Object, or UNIX timestamp.
 * @returns {String}
 */
export function dateToString(format, inDate) {
	if (!(inDate instanceof Date)) {
		inDate = new Date(inDate * 1000);
	}

	let skip = false;

	return format
		.split('')
		.map(c => {
			if (skip) {
				skip = false;
				return c;
			}
			if (c === '\\') {
				skip = true;
				return '';
			}

			return replacements[c] ? replacements[c](inDate) : c;
		})
		.join('');
}
