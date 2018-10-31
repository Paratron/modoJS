import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {
	children: null,
};

export default class DialogHeader extends React.Component {
	render() {
		const classNames = ['mdo-dialog-footer'];

		const children = this.props.children;

		return (
			<div className={classNames.join(' ')}>
				{children}
			</div>
		);
	}
}

DialogHeader.propTypes = propTypes;
DialogHeader.defaultProps = defaultProps;
