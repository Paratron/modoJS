import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	open: PropTypes.bool,
	className: PropTypes.string,
	closeOnBackdrop: PropTypes.bool,
	closeOnEscape: PropTypes.bool,
	onClose: PropTypes.func,
	children: PropTypes.node,
};

const defaultProps = {
	open: true,
	className: undefined,
	children: null,
	closeOnBackdrop: true,
	closeOnEscape: true,
	onClose: undefined,
};

export default class Dialog extends React.Component {
	constructor(props) {
		super(props);

		this.handleBackgroundClick = () => {
			const {
				onClose,
				closeOnBackdrop
			} = this.props;

			if (onClose && closeOnBackdrop) {
				onClose();
			}
		};

		this.handleWindowClick = (e) => {
			e.stopPropagation();
		};
	}

	render() {
		const classNames = ['mdo-dialog'];

		const {
			open,
			className,
			children,

		} = this.props;

		if (className) {
			classNames.push(className);
		}

		if (!open) {
			return null;
		}

		return (
			<div className={classNames.join(' ')} onClick={this.handleBackgroundClick}>
				<div className="mdo-dialog-window" onClick={this.handleWindowClick}>
					{children}
				</div>
			</div>
		);
	}
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;