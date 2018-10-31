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

const closeHandlers = [];

window.addEventListener('keydown', (e) => {
	if(e.key === 'Escape'){
		closeHandlers.forEach(c => c());
	}
});

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

	componentDidMount(){
		if(this.props.onClose && this.props.closeOnEscape){
			closeHandlers.push(this.props.onClose);
		}
	}

	componentWillUnmount(){
		if(this.props.onClose){
			const index = closeHandlers.indexOf(this.props.onClose);
			if(index === -1){
				return;
			}
			closeHandlers.splice(index, 1);
		}
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

		if (open) {
			classNames.push('mdo-open');
		}

		return (
			<div className={classNames.join(' ')} onClick={this.handleBackgroundClick}>
				<div className="mdo-dialog-window" onClick={this.handleWindowClick}>
					{open ? children : null}
				</div>
			</div>
		);
	}
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;
