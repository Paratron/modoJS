import React from 'react';
import PropTypes from 'prop-types';

import {cloneWithoutProps} from "../utilities/object";

const propTypes = {
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	sizeMedium: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	sizeLarge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	offsetMedium: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	offsetLarge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	orderMedium: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	orderLarge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	className: PropTypes.string,
	children: PropTypes.node,
};

const defaultProps = {
	size: 'auto',
	sizeMedium: undefined,
	sizeLarge: undefined,
	offset: undefined,
	offsetMedium: undefined,
	offsetLarge: undefined,
	order: undefined,
	orderMedium: undefined,
	orderLarge: undefined,
	className: null,
	children: null,
};

const removeKeys = Object.keys(propTypes);

/**
 * Creates and returns a CSS class for cell sizing based on the given size
 * and target screen size.
 * @param size
 * @param screen
 * @param inject
 * @returns {string}
 */
const makeSize = (size, screen, inject = '') => {
	const unitString = ['small', 'medium', 'large'][screen];

	if (inject) {
		inject += '-';
	}

	switch (size) {
		case undefined:
			break;
		case 'auto':
		case 'shrink':
			return screen ? `${unitString}-${inject}${size}` : size;
			break;
		case '0':
		case 0:
			return `hide-for-${unitString}-only`;
		default:
			return `${unitString}-${inject}${size}`;
			break;
	}
};

const Cell = (props) => {
	const classNames = ['mdo-grid-cell', 'cell'];

	const {
		size,
		sizeMedium,
		sizeLarge,
		offset,
		offsetMedium,
		offsetLarge,
		order,
		orderMedium,
		orderLarge,
		className,
		children,
	} = props;

	if (size !== undefined) {
		classNames.push(makeSize(size, 0));
	}

	if (sizeMedium !== undefined) {
		classNames.push(makeSize(sizeMedium, 1));
	}

	if (sizeLarge !== undefined) {
		classNames.push(makeSize(sizeLarge, 2));
	}

	if (offset) {
		classNames.push(makeSize(offset, 0, 'offset'));
	}

	if (offsetMedium) {
		classNames.push(makeSize(offsetMedium, 1, 'offset'));
	}

	if (offsetLarge) {
		classNames.push(makeSize(offsetLarge, 2, 'offset'));
	}

	if (order) {
		classNames.push(makeSize(order, 0, 'order'));
	}

	if (orderMedium) {
		classNames.push(makeSize(orderMedium, 1, 'order'));
	}

	if (orderLarge) {
		classNames.push(makeSize(orderLarge, 2, 'order'));
	}

	if (className) {
		classNames.push(className);
	}

	const cleanedProps = cloneWithoutProps(props, removeKeys);

	return (
		<div
			{...cleanedProps}
			className={classNames.join(' ')}
		>
			{children}
		</div>
	);
};

Cell.propTypes = propTypes;
Cell.defaultProps = defaultProps;

export default Cell;