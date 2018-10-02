import React from 'react';
// import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

export default class Card extends React.Component {
	render() {
		const classNames = ['mdo-card'];

		const {
			className,
		} = this.props;

		if (className) {
			classNames.push(className);
		}

		return (
			<div {...this.props} className={classNames.join(' ')} />
		);
	}
}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;
