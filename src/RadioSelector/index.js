import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from '../RadioButton';

const propTypes = {
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	className: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	enabled: PropTypes.bool,
};

const defaultProps = {
	className: '',
	value: null,
	enabled: true,
	onChange: () => {
	},
};

export default class RadioSelector extends React.Component {
	constructor(props) {
		super(props);
		this.clickHandlers = {};

		this.handleChange = (index) => {
			const {
				items,
				onChange,
			} = this.props;

			const nextValue = items instanceof Array ? index : Object.keys(items)[index];

			onChange(nextValue);
		};

		this.handleClick = (index) => {
			const key = `${index}`;

			if (this.clickHandlers[key]) {
				return this.clickHandlers[key];
			}

			const clickHandler = () => this.handleChange(index);

			this.clickHandlers[key] = clickHandler;

			return clickHandler;
		};
	}

	render() {
		const classNames = ['mdo-radioselector'];

		const {
			items,
			className,
			value,
		} = this.props;

		const isArr = items instanceof Array;
		const itemLabels = isArr ? items : Object.values(items);
		const itemKeys = isArr ? items.map((v, i) => i) : Object.keys(items);
		const activeIndex = isArr ? value : itemKeys.indexOf(value);

		if (className) {
			classNames.push(className);
		}

		return (
			<div className={classNames.join(' ')}>
				{itemLabels.map((label, index) => <RadioButton
					key={index}
					label={label}
					checked={index === activeIndex}
					onClick={this.handleClick(index)}
				/>)}
			</div>
		);
	}
}

RadioSelector.propTypes = propTypes;
RadioSelector.defaultProps = defaultProps;
