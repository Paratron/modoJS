import React from 'react';
import PropTypes from 'prop-types';

import {cloneWithoutProps} from "./utilities/object";

const propTypes = {
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	tooltip: PropTypes.string,
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	className: PropTypes.string,
	onChange: PropTypes.func,
};

const defaultProps = {
	label: '',
	tooltip: undefined,
	value: false,
	enabled: true,
	className: '',
	onChange: () => {
	}
};

const removeKeys = Object.keys(propTypes);

const Checkbox = (props) => {
	const classNames = ['mdo-checkbox'];

	const {
		label,
		tooltip,
		value,
		enabled,
		className,
		onChange,
	} = props;

	if (value) {
		classNames.push('mdo-checked');
	}

	if (!enabled) {
		classNames.push('mdo-disabled');
	}

	if (className) {
		classNames.push(className);
	}

	const cleanedProps = cloneWithoutProps(props, removeKeys);

	return (
		<div
			{...cleanedProps}
			tabIndex={enabled ? 0 : -1}
			role="checkbox"
			className={classNames.join(' ')}
			title={tooltip}
			onClick={enabled ? onChange : null}
		>
			<div className="mdo-label">{label}</div>
		</div>
	);
};

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;