import React from 'react';
import PropTypes from 'prop-types';

import {FormContext} from '../FormContainer';

const propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	className: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	enabled: PropTypes.bool,
	manual: PropTypes.bool,
	staticLabel: PropTypes.bool,
};

const defaultProps = {
	className: '',
	enabled: true,
	manual: false,
	staticLabel: false,
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
			manual,
			staticLabel,
			...restProps
		} = this.props;

		const {
			hasFocus
		} = this.state;

		if(staticLabel){
			classNames.push('mdo-staticLabel');
		}

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

					const val = context.value[name];

					if (manual) {
						return children(val, context.changeHandler(name));
					} else {
						const preparedChild = this.prepareChild(
							children,
							Object.assign(restProps, {
								value: context.value[name],
								onChange: context.changeHandler(name)
							})
						);

						if (val !== undefined && val !== null && val !== '') {
							classNames.push('mdo-filled');
						}

						if (className) {
							classNames.push(className);
						}

						return (
							<div className={classNames.join(' ')}>
								<label className="mdo-formslot-label">
									<span className="mdo-formslot-label-inner">{label}</span>
									{preparedChild}
								</label>
							</div>
						);
					}
				}}
			</FormContext.Consumer>
		);
	}
}

FormSlot.propTypes = propTypes;
FormSlot.defaultProps = defaultProps;
