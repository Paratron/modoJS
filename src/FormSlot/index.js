import React from 'react';
import PropTypes from 'prop-types';

import {FormContext} from '../FormContainer';

const propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
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
					if (children.props.onFocus) {
						children.props.onFocus();
					}
					this.setState({hasFocus: true});
				};
				this.blur = () => {
					if (children.props.onBlur) {
						children.props.onBlur();
					}
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
			name,
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

		return (

			<FormContext.Consumer>
				{(context) => {
					if (!context) {
						throw new Error('FormSlot components can only be placed somewhere inside a FormContainer component.');
					}

					const preparedChild = this.prepareChild(
						children,
						Object.assign(restProps, {
							value: context.value[name],
							onChange: context.getChangeHandler(name)
						})
					);

					const val = context.value[name];

					if (val !== undefined && val !== null && val !== '') {
						classNames.push('mdo-filled');
					}

					if (className) {
						classNames.push(className);
					}

					return (
						<div className={classNames.join(' ')}>
							<label>
								<span>{label}</span>
								{preparedChild}
							</label>
						</div>
					);
				}}
			</FormContext.Consumer>
		);
	}
}

FormSlot.propTypes = propTypes;
FormSlot.defaultProps = defaultProps;
