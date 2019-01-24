import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Card from '../Card';
import TextInput from '../TextInput';

import {dateToString} from '../utils/dateFormatter';

import MonthSelector from '../MonthSelector';
import Calendar from '../Calendar';

const propTypes = {};


const travelUp = (node, className) => {
	if (node.classList && node.classList.contains(className)) {
		return true;
	}
	if (node.parentNode) {
		return travelUp(node.parentNode, className);
	}
	return false;
};

const Index = ({value, onChange}) => {
	const targetDate = new Date();
	let dateOutput = true;

	if (value) {
		if (value instanceof Date) {
			targetDate.setTime(value.getTime());
		} else {
			if (parseInt(value, 10)) {
				dateOutput = false;
				targetDate.setTime(parseInt(value, 10) * 1000)
			}
		}
	}

	const [dateBuffer, setDateBuffer] = React.useState(targetDate.getTime());
	const [showPicker, setShowPicker] = React.useState(false);

	targetDate.setTime(dateBuffer);

	const parseYear = (inStr) => {
		targetDate.setFullYear(parseInt(inStr, 10));
		setDateBuffer(targetDate.getTime());
	};

	const handleChange = (inDate) => {
		if (!onChange) {
			return;
		}
		setDateBuffer(inDate.getTime());
		setShowPicker(false);
		if (dateOutput) {
			onChange(inDate);
			return;
		}
		onChange(Math.floor(inDate.getTime() / 1000));
	};

	const classNames = ['mdo-datePicker'];

	if (showPicker) {
		classNames.push('mdo-open');
	}

	React.useEffect(() => {
		const handler = (e) => {
			if (travelUp(e.target, 'mdo-datePicker')) {
				return;
			}
			setShowPicker(false);
		};

		document.body.addEventListener('click', handler);

		return () => {
			document.body.removeEventListener('click', handler);
		};
	});

	return (
		<div className={classNames.join(' ')}>
			<Button type={Button.TYPES.MINIMAL}
					onClick={() => setShowPicker(true)}>{dateToString('d.m.Y', targetDate)}</Button>
			<Card>
				<TextInput type="number" value={targetDate.getTime() ? dateToString('Y', targetDate) : '-'}
						   onChange={parseYear}/>
				<MonthSelector value={targetDate} onChange={(d) => setDateBuffer(d.getTime())}/>
				<Calendar value={targetDate} onChange={handleChange}/>
			</Card>
		</div>
	);
};

Index.propTypes = propTypes;

export default Index;
