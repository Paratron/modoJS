import React from 'react';
// import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

export default class ButtonGroup extends React.Component {
	render() {
		const classNames = ['mdo-buttongroup'];

		if (this.props.className) {
			classNames.push(this.props.className);
		}

		return (
			<div {...this.props} className={classNames.join(' ')}/>
		);
	}
}

ButtonGroup.propTypes = propTypes;
ButtonGroup.defaultProps = defaultProps;
