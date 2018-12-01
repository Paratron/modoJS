import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import List from '../List';
import Card from '../Card';

const propTypes = {
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	renderButtonLabel: PropTypes.func,
	onChange: PropTypes.func,
	className: PropTypes.string,
	enabled: PropTypes.bool
};

const defaultProps = {
	renderButtonLabel: (value, items) => items[value],
	onChange: () => {
	},
	enabled: true
};

export const handleListClick = (onChange, setDropDownOpen) => (index) => {
	if (onChange) {
		onChange(index);
	}
	setDropDownOpen(false);
};

export const handleButtonClick = (dropdownOpen, setDropdownOpen) => () => {
	setDropdownOpen(!dropdownOpen);
};

let previousOnChange;

const DropDown = (props) => {
	const [dropDownOpen, setDropDownOpen] = React.useState(false);

	const {
		items,
		value,
		onChange,
		className,
		renderButtonLabel,
		enabled
	} = props;

	const mHandleListClick = React.useCallback((item) => {
		if(onChange){
			onChange(item)
		}
		setDropDownOpen(false);
	}, [onChange]);

	const classNames = ['mdo-dropdown'];

	if (dropDownOpen) {
		classNames.push('mdo-open');
	}

	if (!enabled) {
		classNames.push('mdo-disabled');
	}

	if (className) {
		classNames.push(className);
	}

	return (
		<div className={classNames.join(' ')}>
			<Button
				enabled={enabled}
				onClick={handleButtonClick(dropDownOpen, setDropDownOpen)}
			>
				{renderButtonLabel(value, items)}
			</Button>
			<i className="material-icons">
				arrow_drop_down
			</i>
			<Card>
				<List items={items} onChange={handleListClick(onChange,setDropDownOpen)} />
			</Card>
		</div>
	);
};

DropDown.propTypes = propTypes;
DropDown.defaultProps = defaultProps;

export default DropDown;
