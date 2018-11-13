import React from 'react';
import PropTypes from 'prop-types';

import FormContext from '../FormContainer';

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

const prepareChild = () => {
};

const FormSlot = (props) => {
	const classNames = ['mdo-formslot'];

	const {
		children,
		className,
		enabled,
		label,
		name,
		manual
		...restProps
	} = this.props;

	return (
		<FormContext.Consumer>
			{(context) => {
				if (!context) {
					throw new Error('FormSlot components can only be placed somewhere inside a FormContainer component.');
				}
				
				if(manual){
					return children(context.value, context.changeHandler());
				}

				const preparedChild = prepareChild(children);
			}}
		</FormContext.Consumer>
	);
};

FormSlot.propTypes = propTypes;
FormSlot.defaultProps = defaultProps;

export default FormSlot;
