import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	className: PropTypes.string,
};

const defaultProps = {};

const Card = (props) => {
	const classNames = ['mdo-card'];

	const {
		className,
	} = props;

	if (className) {
		classNames.push(className);
	}

	return (
		<div {...props} className={classNames.join(' ')}/>
	);
};

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

export default Card;
