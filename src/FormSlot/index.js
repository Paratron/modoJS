import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	value: PropTypes.any,
	children: PropTypes.node,
	className: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	enabled: PropTypes.bool,
};

const defaultProps = {
	className: '',
	enabled: true,
};

export default class FormSlot extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hasFocus: false,
		};

		this.focus = null;
		this.blur = null;
		this.prepareChild = (children, restProps) => {
			if (!this.focus) {
				this.focus = () => {
					children.props.onFocus ? children.props.onFocus() : null;
					this.setState({hasFocus: true});
				};
				this.blur = () => {
					children.props.onBlur ? children.props.onBlur() : null;
					this.setState({hasFocus: false});
				};
			}

			return React.cloneElement(children, Object.assign({}, restProps, {onFocus: this.focus, onBlur: this.blur}));
		};
	}

	render() {
		const classNames = ['mdo-formslot'];

		const {
			children,
			className,
			enabled,
			label,
			...restProps
		} = this.props;

		const {
			hasFocus
		} = this.state;

		if (!enabled) {
			classNames.push('mdo-disabled');
		}

		if (hasFocus) {
			classNames.push('mdo-focused');
		}

		if (restProps.value !== undefined && restProps.value !== null && restProps.value !== '') {
			classNames.push('mdo-filled');
		}

		if (className) {
			classNames.push(className);
		}

		const preparedChild = this.prepareChild(children, restProps);

		return (
			<div className={classNames.join(' ')}>
				<label>
					<span>{label}</span>
					{preparedChild}
				</label>
			</div>
		);
	}
}

FormSlot.propTypes = propTypes;
FormSlot.defaultProps = defaultProps;
