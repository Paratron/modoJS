import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node,
	active: PropTypes.bool,
};

const defaultProps = {
	active: false,
};

export default class Tab extends React.Component {
	render() {
		const classNames = ['mdo-tab'];

		const {
			children,
			active,
		} = this.props;

		if (active) {
			classNames.push('mdo-active');
		}

		return (
			<div className={classNames.join(' ')}>
				{active ? children : null}
			</div>
		);
	}
}

Tab.propTypes = propTypes;
Tab.defaultProps = defaultProps;
