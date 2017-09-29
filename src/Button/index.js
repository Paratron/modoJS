import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import {cloneWithoutProps} from "../utils/object";

const TYPES = {
	DEFAULT: 0,
	PRIMARY: 1,
	MINIMAL: 2,
};

const typeCSS = [
	'mdo-default',
	'mdo-primary',
	'mdo-minimal',
];

const emptyFunc = () => {};

const propTypes = {
	type: PropTypes.number,
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	children: PropTypes.node,
	title: PropTypes.string,
	enabled: PropTypes.bool,
	className: PropTypes.string,
	onChange: PropTypes.func,
	icon: PropTypes.string,
};

const defaultProps = {
	type: TYPES.DEFAULT,
	label: '',
	children: null,
	title: '',
	enabled: true,
	className: '',
	onClick: emptyFunc,
	icon: undefined,
};

const removeKeys = Object.keys(propTypes);

const Button = (props) => {
	const classNames = ['mdo-button'];

	const {
		type,
		label,
		children,
		title,
		enabled,
		className,
		onClick,
		icon
	} = props;

	classNames.push(typeCSS[type]);

	if(!enabled){
		classNames.push('mdo-disabled');
	}

	if(className){
		classNames.push(className);
	}

	const iconElm = icon ? <Icon name={icon} key="icon" /> : null;

	if(icon){
		classNames.push('mdo-has-icon');
	}

	if(!children && !label){
		classNames.push('mdo-only-icon');
	}

	const content = [iconElm, children || label];

	const cleanedProps = cloneWithoutProps(props, removeKeys);

	return (
		<div
			{...cleanedProps}
			className={classNames.join(' ')}
			title={title}
			tabIndex={enabled ? 0 : -1}
			disabled={!enabled}
			onClick={ enabled ? onClick : undefined}
		>
			{ content }
		</div>
	);
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
Button.TYPES = TYPES;

export default Button;