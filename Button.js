import React from 'react';
import PropTypes from 'prop-types';

import {cloneWithoutProps} from "./utilities/object";

const TYPES = {
	DEFAULT: 0,
	PRIMARY: 1,
};

const typeCSS = [
	'mdo-default',
	'mdo-primary',
];

const emptyFunc = () => {};

propTypes = {
	type: PropTypes.number,
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	tooltip: PropTypes.string,
	enabled: PropTypes.bool,
	className: PropTypes.string,
	onClick: PropTypes.func,
};

defaultProps = {
	type: TYPES.DEFAULT,
	label: '',
	tooltip: '',
	enabled: true,
	className: '',
	onClick: emptyFunc
};

const removeKeys = Object.keys(propTypes);

const Button = (props) => {
	const classNames = ['mdo-button'];

	const {
		type,
		label,
		tooltip,
		enabled,
		className,
		onClick
	} = props;

	classNames.push(typeCSS[type]);

	if(!enabled){
		classNames.push('mdo-disabled');
	}

	if(className){
		classNames.push(className);
	}

	const cleanedProps = cloneWithoutProps(props, removeKeys);

	return (
		<div
			{...cleanedProps}
			className={classNames.join(' ')}
			title={tooltip}
			tabIndex={enabled ? 0 : -1}
			disabled={!enabled}
			onClick={ enabled ? onClick : undefined}
		>
			{ label }
		</div>
	);
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
Button.TYPES = TYPES;

export default Button;