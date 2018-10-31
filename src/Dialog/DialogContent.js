import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {
	children: null,
};

export default class DialogContent extends React.Component {
	render() {
		const classNames = ['mdo-dialog-content'];

		const children = this.props.children;

		return (
			<div className={classNames.join(' ')}>
				{children}
			</div>
		);
	}
}

DialogContent.propTypes = propTypes;
DialogContent.defaultProps = defaultProps;