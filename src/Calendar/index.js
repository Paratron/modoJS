import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

import {LOCALIZATION} from '../utils/dateFormatter';

const propTypes = {
	minDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
	maxDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
	monthLabelFormat: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	className: PropTypes.string,
};

const minimal = Button.TYPES.MINIMAL;

/**
 * "Removes" the time of a date object - setting it back to 00:00:00:000
 * @param {Date} inDate
 */
const onlyDate = (inDate) => {
	inDate.setHours(0);
	inDate.setMinutes(0);
	inDate.setSeconds(0);
	inDate.setMilliseconds(0);
};

const Calendar =
	({
		 value,
		 onChange,
		 className,
		 firstDaySunday = false,
	 }) => {
		const workDate = new Date();
		const firstDayOfWeek = firstDaySunday ? 0 : 1;
		let dateOutput = false;

		if (value) {
			if (value instanceof Date) {
				workDate.setTime(value.getTime());
				dateOutput = true;
			} else {
				workDate.setTime(parseInt(value, 10) * 1000);
			}
		}
		onlyDate(workDate);

		const weekdays = LOCALIZATION.DAY_NAMES_SHORT.slice();

		if (firstDaySunday) {
			weekdays.unshift(weekdays.pop());
		}

		const rows = [];

		const refDate = new Date();
		onlyDate(refDate);
		const today = refDate.getTime();
		refDate.setTime(workDate.getTime());
		workDate.setDate(1);

		const handleDayClick = (e) => {
			if(!onChange){
				return;
			}

			const time = parseInt(e.target.getAttribute('data-date'), 10);
			if(!dateOutput){
				onChange(Math.floor(time / 1000));
				return;
			}
			onChange(new Date(time));
		};

		while (workDate.getDay() !== firstDayOfWeek) {
			workDate.setDate(workDate.getDate() - 1);
		}

		for(let week = 0; week < 6; week++){
			const row = [];

			for(let day = 0; day < 7; day++){
				const dayClasses = ['mdo-day'];
				let isEnabled = true;

				if(workDate.getMonth() !== refDate.getMonth()){
					dayClasses.push('mdo-otherMonth');
					isEnabled = false;
				}

				if(workDate.getTime() === today){
					dayClasses.push('mdo-today');
				}

				row.push(<Button
					type={minimal}
					enabled={isEnabled}
					data-date={workDate.getTime()}
					onClick={handleDayClick}
					className={dayClasses.join(' ')}>{workDate.getDate()}</Button>);

				workDate.setDate(workDate.getDate()+1);
			}

			rows.push(<div className="mdo-calendar-row">{row}</div>);
		}

		return (
			<div className="mdo-calendar">
				<div className="mdo-header">
					{weekdays.map(day => <div className={`mdo-day mdo-${day}`}>{day}</div>)}
				</div>
				<div className="mdo-days">
					{rows}
				</div>
			</div>
		);
	};

Calendar.propTypes = propTypes;

export default Calendar;
