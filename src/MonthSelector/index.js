import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

import {dateToString} from '../utils/dateFormatter';

const propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
	onChange: PropTypes.func,
	minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
	maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
	className: PropTypes.string,
	enabled: PropTypes.bool,
	monthLabelFormat: PropTypes.string,
};

const minimal = Button.TYPES.MINIMAL;

const MonthSelector = ({value, onChange, className, enabled = true, minDate, maxDate, monthLabelFormat = 'F'}) => {
	const targetDate = new Date();
	let dateOutput = true;

	if (value) {
		if (value instanceof Date) {
			targetDate.setTime(value.getTime());
		} else {
			dateOutput = false;
			targetDate.setTime(parseInt(value, 10) * 1000);
		}
	}

	const decreaseMonth = () => {
		if(!onChange){
			return;
		}

		if(minDate){

		}

		targetDate.setMonth(targetDate.getMonth() - 1);
		if(dateOutput){
			onChange(targetDate);
			return;
		}
		onChange(Math.floor(targetDate.getTime() / 1000));
	};

	const increaseMonth = () => {
		if(!onChange){
			return;
		}
		targetDate.setMonth(targetDate.getMonth() + 1);
		if(dateOutput){
			onChange(targetDate);
			return;
		}
		onChange(Math.floor(targetDate.getTime() / 1000));
	};

	return (
		<div className="mdo-monthselector">
			<Button type={minimal} onClick={decreaseMonth}>⯇</Button>
			<Button type={minimal}>{dateToString(monthLabelFormat, targetDate)}</Button>
			<Button type={minimal} onClick={increaseMonth}>⯈</Button>
		</div>
	);
};

MonthSelector.propTypes = propTypes;

export default MonthSelector;
