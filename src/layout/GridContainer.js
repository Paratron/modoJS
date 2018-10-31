import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	fluid: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node,
};

const defaultProps = {
	fluid: false,
	className: null,
	children: null,
};

const GridContainer = (props) => {
	const classNames = ['mdo-grid-container', 'grid-container'];

	const {
		fluid,
		className,
		children
	} = props;

	if (fluid) {
		classNames.push('fluid');
	}

	if (className) {
		classNames.push(className);
	}

	return (
		<div className={classNames.join(' ')}>
			{children}
		</div>
	);
}

GridContainer.propTypes = propTypes;
GridContainer.defaultProps = defaultProps;

export default GridContainer;