import React from 'react';
import PropTypes from 'prop-types';

const ZOOM = {
	DAY: 0,
	MONTH: 1,
	YEAR: 2
};

const propTypes = {
	minDate: PropTypes.number,
	maxDate: PropTypes.number,
	value: PropTypes.number,
	onChange: PropTypes.func,
	className: PropTypes.string,
	minZoom: PropTypes.number,
	maxZoom: PropTypes.number,
	defaultZoom: PropTypes.number,
	zoom: PropTypes.number,
};

const defaultProps = {
	minDate: null,
	maxDate: null,
	value: Date.now(),
	onChange: undefined,
	className: '',
	minZoom: ZOOM.DAY,
	maxZoom: ZOOM.YEAR,
	defaultZoom: ZOOM.DAY,
	zoom: undefined,
};

const l11n = {
	PREVIOUS: '<',
	NEXT: '>',
	MONTH_NAMES: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	MONTH_NAMES_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	DAY_NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
	DAY_NAMES_SHORT: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	SUFFIX: ['st', 'nd', 'rd', 'th'],

};

export default class Calendar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			zoom: props.defaultZoom, //0 = Month, 1 = Year, 2 = 20 Years
			selectedYear: 0,
			selectedMonth: 0,
			selectedDay: 0,
		};
	}

	render() {
		const classNames = ['mdo-calendar'];

		return (
			<div className={classNames.join(' ')}>
				<div className="mdo-yearsPanel"></div>
				<div className="mdo-monthsPanel"></div>
				<div className="mdo-daysPanel"></div>
			</div>
		);
	}
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
Calendar.l11n = l11n;