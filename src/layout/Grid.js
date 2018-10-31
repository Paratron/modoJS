import React from 'react';
import PropTypes from 'prop-types';

import {cloneWithoutProps} from "../utils/object";

const propTypes = {
	orientation: PropTypes.oneOf(['x', 'y']),
	gutter: PropTypes.string,
	mediumGutter: PropTypes.string,
	largeGutter: PropTypes.string,
	fullHeight: PropTypes.bool,
	padded: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node,
};

const defaultProps = {
	orientation: 'x',
	gutter: null,
	mediumGutter: null,
	largeGutter: null,
	fullHeight: false,
	padded: false,
	className: null,
	children: null,
};

const removeKeys = Object.keys(propTypes);

const Grid = (props) => {
	const classNames = ['mdo-grid'];

	const {
		orientation,
		gutter,
		mediumGutter,
		largeGutter,
		fullHeight,
		padded,
		className,
		children,
	} = props;

	classNames.push(`grid-${orientation}`);

	if (gutter) {
		classNames.push(`grid-padding-${orientation}`);
	}

	if (mediumGutter) {
		classNames.push(`medium-grid-padding-${orientation}`);
	}

	if(largeGutter){
		classNames.push(`large-grid-padding-${orientation}`);
	}

	if(fullHeight){
		classNames.push('mdo-fullHeight');
	}

	if(padded){
		classNames.push('mdo-padded');
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

Grid.propTypes = propTypes;
Grid.defaultProps = defaultProps;

export default Grid;
