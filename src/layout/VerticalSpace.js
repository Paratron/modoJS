import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	space: PropTypes.number,
};

const defaultProps = {
	space: 1,
};

export default class VerticalSpace extends React.Component {
	render() {
		const classNames = ['mdo-verticalspace'];

		const {
			space
		} = this.props;

		classNames.push('mdo-space-' + space);

		return (
			<div className={classNames.join(' ')}/>
		);
	}
}

VerticalSpace.propTypes = propTypes;
VerticalSpace.defaultProps = defaultProps;