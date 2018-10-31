import React from 'react';
import PropTypes from 'prop-types';

import Grid from './Grid';

const propTypes = {
	className: PropTypes.string,
	chidldren: PropTypes.node,
};

const defaultProps = {
	className: null,
	children: null,
};

const GridFrame = (props) => {
	const classNames = ['mdo-grid-frame', 'medium-grid-frame'];

	const {
		className,
		children,
	} = props;

	if (className) {
		classNames.push(className);
	}

	return (
		<Grid {...props} orientation="y" className={classNames.join(' ')}>
			{children}
		</Grid>
	);
};

GridFrame.propTypes = propTypes;
GridFrame.defaultProps = defaultProps;

export default GridFrame;